import React, { useState, useEffect } from 'react';
import './AddProduct.css';
import { BiCloudUpload } from 'react-icons/bi';

const categories = {
  men: {
    Topwear: ['T-Shirts', 'Shirts', 'Jackets', 'Sweaters'],
    Bottomwear: ['Jeans', 'Trousers', 'Shorts', 'Track Pants'],
    Footwear: ['Casual Shoes', 'Sports Shoes', 'Sandals', 'Socks'],
    Accessories: ['Belts', 'Caps & Hats', 'Wallets'],
  },
  women: {
    'Indian Wear': ['Kurtas', 'Sarees', 'Lehenga Choli', 'Dupattas'],
    Topwear: ['Tops', 'Blouses', 'Jumpsuits', 'Skirts'],
    Dresses:['Dresses','Formal Dresses'],
    Footwear: ['Heels', 'Flats', 'Sneakers', 'Boots'],
    Accessories: ['Handbags', 'Sunglasses', 'Jewellery'],
  },
  kids: {
    'Boys Clothing': ['T-Shirts', 'Shirts', 'Shorts', 'Jeans', 'Jackets'],
    'Girls Clothing': ['Dresses', 'Tops', 'Lehenga', 'Jumpsuits', 'Skirts'],
    Footwear: ['Sandals', 'Shoes', 'Socks'],
    Toys: ['Soft Toys', 'Action Figures'],
    Infants: ['Bodysuits', 'Rompers', 'Infant Care'],
    Accessories: ['Bags', 'Sunglasses'],
  },
};

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const availableColors = [
  'Red', 'Blue', 'Green', 'Black', 'White',
  'Yellow', 'Pink', 'Purple', 'Gray', 'Orange',
  'Brown', 'Beige', 'Maroon', 'Navy', 'Teal'
];

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: '',
    gender: '',
    category: '',
    subcategory: '',
    new_price: '',
    old_price: '',
    stock: '',
    colors: [],
    sizes: [],
  });

  // Reset category and subcategory when gender changes
  useEffect(() => {
    setProductDetails(prev => ({
      ...prev,
      category: '',
      subcategory: '',
    }));
  }, [productDetails.gender]);

  // Reset subcategory when category changes
  useEffect(() => {
    setProductDetails(prev => ({
      ...prev,
      subcategory: '',
    }));
  }, [productDetails.category]);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setProductDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color) => {
    setProductDetails(prev => {
      const colors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors };
    });
  };

  const handleSizeChange = (size) => {
    setProductDetails(prev => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const Add_Product = async () => {
    if (!productDetails.gender) {
      alert('Please select Gender');
      return;
    }
    if (!productDetails.category) {
      alert('Please select Category');
      return;
    }
    if (!productDetails.subcategory) {
      alert('Please select Subcategory');
      return;
    }
    if (!image) {
      alert('Please upload an image');
      return;
    }

    try {
      let formData = new FormData();
      formData.append('product', image);

      const uploadResponse = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.success) {
       const updatedProductDetails = {
  name: productDetails.name,
  image: uploadData.image_url,
  gender: productDetails.gender,
  category: productDetails.category,
  subcategory: productDetails.subcategory,
  new_price: Number(productDetails.new_price),
  old_price: productDetails.old_price ? Number(productDetails.old_price) : null,
  stock: productDetails.stock ? Number(productDetails.stock) : 0,
  colors: Array.isArray(productDetails.colors) && productDetails.colors.length > 0
    ? productDetails.colors
    : ['Black'],
  sizes: Array.isArray(productDetails.sizes) && productDetails.sizes.length > 0
    ? productDetails.sizes
    : ['M'],
};


        const addProductResponse = await fetch('http://localhost:5000/addproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProductDetails),
        });

        const addProductData = await addProductResponse.json();
        if (addProductData.success) {
          alert("✅ Product Added");
          setProductDetails({
            name: '',
            gender: '',
            category: '',
            subcategory: '',
            new_price: '',
            old_price: '',
            stock: '',
            colors: [],
            sizes: [],
          });
          setImage(null);
        } else {
          alert("❌ Failed to add product");
        }
      } else {
        alert("❌ Image upload failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ An error occurred while adding the product.");
    }
  };

  return (
    <div className="add-product">
      {/* Product Title */}
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          type="text"
          name="name"
          value={productDetails.name}
          onChange={changeHandler}
          placeholder="Type here"
        />
      </div>

      {/* Price */}
      <div className="addproductc-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            type="number"
            name="old_price"
            value={productDetails.old_price}
            onChange={changeHandler}
            placeholder="Original price"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            type="number"
            name="new_price"
            value={productDetails.new_price}
            onChange={changeHandler}
            placeholder="Offer price"
          />
        </div>
      </div>

      {/* Gender */}
      <div className="addproduct-itemfield">
        <p>Gender</p>
        <select
          name="gender"
          value={productDetails.gender}
          onChange={changeHandler}
          className="addproduct-selector"
        >
          <option value="">-- Select Gender --</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>
      </div>

      {/* Category */}
      <div className="addproduct-itemfield">
        <p>Category</p>
        <select
          name="category"
          value={productDetails.category}
          onChange={changeHandler}
          className="addproduct-selector"
          disabled={!productDetails.gender}
        >
          <option value="">-- Select Category --</option>
          {productDetails.gender &&
            Object.keys(categories[productDetails.gender]).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </select>
      </div>

      {/* Subcategory */}
      <div className="addproduct-itemfield">
        <p>Subcategory</p>
        <select
          name="subcategory"
          value={productDetails.subcategory}
          onChange={changeHandler}
          className="addproduct-selector"
          disabled={!productDetails.category}
        >
          <option value="">-- Select Subcategory --</option>
          {productDetails.category &&
            categories[productDetails.gender][productDetails.category].map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
        </select>
      </div>

      {/* Stock */}
      <div className="addproduct-itemfield">
        <p>Stock</p>
        <input
          type="number"
          name="stock"
          value={productDetails.stock}
          onChange={changeHandler}
          placeholder="Available stock"
          min="0"
        />
      </div>

      {/* Colors */}
      <div className="addproduct-itemfield">
        <p>Colors</p>
        <div className="color-options">
          {availableColors.map(color => (
            <div key={color} className="color-option">
              <input
                type="checkbox"
                id={`color-${color}`}
                checked={productDetails.colors.includes(color)}
                onChange={() => handleColorChange(color)}
              />
              <label htmlFor={`color-${color}`} style={{ backgroundColor: color.toLowerCase() }}>
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="addproduct-itemfield">
        <p>Sizes</p>
        <div className="size-options">
          {availableSizes.map(size => (
            <div key={size} className="size-option">
              <input
                type="checkbox"
                id={`size-${size}`}
                checked={productDetails.sizes.includes(size)}
                onChange={() => handleSizeChange(size)}
              />
              <label htmlFor={`size-${size}`}>{size}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Image */}
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <div className="addproduct-thumnail-img">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Selected Product"
                className="addproduct-thumnail-img"
              />
            ) : (
              <>
                <BiCloudUpload size={40} color="gray" />
                <p>Upload Image</p>
              </>
            )}
          </div>
        </label>
        <input
          type="file"
          id="file-input"
          name="image"
          onChange={imageHandler}
          hidden
          accept="image/*"
        />
      </div>

      {/* Submit */}
      <button className="addproduct-btn" onClick={Add_Product}>
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
