import { useState } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import ProfileSideBar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";

const ProfilePage = () => {
  const [active, setActive] = useState(1);

  return (
    <div>
      <Header activeHeading={null} />
      <div className={`${styles.section} flex bg-gray-100 py-10`}>
        <div className="w-[50px] 800px:w-[335px] 800px:mt-0">
          <ProfileSideBar active={active} setActive={setActive} />
        </div>
        <ProfileContent active={active} />
      </div>
    </div>
  );
};

export default ProfilePage;
