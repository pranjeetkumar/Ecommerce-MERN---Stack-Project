import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";

export const createProductController = async (req, res) => {
    try {
       const { name, slug, description, price, category, quantity, shipping } = req.fields;
       const { photo } = req.files;
         switch (true) {
            case !name:
                return res.status(400).send({ error: "Name is required" });
            case !description:
                return res.status(400).send({ error: "Description is required" });
            case !price:
                return res.status(400).send({ error: "Price is required" });
            case !category:
                return res.status(400).send({ error: "Category is required" });
            case !quantity:
                return res.status(400).send({ error: "Quantity is required" });
            case photo && photo.size > 1000000:
                return res.status(400).send({ error: "Photo is required and should be less than 1MB" });
         }

         console.log(req.fields);
         console.log(req.files);

         const products = new productModel({...req.fields, slug: slugify(name)})
         if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
            }
            await products.save();
            res.status(201).send({
                success: true,
                message: "Product created successfully",
                products
            });
            

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating product",
            error: error.message
        });
    }

}







export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate("category").select("-photo").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            countTotal: products.length,
            message: "All products fetched successfully",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching products",
            error: error.message
        });
    }

}





export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category");
        res.status(200).send({
            success: true,
            message: "Single product fetched successfully",
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching single product",
            error: error.message
        });
    }
}



export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-Type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching product photo",
            error: error.message
        });
    }
}




export const deleteProductController = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in deleting product",
            error: error.message
        });
    }
}



export const updateProductController = async (req, res) => {
     try {
       const { name, slug, description, price, category, quantity, shipping } = req.fields;
       const { photo } = req.files;
         switch (true) {
            case !name:
                return res.status(400).send({ error: "Name is required" });
            case !description:
                return res.status(400).send({ error: "Description is required" });
            case !price:
                return res.status(400).send({ error: "Price is required" });
            case !category:
                return res.status(400).send({ error: "Category is required" });
            case !quantity:
                return res.status(400).send({ error: "Quantity is required" });
            case photo && photo.size > 1000000:
                return res.status(400).send({ error: "Photo is required and should be less than 1MB" });
         }

         const products = await productModel.findByIdAndUpdate(req.params.pid, {...req.fields, slug: slugify(name)}, {new: true});
         if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
            }
            await products.save();
            res.status(201).send({
                success: true,
                message: "Product updated successfully",
                products
            });
            

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in updating product",
            error: error.message
        });
    }
}



export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in filtering products",
            error: error.message
        });
    }
}




export const ProductCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in counting products",
            error: error.message
        });
    }
}




export const productListController = async (req, res) => {
    try {
        const perPage = 2;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in listing products",
            error: error.message
        });
    }
}  




export const serarchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo");
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in searching products",
            error: error.message
        });
    }
}



export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(3).populate("category");
        res.status(200).send({
            success: true,
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching related products",
            error: error.message
        });
    }
}





export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({slug: req.params.slug})
        const products = await productModel.find({category}).populate('category')
        res.status(200).send({
            success: true,
            products,
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching products by category",
            error: error.message
        });
    }
}