<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = [
        'user_id',
        'file_path',
        'x',
        'y',
        'width',
        'height',
        'rotation',
        'z_index',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
