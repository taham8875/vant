<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateAccountRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:100'],
            'type' => ['required', 'string', 'in:checking,savings,credit_card,cash,investment'],
            'balance' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'size:3'],
            'is_asset' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Account name is required',
            'name.max' => 'Account name cannot exceed 100 characters',
            'type.required' => 'Account type is required',
            'type.in' => 'Account type must be one of: checking, savings, credit, cash, investment',
            'balance.numeric' => 'Balance must be a valid number',
            'balance.min' => 'Balance cannot be negative',
            'currency.required' => 'Currency is required',
            'currency.size' => 'Currency must be a 3-letter code (e.g., USD, EUR)',
            'is_asset.required' => 'Please specify if this is an asset account',
            'is_asset.boolean' => 'Is asset must be true or false',
        ];
    }
}
