import { Router } from "express";
import { myMulter } from "../../services/multer.js";
import * as controllers from "./brand.controller.js";
import * as validators from "./brand.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validationMiddle } from "../../middleWare/validation.middle.js";
import auth, { roles } from "../../middleWare/auth.js";

const router = Router()



router.route('/')
    .post(auth(roles.Admin),
        myMulter({}).single("image"),
        validationMiddle(validators.createBrand),
        asyncHandler(controllers.createBrand))
//================================================================    
    .get(asyncHandler(controllers.getAllBrands))

// //====================================================
router.route('/:brandId')
    .put(auth(roles.Admin),
        myMulter({}).single("image"),
        validationMiddle(validators.updateBrand),
        asyncHandler(controllers.updateBrand))


export default router