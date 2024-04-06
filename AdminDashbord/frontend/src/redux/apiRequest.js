import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logOutFailed,
  logOutStart,
  logOutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,


} from "./authSlice";
import {
  getUsersFailed,
  getUsersStart,
  getUsersSuccess,
  changepassStart,
  changepassSuccess,
  changepassFailed,
  notificationStart,
  notificationSuccess,
  notificationFailed,
  allAcc,


} from "./userSlice";
import {
  productStart,
  productSucces,
  productFaile,
  AllproductStart,
  AllproductSucces,
  AllproductFaile,
  AddProductStart,
  AddProductSuccess,
  AddProductFaile,
} from "./productSlice"

import {
  GetCategory,
  AddCategoryStart,
  AddCategorySuccess,
  AddCategoryFaile,
} from "./categorySlice"

import {
  getRevenueStart,
  getRevenueSucces,
  getRevenueError,
  getChart,
} from "./revenueSlice"


export const GetChart = async (dispatch) => {
  try {
    const res = await axios.get("/home/chart")
    dispatch(getChart(res.data))
  } catch (err) {
    console.log(err)
  }
}

export const getRevenue = async (dispatch) => {
  dispatch(getRevenueStart());
  try {
    const res = await axios.get("/home/revenue")
    dispatch(getRevenueSucces(res.data))
  } catch (err) {
    dispatch(getRevenueError());
  }
}

export const addCategory = async (navigate, category, axiosJWT, accessToken, dispatch) => {
  dispatch(AddCategoryStart());
  try {
    await axiosJWT.post("/menu/addcategory", category, {
      headers: { token: `Bearer ${accessToken}` },

    });
    dispatch(AddCategorySuccess())
    navigate("/category")

  } catch (err) {
    dispatch(AddCategoryFaile())
    console.log(err)
  }
}
export const updateCategory = async (navigate, category, axiosJWT, accessToken) => {
  try {
   await axiosJWT.post("/menu/updatecategory", category, {
      headers: { token: `Bearer ${accessToken}` },

    });

    navigate("/category")

  } catch (err) {
    throw err;
  }
}
export const getAllCategory = async (dispatch) => {
  try {
    const res = await axios.get("/menu/allcategory")
    await res.data.map((item) => (
      item.image = `data:image/jpeg;base64,${item.image}`
    ))
    dispatch(GetCategory(res.data));

  } catch (err) {
    console.log(err);
  }
}

export const allProducts = async (dispatch) => {
  dispatch(AllproductStart());
  try {
    const res = await axios.get("/menu/allproduct")

    dispatch(AllproductSucces(res.data));
  } catch (err) {
    dispatch(AllproductFaile());
  }
}
export const addProduct = async (navigate, product, axiosJWT, accessToken, dispatch) => {
  dispatch(AddProductStart());
  try {
    await axiosJWT.post("/menu/addproduct", product, {
      headers: { token: `Bearer ${accessToken}` },

    });
    dispatch(AddProductSuccess())
    navigate("/product")
  } catch (err) {
    dispatch(AddProductFaile())
    console.log(err)
  }
}
export const allProductsOrder = async (dispatch) => {
  dispatch(productStart());
  try {
    const res = await axios.get("/menu/productOrder")
    dispatch(productSucces(res.data));
  } catch (err) {
    dispatch(productFaile());
  }
}

export const AllAccount = async (dispatch) => {
  try {
    const res = await axios.get("/v1/user/account")
    dispatch(allAcc(res.data));
  }
  catch (err) {
    console.log(err)
  }
}
export const accUp = async (info, navigate, dispatch) => {
  try {
    await axios.post("/v1/user/account/update", info)
    await AllAccount(dispatch);
    navigate("/account");

  } catch (err) {
    console.log(err)
  }
}
export const Notification = async (dispatch) => {
  dispatch(notificationStart());
  try {
    const res = await axios.get("/navbar/notification");
    dispatch(notificationSuccess(res.data));
  } catch (err) {
    dispatch(notificationFailed());
  }
};
export const changepass = async (accessToken, user, dispatch, axiosJWT, navigate) => {
  dispatch(changepassStart());
  try {

   await axiosJWT.post("/v1/user/UpdatePassword", user, {
      headers: { token: `Bearer ${accessToken}` },

    });
    navigate("/updateinfo")
    dispatch(changepassSuccess());


  } catch (err) {
    dispatch(changepassFailed());

  }
};
export const UpdataEmail = async (accessToken, user, dispatch, axiosJWT) => {

  try {

    const res = await axiosJWT.post("/v1/user/UpdateEmail", user, {
      headers: { token: `Bearer ${accessToken}` },

    });
    dispatch(loginSuccess(res.data));

  } catch (err) {


  }
};

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("/v1/auth/login", user);
    await dispatch(loginSuccess(res.data));
    navigate("/");
  } catch (err) {
    dispatch(loginFailed(err.response.data));
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post("/v1/auth/register", user);
    dispatch(registerSuccess());
    navigate("/");
  } catch (err) {
    dispatch(registerFailed());
  }
};

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getUsersStart());
  try {
    const res = await axiosJWT.get("/v1/user", {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    dispatch(getUsersFailed());
  }
};




export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
  dispatch(logOutStart());
  try {
    await axios.post("/v1/auth/logout")
    dispatch(logOutSuccess());
    navigate("/login");

  } catch (err) {

    dispatch(logOutFailed());
  }
};
