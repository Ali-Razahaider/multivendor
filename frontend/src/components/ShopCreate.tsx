import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import styles from '../styles/styles.js';
import server from '../server.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ShopCreate() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [avatar, setAvatar] = useState(null);

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phoneNumber', phoneNumber);
        formData.append('address', address);
        formData.append('zipCode', zipCode);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            const res = await axios.post(
                `${server}shop/create-shop`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
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
            setAvatar(null);
            navigate('/');
            window.location.reload();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Shop creation failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Register as a Seller
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-900">
                                Shop Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="block px-3 py-2 w-full rounded-md border border-gray-300 text-sm mt-1"
                                placeholder="Enter your shop name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block px-3 py-2 w-full rounded-md border border-gray-300 text-sm mt-1"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-900">
                                Password
                            </label>
                            <input
                                type={visible ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block px-3 py-2 w-full rounded-md border border-gray-300 text-sm mt-1"
                                placeholder="Enter your password"
                            />
                            {visible ? (
                                <AiOutlineEye
                                    className="absolute right-2 top-8 cursor-pointer"
                                    size={25}
                                    onClick={() => setVisible(false)}
                                />
                            ) : (
                                <AiOutlineEyeInvisible
                                    className="absolute right-2 top-8 cursor-pointer"
                                    size={25}
                                    onClick={() => setVisible(true)}
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                className="block px-3 py-2 w-full rounded-md border border-gray-300 text-sm mt-1"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900">
                                Address
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className="block px-3 py-2 w-full rounded-md border border-gray-300 text-sm mt-1"
                                placeholder="Enter your address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900">
                                Zip Code
                            </label>
                            <input
                                type="text"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                required
                                className="block px-3 py-2 w-full rounded-md border border-gray-300 text-sm mt-1"
                                placeholder="Enter your zip code"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900">
                                Shop Avatar
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileInput}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Register Shop
                            </button>
                        </div>

                        <div className={`${styles.normalFlex} w-full`}>
                            <h4>Already have a shop?</h4>
                            <Link to="/shop-login" className="text-blue-600 pl-2">
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ShopCreate;
