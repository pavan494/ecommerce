import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import "./SolarSearch.css"

const SolarSearch = () => {
  let { searchTerm } = useParams();
  const [data, setdata] = useState([]);
 
  useEffect(() => {
    async function fetchdata() {
      try {
      
        console.log("passing searechterm ", searchTerm);
        let response = await fetch(`http://localhost:5001/search?q=${encodeURIComponent(searchTerm)}`,{
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        response = await response.json();
        console.log(response);
        setdata(response);
      } catch (error) {
        console.error('Error performing Solr search:', error);
      }
    }
    fetchdata();
  }, [searchTerm]);

  return (
    <div className="search-container">
      <div className="center-content">
        <Link to="/products?page=1" className="btn btn-primary home-button">
          Home
        </Link>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>PD_ID</th>
            <th>PD_NAME</th>
            <th>MRP</th>
            <th>DISCOUNT</th>
            <th>STOCK</th>
            <th>BRAND_NAME</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {data.map((category) => (
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
    </div>
  );
};

export default SolarSearch;
