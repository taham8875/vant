<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTransferRequest extends FormRequest
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
            'from_account_id' => ['required', 'uuid', 'exists:accounts,id'],
            'to_account_id' => ['required', 'uuid', 'exists:accounts,id', 'different:from_account_id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'from_account_id.required' => 'Source account is required',
            'from_account_id.exists' => 'Selected source account does not exist',
            'to_account_id.required' => 'Destination account is required',
            'to_account_id.exists' => 'Selected destination account does not exist',
            'to_account_id.different' => 'Source and destination accounts must be different',
            'amount.required' => 'Transfer amount is required',
            'amount.numeric' => 'Amount must be a valid number',
            'amount.min' => 'Amount must be greater than 0',
            'date.required' => 'Transfer date is required',
            'date.date' => 'Date must be a valid date',
            'notes.max' => 'Notes cannot exceed 1000 characters',
        ];
    }
}
