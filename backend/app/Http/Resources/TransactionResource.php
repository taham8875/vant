<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'account_id' => $this->account_id,
            'category_id' => $this->category_id,
            'linked_transaction_id' => $this->linked_transaction_id,
            'type' => $this->type,
            'amount' => $this->amount,
            'date' => $this->date?->toDateString(),
            'payee' => $this->payee,
            'notes' => $this->notes,
            'is_duplicate_flagged' => $this->is_duplicate_flagged,
            'import_batch_id' => $this->import_batch_id,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'account' => new AccountResource($this->whenLoaded('account')),
            'category' => new CategoryResource($this->whenLoaded('category')),
        ];
    }
}
