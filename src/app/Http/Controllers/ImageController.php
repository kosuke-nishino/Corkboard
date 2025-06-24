<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ImageController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'List of images']);
    }

    public function store(Request $request)
    {
        $image = Image::create($validated);

        return response()->json($image, 201);
    }

    public function update(Request $request, Image $image)
    {
        if ($image->user_id !== Auth::id()) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $validated = $request->validate([
            'x' => 'nullable|numeric',
            'y' => 'nullable|numeric',
            'width' => 'nullable|numeric',
            'height' => 'nullable|numeric',
            'rotation' => 'nullable|numeric',
            'z_index' => 'nullable|integer',
        ]);

        $image->update($validated);

        return response()->json($image);
    }
    {
        $image = Image::findOrFail($id);
        
        $validated = $request->validate([
            'x' => 'nullable|numeric',
            'y' => 'nullable|numeric',
            'width' => 'nullable|numeric',
            'height' => 'nullable|numeric',
            'rotation' => 'nullable|numeric',
            'z_index' => 'nullable|integer',
        ]);

        $image->update($validated);

        return response()->json([
            'message' => '位置情報を更新しました',
            'image' => $image->fresh()
        ]);
    }

    public function destroy($id)
    {
        // Logic to delete an image
        $image = \App\Models\Image::findOrFail($id);
        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }
}
