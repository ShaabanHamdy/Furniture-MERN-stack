import joi from 'joi'
import { generationFields } from '../../middleWare/validation.middle.js'


export const createCoupon = joi.object({
    code: joi.string().min(2).max(20).required(),
    discount: joi.number().positive().min(1).max(100).required(),
    expiredDate: joi.date().greater(Date.now()).required(),
    file: generationFields.file,
}).required()
//========================================================
export const updateCoupon = joi.object({
    code: joi.string().min(2).max(20),
    discount: joi.number().positive().min(1).max(100),
    expiredDate: joi.number().positive().min(1).max(100),
    file: generationFields.file,
    couponId: generationFields.id.required(),
}).required()



