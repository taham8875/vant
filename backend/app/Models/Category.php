<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'parent_id',
        'name',
        'icon',
        'is_system',
        'is_protected',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'is_system' => 'boolean',
            'is_protected' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('display_order');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function budgets(): HasMany
    {
        return $this->hasMany(Budget::class);
    }

    public function autoCategorization(): HasMany
    {
        return $this->hasMany(AutoCategorizationRule::class);
    }

    public function scopeSystemCategories($query)
    {
        return $query->where('is_system', true);
    }

    public function scopeUserCategories($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeParentCategories($query)
    {
        return $query->whereNull('parent_id')->orderBy('display_order');
    }
}
