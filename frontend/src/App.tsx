import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage, HomePage, RegisterPage, ActivationPage } from './Routes';
import './App.css';
import { toast, ToastContainer } from 'react-toastify';
import server from './server.js';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const App = () => {
  useEffect(() => {
    const fetchCurrentUser = () => {
      axios
        .get(`${server}user/current`)
        .then((res) => {
          toast.success(`Welcome back ${res.data.user.name}!`);
        })
        .catch((err) => {
          console.log(err.response?.data?.message);
          toast.error('Please login to continue');
        });
    };
    fetchCurrentUser();
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
