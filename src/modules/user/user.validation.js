import joi from 'joi'
import { generationFields } from '../../middleWare/validation.middle.js'

//==================================================================================== signup validation ==============================

export const sendCode = joi.object({
    email: generationFields.email.required(),
}).required()
//================================================================================== restPassword ========================
export const restPassword = joi.object({
    code:joi.number().required(),
    newPassword: generationFields.password.required(),
    cNewPassword: joi.string().valid(joi.ref("newPassword")),
}).required()
