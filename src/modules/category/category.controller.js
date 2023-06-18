import cloudinary from "../../utils/cloudinary.js"
import categoryModel from "../../../DB/models/category.model.js"
import slugify from "slugify"



export const createCategory = async (req, res, next) => {
    const { name } = req.body
    if (await categoryModel.findOne({ name })) {
        return next(new Error("duplicate key", { cause: 409 }))
    }
    const { secure_url, public_id } =
        await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.FILE_NAME}/category` })

    const category = new categoryModel({
        name,
        image: { secure_url, public_id },
        slug: slugify(name, '-'),
        createdBy: req.user._id

    })
    await category.save()
    return res.status(201).json({ message: "success", category })
}
//======================================================================
export const updateCategory = async (req, res, next) => {
    const category = await categoryModel.findById(req.params.categoryId)
    !category && next(new Error("invalid category id", { cause: 400 }))
    if (req.body.name) {
        if (category.name == req.body.name) {
            return next(new Error("updated fail cause the same value", { cause: 409 }))
        }
        if (await categoryModel.findOne({ name: req.body.name })) {
            return next(new Error("updated fail Duplicate Key", { cause: 409 }))

        }
        category.name = req.body.name
        category.slug = slugify(req.body.name, '-')
    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.FILE_NAME}/category` })
        await cloudinary.uploader.destroy(category.image.public_id)
        category.image = { secure_url, public_id }
    }

    await category.save()
    res.status(201).json({ message: "success", category })
}
//========================================================================== get categories
export const getCategories = async (req, res, next) => {
    const category = await categoryModel.find().populate([{
        path: "subCategoryItems"
    }])
    if (!category.length) return next(new Error("not found categories", { cause: 400 }))
    res.status(201).json({ message: "success", category })
}