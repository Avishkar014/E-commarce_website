import React from 'react';
import './Footer.css';
import footer_logo from '../Assets/Frontend_Assets/logo_big.png'; // ✅ Ensure this file exists and is correctly imported
import instagram_icon from '../Assets/Frontend_Assets/instagram_icon.png'
import pintester_icon from '../Assets/Frontend_Assets/pintester_icon.png';
import whatsapp_icon from '../Assets/Frontend_Assets/whatsapp_icon.png';

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={footer_logo} alt='logo' />
        <p>Shopper</p>
      </div>
      <ul>
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icon">
        <img src={instagram_icon} alt='Instagram' />
        <img src={pintester_icon} alt='Pinterest' />
        <img src={whatsapp_icon} alt='WhatsApp' />
      </div>
      <div className="footer-copyright">
        <p>© 2025 Shopper. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
