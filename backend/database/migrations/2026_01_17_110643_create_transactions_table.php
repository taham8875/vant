<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('account_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('category_id')->nullable()->constrained()->onDelete('set null');
            $table->uuid('linked_transaction_id')->nullable();
            $table->enum('type', ['income', 'expense']);
            $table->decimal('amount', 15, 2);
            $table->date('date');
            $table->string('payee');
            $table->text('notes')->nullable();
            $table->boolean('is_duplicate_flagged')->default(false);
            $table->uuid('import_batch_id')->nullable();
            $table->timestamps();

            $table->index('account_id');
            $table->index(['account_id', 'date']);
            $table->index('category_id');
            $table->index('date');
            $table->index(['account_id', 'date', 'amount', 'payee'], 'transactions_duplicate_check_index');
        });

        // Add self-referential foreign key after table creation
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreign('linked_transaction_id')->references('id')->on('transactions')->onDelete('cascade');
        });

        // Add PostgreSQL specific full-text search index for payee
        if (config('database.default') === 'pgsql') {
            DB::statement('CREATE INDEX transactions_payee_trgm_index ON transactions USING gin (payee gin_trgm_ops)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
