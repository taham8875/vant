<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'account_id',
        'category_id',
        'linked_transaction_id',
        'type',
        'amount',
        'date',
        'payee',
        'notes',
        'is_duplicate_flagged',
        'import_batch_id',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'date' => 'date',
            'is_duplicate_flagged' => 'boolean',
        ];
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function linkedTransaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'linked_transaction_id');
    }

    public function importBatch(): BelongsTo
    {
        return $this->belongsTo(ImportBatch::class);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->whereHas('account', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });
    }

    public function scopeIncome($query)
    {
        return $query->where('type', 'income');
    }

    public function scopeExpense($query)
    {
        return $query->where('type', 'expense');
    }

    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where('payee', 'ILIKE', "%{$search}%");
    }

    public function scopeFreeTierHistory($query, $user)
    {
        if ($user->isFreeTier()) {
            return $query->where('date', '>=', now()->subMonths(6));
        }

        return $query;
    }
}
