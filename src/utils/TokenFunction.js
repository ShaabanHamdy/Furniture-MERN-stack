import jwt from "jsonwebtoken"


// =====Generate token

export const tokenGeneration = ({
    payload = {},
    signature = process.env.TOKEN_SIGNATURE,
    // expiresIn = 60 * 60 * 24
}) => {

    const token = jwt.sign(payload, signature)
    return token
}
//=========================== decode token 

export const tokenDecode = ({
    payload = '',
    signature = process.env.TOKEN_SIGNATURE,

}) => {

    const decode = jwt.verify(payload, signature)
    return decode
}

