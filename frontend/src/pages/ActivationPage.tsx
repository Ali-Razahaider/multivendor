import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import server from '../server.js';

function ActivationPage() {
  const { activationToken } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activationToken) {
      const activation = async () => {
        try {
          const type = searchParams.get('type') || 'user';
          const endpoint = type === 'shop' ? 'shop' : 'user';
          const res = await axios.post(
            `${server}${endpoint}/activation`,
            { activationToken },
            { withCredentials: true }
          );
          console.log(res.data.message);
          setError(false);
          if (type === 'shop') {
            navigate(`/shop/${res.data.shop._id}`);
          }
        } catch (error) {
          setError(true);
          console.log(error.response?.data?.message);
        }
      };
      activation();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {error
            ? 'Activation failed'
            : 'Activation successful, Account Created successfully'}
        </h2>
      </div>
    </div>
  );
}

export default ActivationPage;
