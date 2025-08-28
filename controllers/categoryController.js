import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ message: "Name is required" });
        }

        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(400).send({ message: "Category already exists" });
        }

        const category = await new categoryModel({ name, slug: slugify(name) }).save();
        
        res.status(201).send({ success: true, message: "Category created successfully", category });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            sucess: false,
            message: "Error in creating category",
            error: error.message
        })
    }
}





export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        if (!name || !id) {
            return res.status(400).send({ message: "Name and ID are required" });
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });

        if (!updatedCategory) {
            return res.status(404).send({ message: "Category not found" });
        }

        res.status(200).send({ success: true, message: "Category updated successfully", updatedCategory });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            sucess: false,
            message: "Error in updating category",
            error: error.message
        })
    }
}



export const categoryController = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "All categories fetched successfully",
            categories
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching categories",
            error: error.message
        });
    }
}




export const singleCategoryController = async (req, res) => {
    try {

        const category = await categoryModel.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).send({ message: "Category not found" });
        }
        res.status(200).send({
            success: true,
            message: "Single category fetched successfully",
            category
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching single category",
            error: error.message
        });
    }

}




export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({ success: true, message: "Category deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in deleting category",
            error: error.message
        });
    }
}