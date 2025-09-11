import React, { useContext } from "react";
import "./CSS/Payment.css"; 
import { ShopContext } from "../Context/ShopContext"; 
const Payment = () => {
  const { getTotalCartAmount } = useContext(ShopContext);
  const total = getTotalCartAmount();

  return (
    <div className="payment-container">
      <h1>Payment Page</h1>

      {/* Order Summary */}
      <div className="payment-summary">
        <h2>Order Summary</h2>
        <p><span>Subtotal</span><span>${total}</span></p>
        <p><span>Shipping</span><span>Free</span></p>
        <p className="payment-total">
          <strong>Total</strong><strong>${total}</strong>
        </p>
      </div>

      {/* Payment Methods */}
      <div className="payment-methods">
        <h2>Select Payment Method</h2>
        <label><input type="radio" name="payment" /> Credit / Debit Card</label>
        <label><input type="radio" name="payment" /> UPI</label>
        <label><input type="radio" name="payment" /> Net Banking</label>
        <label><input type="radio" name="payment" /> Cash on Delivery</label>
      </div>

      {/* Pay Now Button */}
      <button className="pay-button">Pay Now</button>
    </div>
  );
};

export default Payment;
