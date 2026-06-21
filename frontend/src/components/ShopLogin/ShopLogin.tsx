import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import styles from '../../styles/styles.js';
import axios from 'axios';
import server from '../../server.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ShopLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${server}shop/login`,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      toast.success(res.data.message);
      setEmail('');
      setPassword('');
      setVisible(false);
      navigate('/');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold">
          Login to your shop
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={login}>
            <div>
              <label
                htmlFor="email"
                className="block py-2 w-full text-sm font-medium text-gray-900 required"
              >
                Email address
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  type="email"
                  id="email"
                  value={email}
                  name="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="block px-3 py-2 w-full rounded-md border border-gray-300 text-sm sm:mt-0 sm:border-r sm:rounded-bl-md"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mt-2 relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium py-2 text-gray-900"
                >
                  Password
                </label>
                <input
                  type={visible ? 'text' : 'password'}
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block px-3 py-2 w-full rounded-md border border-gray-300 text-sm sm:mt-0 sm:border-r sm:rounded-bl-md"
                  placeholder="Enter your password"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-10 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-10 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>
            <div className={`${styles.normalFlex} justify-between`}>
              <div className={`${styles.normalFlex}`}>
                <input
                  type="checkbox"
                  name="remember-me"
                  id="remember-me"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full h-10 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Login
              </button>
            </div>
            <div className={`${styles.normalFlex} w-full`}>
              <h4>Not have any shop account?</h4>
              <Link to="/shop-create" className="text-blue-600 pl-2">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ShopLogin;
