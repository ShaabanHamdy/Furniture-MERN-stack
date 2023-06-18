import orderModel from "../../../DB/models/order.model.js"
import couponModel from "../../../DB/models/coupon.model.js";
import productModel from "../../../DB/models/product.model.js"
import cartModel from "../../../DB/models/cart.model.js"



export const createOrder = async (req, res, next) => {
    const { note, paymentMethod, products, address, phone, couponCode } = req.body

    if (!req.body.products) {

        const cart = await cartModel.findOne({ userId: req.user._id })
        if (!cart?.products?.length) return next(new Error("empty cart", { cause: 400 }))
        req.body.isCart = true
        req.body.products = cart.products
    }
    //======= check if there are coupon use
    if (couponCode) {
        const coupon = await couponModel.findOne({ code: couponCode })
        if (!coupon) return next(new Error("in valid coupon code", { cause: 404 }))
        if (coupon.expiredDate.getTime() < Date.now()) return next(new Error("expired coupon code", { cause: 400 }))
        if (coupon.usedBy.includes(req.user._id)) return next(new Error("you already used this coupon code", { cause: 400 }))
        req.body.coupon = coupon
    }
    const productList = []
    const productIds = []
    let subtotal = 0

    //================= check if not find product id in product schema
    for (let product of req.body.products) {
        if (! await productModel.findById(product.productId)) {
            return next(new Error(`there is not this id ${product.productId} in product data base`, { cause: 400 }))
        }

    }


    for (let product of req.body.products) {
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity },
            isDeleted: false
        })

        if (!checkProduct) return next(new Error(`fail in checkProduct `, { cause: 400 }))
        if (req.body.isCart) {
            product = product.toObject()

        }
        productIds.push(product.productId)
        product.name = checkProduct.name
        product.unitPrice = checkProduct.finalPrice
        product.finalPrice = product.quantity * checkProduct.finalPrice.toFixed(2)
        subtotal += product.finalPrice
        productList.push(product)
    }


    const order = await orderModel.create({
        userId: req.user._id,
        address,
        phone,
        note,
        products: productList,
        couponId: req.body.coupon?._id,
        subtotal,
        finalPrice: subtotal - (subtotal * ((req.body.coupon?.discount || 0) / 1000)).toFixed(2),
        paymentMethod,
        status: paymentMethod ? "waitPayment" : "placed",


    })
    //=========== decrease product stock ======================================================================================
    for (const product of req.body.products) { await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } }) }
    //==================push user is in usedBy coupon ============
    if (req.body.coupon) { await couponModel.updateOne({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user._id } }) }
    //======================clear items from cart========
    if (req.body.isCart) {
        await cartModel.updateOne({ userId: req.user._id }, { products: [] })

    } else {
        await cartModel.updateOne({ userId: req.user._id }, {
            $pull: { products: { productId: { $in: productIds } } }
        })

    }


    return res.status(201).json({ message: "Success", order })

}
//================= cancel order 

export const cancelOrder = async (req, res, next) => {
    const { reason } = req.body
    const { orderId } = req.params
    const order = await orderModel.findOne({ _id: orderId, userId: req.user._id })

    if (!order) {
        return next(new Error(`invalid order id`, { cause: 400 }))
    }
    if (order?.status != "placed" && order.paymentMethod == "cash" || (order?.status != "waitPayment" && order.paymentMethod == "card")) {
        return next(new Error(`cannot cancel your order after it changed ${order.status}`, { cause: 400 }))
    }
    const cancelOrder = await orderModel.updateOne({ _id: order._id }, { status: "canceled", reason, updatedBy: req.user._id })
    if (!cancelOrder.matchedCount) {
        return next(new Error(`fail to cancel order`, { cause: 400 }))
    }
    //======== decrease product stock 
    for (const product of order.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: parseInt(product.quantity) } })
    }
    if (order.couponId) {
        await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: req.user._id } })
    }

    return res.status(201).json({ message: "cancel order Successfully" })

}
//=============================

export const updateOrderStatus = async (req, res, next) => {
    const { status } = req.body
    const { orderId } = req.params
    const order = await orderModel.findOne({ _id: orderId })

    if (!order) {
        return next(new Error(`invalid order id`, { cause: 400 }))
    }
    const cancelOrder = await orderModel.updateOne({ _id: order._id }, { status, updatedBy: req.user._id })


    if (!cancelOrder.matchedCount) {
        return next(new Error(`fail to update your order`, { cause: 400 }))
    }

    return res.status(201).json({ message: "updated order Successfully" })

}
//=====================================================================
export const getOrder = async (req, res, next) => {
    const order = await orderModel.find()
    return res.status(201).json({ message: "success" , order })

}
