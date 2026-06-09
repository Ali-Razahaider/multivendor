import styles from '../../styles/styles';
import { brandingData } from '../../static/data';
import { categoriesData } from '../../static/data';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div
          className={`branding my-12 flex justify-between w-full shadow-sm bg-white rounded-md`}
        >
          {brandingData &&
            brandingData.map((item, index) => (
              <div key={index} className={`flex p-3 items-start`}>
                <span className="mr-4">{item.icon}</span>
                <div>
                  <h3 className="text-sm md:text-base font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500">
                    {item.Description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Categories */}
      <div
        className={`${styles.section} bg-white
          rounded-lg mb-12  `}
        id="categories"
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
          {categoriesData &&
            categoriesData.map((item, index) => (
              <div
                key={index}
                className="flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg"
                onClick={() => navigate(`/products?category=${item.title}`)}
              >
                <h3 className="ml-2 text-lg leading-[1.3] text-gray-700">
                  {item.title}
                </h3>
                <img
                  src={item.image_Url}
                  alt={item.title}
                  className="w-25  object-cover"
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
