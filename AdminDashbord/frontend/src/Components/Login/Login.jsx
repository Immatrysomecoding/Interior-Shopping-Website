import {  useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useFormik } from "formik";
import { AllAccount } from "../../redux/apiRequest";
import { allProductsOrder } from "../../redux/apiRequest";
import { Notification } from "../../redux/apiRequest";
import { allProducts } from "../../redux/apiRequest";
import { getAllCategory } from "../../redux/apiRequest";
import { getRevenue } from "../../redux/apiRequest";
import { GetChart } from "../../redux/apiRequest";
import * as Yup from "yup";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginError = useSelector((state) => state.auth.login.error);
 

  useEffect(() => {
    GetChart(dispatch);
    getRevenue(dispatch);
    Notification(dispatch);
    allProductsOrder(dispatch);
    AllAccount(dispatch);
    allProducts(dispatch);
    getAllCategory(dispatch);
  }, [])
  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Required"),


      password: Yup.string()
        .required("Required"),


    }),

    onSubmit: (values) => {

      const newUser = {
        password: values.password,
        username: values.name

      };

      loginUser(newUser, dispatch, navigate);
      console.log(loginError);
      { loginError && (window.alert("Incorrect username or Incorrect password")) }
    },
  });


  return (
    <div className="main">
      <p className="sign" align="center">
        Đăng nhập
      </p>
      <section>
        <form className="form1" onSubmit={formik.handleSubmit}>
          <input
            className="username"
            type="text"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            placeholder="Enter your name"
          />
          {formik.errors.name && (
            <p className="errorMsglogin1"> {formik.errors.name} </p>
          )}
          <br></br>
          <input
            className="password"
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder="Enter your password"
          />
          {formik.errors.password && (
            <p className="errorMsglogin2"> {formik.errors.password} </p>
          )}

          <button className="submit" align="center" type="submit"> Continue </button>
        </form>
      </section>
    </div>

  );
};

export default Login;






