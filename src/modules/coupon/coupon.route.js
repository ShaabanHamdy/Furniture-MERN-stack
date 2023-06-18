import { Router } from "express";
import * as controllers from "./coupon.controller.js";
import * as validators from "./coupon.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validationMiddle } from "../../middleWare/validation.middle.js";
import { myMulter } from "../../services/multer.js";
import auth, { roles } from "../../middleWare/auth.js";

const router = Router()

router.route('/')
    .post(auth(roles.Admin),
        myMulter({}).single("image"),
        validationMiddle(validators.createCoupon),
        asyncHandler(controllers.createCoupon))
    //================================================================    
    .get(asyncHandler(controllers.getAllCoupons))

//====================================================
router.route('/:couponId')
    .put(auth(roles.Admin),
        myMulter({}).single("image"),
        validationMiddle(validators.updateCoupon),
        asyncHandler(controllers.updateCoupon))


export default router