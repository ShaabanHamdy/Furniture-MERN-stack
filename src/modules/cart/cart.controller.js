import cloudinary from "../../utils/cloudinary.js"
import cartModel from "../../../DB/models/cart.model.js"
import productModel from "../../../DB/models/product.model.js"
import slugify from "slugify"



export const addProductToCart = async (req, res, next) => {
    const { productId, quantity } = req.body
    const product = await productModel.findById(productId)

    if (!product) return next(new Error("in valid product id", { cause: 400 }))

    if (product.stock < quantity || product.isDeleted) {
        await productModel.updateOne({ _id: productId }, { $addToSet: { wishUserList: req.user._id } })
        return next(new Error(`invalid product quantity max available is ${product.stock}`, { cause: 400 }))
    }
    const cart = await cartModel.findOne({ userId: req.user._id })

    if (!cart) {
        const newCart = await cartModel.create({
            userId: req.user._id,
            products: [{ productId, quantity }]
        })
        return res.status(201).json({ message: "Success added product", newCart })
    }
    let equalProduct = false
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].productId.toString() == productId) {
            cart.products[i].quantity = quantity
            equalProduct = true
            res.status(201).json({ message: "updated quantity" })
            break;
        }
    }
    if (!equalProduct) {
        cart.products.push({ productId, quantity })
    }
    const newC =await cart.save()
    return res.status(201).json({ message: "Success added new product " ,newC})

}
// //======================================================================
// export const updatecart = async (req, res, next) => {
//     const cart = await cartModel.findById(req.params.cartId)
//     !cart && next(new Error("invalid cart id", { cause: 400 }))
//     if (req.body.name) {
//         if (cart.name == req.body.name) {
//             return next(new Error("updated fail cause the same value", { cause: 409 }))
//         }
//         if (await cartModel.findOne({ name: req.body.name })) {
//             return next(new Error("updated fail Duplicate Key", { cause: 409 }))

//         }
//         cart.name = req.body.name
//         cart.slug = slugify(req.body.name, '-')
//     }

//     if (req.file) {
//         const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.FILE_NAME}/cart` })
//         await cloudinary.uploader.destroy(cart.image.public_id)
//         cart.image = { secure_url, public_id }
//     }

//     await cart.save()
//     res.status(201).json({ message: "success", cart })
// }
// //========================================================================== get categories
// export const getAllcarts = async (req, res, next) => {
//     const cart = await cartModel.find()
//     if (!cart.length) return next(new Error("not found categories", { cause: 400 }))
//     res.status(201).json({ message: "success", cart })
// }