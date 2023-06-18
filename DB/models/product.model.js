import mongoose, { Schema, model } from "mongoose";
const productSchema = new Schema({
    name: { type: String, lowercase: true, required: true, trim: true },
    slug: { type: String, lowercase: true, required: true, trim: true },
    description: String,
    stock: { type: Number,  required: true },
    price: { type: Number, required: true },
    discount: { type: Number , default: 0},
    finalPrice: { type: Number  },
    isDeleted: { type: Boolean, default: false },
    
    //======================================================================
    colors: [String],
    customId: String,
    size: { type: [String], enum: ['s', 'm', 'lg', 'xl'] },
    mainImage: { type: Object, required: true },
    subImages: { type: [Object] },
//================================================================================================================ ids    
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: [true, "createdBy is required"] },
    subcategoryId: { type: Schema.Types.ObjectId, ref: "Subcategory", required: [true, "createdBy is required"] },
    brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: [true, "createdBy is required"] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    wishUserList: { type: Schema.Types.ObjectId, ref: "User" },
}, {
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps: true
})


productSchema.virtual("reviews" , {
    ref:"Review",
    localField:"_id",
    foreignField:"productId"
})





const productModel = mongoose.models.Product || model("Product", productSchema)





export default productModel