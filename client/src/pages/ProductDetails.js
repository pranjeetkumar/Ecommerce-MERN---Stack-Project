import React, {useState, useEffect} from 'react'
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {

    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        if(params?.slug) getProduct();
    }, [params?.slug]);


    const getProduct = async() => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product);
            getSimilarProducts(data?.product._id, data?.product.category?._id);
        } catch (error) {
            console.log(error);
        }
    }


    const getSimilarProducts = async(pid, cid) => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <Layout>
        <h1>Product details</h1>
        <div className='row container mt-2'>
            <div className='col-md-6'>
                <img 
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`} 
                    className='card-img-top' 
                    alt={product.name} 
                    height="300" 
                    width={"350px"}
                />
            </div>
            <div className='col-md-6'>
                <h1 className='text-center'>Product details</h1>
                <h6>Name : {product.name}</h6>
                <h6>Description : {product.description}</h6>
                <h6>Price : {product.price}</h6>
                <h6>Category : {product.category?.name}</h6>
                <h6>Shipping : {product.shipping}</h6>
                <h6>Quantity : {product.quantity}</h6>
                <button className='btn btn-secondary ms-1'>Add to Cart</button>
                <button className='btn btn-success ms-1'>Buy Now</button>
            </div>
        </div>
        <div className='row'>
            <h1>Similar Products</h1>
            <div className='d-flex flex-wrap'>
                {relatedProducts.length < 1 && (
                    <p className='text-center'>No Similar Products found</p>
                )}
                {relatedProducts?.map((p) => (
                    <div className='card m-2' style={{width: "18rem"}} key={p._id}>
                        <img 
                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} 
                            className='card-img-top' 
                            alt={p.name} 
                            height="200" 
                            width={"350px"}
                        />
                        <div className='card-body'>
                            <h5 className='card-title'>{p.name}</h5>
                            <p className='card-text'>{p.description.substring(0, 30)}...</p>
                            <p className='card-text'>${p.price}</p>
                            <button className='btn btn-secondary ms-1'>Add to Cart</button>
                            <button className='btn btn-success ms-1'>Buy Now</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </Layout>
  )
}

export default ProductDetails