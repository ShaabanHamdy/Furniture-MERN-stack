import joi from 'joi'
import { generationFields } from '../../middleWare/validation.middle.js'


export const createProduct = joi.object({
    
    name: joi.string().min(2).max(50).required(),
    description: joi.string().min(2),
    stock: joi.number().integer().positive().min(1).required(),
    price: joi.number().positive().min(1).required(),
    discount: joi.number().positive().min(1),
    size: joi.array(),
    colors: joi.array(),
    categoryId: generationFields.id.required(),
    subcategoryId: generationFields.id.required(),
    brandId: generationFields.id.required(),
    
    file:joi.object({
        mainImage:joi.array().items(generationFields.file.required()).length(1).required(),
        subImages:joi.array().items(generationFields.file).min(1).max(5).optional(),
    })
}).required()

//====================================================================================== update Product
export const updateProduct = joi.object({
    name: joi.string().min(2).max(50),
    description: joi.string().min(2),
    stock: joi.number().integer().positive().min(1),
    price: joi.number().positive().min(1),
    discount: joi.number().positive().min(1),
    size: joi.array(),
    colors: joi.array(),
    productId:generationFields.id.required(),
    file:joi.object({
        mainImage:joi.array().items(generationFields.file.required()).length(1),
        subImages:joi.array().items(generationFields.file).min(1).max(5),
    })
}).required()
//====================================================================================== update Product
export const wishlist = joi.object({
    
    productId:generationFields.id,
   
}).required()
//========================================================

