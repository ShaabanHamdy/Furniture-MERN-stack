import { customAlphabet  } from "nanoid"
import userModel from "../../../DB/models/user.model.js"
import sendEmail from "../../utils/email.js"
import bcrypt from 'bcryptjs'


export const sendCode = async (req, res, next) => {
    const {  email } = req.body
    
    const user =await userModel.findOne({ email }).select("firstName")
    
    if (!user) return next(new Error("`invalid email information`", { cause: 409 }))
    
    const id = customAlphabet("123456789")
    
    const code = id(4)

    // send email to get code  ========================
    const message = ` Hello ${user.firstName} your code is ${code}`

    if (!await sendEmail({ to: email, subject: 'Confirmation Code', message })) return next(new Error("email rejected", { cause: 400 }))
    
    await userModel.updateOne({forgetCode : code})
    
    res.status(201).json({ message: "please check your Gmail to get your Confirmation Code" })
}
//================================= confirmation link
export const restPassword = async (req, res, next) => {
    const { code , newPassword } = req.body


    const user = await userModel.findOne().select("forgetCode")
    
    if (user.forgetCode !== code) return next(new Error("invalid code "))

    const hashNewPassword = bcrypt.hashSync(newPassword ,+process.env.SALT_ROUNDS)
    
    await userModel.updateOne({password:hashNewPassword , forgetCode:null , changePasswordTime : Date.now() })
    
    return res.status(200).json({ message: "change password successfully" })
}
