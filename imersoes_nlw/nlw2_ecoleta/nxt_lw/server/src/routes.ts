import express from 'express';
import multer from 'multer'
import multerConfig from './config/multer'
import { celebrate, Joi } from 'celebrate'
import PointController from './controlers/PointsController';
import ItensController from './controlers/ItensController';

const pointController = new PointController();
const itensController = new ItensController();
const routes = express.Router();
const upload = multer(multerConfig);

routes.get('/points', pointController.index);
routes.get('/itens', itensController.index);

routes.get('/points/:id', pointController.show);



routes.post(
    '/points', 
    upload.single('image'), 
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email,
            whatsApp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            itens: Joi.string().required(),
            

        })
    }, {
        abortEarly: false
    }),

    pointController.create);


 export default routes;