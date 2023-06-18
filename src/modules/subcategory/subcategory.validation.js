import joi from 'joi'
import { generationFields } from '../../middleWare/validation.middle.js'


export const createSubcategory = joi.object({
    name: joi.string().min(2).max(20).required(),
    file : generationFields.file.required(),
    categoryId : generationFields.id,
}).required()
//========================================================
export const updateSubcategory = joi.object({
    name: joi.string().min(2).max(20),
    file : generationFields.file,
    subcategoryId : generationFields.id,
}).required()



