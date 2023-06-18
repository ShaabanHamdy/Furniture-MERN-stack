import mongoose, { Schema, model } from "mongoose";
const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },

    rating: { type: Number, required: true ,min:1 ,max:5},
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: [true, "createdBy is required"] }, 
    productId: { type: Schema.Types.ObjectId, ref: "Product" }, 
    orderId: { type: Schema.Types.ObjectId, ref: "Order" }, 

}, {
    timestamps: true
})

const reviewModel = mongoose.models.Review || model("Review", reviewSchema)

export default reviewModel