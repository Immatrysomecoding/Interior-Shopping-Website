import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetCategory } from '../../redux/categorySlice';
import { SaveCategory } from '../../redux/categorySlice';
import { AllproductSucces } from '../../redux/productSlice';
import axios from "axios";
import { allProducts } from '../../redux/apiRequest';
import ReactPaginate from "react-paginate";
import * as AiIcons from 'react-icons/ai'
import * as IoIcons from "react-icons/io"
import "./listproduct.css"
const Category = () => {

  const [cate, setCate] = useState([]);

  const [uninput, setUninput] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [pageCount, setPageCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allcategory = useSelector((state) => state.category?.allcategory);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const Product = useSelector((state) => state.product?.allProducts);

  const itemsPerPage = 2;
  const getCurrentPageData = () => {

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return cate.slice(startIndex, endIndex);
  };
  useEffect(() => {

    setCate(allcategory);
    setPageCount(Math.ceil(allcategory.length / itemsPerPage));
    if (!user) {
      navigate("/login");
    }
    setUninput(false);

    if (allcategory.length === 0) {
      setUninput(true);
    }


  }, [allcategory]);
  const deleteCategary = async (dispatch, row) => {

    try {
       await axios.delete("/menu/category/" + row.idCategory)
      const updatedCate = allcategory.filter((category) => category.idCategory !== row.idCategory);
      await dispatch(GetCategory(updatedCate))
      setCate(allcategory);
      await allProducts(dispatch);
    } catch (err) {
      console.log(err);

    }
  };
  const deleteProductCategary = async (dispatch, idcate, idpro) => {
    try {
      await axios.delete("/menu/categoryproduct/" + idpro);

      const updatedCategoryPromises = allcategory.map(async (category) => {
        if (category.idCategory === idcate) {
          const updatedListIdProduct = category.listIdProduct.filter(
            (categoryPro) => categoryPro.idProduct !== idpro
          );
          return { ...category, listIdProduct: updatedListIdProduct };
        }
        return category;
      });

      const updatedCategories = await Promise.all(updatedCategoryPromises);

      const updatedProductPromises = Product.map(async (product) => {
        if (product.idProduct === idpro) {
          return { ...product, category: "Trống" };
        }
        return product;
      });

      const updatedProducts = await Promise.all(updatedProductPromises);

      await dispatch(GetCategory(updatedCategories));
      setCate(updatedCategories);

      await dispatch(AllproductSucces(updatedProducts));
    } catch (err) {
      console.log(err);
    }
  };
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const handleDelete = async (row) => {
    await deleteCategary(dispatch, row);
  };
  const handleDeleteProduct = async (idcate, idpro) => {
    await deleteProductCategary(dispatch, idcate, idpro);
  };
  const handleEdit = (row) => {
    dispatch(SaveCategory(row));
    navigate("/category/update")
  };
  const handleAdd = (row) => {
    navigate("/category/add")
  };




  function handleFilter(event) {
    setCurrentPage(0);
    const newdata = allcategory.filter(row => {
      return row.name.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setCate(newdata)
  }

  const columns = [
    { name: 'Tên danh mục', selector: 'name', width: '300px', },

    {
      name: 'Sản phẩm', width: '500px',
      cell: (row) => (


        <div>
          {row.listIdProduct.map((listIdProduct) => (
            <div key={listIdProduct._id}>
              <div className='proimg'>
                <div className='listproduct'>
                  <div className='productName'>{listIdProduct.name}</div>
                  <div className='productItem'>Số lượng: {listIdProduct.quantity}</div>

                  <div className='productItem'>Giá: {listIdProduct.price}đ </div>
                </div>
                <img src={listIdProduct.image} alt="Product Image" className="carousel-image" />

              </div>
              <AiIcons.AiTwotoneDelete className='IconCus' onClick={() => handleDeleteProduct(row.idCategory, listIdProduct.idProduct)} />
              <hr></hr>
            </div>

          ))}

        </div>

      ),
    },
    {

      name: 'Chỉnh sửa', width: '200px',
      cell: (row) => (
        <div>
          < AiIcons.AiFillEdit className='IconCus' onClick={() => handleEdit(row)} />
          <AiIcons.AiTwotoneDelete className='IconCus' onClick={() => handleDelete(row)} />
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
      <button onClick={() => handleAdd()}><IoIcons.IoMdAddCircle /> <span>Thêm danh mục</span> </button>
      <div className='table' >
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

export default Category;