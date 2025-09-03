import React, {useState, useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from './../../components/Layout/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import moment from 'moment';

import { Select } from 'antd';


const AdminOrders = () => {

    const [status, setStatus] = useState(["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"])
    const [changeStatus, setChangeStatus] = useState("");

    const [orders, setOrders] = useState([])
    const [auth] = useAuth();



    const getOrders = async () => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-orders`)
            setOrders(data);
        
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        if(auth?.token) getOrders();
    }, [auth?.token])


    const handleChange = async (orderId, value) => {
        try {
            const { data } = await axios.put(
            `${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`,
            { status: value }
            );

            toast.success("Order status updated");
            getOrders();
        } catch (error) {
            console.log(error);
            toast.error("Failed to update status");
        }
        };





  return (
    <Layout>
        <>

        <div className='row'>
            <div className='col-md-3'>
                <AdminMenu/>
            </div>
            <div className='col-md-9'>
                <h1 className='text-center'>All Orders</h1>
                 {
                                        orders?.map((o, i) => {
                                            return (
                                                <div className='border shadow' key={o._id}>
                                                    <table className='table'>
                                                        <thead>
                                                            <tr>
                                                                <th scope='col'>#</th>
                                                                <th scope='col'>Status</th>
                                                                <th scope='col'>Buyer</th>
                                                                <th scope='col'>Date</th>
                                                                <th scope='col'>Payment</th>
                                                                <th scope='col'>Quantity</th>
                                                                <th scope='col'>Total Price</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody> 
                                                            <tr>
                                                                <td>{i + 1}</td>
                                                                <td>
                                                                   <Select
                                                                        defaultValue={o?.status}
                                                                        style={{ width: 200 }}
                                                                        onChange={(value) => handleChange(o._id, value)}
                                                                        >
                                                                        {status.map((s, i) => (
                                                                            <Select.Option key={i} value={s}>{s}</Select.Option>
                                                                        ))}
                                                                    </Select>
                                                                </td>
                                                                <td>{o?.buyer?.name}</td>
                                                                <td>{moment(o?.createAt).fromNow()}</td>
                                                                <td>{o?.payment.success ? "Success" : "Failed"}</td>
                                                                <td>{o?.products?.length}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <div className='container'>
                
                                                        <div className='col-md-8'>
                                                            {
                                                                o?.products?.map((p) => (
                                                                    <div className='row mb-2 p-3 card flex-row'>
                                                                        <div className='col-md-4'>
                                                                            <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} width="100px" height="100px" />
                                                                        </div>
                                                                        <div className='col-md-4'>
                                                                            <p>{p.name}</p>
                                                                            <p>{p.description.substring(0,30)}</p>
                                                                            <p>{p.price}</p>
                                                                        
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                
                                    }
            </div>

        </div>
        </>
    </Layout>
  )
}

export default AdminOrders