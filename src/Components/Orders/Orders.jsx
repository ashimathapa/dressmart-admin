import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';

// Set base URL for API calls
axios.defaults.baseURL = 'http://localhost:5000';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token for all requests
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const formatCurrency = (amount) => {
    return `Rs ${amount?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0.00'}`;
  };

  const getCustomerName = (order) => {
    if (order.shippingInfo) {
      return `${order.shippingInfo.firstName || ''} ${order.shippingInfo.lastName || ''}`.trim();
    }
    return order.user?.name || 'Guest';
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/admin/orders');
        setOrders(response.data.orders);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      
      setOrders(orders.map(order => 
        order._id === response.data.order._id ? response.data.order : order
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading-message">Loading orders...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (orders.length === 0) return <div className="empty-message">No orders found</div>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">Order Management</h1>
      
      <div className="orders-table-container">
        <table className="orders-table">
          <thead className="orders-table-header">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="orders-table-row">
                <td>#{order._id.substring(0, 8)}</td>
                <td>{getCustomerName(order)}</td>
                <td>{formatDate(order.orderDate)}</td>
                <td>{formatCurrency(order.totalAmount)}</td>
                <td>
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="status-selector"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;