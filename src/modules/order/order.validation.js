import joi from 'joi'
import { generationFields } from '../../middleWare/validation.middle.js'


export const createOrder = joi.object({
    note: joi.string().min(1),
    address: joi.string().min(1).required(),
    phone: joi.array().items(
        joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)).required()
    ).min(1).max(3).required(),
    couponCode: joi.string(),
    paymentMethod: joi.string().valid("cash", "card"),
    products: joi.array().items(
        joi.object({
            productId: generationFields.id,
            quantity: joi.number().positive().integer().min(1).required()

        }).required()
    ),
}).required()
//========================================================


export const cancelOrder = joi.object({
    reason: joi.string().min(1).required(),
    orderId: generationFields.id.required()
}).required()

//================================================================
export const updateStatus = joi.object({
    status: joi.string().valid("delivered", "onWay").required(),
    orderId: generationFields.id.required()
}).required()