import { useEffect, useState } from "react";

import { axiosInstance } from "./axiosConfig";

export const userLoggedInUserInfo = () => {
  const [profile, setProfile] = useState([]);
  const token = localStorage.getItem("accessToken");
  const getProfile = async () => {
    try {
      let url = "v1/LHS/staff/getProfile";
      const response = await axiosInstance.get(url);
      if (response.status === 200) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, [token]);

  return { profile };
};
