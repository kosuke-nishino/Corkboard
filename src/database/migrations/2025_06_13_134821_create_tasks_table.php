<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->text('content')->nullable();
        $table->date('start_date')->nullable();
        $table->date('end_date')->nullable();
        $table->float('x')->nullable();
        $table->float('y')->nullable();
        $table->float('width')->nullable();
        $table->float('height')->nullable();
        $table->float('rotation')->nullable();
        $table->integer('z_index')->nullable();
        $table->string('color')->nullable();
        $table->boolean('is_completed')->default(false);
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
 