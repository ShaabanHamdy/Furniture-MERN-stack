import mongoose, { Schema, model } from "mongoose";
const couponSchema = new Schema({
    code: { type: String, lowercase: true, required: true, unique: true },
    image: { type: Object },
    discount: { type: Number, default: 1 },
    expiredDate: { type: Date, required: true },
    usedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },

}, {
    timestamps: true
})

const couponModel = mongoose.models.Coupon || model("Coupon", couponSchema)


export default couponModel