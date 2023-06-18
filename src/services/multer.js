import multer from 'multer'

export const validationObject = {
    image: ['image/png' , "image/jpeg"],
    file: ['application/pdf']
}


export const myMulter = ({
    customValidation = validationObject.image
} = {}) => {
    const storage = multer.diskStorage({})
    const fileFilter = (req, file, cb) => {
        if (!customValidation.includes(file.mimetype)) {
            return cb(Error("invalid file extension"), false)
        }
        return cb(null, true)
    }
    const upload = multer({ fileFilter, storage })
    return upload
}
