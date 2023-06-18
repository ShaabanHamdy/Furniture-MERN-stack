import joi from 'joi'
import { generationFields } from '../../middleWare/validation.middle.js'


export const createBrand = joi.object({
    name: joi.string().min(2).max(20).required(),
    file : generationFields.file.required()
}).required()
//========================================================
export const updateBrand = joi.object({
    name: joi.string().min(2).max(20),
    file : generationFields.file,
    brandId : generationFields.id,
}).required()



