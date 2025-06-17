<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskMemoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/task-memos', [TaskMemoController::class, 'index'])->name('task.index');
    Route::post('/task-memos', [TaskMemoController::class, 'store'])->name('task.store');
    Route::put('/task-memos/{id}', [TaskMemoController::class, 'update'])->name('task.update');
    Route::delete('/task-memos/{id}', [TaskMemoController::class, 'destroy'])->name('task.destroy');
});

require __DIR__.'/auth.php';
