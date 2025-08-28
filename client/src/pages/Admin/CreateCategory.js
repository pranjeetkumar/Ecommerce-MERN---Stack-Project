import React, {useEffect, useState} from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from 'react-hot-toast';
import axios from 'axios';
import CategoryForm from '../../components/form/CategoryForm.js';
import { Modal } from 'antd';



const CreateCategory = () => {

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [Visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/category/create-category`, { name });
            if(data?.success)
            {
                toast.success(`${name} is created.`);
                getAllCategories();
            }
            else{
                toast.error(data.message);
            }
            
        } catch (error) {

            console.log(error);
            toast.error('something went wrong in input form');
            
        }
    };


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
        getAllCategories();
    }, []);


    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`, { name: updatedName });
            if(data?.success)
            {
                toast.success(`${updatedName} is updated.`);
                setSelected(null);
                setUpdatedName("");
                setVisible(false);
                getAllCategories();
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('something went wrong in update form');
        }
    }



    const handleDelete = async (id) => {
        try {

            const confirmDelete = window.confirm("Are you sure you want to delete this category?");
            if (!confirmDelete) return;
            
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`);
            if(data?.success)
            {
                toast.success(`Category is deleted.`);
                getAllCategories();
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('something went wrong in update form');
        }
    }


  return (
     <Layout title={"Dashboard - Create Category"}>
        <div className='container-fluid m-3 p-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9'>
                    <h1>Manage Category</h1>
                    <div className='p-3 w-50'>
                        <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName}/>
                    </div>
                    <div className='w-75'>
                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories?.map((category) => (
                                    <tr key={category._id}>
                                        <td>{category.name}</td>
                                        <td>
                                            <button className='btn btn-primary ms-2' 
                                            onClick = {() => {
                                                setVisible(true);
                                                setUpdatedName(category.name);
                                                setSelected(category);
                                                }}>Edit</button>
                                            <button className='btn btn-danger ms-2' onClick={() => {handleDelete(category._id)}}>Delete</button>
                                        </td>                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Modal onCancel = {() => setVisible(false)} footer = {null} open={Visible}>
                        <CategoryForm value={updatedName || ""} setValue={setUpdatedName} handleSubmit={handleUpdate}/>
                    </Modal>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default CreateCategory