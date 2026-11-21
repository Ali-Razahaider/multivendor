import Header from '../Layout/Header';
import Hero from './Hero';
import Categories from './Categories';
import BestDeals from './BestDeals';
import BestSellers from './BestSellers';
import FeaturedProducts from './FeaturedProducts';
import Events from './Events';
import ShopSpotlight from './ShopSpotlight';
import SellerCta from './SellerCta';
import Footer from '../Layout/Footer';

const Home = () => (
  <>
    <Header activeHeading={1} />
    <main id="main">
      <Hero />
      <Categories />
      <BestDeals />
      <Events />
      <BestSellers />
      <ShopSpotlight />
      <FeaturedProducts />
      <SellerCta />
    </main>
    <Footer />
  </>
);

export default Home;
