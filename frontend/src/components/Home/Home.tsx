import { useSelector } from 'react-redux';

const Home = () => {
  const { user, loading } = useSelector((state: any) => state.user);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {loading
            ? 'Loading...'
            : user
              ? `Welcome back, ${user.name}!`
              : 'Home Page'}
        </h2>
      </div>
    </div>
  );
};

export default Home;
