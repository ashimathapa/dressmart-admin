import React, { useState, useEffect } from 'react';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format currency with "Rs" prefix
  const formatCurrency = (amount) => {
    return `Rs ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  // Get customer name from shipping info
  const getCustomerName = (order) => {
    if (order.shippingInfo) {
      return `${order.shippingInfo.firstName || ''} ${order.shippingInfo.lastName || ''}`.trim();
    }
    return order.user?.name || 'Guest';
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update order status');
      
      const updatedOrder = await response.json();
      
      setOrders(orders.map(order => 
        order._id === updatedOrder.order._id ? updatedOrder.order : order
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading-message">Loading orders...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

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