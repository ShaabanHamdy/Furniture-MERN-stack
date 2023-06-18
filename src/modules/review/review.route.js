import { Router } from "express";
import * as controllers from "./review.controller.js";
import * as validators from "./review.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validationMiddle } from "../../middleWare/validation.middle.js";
import auth, { roles } from "../../middleWare/auth.js";

const router = Router({mergeParams:true})

router.post("/" ,auth(roles.User),validationMiddle(validators.createReview) ,asyncHandler(controllers.createReview))
router.put("/:reviewId" ,auth(roles.User),validationMiddle(validators.updateReview) , asyncHandler(controllers.updateReview))
router.get("/getReviews" , asyncHandler(controllers.getReviews))


export default router