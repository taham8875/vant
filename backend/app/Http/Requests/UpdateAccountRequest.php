<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAccountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:100'],
            'type' => ['sometimes', 'string', 'in:checking,savings,credit_card,cash,investment'],
            // Note: balance is not editable - it's calculated from transactions
            'currency' => ['sometimes', 'string', 'size:3'],
            'is_asset' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.max' => 'Account name cannot exceed 100 characters',
            'type.in' => 'Account type must be one of: checking, savings, credit, cash, investment',
            'currency.size' => 'Currency must be a 3-letter code (e.g., USD, EUR)',
            'is_asset.boolean' => 'Is asset must be true or false',
        ];
    }
}
