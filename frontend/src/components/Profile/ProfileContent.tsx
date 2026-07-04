import React, { useState, useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineCamera } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../styles/styles";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { toast } from "react-toastify";
import { updateProfile } from "../../redux/actions/userActions";
import { getAllOrdersOfUser } from "../../redux/actions/orderActions";

const ProfileContent = ({ active }) => {
  const { user, error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearErrors' });
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {};
    if (name && name !== user?.name) data.name = name;
    if (email && email !== user?.email) data.email = email;
    if (phoneNumber && phoneNumber !== user?.phoneNumber) data.phoneNumber = phoneNumber;
    if (oldPassword) data.oldPassword = oldPassword;
    if (newPassword) data.newPassword = newPassword;
    dispatch(updateProfile(data));
    if (!error) {
      toast.success("Profile updated successfully");
      setOldPassword("");
      setNewPassword("");
    }
  };

  return (
    <div className="w-full">
      {/* profile */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={`${user?.avatar?.url}`}
                className="size-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                alt=""
              />
              <div className="size-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-1 right-1">
                <input type="file" id="image" className="hidden" />
                <label htmlFor="image">
                  <AiOutlineCamera />
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-5">
            <form aria-required={true} onSubmit={handleSubmit}>
              <div className="w-full 800px:flex block pb-3">
                <div className=" w-full 800px:w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-full 800px:!w-[95%] mb-4 800px:mb-0`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className=" w-full 800px:w-[50%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-full 800px:!w-[95%] mb-1 800px:mb-0`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block pb-3">
                <div className=" w-full 800px:w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    className={`${styles.input} !w-full 800px:!w-[95%] mb-4 800px:mb-0`}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className=" w-full 800px:w-[50%]">
                  <label className="block pb-2">Old Password</label>
                  <input
                    type="password"
                    className={`${styles.input} !w-full 800px:!w-[95%] mb-4 800px:mb-0`}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block pb-3">
                <div className=" w-full 800px:w-[50%]">
                  <label className="block pb-2">New Password</label>
                  <input
                    type="password"
                    className={`${styles.input} !w-full 800px:!w-[95%] mb-4 800px:mb-0`}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <input
                className={`w-full 800px:w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
                value={loading ? "Updating..." : "Update"}
                type="submit"
                disabled={loading}
              />
            </form>
          </div>
        </>
      )}

      {/* order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* Inbox */}
      {active === 3 && (
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-gray-500 text-lg">Inbox - Coming Soon</p>
        </div>
      )}

      {/* Refund */}
      {active === 4 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/* Logout */}
      {active === 5 && (
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-gray-500 text-lg">Logout - Coming Soon</p>
        </div>
      )}

      {/* Track order */}
      {active === 6 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* Payment Methods */}
      {active === 7 && (
        <div className="w-full px-5">
          <div className="w-full 800px:w-[80%] mx-auto">
            <div className="flex flex-col 800px:flex-row items-start 800px:items-center justify-between mb-4 gap-2">
              <h2 className="text-lg 800px:text-xl font-semibold text-gray-800">Saved Payment Methods</h2>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs 800px:text-sm font-medium px-3 800px:px-4 py-2 rounded-md cursor-pointer w-full 800px:w-auto text-center transition-colors">+ Add Payment Method</button>
            </div>
            <div className="flex flex-col 800px:flex-row items-start 800px:items-center gap-3 border rounded-lg px-3 800px:px-4 py-3 shadow-sm bg-white">
              <div className="flex items-center gap-3 w-full 800px:w-auto">
                <div className="w-10 h-7 800px:w-12 800px:h-8 bg-blue-700 rounded flex items-center justify-center text-white text-[9px] 800px:text-[10px] font-bold shrink-0">VISA</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm 800px:text-base truncate">John Doe</p>
                  <p className="text-xs 800px:text-sm text-gray-500 font-mono">4242 **** **** 4242</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full 800px:w-auto 800px:ml-auto">
                <div className="text-left 800px:text-right text-xs 800px:text-sm text-gray-600">
                  <p>12/28</p>
                  <p className="text-[9px] 800px:text-[10px] text-gray-400">CVC ***</p>
                </div>
                <span className="text-[10px] 800px:text-[11px] text-green-600 font-medium border border-green-600 rounded px-2 py-0.5 shrink-0 ml-auto 800px:ml-0">Default</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const fallbackOrders = [
  { _id: 'ORD-001', cart: [{ qty: 2 }, { qty: 1 }], totalPrice: 299.99, status: 'Processing', createdAt: '2025-06-15T10:30:00.000Z' },
  { _id: 'ORD-002', cart: [{ qty: 1 }], totalPrice: 149.50, status: 'Delivered', createdAt: '2025-06-10T14:00:00.000Z' },
  { _id: 'ORD-003', cart: [{ qty: 3 }], totalPrice: 89.99, status: 'Processing refund', createdAt: '2025-06-05T09:15:00.000Z' },
  { _id: 'ORD-004', cart: [{ qty: 1 }, { qty: 1 }], totalPrice: 420.00, status: 'Refund Success', createdAt: '2025-05-28T16:45:00.000Z' },
]

const AllOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const rows = ((orders?.length > 0 ? orders : fallbackOrders) || []).map((item) => ({
    id: item._id,
    itemsQty: item.cart?.reduce((acc, c) => acc + c.qty, 0) || 0,
    total: item.totalPrice || 0,
    status: item.status,
  }));

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const AllRefundOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const rows = ((orders?.length > 0 ? orders : fallbackOrders) || [])
    .filter((item) => item.status === "Processing refund" || item.status === "Refund Success")
    .map((item) => ({
      id: item._id,
      itemsQty: item.cart?.reduce((acc, c) => acc + c.qty, 0) || 0,
      total: item.totalPrice || 0,
      status: item.status,
    }));

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10]}
        autoHeight
        disableRowSelectionOnClick
      />
    </div>
  );
};

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const rows = ((orders?.length > 0 ? orders : fallbackOrders) || []).map((item) => ({
    id: item._id,
    itemsQty: item.cart?.reduce((acc, c) => acc + c.qty, 0) || 0,
    total: item.totalPrice || 0,
    status: item.status,
  }));

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        autoHeight
      />
    </div>
  );
};

export default ProfileContent;
