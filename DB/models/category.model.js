import mongoose, { Schema, model } from "mongoose";
const categorySchema = new Schema({
    name: { type: String, lowercase: true, required: true, unique: [true, 'category name must be unique  '] },
    slug: { type: String, required: true , lowercase: true, },
    image: { type: Object, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    updatedBy: { type: Schema.Types.ObjectId, ref: "User"}, 

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
})

categorySchema.virtual('subCategoryItems', {
    localField: '_id', // Of post collection
    foreignField: 'categoryId',    // Of user collection
    ref: 'Subcategory',
    // justOne: true
})




const categoryModel = mongoose.models.Category || model("Category", categorySchema)


export default categoryModel