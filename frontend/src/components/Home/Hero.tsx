import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.normalFlex}`}
      style={{
        backgroundImage:
          'linear-gradient(90deg, rgba(18,20,24,0.76) 0%, rgba(18,20,24,0.47) 48%, rgba(18,20,24,0.12) 100%), url(/images/marketplace-hero.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={`${styles.section} py-20 800px:py-0`}>
        <h1
          className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white"
        >
          Discover more of what you love
        </h1>
        <p className="max-w-xl text-base sm:text-lg text-gray-100 mt-4 leading-relaxed">
          Explore everyday essentials, standout gifts, and fresh finds from independent sellers.
        </p>
        <Link
          to="/products"
          className={`${styles.button} mt-6 px-6 w-fit min-w-[170px] rounded-lg text-white font-semibold shadow-lg shadow-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
        >
          Explore products
        </Link>
      </div>
    </div>
  );
};

export default Hero;
