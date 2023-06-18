import { Router } from "express";
// import { myMulter } from "../../services/multer.js";
import * as controllers from "./cart.controller.js";
import * as validators from "./cart.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validationMiddle } from "../../middleWare/validation.middle.js";
import auth, { roles } from "../../middleWare/auth.js";

const router = Router()



router.route('/')
    .post(auth(roles.User),
        // validationMiddle(validators.createCart),
        asyncHandler(controllers.addProductToCart))
//================================================================    
    // .get(asyncHandler(controllers.getAllCarts))

// //====================================================
// router.route('/:CartId')
//     .put(auth(roles.User),
//         myMulter({}).single("image"),
//         validationMiddle(validators.updateCart),
//         asyncHandler(controllers.updateCart))


export default router