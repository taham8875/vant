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
        Schema::create('categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->uuid('parent_id')->nullable();
            $table->string('name', 100);
            $table->string('icon', 50)->nullable();
            $table->boolean('is_system')->default(false);
            $table->boolean('is_protected')->default(false);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->index('user_id');
            $table->index('parent_id');
            $table->unique(['user_id', 'name'], 'categories_user_id_name_unique');
        });

        // Add self-referential foreign key after table creation
        Schema::table('categories', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
