<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Feedback;
use App\Models\News;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function overview()
    {
        $totalFeedback = Feedback::count();
        $totalNews = News::count();
        $avgRating = Feedback::avg('rating');
        
        $sentimentDistribution = Feedback::select('sentiment', DB::raw('count(*) as count'))
            ->groupBy('sentiment')
            ->pluck('count', 'sentiment');

        return response()->json([
            'total_feedback' => $totalFeedback,
            'total_news' => $totalNews,
            'average_rating' => round($avgRating, 2),
            'sentiment' => $sentimentDistribution,
        ]);
    }

    public function regions()
    {
        $regionalData = Feedback::join('regions', 'feedback.region_id', '=', 'regions.id')
            ->select('regions.region_name', DB::raw('count(feedback.id) as feedback_count'), DB::raw('avg(feedback.rating) as avg_rating'))
            ->groupBy('regions.region_name')
            ->get();

        return response()->json($regionalData);
    }

    public function trends()
    {
        $trends = Feedback::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->take(30)
            ->get();

        return response()->json($trends);
    }
}
