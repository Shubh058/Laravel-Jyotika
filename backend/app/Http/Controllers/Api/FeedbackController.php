<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Feedback;
use App\Services\FeedbackService;

class FeedbackController extends Controller
{
    protected $feedbackService;

    public function __construct(FeedbackService $feedbackService)
    {
        $this->feedbackService = $feedbackService;
    }

    public function store(Request $request)
    {
        $request->validate([
            'news_id' => 'required|exists:news,id',
            'rating' => 'required|integer|min:1|max:5',
            'sentiment' => 'required|in:positive,neutral,negative',
            'comment' => 'nullable|string',
            'media_type' => 'nullable|string',
        ]);

        try {
            $data = $request->all();
            $data['user_id'] = $request->user()->id;
            $data['region_id'] = $request->user()->region_id;

            $feedback = $this->feedbackService->submitFeedback($data);

            return response()->json($feedback, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function getByNews($newsId)
    {
        $feedbacks = Feedback::with('user')->where('news_id', $newsId)->latest()->paginate(20);
        return response()->json($feedbacks);
    }

    public function getUserFeedback(Request $request)
    {
        $feedbacks = Feedback::with('news')->where('user_id', $request->user()->id)->latest()->paginate(20);
        return response()->json($feedbacks);
    }
}
