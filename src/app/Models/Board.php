<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    protected $fillable = ['title', 'content','start_date', 'end_date', 'color','user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }//
}
