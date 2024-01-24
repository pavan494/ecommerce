import './Navbar.css';
import logo from '../assets/myntra.png';
import cart_icon from '../assets/search.png';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  //const handleSearch = () => {
    // Implement your search logic here, e.g., navigate to search results page
    //navigate(`/search?q=${searchQuery}`);
    const handleSearch = async() => {
      // Implement your search logic here, e.g., navigate to search results page
      navigate(`/SolarSearch/${searchQuery}`);
      const response = await fetch(`http://localhost:4001/search?q=${encodeURIComponent(searchQuery)}` );
            const data = await response.json();
           // setProducts(data);
            console.log('Search Results:', data);
          } 
 
  
  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt="logo-img" className="logo-image"/>
      </div>
      <ul className="nav-menu">
        <li onClick={() => { setMenu("Clothing"); navigate(`/products/category/Clothing`) }}>Clothing{menu === "Clothing" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("kitchen"); navigate(`/products/category/Kitchen`) }}>KITCHEN{menu === "kitchen" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("Home&Kitchen"); navigate(`/products/category/Home&Kitchen`) }}>Home&Kitchen{menu === "Home&Kitchen" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("Electronics"); navigate(`/products/category/Electronics`) }}>Electronics{menu === "Electronics" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("Automobiles"); navigate(`/products/category/Automobiles`) }}>Automobiles{menu === "Automobiles" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("allproducts"); navigate('/products'); }}>All Products{menu === "allproducts" ? <hr /> : <></>}</li>
      </ul>
      {/* <div className="Search">
        <input  
          type="text"
          placeholder="Search..."
          className="Search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button class="button-1" onClick={handleSearch}>Search</button>
      </div> */}
      <form className="search-form">
            <input
              type="text"
              placeholder="Search for products"
              className="search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button" onClick={handleSearch}>
              Search
            </button>
          </form>
      <div className="nav-login-cart">
        <button>Login</button>
        <img src={cart_icon} alt="cart-img" className="cart-image"/>
        <div className="nav-cart-count">0</div>
      </div>
    </div>
  );
}

export default Navbar;