import Knex from 'knex';

//recurso para criar tabelas  //função up para criar a tabela down para remover



export async function up(knex: Knex){
    return knex.schema.createTable('itens', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
       
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable('itens');
}