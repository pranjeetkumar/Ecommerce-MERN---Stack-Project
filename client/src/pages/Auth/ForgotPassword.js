import React, {useState} from 'react'
import Layout from '../../components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import '../../styles/AuthStyles.css';



const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [answer, setAnswer] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, {
                email, newPassword, answer
            });
            if(res.data.success){
                toast.success(res.data.message);
                setEmail('');
                setNewPassword('');
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

    <Layout title={'Forgot Password - Ecommerce App'}>
             <div className="form-container">
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                 <div className="mb-3">
                    <input type="email" className="form-control" placeholder='Email' value={email} onChange={(e)=>{setEmail(e.target.value)}} required/>
                </div>
                 <div className="mb-3">
                    <input type="text" className="form-control" placeholder='Enter your friend Name' value={answer} onChange={(e)=>{setAnswer(e.target.value)}} required/>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" placeholder='Enter New Password' value={newPassword} onChange={(e)=>{setNewPassword(e.target.value)}} required/>
                </div>
            
                <button type="submit" className="btn btn-primary">Reset</button>
            </form>
        </div>
    </Layout>
  )
}

export default ForgotPassword