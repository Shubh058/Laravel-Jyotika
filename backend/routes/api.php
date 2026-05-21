<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\RegionController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/regions', [RegionController::class, 'index']);
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{id}', [NewsController::class, 'show']);
Route::get('/feedback/news/{id}', [FeedbackController::class, 'getByNews']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    Route::post('/feedback', [FeedbackController::class, 'store']);
    Route::get('/feedback/user', [FeedbackController::class, 'getUserFeedback']);

    // Admin/Analyst routes (simplified middleware for now)
    Route::post('/news', [NewsController::class, 'store']);
    Route::put('/news/{id}', [NewsController::class, 'update']);
    Route::delete('/news/{id}', [NewsController::class, 'destroy']);
    
    Route::get('/analytics/overview', [AnalyticsController::class, 'overview']);
    Route::get('/analytics/regions', [AnalyticsController::class, 'regions']);
    Route::get('/analytics/trends', [AnalyticsController::class, 'trends']);
});

// Catch-all for CORS preflight
Route::options('/{any}', function () {
    return response('', 200);
})->where('any', '.*');
