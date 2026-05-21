<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Region;
use App\Models\News;
use App\Models\Feedback;
use App\Models\AnalyticsLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Regions
        $regions = [
            ['region_name' => 'North India', 'state' => 'Delhi', 'language' => 'Hindi'],
            ['region_name' => 'South India', 'state' => 'Karnataka', 'language' => 'Kannada'],
            ['region_name' => 'West India', 'state' => 'Maharashtra', 'language' => 'Marathi'],
            ['region_name' => 'East India', 'state' => 'West Bengal', 'language' => 'Bengali'],
        ];

        foreach ($regions as $region) {
            Region::create($region);
        }

        // 2. Create Admin and Analyst Users
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'region_id' => 1,
        ]);

        $analyst = User::create([
            'name' => 'Data Analyst',
            'email' => 'analyst@example.com',
            'password' => Hash::make('password'),
            'role' => 'analyst',
            'region_id' => 2,
        ]);

        $citizen = User::create([
            'name' => 'Citizen Reporter',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'region_id' => 3,
        ]);

        // 3. Create News Stories
        $newsList = [
            [
                'title' => 'Launch of PM Vishwakarma Yojana Boosts Traditional Artisans',
                'summary' => 'The newly launched scheme aims to provide financial support and skill training to millions of traditional artisans across India.',
                'category' => 'Economy',
                'source_name' => 'Press Information Bureau',
            ],
            [
                'title' => 'Digital India Initiative Reaches 1 Lakh Gram Panchayats',
                'summary' => 'High-speed broadband connectivity under BharatNet has successfully reached over 100,000 rural panchayats, bridging the digital divide.',
                'category' => 'Technology',
                'source_name' => 'Doordarshan News',
            ],
            [
                'title' => 'New National Education Policy 2020 Implementation Accelerates',
                'summary' => 'Several states have fully adopted the 5+3+3+4 curricular structure, significantly improving early childhood education standards.',
                'category' => 'Education',
                'source_name' => 'All India Radio',
            ],
            [
                'title' => 'G20 Summit Success Showcases India\'s Global Leadership',
                'summary' => 'The New Delhi declaration was unanimously adopted, highlighting India\'s diplomatic prowess on the global stage.',
                'category' => 'Foreign Affairs',
                'source_name' => 'Sansad TV',
            ]
        ];

        foreach ($newsList as $newsItem) {
            $news = News::create([
                'title' => $newsItem['title'],
                'slug' => Str::slug($newsItem['title']) . '-' . uniqid(),
                'content' => $newsItem['summary'] . ' Detailed article content goes here representing the full news story from regional media.',
                'summary' => $newsItem['summary'],
                'category' => $newsItem['category'],
                'source_name' => $newsItem['source_name'],
                'source_url' => 'https://example.gov.in',
                'published_at' => now()->subDays(rand(1, 10)),
                'created_by' => $admin->id,
                'status' => 'published',
            ]);

            // 4. Create Mock Feedback for each news story
            $totalFeedback = rand(15, 40);
            $totalRating = 0;
            $sentiments = ['positive', 'positive', 'positive', 'neutral', 'negative'];

            for ($i = 0; $i < $totalFeedback; $i++) {
                $sentiment = $sentiments[array_rand($sentiments)];
                $rating = $sentiment === 'positive' ? rand(4, 5) : ($sentiment === 'neutral' ? 3 : rand(1, 2));
                $totalRating += $rating;

                Feedback::create([
                    'news_id' => $news->id,
                    'user_id' => $citizen->id,
                    'region_id' => rand(1, 4),
                    'rating' => $rating,
                    'sentiment' => $sentiment,
                    'comment' => 'This is a ' . $sentiment . ' response to the government initiative.',
                    'trust_score' => rand(60, 95),
                ]);
            }

            // Update Analytics Log
            AnalyticsLog::create([
                'news_id' => $news->id,
                'total_feedback' => $totalFeedback,
                'avg_rating' => round($totalRating / $totalFeedback, 2),
                'positive_count' => floor($totalFeedback * 0.6),
                'neutral_count' => floor($totalFeedback * 0.2),
                'negative_count' => floor($totalFeedback * 0.2),
                'generated_at' => now(),
            ]);
        }
    }
}
