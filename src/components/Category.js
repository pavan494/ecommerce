// Updated CategoryTable.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Category.css";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/category")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.log(error));
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  return (
    <div className="container mt-5">
      <div className="category-container">
        {categories.map((category, index) => (
          <div className={`category-item ${index < 3 ? 'large' : 'small'}`} key={category.id}>
            <Link to={`/products/category/${encodeURIComponent(category.category)}`}>
              <img src={`images/category${index + 1}.jpg`} alt={category.category} />
              <div className="category-details">
                <h3>{category.category}</h3>
                <p>{category.product_count} Products</p>
                <p>Date Added: {formatDate(category.created_date)}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTable;
