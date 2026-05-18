import { toast } from 'react-toastify';

const Home = ({ user }: { user: any }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {user ? `Welcome back, ${user.name}!` : 'Please login to continue'}
        </h2>
      </div>
    </div>
  );
};

export default Home;
