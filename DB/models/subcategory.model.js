import mongoose, { Schema, model } from "mongoose";
const subcategorySchema = new Schema({
    name: { type: String, lowercase: true, required: true, unique: [true, 'subcategory name must be unique  '] },
    slug: { type: String, required: true, lowercase: true, },
    image: { type: Object, required: true },
    customId: String,
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, 

}, {
    timestamps: true
})

const subcategoryModel = mongoose.models.Subcategory || model("Subcategory", subcategorySchema)

export default subcategoryModel