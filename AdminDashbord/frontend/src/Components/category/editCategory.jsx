import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/authSlice";
import { updateCategory } from '../../redux/apiRequest';
import { GetCategory } from '../../redux/categorySlice';

const AddCategory = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const SaveCategory = useSelector((state) => state.category?.saveCategory);
  const allcategory = useSelector((state) => state.category?.allcategory);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [name, setName] = useState(SaveCategory.name);
  const [imageURL, setImageURL] = useState(SaveCategory.image);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleUpdateCategory = async (category, selectedImage) => {
    if (user?.accessToken) {
      try {
        await updateCategory(navigate, category, axiosJWT, user?.accessToken);

        if (selectedImage) {
          const base64Image = `data:image/jpeg;base64,${category.image}`;

          const updatedCategory = { ...category, image: base64Image };
          const updatedAllCategory = allcategory.map((item) =>
            item._id === category.id ? updatedCategory : item
          );

          dispatch(GetCategory(updatedAllCategory));
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      const parts = SaveCategory.image.split(",");
      const base64Data = parts[1];
      const category = {
        idCategory: SaveCategory.idCategory,
        name: name,
        image: base64Data,
        listIdProduct: SaveCategory.listIdProduct,
      };
      await handleUpdateCategory(category, selectedImage);
    }

    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = async function (event) {
        const base64Image = event.target.result.split(",")[1];
        const category = {
          idCategory: SaveCategory.idCategory,
          name: name,
          image: base64Image,
          listIdProduct: SaveCategory.listIdProduct,
        };
        await handleUpdateCategory(category, selectedImage);
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
        Cập nhật thông tin danh mục
      </p>
      <section >
        <form className="form1" onSubmit={handleAdd}>
          <input
            className="username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}

          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imageURL && <img src={imageURL} alt="Selected" />}



          <button className="submit" align="center" type="submit" > Cập nhật </button>
          <br></br>

        </form>



      </section>
    </div>
  );
};

export default AddCategory;
