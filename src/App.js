
import React from "react";
import { BrowserRouter as Router,Route,Routes,Redirect, Switch } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Products from "./components/Products";
import Homepage from './components/Homepage';
import CategoryTable from "./components/Category";
import CategoryProducts from "./components/CategoryProducts";
import SolarSearch from "./components/SolarSearch";

function App() {
  return (
    <div>
      
      <Router>
        <Navbar/>
        <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Homepage/>}  />
        <Route path="/category" element={<CategoryTable/>}  />
        <Route path="/products" element={<Products/>}  />
        <Route path="/products/category/:category" element={<CategoryProducts/>}  />
        <Route path="/SolarSearch/:searchTerm" element={<SolarSearch/>}/>
         
      
      </Routes>
      </Router>
    </div>
  );
}

export default App;