import React from "react";
import { connect } from "react-redux";
import topImg from "../../assets/images/topImg.png";
import avatar from "../../assets/images/avatar.png";
import yoga from "../../assets/images/yoga.png";
import tech from "../../assets/images/tech.png";
import mask from "../../assets/images/mask.png";
import Nav from "../Nav";
import { useState } from "react";
import StaffCard from "../../ui/staffCard";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({});

const HomeDetails = () => {
  const slides = [{ url: topImg }, { url: yoga }, { url: mask }, { url: tech }];

  const cardData = [
    {
      id: "0",
      profilePic: avatar,
      name: "Dr. Ronald Lang, MD",
      role: "Nephrologist",
      time: "1 day",
      title: "A human being's nervous system",
      decs: "The nervous system governs virtually every individual's action, thought, expression, and emotion. Your nervous system controls complex functions such as movement, cognition, and memory.",
      image: topImg,
    },
  ];
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

  const [hidePost, setHidePost] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [fullView, SetFullView] = useState(false);
  const [normalView, setNormalView] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentJobData = viewAll ? jobData : jobData.slice(0, 5);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <>
      <Nav />
      <div className="  p-10">
        <div className=" flex justify-start align-top p-10">
          <div>
            <div
              className="border border-gray-100 align-top "
              style={{
                height: "353px",
                width: "345px",
                borderRadius: "10px",
              }}
            >
              <div>
                <img
                  src={topImg}
                  style={{
                    height: "100px",
                    width: "345px",
                  }}
                />
              </div>
              <div className="flex justify-center">
                <img
                  src={avatar}
                  style={{
                    height: "80px",
                    width: "80px",
                    borderRadius: "40px",
                    marginTop: "-35px",
                  }}
                />
              </div>
              <h1 className="font-normal  text-center mt-4">
                Welcome, Dr. Anna!
              </h1>
              <h1 className="font-normal  text-center mt-4">
                Elevate Health Group
              </h1>
              <div
                className="flex justify-center  mt-4 mb-4 px-5  "
                style={{
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                }}
              />
              <h1 className="font-normal  text-center">
                214 N Central Ave, Glendale <br />
                CA 91203{" "}
              </h1>
            </div>
            <div
              className="border border-gray-100  mt-10 "
              style={{
                height: "353px",
                width: "345px",
                borderRadius: "10px",
              }}
            >
              <div className="mt-4 ">
                <h1 className="font-normal  text-center mt-2">Recent</h1>
              </div>
              <div
                className="flex justify-center  mt-4 mb-4 px-5 "
                style={{
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                }}
              />
              <div className="px-4 font-normal">
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
          <div>
            <div
              className="flex items-center p-10 ml-10 border border-gray-100"
              style={{
                height: "100px",
                width: "670px",
                borderRadius: "10px",
              }}
            >
              <div>
                <img
                  src={avatar}
                  style={{
                    height: "80px",
                    width: "80px",
                    borderRadius: "40px",
                  }}
                />
              </div>
              <div className="border border-gray-100 ml-6 rounded-lg justify-center w-10/12 items-center">
                <input
                  className="border border-gray-100 appearance-none rounded  w-full  h-11 py-2 px-3 text-gray-700 leading-tight  focus:outline-none focus:shadow-outline "
                  id="inline-full-name"
                  type="text"
                  placeholder="Start a post"
                />
              </div>
            </div>
            <div>
              {cardData.map((item, index) => (
                <StaffCard
                  {...item}
                  hidePost={hidePost}
                  setHidePost={setHidePost}
                />
              ))}
            </div>
          </div>
          <div
            className="p-4 ml-10 border border-gray-100"
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
              <h1 className="font-normal   mt-2" key={index}>{item?.value}</h1>
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
    </>
  );
};

export default HomeDetails;
