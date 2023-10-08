import React, { useEffect, useRef } from "react";
import notification from "../assets/images/notifications.png";
import blueNotification from "../assets/images/blueNotification.svg";
import drop_down from "../assets/images/dropDown.svg";
import logo from "../assets/images/Logo.png";
import { useHistory } from "react-router-dom";
import { userLoggedInUserInfo } from "../../config/userLoggedInUserInfo";
import { useState } from "react";
import "./global.css";

const LandingHeader = () => {
  const { profile } = userLoggedInUserInfo();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    <img src={notification} className="h-5 w-5 mr-5" />
  );
  const navIcon = history.location.pathname;

  const dropdownRef = useRef(null);
  const openRightMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeRightMenu = () => {
    setIsOpen(false);
  };
  const navTo = () => {};
  const token = localStorage.getItem("accessToken");
  const handleClick = () => {
    history.push("/notification");
    setImageSrc(<img src={blueNotification} className="h-5 w-5 mr-5" />);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        closeRightMenu();
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, closeRightMenu]);

  return (
    <div className="">
      <div
        className="flex items-center h-20 container"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div className=" w-52" onClick={() => navTo("")}>
          <img alt="img" src={logo} />
        </div>
        <div
          className="items-center justify-end w-full mdx:flex hidden"
          // style={{ width: "460px" }}
        >
          <div className=" flex items-center px-3">ABOUT US</div>

          <div
            className=" flex items-center px-3"
            onClick={() => {
              history.push("/signup");
            }}
          >
            SIGN UP
          </div>

          <div
            className=" flex items-center px-3"
            onClick={() => {
              history.push("/login");
              localStorage.removeItem("accessToken");
            }}
          >
            LOGIN
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHeader;
