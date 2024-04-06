import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import { createAxios } from "../../createInstance";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UpdataEmail } from "../../redux/apiRequest";
import { Link } from "react-router-dom";
const UpdateInfo = () => {

  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [email, setEmail] = useState("");


  const handleUpdate = (e) => {
    e.preventDefault();
    const info = {
      username: user?.username,
      email: email,
    };

    if (user?.accessToken) {
      UpdataEmail(user?.accessToken, info, dispatch, axiosJWT, navigate)
    }

  }
  return (
    <div className="main">
      <p className="sign" align="center">
        Cập nhật thông tin Admin
      </p>
      <section >
        <form className="form1" onSubmit={handleUpdate}>
          <input
            className="username"
            disabled="true"
            type="text"
            value={user?.username}

          />
          <input
            className="username"
            type="text"
            placeholder={user?.email}
            onChange={(e) => setEmail(e.target.value)}
          />



          <button className="submit" align="center" type="submit" > Cập nhật </button>
          <br></br>
          <Link className="changepass" to="/updateinfo/changepass" >Đổi mật khẩu</Link>
        </form>



      </section>
    </div>
  );
}

export default UpdateInfo;


