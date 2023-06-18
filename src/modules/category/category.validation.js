import joi from 'joi'
import { generationFields } from '../../middleWare/validation.middle.js'


export const createCategory = joi.object({
    
    name: joi.string().min(2).max(20).required(),
    file : generationFields.file.required()
}).required()
//========================================================
export const updateCategory = joi.object({
    name: joi.string().min(2).max(20),
    file : generationFields.file,
    categoryId : generationFields.id,
}).required()



