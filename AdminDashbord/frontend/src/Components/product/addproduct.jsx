import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/authSlice";
import { addProduct } from '../../redux/apiRequest';
import { addProductToState } from '../../redux/productSlice';
import Form from 'react-bootstrap/Form';
import * as MdIcons from "react-icons/md"
import { QrReader } from 'react-qr-reader';
import slugify from 'slugify';
const AddProduct = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const allcategory = useSelector((state) => state.category?.allcategory);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [pricesale, setPriceSale] = useState(0);
  const [imageURL, setImageURL] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openqr, setOpenQr] = useState(false)
  function generateRandomNumberString(length) {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
  const handleAdd = (e) => {
    e.preventDefault();
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = async function (event) {
        const idProduct = slugify(name, { lower: true, strict: true }) + generateRandomNumberString(10);
        const base64Image = event.target.result;
        if (pricesale === 0) {
          setPriceSale(null);
        }
        const product = {
          name: name,
          image: base64Image,
          details: details,
          quantity: quantity,
          price: price,
          pricesale: pricesale || null,
          listImgExtra: selectedImages,
          category: selectedCategory,
          idProduct: idProduct,
        };
        if (user?.accessToken) {

          await addProduct(navigate, product, axiosJWT, user?.accessToken, dispatch);
          await new Promise((resolve) => setTimeout(resolve, 0));
          await dispatch(addProductToState(product));

        }
      };
      reader.readAsDataURL(selectedImage);
    }
  };
  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    const imageURL = URL.createObjectURL(selectedImage);
    setSelectedImage(selectedImage);
    setImageURL(imageURL);
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
  const handleScanQRCode = async (data) => {
    if (user?.accessToken) {
      await addProduct(navigate, data, axiosJWT, user?.accessToken, dispatch);
    };
  }
  const handleOpen = () => {
    setOpenQr(true)
  }
  return (
    <div>
      {openqr && (
        <QrReader
          delay={300}
          onError={(error) => console.log(error)}
          onScan={handleScanQRCode}
          style={{ width: "100%" }}
        />
      )}
      <p className="sign" align="center">
        Thêm sản phẩm
      </p>
      <section >
        <form className="form1" onSubmit={handleAdd}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control type="text" placeholder="Tên sản phẩm" onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control as="textarea" rows={3} placeholder="Mô tả sản phẩm" onChange={(e) => setDetails(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control type="number" placeholder="Số lượng" onChange={(e) => setQuantity(parseInt(e.target.value, 10))} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control type="number" placeholder="Giá sản phẩm" onChange={(e) => setPrice(parseInt(e.target.value, 10))} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control type="number" placeholder="Giá khuyến mãi" onChange={(e) => setPriceSale(parseInt(e.target.value, 10))} />
          </Form.Group>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <br></br>
          {imageURL && <img src={imageURL} alt="Selected" className="image-preview" />}
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
            <option>Chọn danh mục</option>
            {allcategory.map((item) => (
              <option key={item._id} value={item.name}>{item.name}</option>
            ))}
          </Form.Select>

          <button className="submit" align="center" type="submit" > Cập nhật </button>
          <button onClick={() => handleOpen()} >Quét bằng mã QR</button>
        </form>


      </section>
    </div>
  );
}

export default AddProduct;


