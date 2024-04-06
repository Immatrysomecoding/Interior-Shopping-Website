import { createSlice } from "@reduxjs/toolkit";



const categorySlice = createSlice({
  name: "category",
  initialState: {
    //get all category
    allcategory: null,
    //save category
    saveCategory: null,
    //add category
    addpanding: false,
    addsuccess: false,
    adderror: false,
  },
  reducers: {
    AddCategoryStart: (state) => {
      state.addpanding = true;
    },
    AddCategorySuccess: (state) => {
      state.addpanding = false;
      state.addsuccess = true;
    },
    AddCategoryFaile: (state) => {
      state.addpanding = false;
      state.addsuccess = false;
      state.adderror = true;
    },
    addCategoryToState: (state, action) => {
      state.allcategory.push(action.payload);
    },

    SaveCategory: (state, action) => {
      state.saveCategory = action.payload;
    },
    GetCategory: (state, action) => {
      state.allcategory = action.payload;
    },

  }

})

export const {
  GetCategory,
  SaveCategory,
  AddCategoryStart,
  AddCategorySuccess,
  AddCategoryFaile,
  addCategoryToState

} = categorySlice.actions;

export default categorySlice.reducer;
