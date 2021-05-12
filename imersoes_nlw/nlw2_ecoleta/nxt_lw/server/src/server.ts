import express from 'express';
import routes  from './routes'
import path from 'path';
import cors from 'cors';
import { errors} from 'celebrate'
 
//rota: ENdereço completo da requisição
//recurso: qual entidade estamos acessando


//GET: Buscar informações
//POST: criar informações
//PUT: modificar informações
//DELETE: remover informações


const app = express();

//JSON

//request:  parametro
//response: retornar 

//queryparam rotas opcionais

//request body criacao e modificação da informação

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/upload', express.static(path.resolve(__dirname, '..', 'upload')));  //static é ára arquivos staticos como imagens

//importar as rotas do arquivo
app.use(errors())
app.listen(3333);