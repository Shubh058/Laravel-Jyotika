<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $query = News::with(['author', 'analyticsLogs'])
            ->where('status', 'published')
            ->orderBy('published_at', 'desc');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->paginate(12));
    }

    public function show($id)
    {
        $news = News::with(['author', 'analyticsLogs', 'feedbacks.user'])->findOrFail($id);
        return response()->json($news);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string',
            'source_name' => 'required|string',
        ]);

        $news = News::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . uniqid(),
            'content' => $request->content,
            'summary' => $request->summary,
            'category' => $request->category,
            'source_name' => $request->source_name,
            'source_url' => $request->source_url,
            'published_at' => now(),
            'created_by' => $request->user()->id,
            'status' => 'published',
        ]);

        return response()->json($news, 201);
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
        ]);

        $news->update($request->all());

        return response()->json($news);
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);
        $news->delete();

        return response()->json(null, 204);
    }
}
