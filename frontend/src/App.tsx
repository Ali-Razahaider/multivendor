import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage, HomePage, RegisterPage, ActivationPage, ProductsPage, BestSellingPage, EventPage, FaqPage, ProductDetailsPage, ProfilePage } from './Routes';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import axios from 'axios';
import Store from './redux/store.js';
import { loadUser } from './redux/actions/userActions.js';
import ProtectedRoute from './ProtectedRoute';
import { useSelector } from 'react-redux';

axios.defaults.withCredentials = true;

const App = () => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    Store.dispatch(loadUser());
  }, []);

  // if (!user) {
  //   toast.error('Please login to continue');
  // } else toast.success(`Welcome back ${user.name}`);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/activation/:activationToken"
          element={<ActivationPage />}
        />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/product/:name" element={<ProductDetailsPage />} />
        <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}> <ProfilePage /> </ProtectedRoute>} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;
