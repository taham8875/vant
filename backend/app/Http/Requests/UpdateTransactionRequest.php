<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
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
            'account_id' => ['sometimes', 'uuid', 'exists:accounts,id'],
            'category_id' => ['sometimes', 'uuid', 'exists:categories,id'],
            'type' => ['sometimes', 'string', 'in:income,expense,transfer'],
            'amount' => ['sometimes', 'numeric', 'min:0.01'],
            'date' => ['sometimes', 'date'],
            'payee' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'linked_transaction_id' => ['nullable', 'uuid', 'exists:transactions,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'account_id.exists' => 'Selected account does not exist',
            'category_id.exists' => 'Selected category does not exist',
            'type.in' => 'Transaction type must be income, expense, or transfer',
            'amount.numeric' => 'Amount must be a valid number',
            'amount.min' => 'Amount must be greater than 0',
            'date.date' => 'Date must be a valid date',
            'payee.max' => 'Payee cannot exceed 255 characters',
            'notes.max' => 'Notes cannot exceed 1000 characters',
        ];
    }
}
