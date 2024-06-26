/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
	return knex.schema.createTable('reviews', function (table) {
		table.increments('id').primary();
		table.integer('user_id').unsigned().notNullable();
		table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
		table.integer('tenant_id').unsigned().notNullable();
		table.foreign('tenant_id').references('id').inTable('tenants');
		table.text('comment').notNullable();
		table.float('ratings').nullable().defaultTo(0);
		table.timestamps(true, true);

		table.index('tenant_id');
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
	return knex.schema.dropTable('reviews');
}
