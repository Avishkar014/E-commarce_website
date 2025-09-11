import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Shop from './Pages/Shop';
import LoginSignup from './Pages/LoginSignup';
import Cart from './Pages/Cart';
import Payment from './Pages/Payment';  
import Navbar from './Components/Navbar/Navbar.jsx';
import Footer from './Components/Footer/Footer.jsx';
import men_banner from '../src/Components/Assets/Frontend_Assets/banner_mens.png';
import women_banner from '../src/Components/Assets/Frontend_Assets/banner_women.png';
import kids_banner from '../src/Components/Assets/Frontend_Assets/banner_kids.png';
import ShopContextProvider from './Context/ShopContext';

function App() {
  return (
    <div className="App">
      <ShopContextProvider>
        <BrowserRouter>
          <Navbar /> 
          <Routes>
            <Route path='/' element={<Shop />} />
            <Route path='/mens' element={<ShopCategory banner={men_banner} category="men" />} />
            <Route path='/womens' element={<ShopCategory banner={women_banner} category="women" />} />
            <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kid" />} />
            <Route path='/product/:productId' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/payment' element={<Payment />} />   {/* ✅ Added Payment Route */}
            <Route path='/login' element={<LoginSignup />} />
          </Routes>
          <Footer/>
        </BrowserRouter>  
      </ShopContextProvider>   
    </div>
  );
}

export default App;
