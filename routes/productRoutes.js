import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { brainTreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, ProductCountController, productFiltersController, productListController, productPhotoController, relatedProductController, serarchProductController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';


const router = express.Router();

router.post("/create-product", requireSignIn, isAdmin, formidable(), createProductController)



router.get("/get-product", getProductController)


router.get("/get-product/:slug", getSingleProductController);

router.get("/product-photo/:pid", productPhotoController);

router.delete("/delete-product/:pid", requireSignIn, isAdmin, deleteProductController);

router.put("/update-product/:pid", requireSignIn, isAdmin, formidable(), updateProductController);

router.post("/product-filters", productFiltersController);


router.get("/product-count", ProductCountController);

router.get("/product-list/:page", productListController);


router.get("/search/:keyword", serarchProductController);


router.get("/related-product/:pid/:cid", relatedProductController);

router.get("/product-category/:slug", productCategoryController);


router.get("/braintree/token", braintreeTokenController);

router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;


