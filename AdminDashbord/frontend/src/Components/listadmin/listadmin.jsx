import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { createAxios } from "../../createInstance";
import { deleteUserStart } from "../../redux/userSlice";
import { deleteUserFailed } from "../../redux/userSlice";
import DataTable from 'react-data-table-component';
import { loginSuccess } from "../../redux/authSlice";
import { getUsersSuccess } from "../../redux/userSlice";
import ReactPaginate from "react-paginate";
import * as AiIcons from 'react-icons/ai'
const HomePage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers);
  const [admin, setAdmin] = useState([]);
  const [uninput, setUninput] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 10;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUserStart());
    try {
        await axiosJWT.delete("/v1/user/" + id, {
        headers: { token: `Bearer ${accessToken}` },
      });

      const updatedAdmin = userList.filter((person) => person._id !== id);
      await dispatch(getUsersSuccess(updatedAdmin));
      setAdmin(userList);
    } catch (err) {
      dispatch(deleteUserFailed(err.response.data));

    }
  };
  const handleDelete = (id) => {
    deleteUser(user?.accessToken, dispatch, id, axiosJWT);
  };

  useEffect(() => {
    setAdmin(userList)
    setPageCount(Math.ceil(userList.length / itemsPerPage));
    if (!user) {
      navigate("/login");
    }
    setUninput(false);

    if (userList.length === 0) {
      setUninput(true);
    }



  }, [userList]);


  function handleFilter(event) {
    setCurrentPage(0);
    const newdata = userList.filter(row => {
      return row.name.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setAdmin(newdata)
  }
  const getCurrentPageData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return admin.slice(startIndex, endIndex);
  };
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const columns = [
    { name: 'ID', selector: '_id', width: "300px" },
    { name: 'Tên', selector: 'username', width: "300px" },
    { name: 'Email', selector: 'email', width: "300px" },
    {
      name: 'Điều chỉnh',
      cell: (row) => (
        <div>
          <AiIcons.AiTwotoneDelete className='IconCus' onClick={() => handleDelete(row._id)} />

        </div>
      ),
    },
  ];
  return (
    <div>

      <input
        type="text"
        placeholder="Search..."
        readOnly={uninput}
        onChange={handleFilter}
      />
      <div className='table'>
        <DataTable columns={columns} data={getCurrentPageData()} />
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
};

export default HomePage;
