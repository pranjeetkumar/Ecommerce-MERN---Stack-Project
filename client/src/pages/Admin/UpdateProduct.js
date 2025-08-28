

import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd';
const { Option } = Select;


const UpdateProduct = () => {



    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [photo, setPhoto] = useState("");
    const paramas = useParams();
    const [Id, setId] = useState('');



    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${paramas.slug}`);
            if (data?.success) {
                setName(data.product.name);
                setDescription(data.product.description);
                setPrice(data.product.price);
                setQuantity(data.product.quantity);
                setShipping(data.product.shipping);
                setCategory(data.product.category._id);
                setId(data.product._id);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while fetching product details");
        }
    }





    const getAllCategories = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
            if (data?.success) {
                setCategories(data?.categories);
            } else {
                console.error("Failed to fetch categories");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        getSingleProduct();
    }, [])


    useEffect(() => {
        getAllCategories();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("quantity", quantity);
            formData.append("shipping", shipping);
            formData.append("category", category);
            photo && formData.append("photo", photo);

            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/product/update-product/${Id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });


            if (data?.success) {
                toast.success(`${name} is Updated Successfully.`);
                setName("");
                setDescription("");
                setPrice("");
                setQuantity("");
                setShipping("");
                setCategory("");
                setPhoto("");
                navigate('/dashboard/admin/products')
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong in product updation');
        }
    }


    const handleDelete = async () => {
        try {
            let answer = window.prompt("Are you sure want to delete this product? Type YES to confirm.");
            if (!answer || answer.toLowerCase() !== "yes") {
                return;
            }
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/product/delete-product/${Id}`);
            if (data?.success) {
                toast.success("Product Deleted Successfully");
                navigate('/dashboard/admin/products');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in product deletion");
        
        }
    }





  return (
    <Layout title={"Dashboard - Update Product"}>
                <div className='container-fluid m-3 p-3'>
                    <div className='row'>
                        <div className='col-md-3'>
                            <AdminMenu />
                        </div>
                        <div className='col-md-9'>
                            <h1>Update Product</h1>
                            <div className='m-1 w-75'>
                                <Select variant="borderless" placeholder="Select a category" size="large" showSearch className='form-select mb-3' onChange={(value) => setCategory(value)} value={category}>
                                    {categories?.map((c) => (
                                        <Option key={c._id} value={c._id}>{c.name}</Option>
                                    ))}
                                </Select>
                                <div className='mb-3'>
                                    <label className='btn btn-outline-secondary col-md-12'>
                                        { photo? photo.name : "upload photo" }
                                        <input type="file" name='photo' accept='image/*' hidden onChange={(e) => setPhoto(e.target.files[0])} />
                                    </label>
                                </div>
                                <div className='mb-3'>
                                    {photo ? (
                                        <div className='text-center'>
                                            <img src={URL.createObjectURL(photo)} alt="product-photo" height="200px" className='img img-responsive' />
                                        </div>
                                    ) :(
                                        <div className='text-center'>
                                            <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${Id}`} alt="product-photo" height="200px" className='img img-responsive' />
                                        </div>

                                    )}
                                </div>
                                <div className='mb-3'>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='form-control' placeholder='Write a name' />    
                                </div>
                                <div className='mb-3'>
                                    <input type='textarea' value={description} onChange={(e) => setDescription(e.target.value)} className='form-control' placeholder='Write a description' />
                                </div>
                                <div className='mb-3'>
                                       <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className='form-control' placeholder='Write a price' />    
                                </div>
                                <div className='mb-3'>
                                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className='form-control' placeholder='Write a quantity' />
                                </div>
                                <div className='mb-3'>
                                    <Select variant="borderless" placeholder="Select shipping" size="large" className='form-select mb-3' onChange={(value) => setShipping(value)} value={shipping? "Yes" : "No"}>
                                        <Option value="0">No</Option>
                                        <Option value="1">Yes</Option>
                                    </Select> 
                                </div>
                                <div className='d-flex gap-3'>
                                    <div className='mb-3'>
                                        <button className='btn btn-primary' onClick={handleUpdate}>Update Product</button>
                                    </div>
                                    <div className='mb-3'>
                                        <button className='btn btn-danger' onClick={handleDelete}>Delete Product</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
  )
}

export default UpdateProduct