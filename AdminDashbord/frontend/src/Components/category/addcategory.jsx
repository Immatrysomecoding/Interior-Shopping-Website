import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/authSlice";
import { addCategory } from '../../redux/apiRequest';
import { addCategoryToState } from '../../redux/categorySlice';
import slugify from 'slugify';
const Addcategory = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
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
        const idCategory = slugify(name, { lower: true, strict: true }) + generateRandomNumberString(10);
        const base64Image = event.target.result.split(",")[1];
        const category = {
          name: name,
          image: base64Image,
          listIdProduct: [],
          idCategory: idCategory,
        };
        const category2 = {
          name: name,
          image: `data:image/jpeg;base64,${base64Image}`,
          listIdProduct: [],
          idCategory: idCategory,
        };
        if (user?.accessToken) {
          await addCategory(navigate, category, axiosJWT, user?.accessToken, dispatch);
          await new Promise((resolve) => setTimeout(resolve, 0));
          await dispatch(addCategoryToState(category2))


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
  return (
    <div className="main">
      <p className="sign" align="center">
        Thêm danh mục
      </p>
      <section >
        <form className="form1" onSubmit={handleAdd}>
          <input
            className="username"
            type="text"
            placeholder="Tên danh mục"
            onChange={(e) => setName(e.target.value)}

          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imageURL && <img src={imageURL} alt="Selected" className="image-preview" />}



          <button className="submit" align="center" type="submit" > Cập nhật </button>
          <br></br>

        </form>



      </section>
    </div>
  );
}

export default Addcategory;