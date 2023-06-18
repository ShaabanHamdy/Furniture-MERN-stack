import joi from 'joi'
import { generationFields } from '../../middleWare/validation.middle.js'


export const createReview = 
joi.object({
    productId:generationFields.id,  
    comment: joi.string().min(2).max(1000).required(),
    rating : joi.number().min(1).max(5).required(),
}).required()
//========================================================
export const updateReview = 
joi.object({
    productId:generationFields.id,  
    reviewId:generationFields.id,  
    comment: joi.string().min(2).max(1000),
    rating : joi.number().min(1).max(5),
}).required()
//========================================================
