
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/styles';

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const submitHandle = (i) => {
    navigate(`/products?category=${i.title}`);
    setDropDown(false);
  };
  return (
    <div className="absolute left-0 w-full bg-white shadow-md z-20">
      {categoriesData &&
        categoriesData.map((i, index) => (
          <div
            key={index}
            className={`px-4 py-2 hover:bg-gray-200  cursor-pointer ${styles.normalFlex}`}
            onClick={() => submitHandle(i)}
          >
                <img src={i.image_Url} style={{ width: '25px', height: '25px', objectFit: 'contain', marginLeft: '10px', userSelect: "none" }} alt="" />
                <h3 className="ml-2">{i.title}</h3>

          </div>
        ))}
    </div>
  );
};

export default DropDown;
