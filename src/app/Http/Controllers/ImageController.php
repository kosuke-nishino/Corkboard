<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ImageController extends Controller
{
    public function index(Request $request)
    {
        $query = Image::query();

        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } else {
            $query->whereNull('user_id')->orWhere('user_id', 1);
        }

        if ($request->has('location')) {
            $query->where('location', $request->input('location'));
        }

        $images = $query->get();
        return response()->json($images);
    }

    public function store(Request $request)
    {
        // ファイル保存処理
        $path = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
        }
        
        $image = Image::create([
            'user_id' => Auth::check() ? Auth::id() : 1, // テスト用: 認証なしの場合はuser_id=1
            'file_path' => $path,
            'z_index' => $request->input('z_index', 5),
            'x' => $request->input('x', 100),
            'y' => $request->input('y', 100),
            'width' => $request->input('width', 200),
            'height' => $request->input('height', 150),
            'rotation' => $request->input('rotation', 0),
            'location' => $request->input('location', 'dashboard'), // locationを追加
        ]);

        return response()->json($image, 201);
    }

    public function update(Request $request, Image $image)
    {
        // テスト用: 認証チェックを緩和
        if (Auth::check() && $image->user_id !== Auth::id()) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $updateData = [];
        if ($request->has('x')) $updateData['x'] = $request->input('x');
        if ($request->has('y')) $updateData['y'] = $request->input('y');
        if ($request->has('width')) $updateData['width'] = $request->input('width');
        if ($request->has('height')) $updateData['height'] = $request->input('height');
        if ($request->has('rotation')) $updateData['rotation'] = $request->input('rotation');
        if ($request->has('z_index')) $updateData['z_index'] = $request->input('z_index');

        $image->update($updateData);

        return response()->json($image);
    }

    public function updatePosition(Request $request, $id)
    {
        $image = Image::findOrFail($id);
        
        // テスト用: 認証チェックを緩和
        if (Auth::check() && $image->user_id !== Auth::id()) {
            return response()->json(['message' => '権限がありません'], 403);
        }
        
        $updateData = [];
        if ($request->has('x')) $updateData['x'] = $request->input('x');
        if ($request->has('y')) $updateData['y'] = $request->input('y');
        if ($request->has('width')) $updateData['width'] = $request->input('width');
        if ($request->has('height')) $updateData['height'] = $request->input('height');
        if ($request->has('rotation')) $updateData['rotation'] = $request->input('rotation');
        if ($request->has('z_index')) $updateData['z_index'] = $request->input('z_index');

        $image->update($updateData);

        return response()->json([
            'message' => '位置情報を更新しました',
            'image' => $image->fresh()
        ]);
    }

    public function destroy($id)
    {
        $image = Image::findOrFail($id);
        
        // テスト用: 認証チェックを緩和
        if (Auth::check() && $image->user_id !== Auth::id()) {
            return response()->json(['message' => '権限がありません'], 403);
        }
        
        // ファイルも削除
        if ($image->file_path && Storage::disk('public')->exists($image->file_path)) {
            Storage::disk('public')->delete($image->file_path);
        }
        
        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }
}
