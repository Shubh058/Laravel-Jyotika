<?php
namespace App\Http\Controllers;

use Illuminate\Http\Response;

class HealthController extends Controller
{
    public function index()
    {
        return response()->json(['status' => 'ok'], 200);
    }
}
