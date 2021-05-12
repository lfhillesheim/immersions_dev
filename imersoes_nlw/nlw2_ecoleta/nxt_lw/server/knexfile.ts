import path from 'path';

//informações da conexao

module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'src', 'database','database.sqlite'),
    },

    //criar as tabelas
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },


    //inserir dados pre estabelecidos com codigo
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true,
};


