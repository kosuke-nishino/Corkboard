<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskMemoController;
use App\Http\Controllers\StickyNoteController;
use App\Http\Controllers\ImageController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', [TaskMemoController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Task Memos routes
    Route::get('/task-memos', [TaskMemoController::class, 'index'])->name('task.index');
    Route::post('/task-memos', [TaskMemoController::class, 'store'])->name('task.store');
    Route::put('/task-memos/{task}/position', [TaskMemoController::class, 'updatePosition'])->name('task.updatePosition');
    Route::put('/task-memos/{task}', [TaskMemoController::class, 'update'])->name('task.update');
    Route::delete('/task-memos/{task}', [TaskMemoController::class, 'destroy'])->name('task.destroy');
    
    // Sticky Notes routes
    Route::get('/sticky-notes', [StickyNoteController::class, 'index'])->name('stickyNote.index');
    Route::post('/sticky-notes', [StickyNoteController::class, 'store'])->name('stickyNote.store');
    Route::put('/sticky-notes/{stickyNote}/position', [StickyNoteController::class, 'updatePosition'])->name('stickyNote.updatePosition');
    Route::put('/sticky-notes/{stickyNote}', [StickyNoteController::class, 'update'])->name('stickyNote.update');
    Route::delete('/sticky-notes/{stickyNote}', [StickyNoteController::class, 'destroy'])->name('stickyNote.destroy');

    // Images routes
    Route::get('/images', [ImageController::class, 'index'])->name('image.index');
    Route::post('/images', [ImageController::class, 'store'])->name('image.store');
    Route::put('/images/{image}/position', [ImageController::class, 'updatePosition'])->name('image.updatePosition');
    Route::put('/images/{image}', [ImageController::class, 'update'])->name('image.update');
    Route::delete('/images/{image}', [ImageController::class, 'destroy'])->name('image.destroy');

    
    // Calendar route
    Route::get('/calendar', function () {
        $tasks = auth()->user()->tasks;
        return Inertia::render('Calendar', [
            'tasks' => $tasks
        ]);
    })->name('calendar');
});

// Test routes without authentication
Route::get('/test/images', [ImageController::class, 'index'])->name('image.index.test');
Route::post('/test/images', [ImageController::class, 'store'])->name('image.store.test');
Route::put('/test/images/{image}/position', [ImageController::class, 'updatePosition'])->name('image.updatePosition.test');
Route::put('/test/images/{image}', [ImageController::class, 'update'])->name('image.update.test');
Route::delete('/test/images/{image}', [ImageController::class, 'destroy'])->name('image.destroy.test');

Route::get('/test/api', function() {
    return response()->json(['message' => 'Test API working', 'timestamp' => now()]);
});

require __DIR__.'/auth.php';
