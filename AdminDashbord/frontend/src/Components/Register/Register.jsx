import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/apiRequest";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

const Register = () => {


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.login?.currentUser);
  useEffect(() => {
    if (!user) {

    }
  }, []);
  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      password: "",
      confirmedPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Required")
        .min(4, "Must be 4 characters or more"),
      email: Yup.string()
        .required("Required")
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          "Please enter a valid email address"
        ),
      password: Yup.string()
        .required("Required"),

      confirmedPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), null], "Password must match"),

    }),
    onSubmit: (values) => {
      window.alert("Form submitted");
      const newUser = {
        email: values.email,
        password: values.password,
        username: values.name
      };
      registerUser(newUser, dispatch, navigate);
    },
  });


  return (

    <div className="mainRe">
      <p className="sign" align="center">
        Tạo tài khoản     </p>
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
            <p className="errorMsg1"> {formik.errors.name} </p>
          )}
          <p></p>
          <input
            className="username"
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="Enter your email"
          />
          {formik.errors.email && (
            <p className="errorMsg2"> {formik.errors.email} </p>
          )}
          <p></p>
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
            <p className="errorMsg3"> {formik.errors.password} </p>
          )}
          <p></p>
          <input
            className="password"
            type="password"
            id="confirmedPassword"
            name="confirmedPassword"
            value={formik.values.confirmedPassword}
            onChange={formik.handleChange}
            placeholder="Confirm your password"
          />
          {formik.errors.confirmedPassword && (
            <p className="errorMsg4"> {formik.errors.confirmedPassword} </p>
          )}
          <p></p>
          <button className="submit" align="center" type="submit"> Continue </button>
        </form>
      </section>
    </div>
  );
};

export default Register;



