import { useSelector } from 'react-redux'

const ProfileContent = ({ active }) => {
    const { user } = useSelector((state) => state.user)

    const renderContent = () => {
        switch (active) {
            case 1:
                return (
                    <div className="bg-white shadow-sm rounded-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                                <p className="font-medium">{user?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Email</label>
                                <p className="font-medium">{user?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Phone</label>
                                <p className="font-medium">{user?.phoneNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Joined</label>
                                <p className="font-medium">{user?.createdAt?.slice(0, 10) || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="bg-white shadow-sm rounded-md p-6">
                        <h2 className="text-xl font-semibold mb-4">My Orders</h2>
                        <p className="text-gray-500">No orders yet.</p>
                    </div>
                )
            case 3:
                return (
                    <div className="bg-white shadow-sm rounded-md p-6">
                        <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>
                        <p className="text-gray-500">Your wishlist is empty.</p>
                    </div>
                )
            case 4:
                return (
                    <div className="bg-white shadow-sm rounded-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Logout</h2>
                        <p className="text-gray-500 mb-4">Are you sure you want to logout?</p>
                        <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors">Logout</button>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="w-full ml-0 800px:ml-5">
            {renderContent()}
        </div>
    )
}

export default ProfileContent
