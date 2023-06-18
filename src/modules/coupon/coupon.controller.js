import couponModel from "../../../DB/models/coupon.model.js";
import cloudinary from "../../utils/cloudinary.js";

export const createCoupon = async (req, res, next) => {
    const { code } = req.body
    if (await couponModel.findOne({ code })) {
        return next(new Error("Duplicate coupon code", { cause: 409 }))
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.FILE_NAME}/coupon`
        })
        req.body.image = { secure_url, public_id }
    }

    const coupon = new couponModel({
        code,
        discount: req.body.discount,
        expiredDate: new Date(req.body.expiredDate),
        createdBy: req.user._id,
    })
    await coupon.save()

    return res.status(201).json({ message: "success", coupon })
}
//======================================================================
export const updateCoupon = async (req, res, next) => {
    const coupon = await couponModel.findById(req.params.couponId)
    if (!coupon) {
        return next(new Error("invalid coupon id", { cause: 400 }))
    }
    if (req.body.code) {
        if (req.body.code == coupon.code) {
            return next(new Error("Sorry cannot update coupon with the same code ", { cause: 400 }))
        }
        if (await couponModel.findOne({ code: req.body.code })) {
            return next(new Error("Duplicate coupon code", { cause: 409 }))
        }
        coupon.code = req.body.code
    }
    if (req.body.discount) {
        if (req.body.discount == coupon.discount) {
            return next(new Error("Sorry cannot update coupon with the same discount value ", { cause: 400 }))
        }
        coupon.discount = req.body.discount
    }
    //============= update image  
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.FILE_NAME}/coupon`
        })
        if (coupon.image) {
            await cloudinary.uploader.destroy(coupon.image.public_id)
        }
        coupon.image = { secure_url, public_id }
    }
    coupon.updatedBy = req.user._id
    await coupon.save()
    return res.status(201).json({ message: "success", coupon })
}
//============================================== get all coupons 
export const getAllCoupons = async (req, res, next) => {
    const coupon = await couponModel.find()
    return res.status(201).json({ message: "success", coupon })
}