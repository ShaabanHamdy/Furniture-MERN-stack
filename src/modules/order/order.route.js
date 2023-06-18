import { Router } from "express";
import * as controllers from "./order.controller.js";
import * as validators from "./order.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validationMiddle } from "../../middleWare/validation.middle.js";
import auth, { roles } from "../../middleWare/auth.js";

const router = Router()



router.route('/')
    .post(auth(roles.User),
        validationMiddle(validators.createOrder),
        asyncHandler(controllers.createOrder))
// /=================================================cancelOrder
router.route('/:orderId')
    .put(auth(roles.User),
        validationMiddle(validators.cancelOrder),
        asyncHandler(controllers.cancelOrder))
//====================================================updateOrderStatus==============
    .patch(auth(roles.User),
        validationMiddle(validators.updateStatus),
        asyncHandler(controllers.updateOrderStatus))
//========================================================
router.get("/getOrder" , asyncHandler(controllers.getOrder))

export default router