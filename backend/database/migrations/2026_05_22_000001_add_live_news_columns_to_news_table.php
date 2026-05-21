<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->string('origin')->default('seeded')->after('status');
            $table->string('external_provider')->nullable()->after('origin');
            $table->string('external_id')->nullable()->after('external_provider');
            $table->timestamp('fetched_at')->nullable()->after('external_id');
            $table->index(['origin', 'published_at']);
            $table->index(['external_provider', 'external_id']);
        });
    }

    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropIndex(['origin', 'published_at']);
            $table->dropIndex(['external_provider', 'external_id']);
            $table->dropColumn(['origin', 'external_provider', 'external_id', 'fetched_at']);
        });
    }
};
