import cloudinary from "../../utils/cloudinary.js"
import brandModel from "../../../DB/models/brand.model.js"
import slugify from "slugify"



export const createBrand = async (req, res, next) => {
    const { name } = req.body
    if (await brandModel.findOne({ name })) {
        return next(new Error("duplicate key", { cause: 409 }))
    }
    const { secure_url, public_id } =
        await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.FILE_NAME}/brand` })

    const brand = new brandModel({
        name,
        image: { secure_url, public_id },
        slug: slugify(name, '-'),
        createdBy : req.user._id 
    })
    await brand.save()
    return res.status(201).json({ message: "success", brand })
}
//======================================================================
export const updateBrand = async (req, res, next) => {
    const brand = await brandModel.findById(req.params.brandId)
    !brand && next(new Error("invalid brand id", { cause: 400 }))
    if (req.body.name) {
        if (brand.name == req.body.name) {
            return next(new Error("updated fail cause the same value", { cause: 409 }))
        }
        if (await brandModel.findOne({ name: req.body.name })) {
            return next(new Error("updated fail Duplicate Key", { cause: 409 }))

        }
        brand.name = req.body.name
        brand.slug = slugify(req.body.name, '-')
    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.FILE_NAME}/brand` })
        await cloudinary.uploader.destroy(brand.image.public_id)
        brand.image = { secure_url, public_id }
    }

    await brand.save()
    res.status(201).json({ message: "success", brand })
}
//========================================================================== get categories
export const getAllBrands = async (req, res, next) => {
    const brand = await brandModel.find()
    if (!brand.length) return next(new Error("not found categories", { cause: 400 }))
    res.status(201).json({ message: "success", brand })
}