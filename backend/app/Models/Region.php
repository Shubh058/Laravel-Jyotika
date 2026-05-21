<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    /** @use HasFactory<\Database\Factories\RegionFactory> */
    use HasFactory;

    protected $fillable = ['region_name', 'state', 'language'];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }
}
