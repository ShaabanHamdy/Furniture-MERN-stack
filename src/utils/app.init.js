import connectionDB from "../../DB/connection.js"
import * as allRouter from "../modules/app.router.js"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import path from "path"
import chalk from "chalk"
import { globalErrorHandling } from "./errorHandling.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../../config/.env') })


const AppInit = (app, express) => {
   const port = process.env.PORT || 5000

   app.use(express.json({}))
   connectionDB()
   //=====================


   //============================================================================= all  app routes ==============    
   app.use(`/category`, allRouter.categoryRouter)
   app.use(`/Subcategory`, allRouter.SubcategoryRouter)
   app.use(`/coupon`, allRouter.couponRouter)
   app.use(`/brand`, allRouter.brandRouter)
   app.use(`/auth`, allRouter.authRouter)
   app.use(`/user`, allRouter.userRouter)
   app.use(`/product`, allRouter.productRouter)
   app.use(`/cart`, allRouter.cartRouter)
   app.use(`/order`, allRouter.orderRouter)
   app.use(`/review`, allRouter.reviewRouter)
   //==============================================================================================================
   app.get('/', (req, res) => res.send('welcome shaaban !'))
   app.use('*', (req, res) => res.send('404 PAGE NOT FOUND'))
   app.listen(port, () => console.log(chalk.bgGray.yellow(`Example app listening on port ${port}!`)))
   app.use(globalErrorHandling)
}

export default AppInit