import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import { Account } from "../../redux/userSlice";
import { allAcc } from '../../redux/userSlice';
import { createAxios } from "../../createInstance";
import ReactPaginate from "react-paginate";
import * as AiIcons from 'react-icons/ai'
import * as ImIcons from "react-icons/im"
import * as TbIcons from "react-icons/tb"
const AccUser = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const allaccount = useSelector((state) => state.users?.allaccount);

  const [acc, setAcc] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [pageCount, setPageCount] = useState(0);
  const [uninput, setUninput] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const itemsPerPage = 10;
  const deleteAccount = async (accessToken, dispatch, id, axiosJWT) => {

    try {
        await axiosJWT.delete("/v1/user/account/" + id, {
        headers: { token: `Bearer ${accessToken}` },

      });
      const updatedAccounts = allaccount.filter((person) => person._id !== id);
      await dispatch(allAcc(updatedAccounts))
      setAcc(allaccount);
    } catch (err) {
      console.log(err);

    }
  };
  const handleDelete = async (id) => {
    await deleteAccount(user?.accessToken, dispatch, id, axiosJWT);
  };
  const handleEdit = (row) => {
    dispatch(Account(row));
    navigate("/account/update")
  };

  useEffect(() => {
    setAcc(allaccount);
    setPageCount(Math.ceil(allaccount.length / itemsPerPage));
    if (!user) {
      navigate("/login");
    }
    setUninput(false);

    if (allaccount.length === 0) {
      setUninput(true);
    }



  }, [allaccount]);
  function handleFilter(event) {
    setCurrentPage(0);
    const newdata = allaccount.filter(row => {
      return row.name.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setAcc(newdata)
  }
  const handleBlock = async (accessToken, dispatch, data, axiosJWT) => {

    try {
       await axiosJWT.post("/v1/user/account/block/", data, {
        headers: { token: `Bearer ${accessToken}` },

      });
      const targetIndex = allaccount.findIndex(account => account._id === data._id);
      if (targetIndex !== -1) {
        const updatedAccount = { ...allaccount[targetIndex], isBlocked: true };


        const updatedAccounts = [...allaccount];
        updatedAccounts[targetIndex] = updatedAccount;

        dispatch(allAcc(updatedAccounts));
        setAcc(updatedAccounts);
      } else {
        console.log("Không tìm thấy người cần thay đổi.");
      }
    } catch (err) {
      console.log(err);

    }
  }
  const handleUnBlock = async (accessToken, dispatch, data, axiosJWT) => {

    try {
      await axiosJWT.post("/v1/user/account/block/", data, {
        headers: { token: `Bearer ${accessToken}` },

      });
      const targetIndex = allaccount.findIndex(account => account._id === data._id);
      if (targetIndex !== -1) {
        const updatedAccount = { ...allaccount[targetIndex], isBlocked: false };


        const updatedAccounts = [...allaccount];
        updatedAccounts[targetIndex] = updatedAccount;


        dispatch(allAcc(updatedAccounts));
        setAcc(updatedAccounts);
      } else {
        console.log("Không tìm thấy người cần thay đổi.");
      }
    } catch (err) {
      console.log(err);

    }
  }
  const getCurrentPageData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return acc.slice(startIndex, endIndex);
  };
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const columns = [
    { name: 'idShoppingCart', selector: 'idShoppingCart', width: "300px" },
    { name: 'Name', selector: 'name', width: "150px" },
    { name: 'Email', selector: 'email', width: "250x" },
    { name: 'Address', selector: 'address', width: "400px" },
    {
      name: 'Actions', width: "150px",
      cell: (row) => (
        <div>
          < AiIcons.AiFillEdit className='IconCus' onClick={() => handleEdit(row)} />
          <AiIcons.AiTwotoneDelete className='IconCus' onClick={() => handleDelete(row._id)} />
          {
            row.isBlocked ? (
              < TbIcons.TbLockOpen className='IconCus' onClick={() => handleUnBlock(user?.accessToken, dispatch, row, axiosJWT)} />
            ) : (
              < ImIcons.ImBlocked className='IconCus' onClick={() => handleBlock(user?.accessToken, dispatch, row, axiosJWT)} />

            )
          }
        </div>
      ),
    },
  ];

  const customStyles = {
    rows: {
      style: {
        backgroundColor: '#f5f5f5', // Màu nền cho các dòng
      },
    },
    headCells: {
      style: {
        backgroundColor: '#e0e0e0', // Màu nền cho tiêu đề cột
        color: '#333', // Màu chữ cho tiêu đề cột
      },
    },
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        readOnly={uninput}
        onChange={handleFilter}
      />
      <div className='table'>
        <DataTable columns={columns} data={getCurrentPageData()} customStyles={customStyles} />
      </div>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
}

export default AccUser;