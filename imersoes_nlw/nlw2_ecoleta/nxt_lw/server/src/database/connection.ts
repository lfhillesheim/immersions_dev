import knex from 'knex';
import path from 'path';  //caminhos internos

//responsavel pela conexao do banco criado
const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true,
});

export default connection;