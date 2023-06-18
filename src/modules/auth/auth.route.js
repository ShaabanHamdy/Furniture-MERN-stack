import { Router } from "express";
import * as controllers from "./auth.controller.js";
import * as validators from "./auth.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validationMiddle } from "../../middleWare/validation.middle.js";

const router = Router()



//=================================================signup===============    
router.post("/signup", validationMiddle(validators.signup), asyncHandler(controllers.signup))
//=================================================login===============    
router.post("/login", validationMiddle(validators.login), asyncHandler(controllers.login))
//=================================================logout===============    
router.get("/logout", asyncHandler(controllers.logout))

// //====================================================
router.get('/:token',validationMiddle(validators.token), asyncHandler(controllers.confirmEmail))


export default router