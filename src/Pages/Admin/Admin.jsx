import React from 'react';
import './Admin.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { Route, Routes } from 'react-router-dom';
import AddProduct from '../../Components/AddProduct/AddProduct';
import ListProduct from '../../Components/ListProduct/ListProduct';
import Orders from '../../Components/Orders/Orders';
import UserManagement from '../../Components/Users/UserManagement';

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar />
      <Routes>
        <Route path='/addProduct' element={<AddProduct/>}/>
        <Route path='/listProduct' element={<ListProduct/>}/>
        <Route path='/orders' element={<Orders />} />
        <Route path='/orders/:id' element={<Orders />} />
        <Route path='/users' element={<UserManagement/>} /> {/* Fixed route syntax */}
      </Routes>
    </div>
  );
}

export default Admin;