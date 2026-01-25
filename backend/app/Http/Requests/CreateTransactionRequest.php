<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTransactionRequest extends FormRequest
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
            'account_id' => ['required', 'uuid', 'exists:accounts,id'],
            'category_id' => ['required', 'uuid', 'exists:categories,id'],
            'type' => ['required', 'string', 'in:income,expense,transfer'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date'],
            'payee' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'linked_transaction_id' => ['nullable', 'uuid', 'exists:transactions,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'account_id.required' => 'Account is required',
            'account_id.exists' => 'Selected account does not exist',
            'category_id.required' => 'Category is required',
            'category_id.exists' => 'Selected category does not exist',
            'type.required' => 'Transaction type is required',
            'type.in' => 'Transaction type must be income, expense, or transfer',
            'amount.required' => 'Amount is required',
            'amount.numeric' => 'Amount must be a valid number',
            'amount.min' => 'Amount must be greater than 0',
            'date.required' => 'Date is required',
            'date.date' => 'Date must be a valid date',
            'payee.max' => 'Payee cannot exceed 255 characters',
            'notes.max' => 'Notes cannot exceed 1000 characters',
        ];
    }
}
