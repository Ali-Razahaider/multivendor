import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import styles from '../../styles/styles.js';
import axios from 'axios';
import server from '../../server.js';
import { toast } from 'react-toastify';
function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { 'Content-Type': 'application/json' } };

    try {
      const res = await axios.post(
        `${server}user/register`,
        { name: fullName, email, password },
        {
          ...config,
          withCredentials: true, //with credentials is required to allow cross origin sites to set and read cookie, by default it is false. When the cookie is set by a different origin it will honor the same origin policy. and the cookie isnt accessable through document.cookie
        }
      );

      toast.success(res.data.message);

      setFullName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto  sm:w-full sm:max-w-md">
        <h2 className="mt-6  text-center text-3xl font-extrabold">Register</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form action="" className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <div>
                <label
                  htmlFor="full-name"
                  className="block py-2 w-full text-sm font-medium text-gray-900 required"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="full-name"
                  name="full-name"
                  value={fullName}
                  required
                  onChange={(e) => setFullName(e.target.value)}
                  className="block px-3 py-2 w-full rounded-md border border-gray-300 text-sm sm:mt-0 sm:border-r sm:rounded-bl-md"
                  placeholder="Enter your Name"
                />
              </div>

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
                  className="block px-3 py-2 w-full rounded-md border  border-gray-300 text-sm sm:mt-0 sm:border-r sm:rounded-bl-md"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mt-2 relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium py-2 text-gray-900 required"
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
                    className="absolute right-2 top-10 cursor-pointer "
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-10  cursor-pointer "
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
            <div className={`${styles.normalFlex} w-full`}>
              <h4>Already have an account?</h4>
              <Link to="/login" className="text-blue-600 pl-2">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
