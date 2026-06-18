import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai'
import { RxExit } from 'react-icons/rx'

const ProfileSideBar = ({ active, setActive }) => {
    const tabs = [
        { id: 1, label: 'Profile', icon: <AiOutlineUser size={20} /> },
        { id: 6, label: 'Change Password', icon: <AiOutlineLock size={20} /> },
        { id: 4, label: 'Logout', icon: <RxExit size={20} /> },
    ]

    return (
        <div className="w-full bg-white shadow-sm rounded-md p-4">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    className={`flex items-center gap-3 p-3 mb-2 rounded-md cursor-pointer transition-colors ${
                        active === tab.id
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActive(tab.id)}
                >
                    {tab.icon}
                    <span className="hidden 800px:block text-sm font-medium">{tab.label}</span>
                </div>
            ))}
        </div>
    )
}

export default ProfileSideBar
