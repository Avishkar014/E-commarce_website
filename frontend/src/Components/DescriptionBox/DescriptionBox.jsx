import React from 'react';
import './DescriptionBox.css';

const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box.fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          An e-commerce website is an online platform that facilitates buying and selling
          of goods or services over the internet. It allows businesses to reach a global audience,
          provide detailed product information, enable secure payments, and streamline the order
          and delivery process. E-commerce websites are essential for modern retail, combining
          convenience, variety, and accessibility for both customers and sellers.
        </p>
        <p>
          E-commerce websites typically display products or services with detailed descriptions,
          images, prices, and any available variations such as size, color, or quantity. These features
          help users make informed purchasing decisions and improve the overall shopping experience.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
