import joi from 'joi'
import { generationFields } from '../../middleWare/validation.middle.js'

//==================================================================================== signup validation ==============================

export const signup = joi.object({
    firstName: joi.string().messages({
        "string.min": "must be contain minimum 2 characters"
    }).min(2).max(20).required(),
    lastName: joi.string().min(2).max(20).required(),
    phone: joi.string().messages({
        "string.min": "must be contain minimum 11 numbers"
    }).min(11).max(25).required(),
    // DOB: joi.date().required(),
    password: generationFields.password.messages({
        "string.pattern.base":"password must to be contain min 8 letters capital and small  and spacial characters "
    }).required(),
    confirmPassword: generationFields.cPassword.messages({
        "any.only":"confirmPassword must be contain the same value of password"
    }).required(),
    email: generationFields.email.required(),
}).required()
//==================================================================================== login validation==============================
export const login = joi.object({
    password: joi.string().required(),
    email: generationFields.email.required()
}).required()



//==================================================================================== token validation ==============================
export const token = joi.object({ token: joi.string().required(), }).required()
