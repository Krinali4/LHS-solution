import React, { useEffect, useRef } from "react";
import home from "../assets/images/home.png";
import post from "../assets/images/post.png";
import StaffHiring from "../assets/images/staffHiring.png";
import msg from "../assets/images/msg.png";
import manage from "../assets/images/manage.png";
import administration from "../assets/images/administration.png";
import user from "../assets/images/user.png";
import search from "../assets/images/search.png";
import settings from "../assets/images/settings.png";
import searchIcon from "../assets/images/searchIcon.png";
import notification from "../assets/images/notifications.png";
import blueNotification from "../assets/images/blueNotification.svg";
import drop_down from "../assets/images/dropDown.svg";
import logo from "../assets/images/Logo.png";
import { useHistory } from "react-router-dom";
import { userLoggedInUserInfo } from "../../config/userLoggedInUserInfo";
import { useState } from "react";
import "./global.css";
import { removeSession } from "../../action";
import { axiosInstance } from "../../config/axiosConfig";

const Nav = () => {
  const { profile } = userLoggedInUserInfo();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [imageSrc, setImageSrc] = useState(
    false
    // <img src={notification} className="h-6 w-8" />
  );

  const dropdownRef = useRef(null);
  const openRightMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeRightMenu = () => {
    setIsOpen(false);
  };
  const openIsModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setText("");
    setError(false);
  };
  const navTo = () => {};
  const token = localStorage.getItem("accessToken");
  const navType = localStorage.getItem("type");
  const [showNotificationCount, setShowNotificationCount] = useState(true);
  // const handleClick = () => {
  //   // history.push("/notification");
  //   // setShowNotificationCount(false);
  //   // setNotificationIcon((prevIcon) => !prevIcon);
  //   if (location.pathname !== "/notification") {
  //     setShowNotificationCount((prevIcon) => !prevIcon);
  //   }

  //   history.push("/notification");
  //   // setShowNotificationCount(false);
  // };
  const [notificationClicked, setNotificationClicked] = useState(false);
  const handleClick = () => {
    if (location.pathname === "/notification") {
      // If the current path is "/notification", we don't want to toggle the count.
      return;
    }

    setShowNotificationCount((prevIcon) => !prevIcon);
    setNotificationClicked(true); // Set the notification as clicked
    history.push("/notification");
  };

  const pathNameRout = history?.location?.pathname;
  const [notifications, setNotifications] = useState([]);

  const GetNotification = async () => {
    try {
      let url = `v2/LHS/User/getNotification?page=1&limit=10`;
      const response = await axiosInstance.get(url);
      if (response.data) {
        if (response?.data?.data) {
          setNotifications(response?.data?.data.notifications);
        } else {
          setNotifications([]);
        }
        showSuccessToast("notification successfully!");
      }
    } catch (error) {
      console.error("Error fetching interest jobs:", error);
    }
  };
  useEffect(() => {
    GetNotification();
  }, []);

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
      {token && (
        <div
          className="flex items-center h-20 container 2xl:px-[10px]  xl:px-12  lg:px-8 px-8 "
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <div className="w-56 sm:w-60 lg:w-52 " onClick={() => navTo("")}>
            <img alt="img" src={logo} />
          </div>
          <div
            className="items-center justify-center w-auto  mdx:flex hidden"
            // style={{ width: "460px" }}
          >
            {token && (
              <div
                className=" flex items-center px-3"
                onClick={() => {
                  history.push("/staff");
                }}
              >
                <img src={home} className=" h-4 w-4 mr-2" />
                Home
              </div>
            )}
            {navType === "staff" && token && (
              <div className=" flex items-center px-3">
                <img src={search} className=" h-4 w-4 mr-2" />
                Jobs
              </div>
            )}
            {navType === "hospital" && token && (
              <div className=" flex items-center px-3">
                <img src={StaffHiring} className=" h-5 w-5 mr-2" />
                Staff Hiring
              </div>
            )}
            {navType === "superAdmin" && token && (
              <div className=" flex items-center px-3">
                <img src={administration} className=" h-5 w-5 mr-2" />
                Manage Administrator
              </div>
            )}

            {navType === "superAdmin"
              ? token && (
                  <div className=" flex items-center px-3">
                    <img src={manage} className=" h-5 w-5 mr-2" />
                    Manage Hospital
                  </div>
                )
              : token && (
                  <div className=" flex items-center px-3">
                    <img src={msg} className=" h-4 w-4 mr-2" />
                    Messaging
                  </div>
                )}
            {token && (
              <div className=" flex items-center px-3" onClick={openRightMenu}>
                <img src={settings} className=" h-4 w-4 mr-2" />
                Settings
              </div>
            )}
          </div>
          {token && (
            <div className="flex items-center sm:gap-3 gap-[3px]">
              <a onClick={() => handleClick()}>
                <div className="flex items-center w-7 relative">
                  {showNotificationCount ? (
                    <img
                      src={
                        notificationClicked ? blueNotification : notification
                      }
                      className="h-6 w-8"
                    />
                  ) : null}
                  {notifications?.length === 0 ||
                  pathNameRout === "/notification" ? (
                    ""
                  ) : showNotificationCount ? (
                    <span className="inline-block p-[2.4px] text-[9px] font-semibold rounded-full bg-red-500 text-white absolute -top-[5px] -right-[2px]">
                      {notifications?.length}
                    </span>
                  ) : null}
                </div>
              </a>
              <div></div>
              <div className="flex items-center gap-1" onClick={openRightMenu}>
                <img
                  src={profile?.image ? profile?.image : user}
                  className=" h-10 w-10  rounded-full mr-2"
                />
                {/* <button className="w3-button w3-xxlarge w3-right tablet_btn mt-2"> */}
                <img src={drop_down} className=" h-[10px] w-[10px] " />
                {/* </button> */}
              </div>
              {isOpen && token && (
                <div className="dropdown-container" ref={dropdownRef}>
                  <div className="dropdown-card">
                    <button
                      onClick={closeRightMenu}
                      className="header-close-btn"
                      style={{ textAlign: "right", marginTop: "5px" }}
                    >
                      {"X"}
                    </button>
                    {/* <a onClick={() => history.push("/staff")}>Staff</a> */}
                    {/* <a onClick={() => history.push("/hospital")}>Hospital</a> */}
                    <a
                      onClick={() => history.push("")}
                      className="dropdown-option"
                    >
                      Home
                    </a>
                    <a
                      onClick={() => history.push("")}
                      className="dropdown-option"
                    >
                      Staff Hiring
                    </a>
                    <a
                      onClick={() => history.push("")}
                      className="dropdown-option"
                    >
                      post
                    </a>
                    <a
                      onClick={() => history.push("")}
                      className="dropdown-option"
                    >
                      Messaging
                    </a>
                    <a
                      onClick={() => history.push("")}
                      className="dropdown-option"
                    >
                      Settings
                    </a>

                    <a onClick={() => history.push("/myprofile")}>
                      My Profile
                    </a>
                    {navType === "staff" && (
                      <>
                        <a onClick={() => history.push("/")}>Dashboard</a>
                        <a onClick={() => history.push("/myJob")}>My Job</a>
                        <a onClick={() => history.push("/staff-ContactInfo")}>
                          Contact information
                        </a>
                        <a onClick={() => history.push("/staff-Resume")}>Resume</a>
                        <a onClick={() => history.push("/staffAccount-Information")}>
                          Account Information
                        </a>
                      </>
                    )}
                    <a onClick={() => history.push("/change-password")}>
                      Change Password
                    </a>
                    {navType === "superAdmin" && (
                      <>
                        <a onClick={() => history.push("/")}>Dashboard</a>
                        <a onClick={() => history.push("/")}>Manage Staff</a>
                      </>
                    )}
                    {/* <a onClick={() => history.push("")}>Messaging</a> */}
                    <a
                      // onClick={() => {
                      //   history.push("/login");
                      //   localStorage.removeItem("accessToken");
                      //   removeSession()
                      // }}
                      onClick={openIsModal}
                    >
                      Logout
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          isOpen={modalOpen}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white z-10 w-full h-full max-w-[500px] max-h-[250px] rounded-lg">
            <div className="p-8">
              <h1 className="font-medium text-xl text-center mb-5">Logout </h1>
              <p className="text-center w-[26rem] m-auto mb-5">
                Are you sure you want to Logout?
              </p>

              <div className="text-center">
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-base border-2 border-[#333] rounded-full w-32 h-11 ml-5"
                >
                  Cancel
                </button>
                <button
                  className="text-base border-2 border-[#009CDE] bg-[#009CDE] rounded-full text-white w-32 h-11 ml-5"
                  onClick={() => {
                    history.push("/login");
                    localStorage.removeItem("accessToken");
                    removeSession();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        // </Modal>
      )}
    </div>
  );
};

export default Nav;
