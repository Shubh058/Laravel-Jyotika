<?php

namespace App\Services;

use App\Models\News;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class LiveNewsService
{
    public function syncDailyBurningNews(): int
    {
        if (!config('news.live_enabled')) {
            return 0;
        }

        $created = 0;
        $topics = config('news.topics');
        $perProviderTopicLimit = 1;

        foreach ($topics as $category => $query) {
            foreach (['gnews', 'newsapi'] as $provider) {
                $articles = $this->fetch($provider, $query, $perProviderTopicLimit);
                $created += $this->storeArticles($articles, $provider, $category);
            }
        }

        $this->pruneLiveArticles();

        return $created;
    }

    public function syncDailyIfStale(): void
    {
        if (Cache::has('live_news_synced')) {
            return;
        }

        $this->syncDailyBurningNews();
        Cache::put('live_news_synced', true, now()->addMinutes(config('news.sync_ttl_minutes')));
    }

    public function searchAndStore(string $keyword): int
    {
        if (!config('news.live_enabled') || trim($keyword) === '') {
            return 0;
        }

        $created = 0;
        $category = $this->guessCategory($keyword);

        foreach (['gnews', 'newsapi'] as $provider) {
            $articles = $this->fetch($provider, $keyword . ' India', (int) ceil(config('news.search_limit') / 2));
            $created += $this->storeArticles($articles, $provider, $category);
        }

        return $created;
    }

    private function fetch(string $provider, string $query, int $limit): array
    {
        $key = config("news.providers.$provider.key");

        if (!$key) {
            return [];
        }

        return match ($provider) {
            'gnews' => $this->fetchFromGNews($query, $limit, $key),
            'newsapi' => $this->fetchFromNewsApi($query, $limit, $key),
            default => [],
        };
    }

    private function fetchFromGNews(string $query, int $limit, string $key): array
    {
        $response = Http::timeout(10)->retry(2, 250)->get(config('news.providers.gnews.base_url') . '/search', [
            'q' => $query,
            'lang' => config('news.language'),
            'country' => config('news.country'),
            'max' => min($limit, 10),
            'apikey' => $key,
        ]);

        if (!$response->successful()) {
            report(new \RuntimeException('GNews request failed: ' . $response->body()));
            return [];
        }

        return collect($response->json('articles', []))
            ->map(fn (array $article) => [
                'title' => $article['title'] ?? null,
                'summary' => $article['description'] ?? null,
                'content' => $article['content'] ?? $article['description'] ?? null,
                'source_name' => $article['source']['name'] ?? 'GNews',
                'source_url' => $article['url'] ?? null,
                'featured_image' => $article['image'] ?? null,
                'published_at' => $article['publishedAt'] ?? null,
            ])
            ->all();
    }

    private function fetchFromNewsApi(string $query, int $limit, string $key): array
    {
        $response = Http::timeout(10)->retry(2, 250)->get(config('news.providers.newsapi.base_url') . '/everything', [
            'q' => $query,
            'language' => config('news.language'),
            'from' => now()->subDay()->toDateString(),
            'sortBy' => 'popularity',
            'pageSize' => min($limit, 20),
            'apiKey' => $key,
        ]);

        if (!$response->successful()) {
            report(new \RuntimeException('NewsAPI request failed: ' . $response->body()));
            return [];
        }

        return collect($response->json('articles', []))
            ->map(fn (array $article) => [
                'title' => $article['title'] ?? null,
                'summary' => $article['description'] ?? null,
                'content' => $article['content'] ?? $article['description'] ?? null,
                'source_name' => $article['source']['name'] ?? 'NewsAPI',
                'source_url' => $article['url'] ?? null,
                'featured_image' => $article['urlToImage'] ?? null,
                'published_at' => $article['publishedAt'] ?? null,
            ])
            ->all();
    }

    private function storeArticles(array $articles, string $provider, string $category): int
    {
        $created = 0;
        $authorId = $this->systemUserId();

        foreach ($articles as $article) {
            if (empty($article['title']) || empty($article['source_url'])) {
                continue;
            }

            $externalId = sha1($article['source_url']);
            $content = $article['content'] ?: $article['summary'] ?: 'Read the full story from the original source.';

            $news = News::firstOrCreate(
                [
                    'external_provider' => $provider,
                    'external_id' => $externalId,
                ],
                [
                    'title' => Str::limit($article['title'], 250, ''),
                    'slug' => $this->uniqueSlug($article['title']),
                    'summary' => $article['summary'],
                    'content' => $content,
                    'category' => $category,
                    'source_name' => $article['source_name'],
                    'source_url' => $article['source_url'],
                    'published_at' => $this->parsePublishedAt($article['published_at']),
                    'created_by' => $authorId,
                    'featured_image' => $article['featured_image'],
                    'status' => 'published',
                    'origin' => 'live',
                    'fetched_at' => now(),
                ]
            );

            if ($news->wasRecentlyCreated) {
                $created++;
            }
        }

        return $created;
    }

    private function pruneLiveArticles(): void
    {
        $limit = max(config('news.daily_limit'), 20);
        $idsToKeep = News::where('origin', 'live')
            ->orderByDesc('published_at')
            ->limit($limit)
            ->pluck('id');

        News::where('origin', 'live')
            ->whereNotIn('id', $idsToKeep)
            ->delete();
    }

    private function systemUserId(): int
    {
        return User::query()->where('role', 'admin')->value('id')
            ?? User::query()->value('id')
            ?? User::create([
                'name' => 'News Sync',
                'email' => 'news-sync@example.com',
                'password' => bcrypt(Str::random(32)),
                'role' => 'admin',
            ])->id;
    }

    private function uniqueSlug(string $title): string
    {
        return Str::slug($title) . '-' . Str::lower(Str::random(8));
    }

    private function parsePublishedAt(?string $publishedAt): Carbon
    {
        try {
            return $publishedAt ? Carbon::parse($publishedAt) : now();
        } catch (\Throwable) {
            return now();
        }
    }

    private function guessCategory(string $keyword): string
    {
        $keyword = Str::lower($keyword);
        foreach (array_keys(config('news.topics')) as $category) {
            if (Str::contains($keyword, Str::lower($category))) {
                return $category;
            }
        }

        return 'General';
    }
}
