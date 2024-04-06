import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    //productOrder
    padding: false,
    error: false,
    product: null,
    //All product
    allProducts: null,
    //save Product
    saveProduct: null,
    //add product
    addpanding: false,
    addsuccess: false,
    adderror: false,
    //Theme 
    themecustem: "dark",
  },
  reducers: {

    ThemeSetCus: (state, action) => {
      state.themecustem = action.payload;
    },
    AddProductStart: (state) => {
      state.addpanding = true;
    },
    AddProductSuccess: (state) => {
      state.addpanding = false;
      state.addsuccess = true;
    },
    AddProductFaile: (state) => {
      state.addpanding = false;
      state.addsuccess = false;
      state.adderror = true;
    },
    addProductToState: (state, action) => {
      state.allProducts.push(action.payload);
    },
    saveProduct: (state, action) => {
      state.saveProduct = action.payload;
    },
    AllproductStart: (state) => {
      state.padding = true;
    },
    AllproductSucces: (state, action) => {
      state.padding = false;
      state.error = false;
      state.allProducts = action.payload;
    },
    AllproductFaile: (state) => {
      state.error = true;
    },

    productStart: (state) => {
      state.padding = true;
    },
    productSucces: (state, action) => {
      state.padding = false;
      state.error = false;
      state.product = action.payload;
    },
    productFaile: (state) => {
      state.error = true;
    }
  }



})
export const {
  productStart,
  productSucces,
  productFaile,
  AllproductStart,
  AllproductSucces,
  AllproductFaile,
  saveProduct,
  AddProductStart,
  AddProductSuccess,
  AddProductFaile,
  addProductToState,
  ThemeSetCus
} = productSlice.actions;
export default productSlice.reducer;