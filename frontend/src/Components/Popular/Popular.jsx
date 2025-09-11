import React, { useState, useEffect } from 'react';
import './Popular.css';
import Item from '../Item/Item';

const Popular = () => {
  // Use the useState hook to create a state variable for popular products
  const [popularProducts, setPopularProducts] = useState([]);

  // Use the useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // The fetch call retrieves data from the popularinwomen endpoint
    // Corrected the URL from 'http;//' to 'http://'
    fetch('http://localhost:4000/popularinwomen')
      .then((response) => response.json())
      .then((data) => setPopularProducts(data));
  }, []); // The empty array ensures this effect runs only once on mount

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {/* Map through the popularProducts state and render an Item component for each product */}
        {popularProducts.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;