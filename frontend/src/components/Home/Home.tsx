// import { useSelector } from 'react-redux';
import Header from '../Layout/Header';
import Hero from './Hero';
import Categories from './Categories';
import BestDeals from './BestDeals';
import FeaturedProducts from './FeaturedProducts';
import Events from './Events';
import Footer from '../Layout/Footer';
const Home = () => {
  return (
    <>
    <Header activeHeading={1} />
      <Hero />
      <Categories />
      <BestDeals />
      <Events />
      <FeaturedProducts />
      <Footer />
    </>
  )
    ;
};

export default Home;
