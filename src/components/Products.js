import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import './products.css';
import { Button } from 'react-bootstrap';


const Products = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Fetch categories from your server API
    // Example API endpoint: http://localhost:4001/products
    fetch("http://localhost:5001/products", {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json().then((data) => { setCategories(data.results) }))
  }, [categoryName, currentPage, productsPerPage]);

  useEffect(() => {
    // Update the URL whenever the currentPage or selectedCategory changes
    let url = '/products';
    if (selectedCategory) {
      url += `/category/${selectedCategory.toLowerCase()}`;
    }
    url += `?page=${currentPage}`;

    navigate(url);
  }, [navigate, currentPage, selectedCategory]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = categories.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(categories.length / productsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end">
        {/* Home button */}
        <Link to="/home" className="btn btn-primary">
          Home
        </Link>
      </div>
      
      
      <div className="main">
      <div className="my-3">
        <label className="mr-2">Select Category: </label>
        <select className="form-control" value={selectedCategory} onChange={handleCategoryChange} >
          <option value="">All</option>
          <option value="Clothing">Clothing</option>
          <option value="Kitchen">Kitchen</option>
          <option value="Home&Kitchen">Home&Kitchen</option>
          <option value="Electronics">Electronics</option>
          <option value="Automobiles">Automobiles</option>
        </select>
        </div>
      </div>


      <h1 className="text-center mb-4">Product Table</h1>

      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>PRODUCT_ID</th>
            <th>PRODUCT_NAME</th>
            <th>MRP</th>
            <th>DISCOUNT</th>
            <th>STOCK</th>
            <th>BRAND_NAME</th>
            <th>CATEGORY</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((category) => (
            <tr key={category.id}>
              <td>{category.P_ID}</td>
              <td>{category.PRODUCT_NAME}</td>
              <td>{category.MRP}</td>
              <td>{category.DISCOUNT}</td>
              <td>{category.STOCK}</td>
              <td>{category.BRAND_NAME}</td>
              <td>{category.Category}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='pagination-container'>
        <button onClick={prevPage} disabled={currentPage === 1} className='btn btn-secondary mr-2'>
          Prev
        </button>
        {Array.from({ length: Math.ceil(categories.length / productsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            disabled={currentPage === index + 1}
            className='btn btn-secondary mr-2'
          >
            {index + 1}
          </button>
        ))}
        <button onClick={nextPage} disabled={currentPage === Math.ceil(categories.length / productsPerPage)} className='btn btn-secondary'>
          Next
        </button>
      </div>
    </div>
  );
}

export default Products;
