<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('budgets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('category_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->integer('period_month');
            $table->integer('period_year');
            $table->boolean('rollover_enabled')->default(false);
            $table->decimal('rollover_amount', 15, 2)->default(0);
            $table->integer('alert_threshold')->default(80);
            $table->timestamps();

            $table->index('user_id');
            $table->unique(['user_id', 'category_id', 'period_year', 'period_month'], 'budgets_user_category_period_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};
