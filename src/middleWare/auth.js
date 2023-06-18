import userModel from "../../DB/models/user.model.js"
import { tokenDecode } from "../utils/TokenFunction.js"
import { asyncHandler } from "../utils/errorHandling.js"

export const roles = {
    Admin: "Admin",
    User: "User",
    HR: "HR"
}


const auth = (accessRoles = []) => {
    return asyncHandler(async (req, res, next) => {

        const { auth } = req.headers

        if (!auth) return next(new Error("auth empty"))

        if (!auth?.startsWith("shaban__")) return next(new Error("invalid  prefix"))

        const splitToken = auth.split("shaban__")[1]

        if (!splitToken) return next(new Error("invalid  splitToken"))

        const decode = tokenDecode({ payload: splitToken })


        if (!decode?.id) return next(new Error("invalid  tokenDecode"))

        const user = await userModel.findById(decode.id).select("firstName email role changePasswordTime")
        if (!user) return next(new Error("not register account"))
        
        if (decode.iat < parseInt(user.changePasswordTime / 1000)) return next(Error("token expired"))
        

        if (!accessRoles.includes(user.role)) return next(new Error("un-authorized user", { cause: 403 }))


        req.user = user

        return next()
    })
}
export default auth
