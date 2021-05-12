import Knex from 'knex';

//inserir itens na tabela


export async function seed(knex: Knex){
    await knex('itens').insert([
        { title: 'Lâmpadas', image: 'lampadas.svg' },
        { title: 'Pilhas e Baterias', image: 'baterias.svg' },
        { title: 'Papéis e Papelão', image: 'papeis-papelao.svg' },
        { title: 'Resíduos Eletrônicos', image: 'eletronicos.svg' },
        { title: 'Resíduos Organicos', image: 'organicos.svg' },
        { title: 'Óleo', image: 'oleo.svg' },
        
    ]);
}