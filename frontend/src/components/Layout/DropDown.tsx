
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/styles';

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const submitHandle = (i) => {
    navigate(`/products?category=${encodeURIComponent(i.title)}`);
    setDropDown(false);
  };
  return (
    <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl" role="menu" aria-label="Product categories">
      {categoriesData &&
        categoriesData.map((i, index) => (
          <button
            type="button"
            role="menuitem"
            key={index}
            className={`w-full text-left px-3 py-2.5 hover:bg-indigo-50 focus:bg-indigo-50 text-sm text-gray-700 transition-colors ${styles.normalFlex}`}
            onClick={() => submitHandle(i)}
          >
                <img src={i.image_Url} className="w-7 h-7 object-cover rounded-md" alt="" />
                <span className="ml-3 font-medium">{i.displayTitle || i.title}</span>

          </button>
        ))}
    </div>
  );
};

export default DropDown;
