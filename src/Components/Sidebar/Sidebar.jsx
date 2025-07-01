import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaList, FaStore ,FaUsers} from 'react-icons/fa';

const Sidebar = () => {
  const handleShopClick = (e) => {
    e.preventDefault();
    window.location.href = 'http://localhost:3000/';
  };

  return (
    <div className='sidebar'>
      {/* Shop Link - styled like others but with external redirect */}
      <a 
        href="http://localhost:3000/" 
        onClick={handleShopClick}
        style={{ textDecoration: 'none' }}
        className="sidebar-link"
      >
        <div className="sidebar-item">
          <FaStore size={24} color="#333" />
          <p>Visit Shop</p>
        </div>
      </a>

       <Link to={'/users'} style={{ textDecoration: 'none' }} className="sidebar-link">
  <div className="sidebar-item">
    <FaUsers size={24} color="#333" />
    <p>Users</p>
  </div>
</Link>

      {/* Original Admin Links */}
      <Link to={'/addProduct'} style={{ textDecoration: 'none' }} className="sidebar-link">
        <div className="sidebar-item">
          <FaShoppingCart size={24} color="#333" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to={'/listProduct'} style={{ textDecoration: 'none' }} className="sidebar-link">
        <div className="sidebar-item">
          <FaList size={24} color="#333" />
          <p>Product List</p>
        </div>
      </Link>
      <Link to={'/orders'} style={{ textDecoration: 'none' }} className="sidebar-link">
        <div className="sidebar-item">
          <FaList size={24} color="#333" />
          <p>Orders</p>
        </div>
      </Link>
     
    </div>
  );
};

export default Sidebar;