import React from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu';
import { useAuth } from '../../context/auth';

const AdminDashboard = () => {

  const [auth] = useAuth();


  return (
    <Layout>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <div className='card w-75 p-3'>
              <h3>
                {auth?.user?.name ? `Welcome ${auth.user.name}` : "Admin Dashboard"}
              </h3>
              <h3>
                {auth?.user?.email ? `Email: ${auth.user.email}` : "No email available"}
              </h3>
              <h3>
                {auth?.user?.phone ? `Phone: ${auth.user.phone}` : "No phone number available"}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard