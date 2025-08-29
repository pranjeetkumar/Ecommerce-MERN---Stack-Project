import React, { useState, useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import toast from 'react-hot-toast'
import axios from 'axios'

const Profile = () => {

    const [auth, setAuth] = useAuth();

    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');



    useEffect(()=>{
        const {name, email, phone, address} = auth.user;
        setName(name);
        setEmail(email);
        setPhone(phone);
        setAddress(address);
    }, [auth?.user]);




    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            const res = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/profile`, {
                name, email, phone, address, password
            });
            if(res.data.success){
                toast.success(res.data.message);
                setAuth({...auth, user: res.data.updatedUser});
                let ls = localStorage.getItem('auth');
                ls = JSON.parse(ls);
                ls.user = res.data.updatedUser;
                localStorage.setItem('auth', JSON.stringify(ls));
            } else {
                toast.error(res.data.message);
            }
            
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error)
        }
    }


  return (
    <Layout title={"Your Profile"}>
        <div className='container-fluid p-3 mt-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <UserMenu/>
                </div>
                <div className='col-md-9'>
                    <div className="form-container">
                        <form onSubmit={handleSubmit}>
                            <h4 className='title'>User Profile</h4>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder='Name' value={name} onChange={(e)=>{setName(e.target.value)}}/>
                            </div>
                            <div className="mb-3">
                                <input type="email" className="form-control" placeholder='Email' value={email} onChange={(e)=>{setEmail(e.target.value)}} disabled/>
                            </div>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder='Phone' value={phone} onChange={(e)=>{setPhone(e.target.value)}}/>
                            </div>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder='Address'value={address} onChange={(e)=>{setAddress(e.target.value)}}/>
                            </div>
                            <div className="mb-3">
                                <input type="password" className="form-control" placeholder='Password' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                            </div>
                            <button type="submit" className="btn btn-primary">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Profile