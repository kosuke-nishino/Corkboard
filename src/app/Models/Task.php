<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'start_date',
        'end_date',
        'x',
        'y',
        'width',
        'height',
        'rotation',
        'z_index',
        'color',
        'is_completed',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
