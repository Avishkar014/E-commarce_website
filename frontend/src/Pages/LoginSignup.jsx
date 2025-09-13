import React, { useState } from 'react';
import '../Pages/CSS/LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState('Login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login function executed", formData);
    try {
      const response = await fetch('https://e-commarce-website-backend.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (data.token) {
        localStorage.setItem('token', data.token);
        alert("Login successful!");
        window.location.href = '/';
      } else {
        alert(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const signup = async () => {
    console.log("Signup function executed", formData);
    try {
      const response = await fetch('https://e-commarce-website-backend.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Signup Response:", data);

      if (response.status === 409) {
        alert("User with this email or username already exists!");
        return;
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        alert("Signup successful!");
        window.location.href = '/';
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state === 'Login') {
      login();
    } else {
      signup();
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state === 'Login' ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="loginsignup-fields">
            {state === 'Sign Up' && (
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={changeHandler}
                placeholder="Enter your name"
                required
              />
            )}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={changeHandler}
              placeholder="Enter your email"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={changeHandler}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit">
            {state === 'Login' ? 'Login' : 'Continue'}
          </button>
        </form>

        <p className="loginsignup-login">
          {state === 'Login' ? (
            <>
              Don't have an account?{' '}
              <span onClick={() => setState('Sign Up')}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span onClick={() => setState('Login')}>Login here</span>
            </>
          )}
        </p>

        {state === 'Sign Up' && (
          <div className="loginsignup-agree">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <span>Terms & Conditions</span> and{' '}
              <span>Privacy Policy</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;