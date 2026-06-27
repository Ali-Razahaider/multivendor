import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import styles from '../../styles/styles.js';
import axios from 'axios';
import server from '../../server.js';
import { toast } from 'react-toastify';

function ShopCreate() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { 'Content-Type': 'application/json' } };

    try {
      const res = await axios.post(
        `${server}shop/create-shop`,
        { name, email, password, phoneNumber, address, zipCode },
        {
          ...config,
          withCredentials: true,
        }
      );

      toast.success(res.data.message);

      setName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setAddress('');
      setZipCode('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Shop registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold">Register as a Seller</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="shop-name" className="block py-2 w-full text-sm font-medium text-gray-900 required">
                Shop Name
              </label>
              <input
                type="text"
                id="shop-name"
                name="shop-name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="block px-3 py-2 w-full rounded-md border border-gray-300 text-sm sm:mt-0 sm:border-r sm:rounded-bl-md"
                placeholder="Enter your shop name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block py-2 w-full text-sm font-medium text-gray-900 required">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="block px-3 py-2 w-full rounded-md border border-gray-300 text-sm sm:mt-0 sm:border-r sm:rounded-bl-md"
                placeholder="Enter your email"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium py-2 text-gray-900 required">
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

            <div>
              <label htmlFor="phone" className="block py-2 w-full text-sm font-medium text-gray-900 required">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phoneNumber}
                required
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="block px-3 py-2 w-full rounded-md border border-gray-300 text-sm sm:mt-0 sm:border-r sm:rounded-bl-md"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="address" className="block py-2 w-full text-sm font-medium text-gray-900 required">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
                className="block px-3 py-2 w-full rounded-md border border-gray-300 text-sm sm:mt-0 sm:border-r sm:rounded-bl-md"
                placeholder="Enter your address"
              />
            </div>

            <div>
              <label htmlFor="zipcode" className="block py-2 w-full text-sm font-medium text-gray-900 required">
                Zip Code
              </label>
              <input
                type="text"
                id="zipcode"
                name="zipcode"
                value={zipCode}
                required
                onChange={(e) => setZipCode(e.target.value)}
                className="block px-3 py-2 w-full rounded-md border border-gray-300 text-sm sm:mt-0 sm:border-r sm:rounded-bl-md"
                placeholder="Enter your zip code"
              />
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
              <h4>Already have a shop?</h4>
              <Link to="/shop-login" className="text-blue-600 pl-2">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ShopCreate;
