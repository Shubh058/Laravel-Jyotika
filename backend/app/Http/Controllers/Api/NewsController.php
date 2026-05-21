<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News;
use App\Services\LiveNewsService;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index(Request $request, LiveNewsService $liveNewsService)
    {
        if ($request->filled('search')) {
            $liveNewsService->searchAndStore($request->string('search')->toString());
        } else {
            $liveNewsService->syncDailyIfStale();
        }

        $query = News::with(['author', 'analyticsLogs'])
            ->where('status', 'published')
            ->orderByRaw("CASE WHEN origin = 'seeded' THEN 0 ELSE 1 END")
            ->orderBy('published_at', 'desc');

        if ($request->filled('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', '%' . $search . '%')
                    ->orWhere('summary', 'like', '%' . $search . '%')
                    ->orWhere('content', 'like', '%' . $search . '%')
                    ->orWhere('source_name', 'like', '%' . $search . '%');
            });
        }

        return response()->json($query->paginate(12));
    }

    public function show($id)
    {
        $news = News::with(['author', 'analyticsLogs', 'feedbacks.user'])->findOrFail($id);
        return response()->json($news);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string',
            'source_name' => 'required|string',
        ]);

        $news = News::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . uniqid(),
            'content' => $request->content,
            'summary' => $request->summary,
            'category' => $request->category,
            'source_name' => $request->source_name,
            'source_url' => $request->source_url,
            'published_at' => now(),
            'created_by' => $request->user()->id,
            'status' => 'published',
        ]);

        return response()->json($news, 201);
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
        ]);

        $news->update($request->all());

        return response()->json($news);
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);
        $news->delete();

        return response()->json(null, 204);
    }
}
