<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StickyNote extends Model
{
    protected $fillable = [
        'user_id',
        'content',
        'x',
        'y',
        'width',
        'height',
        'rotation',
        'z_index',
        'color',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
