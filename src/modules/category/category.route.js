import { Router } from "express";
import { myMulter } from "../../services/multer.js";
import * as controllers from "./category.controller.js";
import * as validators from "./category.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validationMiddle } from "../../middleWare/validation.middle.js";
import SubcategoryRouter from "../subcategory/subcategory.route.js";
import auth, {  roles } from "../../middleWare/auth.js";

const router = Router()

router.use("/:categoryId/Subcategory", SubcategoryRouter)



router.route('/')
    .post(auth(roles.Admin),
        myMulter({}).single("image"),
        validationMiddle(validators.createCategory),
        asyncHandler(controllers.createCategory))
    //================================================================    
    router.get("/getCategories" , asyncHandler(controllers.getCategories))

//====================================================
router.route('/:categoryId')
    .put(auth(roles.Admin),
        myMulter({}).single("image"),
        validationMiddle(validators.updateCategory),
        asyncHandler(controllers.updateCategory))


export default router