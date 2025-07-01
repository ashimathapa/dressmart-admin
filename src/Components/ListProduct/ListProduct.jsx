import React, { useState, useEffect } from 'react';
import './ListProduct.css';
import { FaTrash } from 'react-icons/fa';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/allproducts');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setAllProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    try {
      const response = await fetch('http://localhost:5000/removeproduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to remove product');
      await fetchInfo();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="list-product">
      <h1 className="list-product-title">All Products</h1>

      {loading ? (
        <div className="loading-message">Loading products...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="list-product-header">
            <div className="header-item">Image</div>
            <div className="header-item">Title</div>
            <div className="header-item">Price</div>
            <div className="header-item">Offer</div>
            <div className="header-item">Category</div>
            <div className="header-item">Colors/Sizes</div>
            <div className="header-item">Actions</div>
          </div>

          <div className="list-product-items">
            {allProducts.length > 0 ? (
              allProducts.map((product) => (
                <div key={product.id} className="product-item-container">
                  <div className="product-item">
                    <div className="item-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="item-title">{product.name}</div>
                    <div className="item-price">Rs {product.old_price}</div>
                    <div className="item-new-price">Rs {product.new_price}</div>
                    <div className="item-category">
                      {product.category} / {product.subcategory}
                    </div>
                    <div className="item-colors-sizes">
                      <div className="inline-colors">
                        {product.colors?.length > 0 ? (
                          product.colors.map((color, i) => (
                            <span
                              key={i}
                              className="color-chip-small"
                              style={{ backgroundColor: color.toLowerCase() }}
                              title={color}
                            />
                          ))
                        ) : (
                          <span className="no-info">—</span>
                        )}
                      </div>
                      <div className="inline-sizes">
                        {product.sizes?.length > 0 ? (
                          product.sizes.map((size, i) => (
                            <span key={i} className="size-chip-small">
                              {size}
                            </span>
                          ))
                        ) : (
                          <span className="no-info">—</span>
                        )}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="remove-btn"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">No products found</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ListProduct;
