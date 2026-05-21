<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Services\LiveNewsService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('news:sync', function (LiveNewsService $liveNewsService) {
    $created = $liveNewsService->syncDailyBurningNews();
    $this->info("Live news sync complete. {$created} new articles stored.");
})->purpose('Fetch influential live news from configured news APIs');

Schedule::command('news:sync')->hourly();
