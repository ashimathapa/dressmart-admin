import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo.jpeg';

const Navbar = ({ onLogout }) => {
  return (
    <div className='navbar'>
      <div className='nav-left'>
        <img src={logo} alt="Logo" className="nav-logo" />
        
        <div className="nav-text-group">
          <p className='shop-title'>Dressmart </p>
          <p className='admin-panel'>Admin Panel</p>
        </div>
      </div>

      <div className='nav-right'>
         <button onClick={onLogout}>LOGOUT</button>
      </div>
    </div>
  );
}

export default Navbar;
