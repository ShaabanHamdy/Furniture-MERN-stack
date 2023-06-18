import cloudinary from "../../utils/cloudinary.js"
import productModel from "../../../DB/models/product.model.js"
import categoryModel from "../../../DB/models/category.model.js"
import subcategoryModel from "../../../DB/models/subcategory.model.js"
import brandModel from "../../../DB/models/brand.model.js"
import slugify from "slugify"
import { nanoid } from "nanoid"
import userModel from "../../../DB/models/user.model.js"
import { paginate } from "../../utils/paginate.js"

//======================================================================       create Product
export const createProduct = async (req, res, next) => {
    if (!await subcategoryModel.findById({ _id: req.body.subcategoryId, categoryId: req.body.categoryId })) return next(new Error("invalid Subcategory Id or Category Id", { cause: 409 }))
    if (!await brandModel.findById({ _id: req.body.brandId })) return next(new Error("invalid brand Id", { cause: 409 }))
    if (await productModel.findOne({ name: req.body.name })) return next(new Error("duplicate product name ", { cause: 409 }))

    req.body.createdBy = req.user._id

    req.body.slug = slugify(req.body.name, '-')

    req.body.finalPrice = Number.parseFloat(req.body.price - (req.body.discount / 100 * req.body.price)).toFixed(2)

    req.body.customId = nanoid(4)

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.FILE_NAME}/product/mainImage/${req.body.customId}` })
    req.body.mainImage = { secure_url, public_id }

    if (req.body?.subImages) {

        req.body.subImages = []
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.FILE_NAME}/product/mainImage/${req.body.customId}/subImages` })
            req.body.subImages.push({ secure_url, public_id })
        }

    }

    const product = await productModel.create(req.body)

    if (!product) return next(new Error("fail to create this product ", { cause: 409 }))

    res.status(201).json({ message: "success", product })
}
//======================================================================       update Product
export const updateProduct = async (req, res, next) => {
    const product = await productModel.findById({ _id: req.params.productId })

    if (!product) return next(new Error("invalid product id", { cause: 409 }))

    if (req.body.name) {
        if (await productModel.findOne({ name: req.body.name })) return next(new Error("duplicate name"))
        product.name = req.body.name,
            req.body.slug = slugify(req.body.name, '-')
    } else if (req.body.price && req.body.discount) {
        product.price = req.body.price
        product.discount = req.body.discount
        product.totalPrice = Number.parseFloat(req.body.price - (req.body.discount / 100 * req.body.price)).toFixed(2)
    } else if (req.body.price) {
        product.price = req.body.price
        product.totalPrice = Number.parseFloat(req.body.price - (product.discount / 100 * req.body.price)).toFixed(2)
    }
    else if (req.body.discount) {
        product.discount = req.body.discount
        product.totalPrice = Number.parseFloat(product.price - (req.body.discount / 100 * product.price)).toFixed(2)
    }
    else if (req.body.size) {
        product.size = req.body.size
    }
    else if (req.body.colors) {
        product.colors = req.body.colors
    }
    else if (req.body.description) {
        product.description = req.body.description
    }
    req.body.updatedBy = req.user._id


    if (req.files?.mainImage?.length) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.FILE_NAME}/product/mainImage/${product.customId}` })
        await cloudinary.uploader.destroy(product.mainImage.public_id)
        req.body.mainImage = { secure_url, public_id }
    }

    if (req.files?.subImages?.length) {
        req.body.subImages = []
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.FILE_NAME}/product/mainImage/${product.customId}/subImages` })
            for (const file of product.subImages) {
                await cloudinary.uploader.destroy(file.public_id)
            }
            req.body.subImages.push({ secure_url, public_id })

        }
    }


    const updatedProduct = await productModel.findByIdAndUpdate({ _id: product._id }, req.body, { new: true })
    if (!updatedProduct) return next(new Error("fail in update product"))
    res.status(201).json({ message: "updated successfully", updateProduct })

}
//=================================================== get Products
export const getAllProducts = async (req, res, next) => {

    const { skip, limit } = paginate(req.query.page, req.query.size)

    const products = await productModel.find().populate([{
        path: "reviews"
    }])
    .limit(parseInt(limit)).skip(skip)
     

    // for (let i = 0; i < products.length; i++) {
    //     let calcRating = 0
    //     for (let j = 0; j < products[i].reviews.length; j++) {
    //         calcRating += products[i].reviews[j].rating
    //     }
    //     let avgRating = calcRating / products[i].reviews.length
    //     const product = products[i].toObject()
    //     product.avgRating = avgRating
    //     products[i] = product

    // }
    // const category = await categoryModel.find()
    // if (!product.length) return next(new Error("not products available"))

    res.status(201).json({ message: "success", products })

}

//======================================================== addToWishList
export const addToWishList = async (req, res, next) => {
    const wishLst = await productModel.findById(req.params.productId)
    if (!wishLst) return next(new Error("in-valid product"))
    await userModel.updateOne({ _id: req.user._id }, { $addToSet: { wishlist: req.params.productId } })
    return res.status(201).json({ message: "success" })

}
//======================================================== addToWishList
export const removeFromWishList = async (req, res, next) => {
    await userModel.updateOne({ _id: req.user._id }, { $pull: { wishlist: req.params.productId } })
    return res.status(201).json({ message: "success" })

}



