import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import { createAxios } from "../../createInstance";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { changepass } from "../../redux/apiRequest";
import * as Yup from "yup";
const ChangePass = () => {

  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);



  const formik = useFormik({
    initialValues: {
      newpassword: "",
      password: "",
      confirmedPassword: "",
    },
    validationSchema: Yup.object({
      newpassword: Yup.string()
        .required("Không được để trống"),



      password: Yup.string()
        .required("Không được để trống"),

      confirmedPassword: Yup.string()
        .required("Không được để trống")
        .oneOf([Yup.ref("newpassword"), null], "Mật khẩu không khớp"),

    }),
    onSubmit: (values) => {
      const newUser = {
        username: user?.username,
        password: values.password,
        newpassword: values.newpassword,
      };
      changepass(user?.accessToken, newUser, dispatch, axiosJWT, navigate)

    },
  });
  return (
    <div className="mainCPass">
      <p className="sign" align="center">
        Đổi mật khẩu
      </p>
      <section>
        <form className="form1" onSubmit={formik.handleSubmit}>


          <input
            className="password"
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder="Nhập mật khẩu"
          />
          {formik.errors.password && (
            <p className="errorMsgOld"> {formik.errors.password} </p>
          )}
          <p></p>
          <input
            className="password"
            type="password"
            id="newpassword"
            name="newpassword"
            value={formik.values.newpassword}
            onChange={formik.handleChange}
            placeholder="Mật khẩu mới"
          />
          {formik.errors.newpassword && (
            <div className="errorMsgNew"> {formik.errors.newpassword} </div>
          )}
          <p></p>

          <input
            className="password"
            type="password"
            id="confirmedPassword"
            name="confirmedPassword"
            value={formik.values.confirmedPassword}
            onChange={formik.handleChange}
            placeholder="Xác nhận lại mật khẩu mới"
          />
          {formik.errors.confirmedPassword && (
            <div className="errorMsgConfi"> {formik.errors.confirmedPassword}</div>
          )}

          <p></p>
          <button className="submit" align="center" type="submit"> Cập nhật </button>
        </form>
      </section>
    </div>
  );
}

export default ChangePass;

