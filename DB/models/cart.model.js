import mongoose, { Schema, model } from "mongoose";
const cartSchema = new Schema({

    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [{
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number,default:1, required: true },
    }],

}, {
    timestamps: true
})

const cartModel = mongoose.models.Cart || model("Cart", cartSchema)

export default cartModel