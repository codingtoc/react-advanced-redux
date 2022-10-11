import { createAsyncThunk } from "@reduxjs/toolkit";

import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";

export const fetchCartData = createAsyncThunk(
  "cartSlice/fetchCartData",
  async (_, thunkAPI) => {
    const fetchData = async () => {
      const response = await fetch(
        "https://react-http-ab4ba-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json"
      );

      if (!response.ok) {
        throw new Error("Could not fetch cart data!");
      }

      const data = await response.json();

      return data;
    };

    try {
      const cartData = await fetchData();
      if (cartData) {
        thunkAPI.dispatch(cartActions.replaceCart(cartData));
      } else {
        thunkAPI.dispatch(
          cartActions.replaceCart({
            items: [],
            totalQuantity: 0,
          })
        );
      }
    } catch (error) {
      thunkAPI.dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Fetching cart data failed!",
        })
      );
    }
  }
);

export const sendCartData = createAsyncThunk(
  "cartSlice/sendCartData",
  async (cart, thunkAPI) => {
    thunkAPI.dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data!",
      })
    );

    const sendRequest = async () => {
      const response = await fetch(
        "https://react-http-ab4ba-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json",
        {
          method: "PUT",
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Sending cart data failed.");
      }
    };

    try {
      await sendRequest();

      thunkAPI.dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Sent cart data successfully!",
        })
      );
    } catch (error) {
      thunkAPI.dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sent cart data failed!",
        })
      );
    }
  }
);
