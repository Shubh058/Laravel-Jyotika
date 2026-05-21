<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnalyticsLog extends Model
{
    /** @use HasFactory<\Database\Factories\AnalyticsLogFactory> */
    use HasFactory;

    protected $fillable = [
        'news_id',
        'total_feedback',
        'avg_rating',
        'positive_count',
        'neutral_count',
        'negative_count',
        'generated_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
    ];

    public function news()
    {
        return $this->belongsTo(News::class);
    }
}
