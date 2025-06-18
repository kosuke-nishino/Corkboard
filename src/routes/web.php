<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskMemoController;
use App\Http\Controllers\StickyNoteController;
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
});

require __DIR__.'/auth.php';
