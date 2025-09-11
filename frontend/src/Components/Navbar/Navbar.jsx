import React, { useContext, useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from '../Assets/Frontend_Assets/logo.png';
import cart_icon from '../Assets/Frontend_Assets/cart_icon.png';
import nav_dropdown from '../Assets/Frontend_Assets/nav_drop.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

export const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { cartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const syncLoginState = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };
    window.addEventListener("storage", syncLoginState);
    return () => window.removeEventListener("storage", syncLoginState);
  }, []);

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className='navbar'>
      {/* Logo wrapped with Link */}
      <Link to="/" className="nav-logo" style={{ textDecoration: "none", color: "inherit" }}>
        <img src={logo} alt="logo" />
        <p>Shopper</p>
      </Link>

      {/* Mobile Menu Icon */}
      <img
        src={nav_dropdown}
        alt="menu"
        className="nav-dropdown"
        onClick={dropdown_toggle}
      />

      {/* Navigation Menu */}
      <ul ref={menuRef} className='nav-menu'>
        <li onClick={() => setMenu("shop")}>
          <Link to='/'>Shop</Link>
          {menu === "shop" && <hr />}
        </li>
        <li onClick={() => setMenu("mens")}>
          <Link to='/mens'>Men</Link>
          {menu === "mens" && <hr />}
        </li>
        <li onClick={() => setMenu("womens")}>
          <Link to='/womens'>Women</Link>
          {menu === "womens" && <hr />}
        </li>
        <li onClick={() => setMenu("kids")}>
          <Link to='/kids'>Kids</Link>
          {menu === "kids" && <hr />}
        </li>
      </ul>

      {/* Login/Logout and Cart */}
      <div className='nav-login-cart'>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to='/login'>
            <button>Login</button>
          </Link>
        )}

        <Link to='/cart'>
          <img src={cart_icon} alt="cart" />
        </Link>
        <div className="nav-cart-count">{getTotalItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
