import joi from 'joi'
import { generationFields } from '../../middleWare/validation.middle.js'


export const createCart = joi.object({
    quantity: joi.number().integer().required(),
    productId : generationFields.id.required()
}).required()
//========================================================

