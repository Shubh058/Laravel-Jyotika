<?php

namespace App\Services;

use App\Models\Feedback;
use App\Models\News;
use App\Models\AnalyticsLog;
use Illuminate\Support\Facades\DB;

class FeedbackService
{
    public function submitFeedback(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Check if user already submitted feedback for this news
            $existing = Feedback::where('user_id', $data['user_id'])
                ->where('news_id', $data['news_id'])
                ->first();

            if ($existing) {
                throw new \Exception('Feedback already submitted for this news item.');
            }

            // Calculate basic trust score based on sentiment and rating logic (mock logic)
            $trustScore = $this->calculateTrustScore($data['rating'], $data['sentiment']);
            $data['trust_score'] = $trustScore;

            $feedback = Feedback::create($data);

            // Update Analytics Log
            $this->updateAnalytics($data['news_id']);

            return $feedback;
        });
    }

    private function calculateTrustScore($rating, $sentiment)
    {
        // Simple mock logic: if rating matches sentiment, higher trust.
        $score = 50.0;
        if (($rating >= 4 && $sentiment == 'positive') || ($rating <= 2 && $sentiment == 'negative') || ($rating == 3 && $sentiment == 'neutral')) {
            $score += 30.0;
        }
        return $score;
    }

    private function updateAnalytics($newsId)
    {
        $feedbacks = Feedback::where('news_id', $newsId)->get();
        
        $total = $feedbacks->count();
        if ($total == 0) return;

        $avgRating = $feedbacks->avg('rating');
        $positive = $feedbacks->where('sentiment', 'positive')->count();
        $neutral = $feedbacks->where('sentiment', 'neutral')->count();
        $negative = $feedbacks->where('sentiment', 'negative')->count();

        AnalyticsLog::updateOrCreate(
            ['news_id' => $newsId],
            [
                'total_feedback' => $total,
                'avg_rating' => round($avgRating, 2),
                'positive_count' => $positive,
                'neutral_count' => $neutral,
                'negative_count' => $negative,
                'generated_at' => now(),
            ]
        );
    }
}
