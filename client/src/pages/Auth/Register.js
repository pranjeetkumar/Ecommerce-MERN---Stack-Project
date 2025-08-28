import React, {useState} from 'react'
import Layout from '../../components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import '../../styles/AuthStyles.css';

const Register = () => {


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [answer, setAnswer] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, {
                name, email, phone, address, password, answer
            });
            if(res.data.success){
                toast.success(res.data.message);
                setName('');
                setEmail('');
                setPhone('');
                setAddress('');
                setPassword('');
                setAnswer('');
                navigate('/login');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error)
        }
    }
    


  return (

    <Layout title={"Register - Ecommerce App"}>

        <div className="form-container">
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input type="text" className="form-control" placeholder='Name' value={name} onChange={(e)=>{setName(e.target.value)}} required/>
                </div>
                 <div className="mb-3">
                    <input type="email" className="form-control" placeholder='Email' value={email} onChange={(e)=>{setEmail(e.target.value)}} required/>
                </div>
                 <div className="mb-3">
                    <input type="text" className="form-control" placeholder='Phone' value={phone} onChange={(e)=>{setPhone(e.target.value)}} required/>
                </div>
                 <div className="mb-3">
                    <input type="text" className="form-control" placeholder='Address'value={address} onChange={(e)=>{setAddress(e.target.value)}} required/>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" placeholder='Password' value={password} onChange={(e)=>{setPassword(e.target.value)}} required/>
                </div>
                <div className="mb-3">
                    <input type="text" className="form-control" placeholder='Your Best Frind Name' value={answer} onChange={(e)=>{setAnswer(e.target.value)}} required/>
                </div>
                
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>

    </Layout>
  )

};

export default Register