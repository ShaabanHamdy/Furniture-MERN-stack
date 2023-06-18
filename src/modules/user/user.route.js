import { Router } from "express";
import * as controllers from "./user.controller.js";
import * as validators from "./user.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validationMiddle } from "../../middleWare/validation.middle.js";

const router = Router()



router.post('/sendCode',validationMiddle(validators.sendCode),asyncHandler(controllers.sendCode))
    //================================================================    
    router.post('/restPassword',validationMiddle(validators.restPassword), asyncHandler(controllers.restPassword))
    router.get("/logout",asyncHandler(controllers.logout))

// //====================================================
// router.route('/:token')
//     .get(validationMiddle(validators.token), asyncHandler(controllers.confirmEmail))


export default router