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
        Schema::create('accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->string('name', 100);
            $table->enum('type', ['checking', 'savings', 'credit_card', 'cash', 'investment']);
            $table->decimal('balance', 15, 2)->default(0);
            $table->char('currency', 3)->default('USD');
            $table->boolean('is_asset');
            $table->timestamps();

            $table->index('user_id');
            $table->index(['user_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
