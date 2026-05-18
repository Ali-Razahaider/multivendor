import Home from '../components/Home/Home.tsx';
const HomePage = ({ user }: { user: any }) => {
  return (
    <div>
      <Home user={user} />
    </div>
  );
};
export default HomePage;
