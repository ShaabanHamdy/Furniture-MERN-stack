import mongoose, { Schema, model } from "mongoose";
const brandSchema = new Schema({
    name: {
        type: String,
        lowercase: true,
        required: true, unique: [true, 'brand name must be unique  ']
    },
    slug: { type: String, lowercase: true, required: true },
    image: { type: Object, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: [true, "createdBy is required"] }, 
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }, 

}, {
    timestamps: true
})

const brandModel = mongoose.models.Brand || model("Brand", brandSchema)

export default brandModel