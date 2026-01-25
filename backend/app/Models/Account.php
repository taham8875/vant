<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'balance',
        'currency',
        'is_asset',
    ];

    protected function casts(): array
    {
        return [
            'balance' => 'decimal:2',
            'is_asset' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function importBatches(): HasMany
    {
        return $this->hasMany(ImportBatch::class);
    }

    public function recalculateBalance(): void
    {
        $income = $this->transactions()->where('type', 'income')->sum('amount');
        $expenses = $this->transactions()->where('type', 'expense')->sum('amount');

        $this->update(['balance' => $income - $expenses]);
    }
}
