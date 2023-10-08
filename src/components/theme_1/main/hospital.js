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
import { userLoggedInUserInfo } from "../../../config/userLoggedInUserInfo";
import Staff from "./staff";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({});

const Hospital = () => {
  const slides = [{ url: topImg }, { url: yoga }, { url: mask }, { url: tech }];

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [updatedData1, setUpdateddata] = useState();

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
  const { profile } = userLoggedInUserInfo();
  console.log(profile, "|profile");

  const handleidData = (data) => {
    setUpdateddata(data);
  };

  return (
    <>
      <Staff />
    </>
  );
};

export default Hospital;
