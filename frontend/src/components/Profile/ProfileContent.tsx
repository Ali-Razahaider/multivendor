import React from "react";
import { AiOutlineArrowRight, AiOutlineCamera } from "react-icons/ai";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";

const ProfileContent = ({ active }) => {
  const { user } = useSelector((state) => state.user);

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
            <form aria-required={true} onSubmit={(e) => e.preventDefault()}>
              <div className="w-full 800px:flex block pb-3">
                <div className=" w-full 800px:w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-full 800px:!w-[95%] mb-4 800px:mb-0`}
                    required
                    placeholder={user?.name}
                  />
                </div>
                <div className=" w-full 800px:w-[50%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-full 800px:!w-[95%] mb-1 800px:mb-0`}
                    required
                    placeholder={user?.email}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block pb-3">
                <div className=" w-full 800px:w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    className={`${styles.input} !w-full 800px:!w-[95%] mb-4 800px:mb-0`}
                    required
                    placeholder={user?.phoneNumber}
                  />
                </div>

                <div className=" w-full 800px:w-[50%]">
                  <label className="block pb-2">Enter your password</label>
                  <input
                    type="password"
                    className={`${styles.input} !w-full 800px:!w-[95%] mb-4 800px:mb-0`}
                    required
                  />
                </div>
              </div>
              <input
                className={`w-full 800px:w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
                value="Update"
                type="submit"
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
              <button className="bg-black text-white text-xs 800px:text-sm font-medium px-3 800px:px-4 py-2 rounded-md cursor-pointer w-full 800px:w-auto text-center">+ Add Payment Method</button>
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

const AllOrders = () => {
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
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

  const row = [];

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
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
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
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

  const row = [];

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
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
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
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

  const row = [];

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
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
