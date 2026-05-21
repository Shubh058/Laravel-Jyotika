<?php

return [
    'live_enabled' => env('NEWS_LIVE_ENABLED', true),
    'country' => env('NEWS_COUNTRY', 'in'),
    'language' => env('NEWS_LANGUAGE', 'en'),
    'daily_limit' => (int) env('NEWS_DAILY_LIMIT', 20),
    'search_limit' => (int) env('NEWS_SEARCH_LIMIT', 20),
    'sync_ttl_minutes' => (int) env('NEWS_SYNC_TTL_MINUTES', 120),

    'providers' => [
        'gnews' => [
            'key' => env('NEWS_GNEWS_API_KEY', env('NEWS_API_PROVIDER') === 'gnews' ? env('NEWS_API_KEY') : null),
            'base_url' => 'https://gnews.io/api/v4',
        ],
        'newsapi' => [
            'key' => env('NEWSAPI_API_KEY', env('NEWS_API_PROVIDER') === 'newsapi' ? env('NEWS_API_KEY') : null),
            'base_url' => 'https://newsapi.org/v2',
        ],
    ],

    'topics' => [
        'Education' => 'India education policy OR schools OR universities',
        'Technology' => 'India technology OR Digital India OR AI',
        'Government Scheme' => 'India government scheme OR yojana OR welfare',
        'Foreign Affairs' => 'India foreign affairs OR diplomacy OR summit',
        'Defence' => 'India defence OR military OR armed forces',
        'Economy' => 'India economy OR finance OR budget',
        'Health' => 'India health OR healthcare OR public health',
        'Science' => 'India science OR research OR space',
        'Sports' => 'India sports OR cricket OR football OR hockey OR athletics',
    ],
];
