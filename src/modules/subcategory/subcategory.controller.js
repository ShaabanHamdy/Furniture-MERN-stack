import cloudinary from "../../utils/cloudinary.js"
import subcategoryModel from "../../../DB/models/subcategory.model.js"
import categoryModel from "../../../DB/models/category.model.js"
import slugify from "slugify"
import { nanoid } from "nanoid"


export const createSubCategory = async (req, res, next) => {
    const { name } = req.body
    const { categoryId } = req.params
    const customId = nanoid(4)  
    const category = await categoryModel.findById({_id:categoryId})
    !category && next(new Error("invalid category id", { cause: 409 }))
    if (await subcategoryModel.findOne({ name })) {
        return next(new Error("Duplicate key", { cause: 409 }))
    }
    const { secure_url, public_id } =
        await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.FILE_NAME}/category/${categoryId}/${customId}` })

    const subcategory = new subcategoryModel({
        name,
        image: { secure_url, public_id },
        slug: slugify(name, '-'),
        categoryId,
        customId,
        createdBy : req.user._id 
    })
    await subcategory.save()
    return res.status(201).json({ message: "success",subcategory })
}
//======================================================================
export const updateSubCategory = async (req, res, next) => {
    const subcategory = await subcategoryModel.findById({_id : req.params.subcategoryId})
    !subcategory && next(new Error("invalid subcategory id", { cause: 400 }))
   
    if (req.body.name) {
        if (subcategory.name == req.body.name) {
            return next(new Error("updated fail cause the same name", { cause: 409 }))
        }
        if (await subcategoryModel.findOne({ name: req.body.name })) {
            return next(new Error("updated fail Duplicate Key", { cause: 409 }))

        }

        subcategory.name = req.body.name
        subcategory.slug = slugify(req.body.name, '-')
    }

    if (req.file) {
        const { secure_url, public_id } = 
        await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.FILE_NAME}/category/${subcategory.categoryId}/${subcategory.customId}` })
        await cloudinary.uploader.destroy(subcategory.image.public_id)
        subcategory.image = { secure_url, public_id }
    }

    await subcategory.save()
    res.status(201).json({ message: "success", subcategory })
}
//========================================================================== get categories
export const getCategories = async (req, res, next) => {
    const subcategory = await subcategoryModel.find().populate("categoryId")
    if (!subcategory.length) return next(new Error("not found categories", { cause: 400 }))
    res.status(201).json({ message: "success", subcategory })
}