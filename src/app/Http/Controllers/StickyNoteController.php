<?php

namespace App\Http\Controllers;

use App\Models\StickyNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StickyNoteController extends Controller
{
    public function index()
    {
        $stickyNotes = StickyNote::where('user_id', Auth::id())->get();
        return response()->json($stickyNotes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'nullable|string|max:1000',
            'x' => 'nullable|numeric',
            'y' => 'nullable|numeric',
            'width' => 'nullable|numeric',
            'height' => 'nullable|numeric',
            'rotation' => 'nullable|numeric',
            'z_index' => 'nullable|integer',
            'color' => 'nullable|string|max:20',
        ]);

        $validated['user_id'] = Auth::id();

        $stickyNote = StickyNote::create($validated);

        return response()->json($stickyNote, 201);
    }

    public function update(Request $request, StickyNote $stickyNote)
    {
        if ($stickyNote->user_id !== Auth::id()) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $validated = $request->validate([
            'content' => 'nullable|string|max:1000',
            'color' => 'nullable|string|max:20',
        ]);

        $stickyNote->update($validated);

        return response()->json($stickyNote);
    }

    public function updatePosition(Request $request, StickyNote $stickyNote)
    {
        if ($stickyNote->user_id !== Auth::id()) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $validated = $request->validate([
            'x' => 'nullable|numeric|between:-9999,9999',
            'y' => 'nullable|numeric|between:-9999,9999',
            'width' => 'nullable|numeric|between:50,1000',
            'height' => 'nullable|numeric|between:30,500',
            'rotation' => 'nullable|numeric|between:-360,360',
            'z_index' => 'nullable|integer|between:0,999',
        ]);

        $stickyNote->update($validated);

        return response()->json([
            'message' => '位置情報を更新しました',
            'stickyNote' => $stickyNote->fresh()
        ]);
    }

    public function destroy(StickyNote $stickyNote)
    {
        if ($stickyNote->user_id !== Auth::id()) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $stickyNote->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
