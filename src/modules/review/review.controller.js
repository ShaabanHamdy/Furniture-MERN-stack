import cloudinary from "../../utils/cloudinary.js"
import brandModel from "../../../DB/models/brand.model.js"
import slugify from "slugify"
import orderModel from "../../../DB/models/order.model.js"
import reviewModel from "../../../DB/models/review.model.js"



export const createReview = async (req, res, next) => {
    const { productId } = req.params
    const { comment, rating } = req.body
    const order = await orderModel.findOne({
        userId: req.user._id,
        status: "delivered",
        "products.productId": productId
    })
    if (!order) return next(new Error("cant review product before receive it", { cause: 400 }))

    const checkReview = await reviewModel.findOne({ createdBy: req.user._id, productId, orderId: order._id })
    if (checkReview) return next(new Error("already reviewed by you", { cause: 400 }))

    const review = await reviewModel.create({ comment, rating, createdBy: req.user._id, orderId: order._id, productId })
    return res.status(201).json({ message: "success", review })


}
//======================================================================

export const updateReview = async (req, res, next) => {
    const { productId, reviewId } = req.params

    const review = await reviewModel.updateOne({ _id: reviewId, productId }, req.body)
    return res.status(201).json({ message: "updated successfully", review })
}


export const getReviews = async (req, res, next) => {
    const review = await reviewModel.find()
    return res.status(201).json({ message: "success", review })
}