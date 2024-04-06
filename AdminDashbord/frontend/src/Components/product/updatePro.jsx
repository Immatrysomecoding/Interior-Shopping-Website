import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { AllproductSucces } from '../../redux/productSlice';
import Form from 'react-bootstrap/Form';
import * as MdIcons from "react-icons/md"
import axios from "axios";
const UpdateAcc = () => {
  const saveProduct = useSelector((state) => state.product?.saveProduct);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Product = useSelector((state) => state.product?.allProducts);
  const allcategory = useSelector((state) => state.category?.allcategory);
  const [selectedImages, setSelectedImages] = useState(saveProduct.listImgExtra);
  const [name, setName] = useState(saveProduct.name);
  const [details, setDetails] = useState(saveProduct.details);
  const [selectedCategory, setSelectedCategory] = useState(saveProduct.category);
  const [price, setPrice] = useState(saveProduct.price);
  const [pricesale, setPriceSale] = useState(saveProduct.pricesale)
  const [quantity, setQuantity] = useState(saveProduct.quantity);
  const [image, setimage] = useState(saveProduct.image);
  const [idProduct, setIdProduct] = useState(saveProduct.idProduct)

  const UpdateProduct = async (info, navigate, dispatch) => {
    try {
     await axios.post("/menu/product/update", info)
      const updatedProducts = Product.map(item => {
        if (item.idProduct === info.idProduct) {
          return {
            ...item,
            details: details,
            category: selectedCategory,
            name: name,
            price: price,
            quantity: quantity,
            image: image,
            listImgExtra: selectedImages,
            pricesale: pricesale || null,
          };
        }
        return item;
      });
      dispatch(AllproductSucces(updatedProducts));

      navigate("/product")
    } catch (err) {
      console.log(err)
    }
  }
  const handleEdit = (e) => {
    e.preventDefault();
    const info = {
      idProduct: saveProduct.idProduct,
      details: details,
      category: selectedCategory,
      name: name,
      price: price,
      quantity: quantity,
      image: image,
      listImgExtra: selectedImages,
      pricesale: pricesale || null,
    };
    console.log(saveProduct)
    UpdateProduct(info, navigate, dispatch);
  }


  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setimage(selectedImage);

  };
  const handleListImageChange = async (event) => {
    const selectedImages = Array.from(event.target.files);
    const base64Images = await Promise.all(selectedImages.map(convertToBase64));
    setSelectedImages(base64Images);
  };
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const handleRemoveImage = (index) => {
    const updatedSelectedImages = [...selectedImages];
    updatedSelectedImages.splice(index, 1);
    setSelectedImages(updatedSelectedImages);
  };
  return (
    <section className="register-container">
      <div className="register-title"> Cập nhật thông tin sản phẩm </div>
      <form className="form1" onSubmit={handleEdit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control type="text" value={idProduct} onChange={(e) => setIdProduct(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Control as="textarea" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value, 10))} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control type="number" value={pricesale} onChange={(e) => setPriceSale(parseInt(e.target.value, 10))} />
        </Form.Group>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <br></br>
        {image && <img src={image} alt="Selected" className="image-preview" />}
        <br></br>
        <input type="file" accept="image/*" multiple onChange={handleListImageChange} />
        <div className="image-preview-container">
          {selectedImages.map((image, index) => (
            <div key={index} >
              <img src={image} alt={`Selected ${index}`} className="image-preview" />
              <MdIcons.MdCancel className='IconCus' onClick={() => handleRemoveImage(index)} />
            </div>
          ))}
        </div>
        <br />
        <Form.Select aria-label="Default select example" onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value={selectedCategory}>{selectedCategory}</option>
          {allcategory.map((item) => (
            item.name === selectedCategory ? null : (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            )
          ))}
        </Form.Select>

        <button className="submit" align="center" type="submit" > Cập nhật </button>

      </form>



    </section>
  );

}

export default UpdateAcc;