import React, { useEffect, useState } from "react";
import { userLoggedInUserInfo } from "../../../config/userLoggedInUserInfo";
import topImg from "../../assets/images/topImg.png";
import user from "../../assets/images/user.png";
import Nav from "../Nav";
import { axiosInstance } from "../../../config/axiosConfig";
import moment from "moment";
import { format } from "date-fns";

const Notification = () => {
  const jobData = [
    {
      id: "0",
      Value: "Primary Care Doctor",
    },
    {
      id: "1",
      value: "Urgent Care",
    },
    {
      id: "2",
      value: "Dermatologist",
    },
    {
      id: "3",
      value: " OB-GYN",
    },
    {
      id: "4",
      value: "Dentist",
    },
    {
      id: "5",
      value: "Psychiatrist",
    },
    {
      id: "6",
      value: "Ear, Nose & Throat Doctor",
    },
    {
      id: "7",
      value: "Gastroenterologist",
    },
    {
      id: "8",
      value: "Therapist Counselor",
    },
    {
      id: "9",
      value: " Physical Therapist",
    },
  ];

  const [viewAll, setViewAll] = useState(false);
  const currentJobData = viewAll ? jobData : jobData.slice(0, 5);
  const { profile } = userLoggedInUserInfo();
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

  function calculateTime(time) {
    const x = new Date();
    const y = new Date(time);

    function compare(x, y) {
      return Math.abs(x - y);
    }

    const diff = compare(x, y);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    const yesterday = new Date(x.getFullYear(), x.getMonth(), x.getDate() - 1);
    const toDate = new Date(y.getFullYear(), y.getMonth(), y.getDate());

    let hoursMins = "";
    let result = "";

    if (toDate.getTime() === yesterday.getTime()) {
      result = "1d";
      return result;
    } else {
      hoursMins = format(y, "h:mm a");

      if (days > 365) {
        result = `${Math.floor(days / 365)}Y`;
      } else if (days > 30) {
        result = `${Math.floor(days / 30)}m`;
      } else if (days > 7) {
        result = `${Math.floor(days / 7)}w`;
      } else if (days >= 1) {
        result = `${days}d`;
      } else if (hours > 1) {
        result = hoursMins;
      } else if (minutes > 1) {
        result = hoursMins;
      } else {
        result = hoursMins;
      }

      return result;
    }
  }

  return (
    <>
      {userLoggedInUserInfo ? <Nav /> : ""}
      <div
        className="flex justify-center items-center"
        style={{ backgroundColor: "#F3F2EF" }}
      >
        <div className="container 2xl:px-2 xl:px-12 lg:px-8">
          <div className="lg:flex justify-between gap-4 block align-top py-10 sm:px-0 md:!px-0 lg:px-0 xl:px-0 2xl:px-0 px-3">
            <div className="md:!px-[16px] lg:!px-0">
              <div
                className="border border-gray-100 align-top bg-white m-auto 2xl:w-[346px] h-auto lg:w-[280px]"
                style={{
                  // height: "353px",
                  // width: "345px",
                  borderRadius: "10px",
                }}
              >
                <div>
                  <img
                    src={topImg}
                    // style={{
                    //     height: "100px",
                    //     width: "345px",
                    // }}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex justify-center">
                  <img
                    src={profile?.image ? profile?.image : user}
                    style={{
                      height: "80px",
                      width: "80px",
                      borderRadius: "40px",
                      marginTop: "-35px",
                    }}
                  />
                </div>
                <h1 className="font-normal  text-center mt-4">
                  Welcome, {profile?.name}
                </h1>
                <h1 className="font-normal  text-center mt-4">
                  {profile?.jobTitle}
                </h1>
                <div
                  className="flex justify-center  mt-4 mb-4 px-5  "
                  style={{
                    height: "1px",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  }}
                />
                <h1 className="font-normal  text-center pb-4">
                  214 N Central Ave, Glendale <br />
                  CA 91203{" "}
                </h1>
              </div>
              <div
                className="border border-gray-100 !my-10 align-top bg-white m-auto 2xl:w-[346px] h-auto lg:w-[280px]"
                style={{
                  // height: "353px",
                  // width: "345px",
                  borderRadius: "10px",
                }}
              >
                <div className="mt-4 ">
                  <h1 className="font-normal text-center mt-2">Recent</h1>
                </div>
                <div
                  className="flex justify-center  mt-4 mb-4 px-5 "
                  style={{
                    height: "1px",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  }}
                />
                <div className="px-4 font-normal text-center pb-4">
                  <h1>
                    Education and training requirements for <br />
                    primary care providers <br />
                    <br />
                    Medical conditions treated at urgent
                    <br /> care centers
                    <br />
                    <br /> Subspecialties in Otolaryngology-Head <br />
                    and Neck Surgery
                    <br />
                    <br />
                    Difference between a podiatrist and an <br />
                    orthopedist <br />
                    <br />
                    Statistics on kidney stones in the US and
                    <br /> worldwide
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:!px-[16px] lg:!px-0">
              {notifications.length === 0 ? (
                <div className="flex justify-center items-center p-3 rounded-[10px] h-full 2xl:w-[760px] lg:w-[666px] sm:w-full font-semibold text-[24px]">
                  <h2>No data found</h2>
                </div>
              ) : (
                notifications?.map((item, index) => {
                  const formattedTime = calculateTime(item?.createdAt);
                  return (
                    <div
                      className="flex justify-between p-3 bg-white rounded-[10px] h-[90px] 2xl:w-[760px] lg:w-[666px] sm:w-full"
                      key={index}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          // src={topImg}
                          src={item?.userId?.image}
                          alt=""
                          className="w-[48px] h-[48px] rounded-full"
                        />
                        <div>
                          <h3 className="p-0 text-[#333333] text-[18px] font-semibold">
                            {item?.title}
                          </h3>
                          <p className="text-gray-500 text-[15px] font-normal">
                            {item?.message}
                          </p>
                        </div>
                      </div>
                      <p className="text-[12px] text-gray-500 mt-1 font-normal">
                        {formattedTime}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
            <div
              className="p-4 border border-gray-100 bg-white rounded-[10px] xl:block hidden"
              style={{
                height: "727px",
                width: "344px",
                borderRadius: "10px",
              }}
            >
              <h1 className="font-normal  text-center mt-2">
                Top Specialties Jobs
              </h1>
              <div
                className="flex justify-center  mt-4 mb-4 px-5 "
                style={{
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                }}
              />
              {currentJobData.map((item, index) => (
                <h1 className="font-normal   mt-2">{item?.value}</h1>
              ))}
              <h1
                className="font-normal mt-5 underline decoration-1"
                onClick={() => setViewAll((s) => !s)}
              >
                {viewAll ? "View Less" : "View all"}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
