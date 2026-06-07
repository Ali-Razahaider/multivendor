// import { useSelector } from 'react-redux';
import Header from '../Layout/Header.tsx';
import Hero from './Hero';
import Categories from './Categories.tsx';
import BestDeals from './BestDeals.tsx';
const Home = () => {
  return (
    <>
    <Header activeHeading={1} />
      <Hero />
      <Categories />
      <BestDeals />
    </>
  )
    ;
};

export default Home;
