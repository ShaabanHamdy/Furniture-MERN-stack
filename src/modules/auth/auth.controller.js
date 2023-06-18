import userModel from "../../../DB/models/user.model.js"
import { tokenDecode, tokenGeneration } from "../../utils/TokenFunction.js"
import sendEmail from "../../utils/email.js"
import bcrypt from 'bcryptjs'

export const signup = async (req, res, next) => {
    const { lastName, firstName, email, password, phone, gender, DOB } = req.body
    // check email exist ========================
    if (await userModel.findOne({ email })) {
        return next(new Error("email already exist", { cause: 409 }))
    }
    const newUser = new userModel({ lastName, firstName, email, password, phone, gender, DOB })
    const token = tokenGeneration({ payload: { newUser }, expiresIn: 60 * 5 })
    // send email to verify  ========================
    if (!token) return next(new Error("fail in generate token", { cause: 400 }))
   await newUser.save()
    res.status(201).json({ message: "success" ,newUser })

   // const confirmationLink = `${req.protocol}://${req.headers.host}/auth/${token}`
    // const message = `
    // Hello ${firstName}
    // You registered an account on , 
    // before being able to use your account you need to verify that this is your email address by clicking 
    // here:<a href = ${confirmationLink}>CLICK HERE</a> 
    // Kind Regards`
    // if (!await sendEmail({ to: email, subject: 'Confirmation Email ', message })) return next(new Error("email rejected", { cause: 400 }))
    //======= waiting to confirm  
    // res.status(201).json({ message: "please check your Gmail to confirm your email" })
}
//================================= confirmation link
export const confirmEmail = async (req, res, next) => {
    const { token } = req.params
    const decode = tokenDecode({ payload: token })
    const newUserDecode = new userModel({ ...decode.newUser })

    if (!newUserDecode) return next(new Error("invalid token decode"))
    newUserDecode.isConfirmed = true
    const user = await newUserDecode.save()

    if (user) {
        res.status(200).json({ message: "Your email confirmed" })

    } else {
        next(new Error("Already confirmed"))

    }



    // const user = await userModel.findOneAndUpdate({email:newUserDecode.email}, { isConfirmed: true })


}
//============================ login =================== 
export const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) return next(new Error("invalid email information", { cause: 409 }))

    const matchPassword = bcrypt.compareSync(password, user.password)
    if (!matchPassword) return next(new Error("invalid password information", { cause: 409 }))
    const token = tokenGeneration({ payload: { id: user._id, role: user.role }, expiresIn: 60 * 30 })

    await userModel.updateOne({ status: "online" })

    res.status(201).json({ message: "success ", token })
}
//=========================================================== logout
export const logout = async (req, res, next) => {
    const user = await userModel.updateOne({ status: "offline" })
    res.status(201).json({ message: "Success logout ", user })
}
