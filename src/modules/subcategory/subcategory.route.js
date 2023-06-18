import { Router } from "express";
import { myMulter } from "../../services/multer.js";
import * as controllers from "./subcategory.controller.js";
import * as validators from "./subcategory.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validationMiddle } from "../../middleWare/validation.middle.js";
import auth, { roles } from "../../middleWare/auth.js";

const router = Router({mergeParams:true})

router.route('/')
    .post(auth(roles.Admin), myMulter({}).single("image"),
    validationMiddle(validators.createSubcategory),
    asyncHandler(controllers.createSubCategory))
//================================================================    
    .get(auth(Object.values(roles)),asyncHandler(controllers.getCategories))

//====================================================
router.route('/:subcategoryId')
    .put(auth(roles.Admin),
        myMulter({}).single("image"),
        validationMiddle(validators.updateSubcategory),
        asyncHandler(controllers.updateSubCategory))


export default router