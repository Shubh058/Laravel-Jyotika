<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    /** @use HasFactory<\Database\Factories\NewsFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'summary',
        'category',
        'source_name',
        'source_url',
        'published_at',
        'created_by',
        'featured_image',
        'status',
        'origin',
        'external_provider',
        'external_id',
        'fetched_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'fetched_at' => 'datetime',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }

    public function analyticsLogs()
    {
        return $this->hasMany(AnalyticsLog::class);
    }
}
