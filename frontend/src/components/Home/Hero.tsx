import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.normalFlex}`}
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(https://images.pexels.com/photos/6214372/pexels-photo-6214372.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={`${styles.section} 800px:pt-0 w-90 800px:w-[60%]`}>
        <h1
          className="text-6xl font-bold text-white
           800px:text-4xl"
        >
          Best Collection for Home Decoration
        </h1>
        <p className="text-lg text-gray-200 font-popins mt-2">
          Discover the best products at the lowest prices.
        </p>
            <Link to="/products">
              <div
                className={`${styles.button} mt-5 rounded-md`}
              >
                Shop Now
                  </div>
            </Link>
      </div>
    </div>
  );
};

export default Hero;
