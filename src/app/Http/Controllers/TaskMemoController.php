<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskMemoController extends Controller
{
    public function index()
{
    $tasks = Task::where('user_id', Auth::id())->get();

    return Inertia::render('Dashboard', [
        'tasks' => $tasks,
    ]);
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'x' => 'nullable|numeric',
            'y' => 'nullable|numeric',
            'width' => 'nullable|numeric',
            'height' => 'nullable|numeric',
            'rotation' => 'nullable|numeric',
            'z_index' => 'nullable|integer',
            'color' => 'nullable|string|max:20',
            'is_completed' => 'boolean',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['is_completed'] = $validated['is_completed'] ?? false;

        $task = Task::create($validated);

        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task)
    {      

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',           
            'color' => 'nullable|string|max:20',
            'is_completed' => 'boolean',
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    public function updatePosition(Request $request, Task $task)
{
    // 必要なら認可チェック（任意）
    // $this->authorize('update', $task);

    $validated = $request->validate([
        'x' => 'nullable|numeric',
        'y' => 'nullable|numeric',
        'width' => 'nullable|numeric',
        'height' => 'nullable|numeric',
        'rotation' => 'nullable|numeric',
        'z_index' => 'nullable|integer',
    ]);

    $task->update($validated);

    return response()->json(['message' => '位置情報を更新しました']);
}

    public function destroy(Task $task)
    {


        $task->delete(); // ← 修正

        return response()->json(['message' => 'Deleted']);
    }
}
