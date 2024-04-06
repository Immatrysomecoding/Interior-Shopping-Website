import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../createInstance";
import { loginSuccess } from '../../redux/authSlice';
import { saveProduct } from "../../redux/productSlice";
import { productSucces } from "../../redux/productSlice";
import { GetCategory } from '../../redux/categorySlice';
import ReactPaginate from "react-paginate";
import *  as BsIcons from 'react-icons/bs'
import * as AiIcons from 'react-icons/ai'
import * as IoIcons from "react-icons/io"
const AccUser = () => {

  const user = useSelector((state) => state.auth.login?.currentUser);
  const Product = useSelector((state) => state.product?.allProducts);
  const allcategory = useSelector((state) => state.category?.allcategory);
  const [pro, setPro] = useState([]);
  const [uninput, setUninput] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [pageCount, setPageCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemsPerPage = 8;
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const getCurrentPageData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return pro.slice(startIndex, endIndex);
  };
  useEffect(() => {
    setPro(Product);
    setPageCount(Math.ceil(Product.length / itemsPerPage));
    if (!user) {
      navigate("/login");
    }
    setUninput(false);

    if (Product.lenght === 0) {
      setUninput(true);
    }
  }, [Product]);
  const deleteProduct = async (accessToken, dispatch, product, axiosJWT) => {
    try {
       await axiosJWT.delete("/menu/product/" + product.idProduct, {
        headers: { token: `Bearer ${accessToken}` },

      });
      const updatedCategoryPromises = allcategory.map(async (category) => {
        if (category.name === product.category) {
          const updatedListIdProduct = category.listIdProduct.filter(
            (categoryPro) => categoryPro.idProduct !== product.idProduct
          );
          return { ...category, listIdProduct: updatedListIdProduct };
        }
        return category;
      });

      const updatedCategories = await Promise.all(updatedCategoryPromises);
      await dispatch(GetCategory(updatedCategories));
      const updatedProduct = Product.filter((person) => person.idProduct !== product.idProduct);
      await dispatch(productSucces(updatedProduct))
      setPro(updatedProduct);
    } catch (err) {
      console.log(err);

    }

  };
  const handleDelete = async (row) => {
    await deleteProduct(user?.accessToken, dispatch, row, axiosJWT);
  };
  const handleEdit = (row) => {
    dispatch(saveProduct(row));
    navigate("/product/update")
  };
  const handleAdd = (row) => {

    navigate("/product/add")
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };


  function handleFilter(event) {
    setCurrentPage(0);
    const newdata = Product.filter(row => {
      return row.name.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setPro(newdata)
  }
  const ImageCarousel = ({ images }) => {

    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
      setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
      setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
      <div className="image-carousel">
        <BsIcons.BsFillArrowLeftCircleFill className='IconCus' onClick={goToPrevious} />
        <img src={images[currentIndex]} alt="Image" className="carousel-image" />
        <BsIcons.BsFillArrowRightCircleFill className='IconCus' onClick={goToNext} />
      </div>
    );
  };

  const columns = [
    {
      name: 'Tên sản phẩm', width: "300px", cell: (row) => (
        <div style={{ whiteSpace: 'normal' }}>
          {row.name}
        </div>),
    },
    {
      name: 'Chi tiết', width: "400px",
      cell: (row) => (

        <div style={{ whiteSpace: 'normal' }}>
          {row.details}
        </div>),
    },
    { name: 'Danh mục', selector: 'category', width: "200px" },
    { name: 'Số lượng', selector: 'quantity' },
    {
      name: 'Giá',
      cell: (row) => (
        <div >
          <div>Giá niêm yết: {row.price}đ</div>
          <br></br>
          {row.pricesale && (<div>Giá khuyến mãi: {row.pricesale}đ</div>)}
        </div>
      ),
    },
    {
      name: 'Hình ảnh đại diện',
      selector: 'image', width: "auto",
      cell: row => <img src={row.image} alt="Image" className="carousel-image" />
    }
    ,
    {
      name: 'Hình ảnh mô tả', width: "auto",
      selector: 'listIdRating',
      cell: row => <ImageCarousel images={row.listImgExtra} />
    },
    {
      name: 'Actions',
      cell: (row) => {

        return (

          <div>
            < AiIcons.AiFillEdit className='IconCus' onClick={() => handleEdit(row)} />
            <AiIcons.AiTwotoneDelete className='IconCus' onClick={() => handleDelete(row)} />
          </div>

        )

      }

    },
  ];


  return (
    <div>
      <input className='search-box'
        type="text"
        placeholder="Tìm kiếm..."
        readOnly={uninput}
        onChange={handleFilter}
      />
      <button className='button' onClick={() => handleAdd()}><IoIcons.IoMdAddCircle /> <span>Thêm sản phẩm</span> </button>
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