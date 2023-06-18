import mongoose, { Schema, model } from "mongoose";
const orderSchema = new Schema({

    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User"},
    address: { type: String, required: true },
    note: String,
    reason: String,
    phone: [{ type: String, required: true }],
    products: [{
        name: { type: String, required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1, required: true },
        unitPrice: { type: Number, default: 1, required: true },
        finalPrice: { type: Number, default: 1, required: true },
    }],
    couponId: { type: Schema.Types.ObjectId, ref: "Coupon", },
    subtotal: { type: Number, default: 1, required: true },
    finalPrice: { type: Number, default: 1, required: true },
    paymentMethod: { type: String, default: "cash", enum: ["cash", "card"], required: true },
    status: { type: String, default: "placed",
     enum: ["waitPayment", "placed", "canceled", "rejected", "onWay", "delivered"], required: true },
}, {
    timestamps: true
})

const orderModel = mongoose.models.Order || model("Order", orderSchema)

export default orderModel