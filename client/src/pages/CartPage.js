
import React, { useState, useEffect, useRef} from 'react'
import Layout from '../components/Layout/Layout';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import * as braintree from 'braintree-web-drop-in';
import axios from 'axios';
import toast from 'react-hot-toast';


const CartPage = () => {

    const [cart, setCart] = useCart();
    const navigate = useNavigate();
    const [auth] = useAuth();
    const [clientToken, setClientToken] = useState('');
    const [instance, setInstance] = useState(null);
    const [loading, setLoading] = useState(false);
    const dropInContainerRef = useRef(null);
    const isMountedRef = useRef(true);


    const totalPrice = () => {
      try {
        let total = cart?.reduce((acc, item) => acc + item.price, 0) || 0;
        return total.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
        });
      } catch (error) {
        console.log(error);
      }
    };


    const removeCartItem = (pid) => {
        try{
            let myCart = [...cart]
            let index = myCart.findIndex((item) => (item.id === pid))
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart))
        } catch(error){
            console.log(error);
        }
    }


    const getToken = async () => {
        try {

            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`);
            setClientToken(data?.clientToken);
            
        } catch (error) {
            console.log(error)
            
        }
    }

    useEffect(() => {
        getToken();

    }, [auth?.token])




useEffect(() => {
  if (clientToken && dropInContainerRef.current && !instance) {
    braintree.create({
        authorization: clientToken,
        container: dropInContainerRef.current,
      })
      .then((createdInstance) => {
        if (isMountedRef.current) {
          setInstance(createdInstance);
        }
      })
      .catch((error) => {
        console.error("Braintree Drop-in initialization error:", error);
        toast.error("Failed to initialize payment. Please try again.");
      });
  }

  // Cleanup
  return () => {
    if (instance) {
      instance
        .teardown()
        .then(() => setInstance(null))
        .catch((error) =>
          console.error("Braintree teardown error:", error)
        );
    }
  };
}, [clientToken]);





    const handlePayment = async () => {

        try {
            setLoading(true);
            const {nonce} = await instance.requestPaymentMethod();  
            await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment`, {
                nonce,
                cart
            });
            setLoading(false);
            localStorage.removeItem('cart');
            setCart([]);
            toast.success("Payment Completed Successfully");
            navigate('/dashboard/user/orders')
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }


  return (
    <Layout>
        <div className='container'>
            <div className='row'>
                <div className='col-md-12'>
                    <h1 className='text-center bg-light p-2 mb-1'>
                        {`hello ${auth?.token && auth?.user.name}`}
                    </h1>
                    <h4 className='text-center'>
                        {cart?.length ? `you have ${cart.length} items in your cart ${auth?.token ? "" : "Please login to checkout"}` : " Your cart is empty"}
                    </h4>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-8'>
                    {
                        cart?.map((p) => (
                            <div className='row mb-2 p-3 card flex-row'>
                                <div className='col-md-4'>
                                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} width="100px" height="100px" />
                                </div>
                                <div className='col-md-4'>
                                    <p>{p.name}</p>
                                    <p>{p.description.substring(0,30)}</p>
                                    <p>{p.price}</p>
                                    <button className='btn btn-danger' onClick={() => {
                                        removeCartItem(p._id)
                                    }}>Remove</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='col-md-4 text-center'>
                    <h4>Cart Summary</h4>
                    <p>Total | Checkout | Payment</p>
                    <hr/>
                    <h4>Total : {totalPrice()}</h4>
                    {
                        auth?.user?.address ? (
                            <>
                            <div className='mb-3'>
                                <h4>Current Address</h4>
                                <h5>{auth?.user?.address}</h5>
                                <button className='btn btn-outline-warning' onClick={() => {
                                    navigate('/dashboard/user/profile')
                                }}>Update Address</button>
                            </div>
                            </>
                        ) : (
                            <>
                            <div className='mb-3'>
                                {
                                    auth?.token ? (
                                        <button className='btn btn-outline-warning' onClick={() => navigate("/dashboard/user/profile")}>Update Address</button>
                                    ) : (
                                        <button className='btn btn-outline-warning' onClick={() => navigate("/login", {state: "/cart"})}>Please Login to checkout</button>
                                     )
                                }
                            </div>
                            </>
                        )
                    }
                    <div className='mt-2 mb-3'>

                        {
                            !clientToken || !auth?.user?.address || !cart?.length ? ("") : (

                                <>
                                  <div 
                                    ref={dropInContainerRef} 
                                    style={{ minHeight: '200px' }} 
                                  />
                                  <button
                                    className="btn btn-primary"
                                    onClick={handlePayment}
                                    disabled={!instance || !auth?.user?.address || loading}
                                  >
                                    {loading ? 'Processing...' : 'Make Payment'}
                                  </button>
                                </>
                            )
                        }

                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}


export default CartPage






