import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";
import "./productorder.css"
import *  as BsIcons from 'react-icons/bs'
import * as MdIcons from "react-icons/md"
const AccUser = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const product = useSelector((state) => state.product?.product);
  const [pro, setPro] = useState([]);
  const [uninput, setUninput] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [pageCount, setPageCount] = useState(0);
  const navigate = useNavigate();
  const itemsPerPage = 3;
  const handleYes = async (row, total) => {
    const info = {
      total: total,
      email: row.email
    }
    try {
      await axios.post("/menu/product/checkoutyes/" + row._id, info);
      const updatedPro = pro.map(item => {
        if (item._id === row._id) {
          return { ...item, status: "Delivering" };
        }
        return item;
      });
      setPro(updatedPro);
    } catch (err) {
      console.log(row._id)
    }
  };

  const handleNo = async (row) => {
    try {
      await axios.post("/menu/product/checkoutno/" + row._id);
      const updatedPro = pro.map(item => {
        if (item._id === row._id) {
          return { ...item, status: "Canceled" };
        }
        return item;
      });
      setPro(updatedPro);
    } catch (err) {

    }
  };

  const getCurrentPageData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return pro.slice(startIndex, endIndex);
  };
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  useEffect(() => {
    setPro(product);
    setPageCount(Math.ceil(product.length / itemsPerPage));
    if (!user) {
      navigate("/login");
    }
    setUninput(false);

    if (product.length === 0) {
      setUninput(true);
    }
  }, [product]);
  function handleFilter(event) {
    setCurrentPage(0);
    const newdata = product.filter(row => {
      return row.numberPhone.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setPro(newdata)
  }
  const columns = [
    { name: 'Tên khách hàng', selector: 'name', width: '200px', },
    { name: 'Số điện thoại', selector: 'numberPhone', width: '150px' },
    { name: 'Địa chỉ', selector: 'address', width: '200px' },

    {
      name: 'Giỏ hàng',
      width: '400px',
      cell: (row) => (

        <div className="cart-cell">
          {row.products.map((product) => (
            <div key={product.id}>
              <div className='proimg'>
                <div className='listproduct'>
                  <div className='productName'>{product.name}</div>
                  <div className='productItem'>Số lượng: {product.quantity}</div>

                  <div className='productItem'>Giá: {product.unitPrice}đ </div>
                </div>
                <img src={product.image} alt="Product Image" className="carousel-image" />

              </div>

              <hr></hr>
            </div>
          ))}

        </div>
      ),
    },
    {
      name: 'Tổng tiền', width: '150px',
      cell: (row) => {
        const total = row.products.reduce((acc, product) => acc + product.unitPrice, 0);
        return (
          <span>{total}đ</span>
        );
      }

    },
    { name: 'Thời gian đặt', selector: 'time', width: '200px' },
    { name: 'Trạng thái', selector: 'status' },
    {
      name: 'Actions',
      cell: (row) => {
        if (row.status === "Pending") {
          const total = row.products.reduce((acc, product) => acc + product.unitPrice, 0);
          return (
            <div>
              < BsIcons.BsFillCheckCircleFill className='IconCus' onClick={() => handleYes(row, total)} />
              <MdIcons.MdCancel className='IconCus' onClick={() => handleNo(row)} />

            </div>
          )
        }
      }

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
        <DataTable columns={columns} data={getCurrentPageData()}

        />
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