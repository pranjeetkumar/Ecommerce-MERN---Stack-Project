import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='footer'>
        <h5 className='text-center'>
            All Rights Reserved &copy; ECommerce App
        </h5>
        <p className='text-center mt-3'>
          <Link to="/about" className='text-light'>About Us</Link> |
          <Link to="/contact" className='text-light'> Contact Us</Link> |
          <Link to="/policy" className='text-light'> Privacy Policy</Link>

        </p>
    </div>
  )
}

export default Footer