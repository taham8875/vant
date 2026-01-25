<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'user_id' => $this->user_id,
            'parent_id' => $this->parent_id,
            'name' => $this->name,
            'icon' => $this->icon,
            'is_system' => $this->is_system,
            'is_protected' => $this->is_protected,
            'display_order' => $this->display_order,
            'can_edit' => ! $this->is_system,
            'can_delete' => ! $this->is_system && ! $this->is_protected,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'parent' => new CategoryResource($this->whenLoaded('parent')),
            'children' => CategoryResource::collection($this->whenLoaded('children')),
        ];
    }
}
