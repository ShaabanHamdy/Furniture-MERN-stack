import { Router } from "express";
import { myMulter } from "../../services/multer.js";
import * as controllers from "./product.controller.js";
import * as validators from "./product.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validationMiddle } from "../../middleWare/validation.middle.js";
import reviewRouter from "../review/review.route.js";
import auth, { roles } from "../../middleWare/auth.js";

const router = Router()





router.use("/:productId/review" , reviewRouter)
//================================================================  add product  

router.post("/addProduct",auth(roles.Admin),myMulter({}).fields([{ name: "mainImage", maxCount: 1 },{ name: "subImages", maxCount: 5 }]),
        validationMiddle(validators.createProduct),
        asyncHandler(controllers.createProduct))
//================================================================  getAllProducts  

router.get("/getAllProducts",asyncHandler(controllers.getAllProducts))

// //====================================================
router.route('/:productId')
    .put(auth(roles.Admin),
        myMulter({}).fields([
            { name: "mainImage", maxCount: 1 },
            { name: "subImages", maxCount: 5 }
        ]),
        validationMiddle(validators.updateProduct),
        asyncHandler(controllers.updateProduct))
//========================================== wishlist
router.patch('/:productId/wishlist',auth(roles.User),
        validationMiddle(validators.wishlist),
        asyncHandler(controllers.addToWishList))

//========================================== Remove wishlist
router.patch('/:productId/remove',auth(roles.User),
        validationMiddle(validators.wishlist),
        asyncHandler(controllers.removeFromWishList))



export default router