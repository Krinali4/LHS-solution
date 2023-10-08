import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import topImg from "../../assets/images/topImg.png";
import avatar from "../../assets/images/avatar.png";
import like from "../../assets/images/like.png";
import comment from "../../assets/images/comment.png";
import share from "../../assets/images/share.png";
import yoga from "../../assets/images/yoga.png";
import tech from "../../assets/images/tech.png";
import mask from "../../assets/images/mask.png";
import dots from "../../assets/images/dots.png";
import hide from "../../assets/images/hide.png";
import right_arrow from "../../assets/images/right_arrow.png";
import left_arrow from "../../assets/images/left_arrow.png";
import like_true from "../../assets/images/like_true.png";
import reply from "../../assets/images/reply.png";
import img from "../../assets/images/img.png";
import user from "../../assets/images/user.png";
import videoupload from "../../assets/images/videoUpload.svg";
import imgicon from "../../assets/images/imgicon.svg";
import playicon from "../../assets/images/playicon.svg";
import plus from "../../assets/images/plus.svg";
import Modal from "../../common/modal";
import { Icon } from "@material-ui/core";
import Nav from "../Nav";
import { useState } from "react";
import StaffCard from "../../ui/staffCard";
import Lightbox from "react-image-lightbox";
// import LightboxComponent from "../../Lightbox";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../../config/axiosConfig";
import {
  showErrorToast,
  showSuccessToast,
} from "../../common/toastMeassage/ToastMeassage";
import { userLoggedInUserInfo } from "../../../config/userLoggedInUserInfo";
import Loader from "../../modals/Loader";

const Staff = () => {
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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [updateComment, setUpdateComment] = useState(null);
  const currentJobData = viewAll ? jobData : jobData.slice(0, 5);
  const { profile } = userLoggedInUserInfo();
  console.log(profile, "profileprofile");
  const [files, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const [showLoader, setShowLoader] = useState(false);
  const [Idmodal, setIdmodal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [videoOpen, setvideoOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [text, setText] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [error, setError] = useState(false);
  const [allInterestJobs, setAllInterestJobs] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [caption, setCaption] = useState("");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [file, setFile] = useState(null);
  const [updatedData1, setUpdateddata] = useState();
  const [videoUploading, setVideoUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const openModal = () => {
    setModalOpen(true);
  };
  const openvideoPopup = () => {
    setvideoOpen(true);
  };
  const closevideopopup = () => {
    setvideoOpen(false);
  };

  const openImagePopup = () => {
    setImageOpen(true);
  };
  const closeImagepopup = () => {
    setImageOpen(false);
    setImage(null);
  };
  // const closeModal = () => {
  //   setModalOpen(false);
  //   setText("");
  //   setError(false);
  // };

  const closeModal = () => {
    setModalOpen(false);
    setImageOpen(false);
    setvideoOpen(false);
    setCaption("");
    setUploadedFiles([]);
    setText("");
    setError(false);
    setIdmodal("");
  };

  const GetAllInterestJobs = async () => {
    try {
      let url = "v2/LHS/User/getAllPost?page=1&limit=10";
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        setAllInterestJobs([...response?.data?.data?.postData]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GetAllInterestJobs();
  }, []);

  const handleUpload = async (files) => {
    const images = [...files];
    if (!images) {
      console.error("No image selected.");
      return;
    } else if (images.length > 5) {
      alert("Please select maximum of five images.");
      return;
    }
    try {
      const formData = new FormData();
      images.forEach((image) => formData.append("files", image));
      console.log(formData, "formDataformData");
      let url = "v2/LHS/Upload/uploadFiles";
      const response = await axiosInstance.post(url, formData);
      const uploadedImageUrls = response.data.data;
      setUploadedFiles([...uploadedFiles, ...uploadedImageUrls]);
    } catch (error) {
      console.error("Failed to upload image:", response.error);
    } finally {
      setShowLoader(false);
    }
  };
  const isvideo = (url) => {
    const fileExtension = url.split(".").pop().toLowerCase();
    return ["mp4", "avi", "mkv", "mov"].includes(fileExtension);
  };
  const isImage = (url) => {
    const fileExtension = url.split(".").pop().toLowerCase();
    return ["png", "jpeg", "jpg", "svg", "webp"].includes(fileExtension);
  };
  const handleUploadvideo = async (video) => {
    if (!video) {
      console.error("No video selected.");
      return;
    }
    setVideoUploading(true);
    try {
      const formDatas = new FormData();
      formDatas.append("files", video);
      let url = "v2/LHS/Upload/uploadFiles";
      const response = await axiosInstance.post(url, formDatas);
      const uploadedImageUrls = response.data.data;
      setUploadedFiles([...uploadedFiles, ...uploadedImageUrls]);
      if (response.ok && response.result === "OK") {
        setVideoUploading(false);
        console.log("Image uploaded successfully!");
      } else {
        setVideoUploading(false);
      }
    } catch (error) {
      setVideoUploading(false);
      console.error("Error while uploading image:", error);
    }
  };
  const handleAddPost = async () => {
    try {
      const formdata = {
        caption: caption,
        fileUrl: uploadedFiles,
        mediaType: 1,
      };
      const url = "v2/LHS/User/addPost";
      const response = await axiosInstance.post(url, formdata);
      if (response?.data?.message == true) {
        setImage(null);
        setCaption("");
      }
      setImage(null);
      setCaption("");
      setUploadedFiles([]);
      closeModal();
      setModalOpen(false);
      showSuccessToast("Post added successfully!");
      GetAllInterestJobs();
    } catch (error) {
      showErrorToast("An error occurred while adding the post.");
      console.error("Error adding post:", error);
    }
  };
  const handleSubmit = async (id) => {
    try {
      let url = `v2/LHS/User/deletePost/${id}`;
      const response = await axiosInstance.delete(url);
      console.log("Deleted Post:", response.data?.message == true);
      if (response.data?.success == true) {
        GetAllInterestJobs();
        showSuccessToast("Post deleted successfully!");
        setImage(null);
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    }
  };

  const handleidData = (data) => {
    setUpdateddata(data);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpdatePost = async () => {
    const updatedData = {
      caption: caption,
      fileUrl: uploadedFiles,
      mediaType: updatedData1?.mediaType,
    };
    const response = await axiosInstance.put(
      `v2/LHS/User/updatePost/${Idmodal}`,
      updatedData
    );
    if (response?.data?.success == true) {
      console.log(
        "Updated Post:",
        response?.data?.success == true,
        response.data
      );
      showSuccessToast(response?.data?.message);
      setModalOpen(false);
      setMediaType("image");
      GetAllInterestJobs();
    }
  };
  const handleTextChange = (event) => {
    const newText = event.target.value;
    if (newText.length <= 400) {
      setCaption(newText);
    }
  };

  const handlePost = async (data) => {
    setModalOpen(!modalOpen);
    setIdmodal(data?._id);
    setCaption(data?.caption);
    setUploadedFiles(data?.fileUrl);
    try {
      if (id) {
        handleUpdatePost();
      } else {
        handleAddPost();
      }
      closeModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleVideoChange = (e) => {
    const image = e.target.files[0];
    handleUploadvideo(image);
  };

  const handleImageRemove = (index) => {
    const updatedUploadedFiles = [...uploadedFiles];
    let tempData = updatedUploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(tempData);
  };

  const handleRemoveImage = (index) => {
    setUploadedFiles([]);
    setSelectedImage(null);
    setImageOpen(false);
  };

  const handleRemoveVideo = (index) => {
    setSelectedImage(null);
    setUploadedFiles([]);
    setvideoOpen(false);
    const updatedUploadedFiles = [...uploadedFiles];
    let tempData = updatedUploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(tempData);
  };
  const isMaxImageUploadReached = uploadedFiles.length >= 5;
  const isPublishButtonDisabled =
    isMaxImageUploadReached || caption.trim() === "";
  return (
    <>
      {userLoggedInUserInfo ? <Nav /> : ""}
      <div
        className="flex justify-center items-center"
        style={{ backgroundColor: "#F3F2EF" }}
      >
        <div className="container 2xl:px-0 xl:px-12 lg:px-8 sm:px-8 px-3">
          <div className=" lg:flex lg:gap-4 2xl:gap-0 block justify-between align-top py-10 lg:px-5 xl:px-8 2xl:px-0">
            <div className="md:block md:!px-[16px] lg:!px-0 hidden">
              <div
                className="border border-gray-100 align-top bg-white m-auto 2xl:w-[346px] h-[353px] lg:w-[280px]"
                style={{
                  // height: "353px",
                  // width: "344px",
                  borderRadius: "10px",
                }}
              >
                <div>
                  <img
                    src={topImg}
                    style={{
                      height: "auto",
                      width: "100%",
                    }}
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
                  Welcome,{" "}
                  {profile?.name
                    ? profile?.name
                    : profile?.firstName + " " + profile?.lastName}
                </h1>
                <h1 className="font-normal  text-center mt-4">
                  {profile?.role == "staff" ? profile?.jobTitle : profile?.role}
                </h1>
                <div
                  className="flex justify-center  mt-4"
                  style={{
                    height: "1px",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  }}
                />
                <div className="align-middle justify-center">
                  {profile?.role == "staff" && (
                    <>
                      {profile.hasOwnProperty("currentLocation") && (
                        <div className="p-3">
                          <h1 className="font-normal  text-center">
                            {profile?.currentLocation?.name +
                              ", " +
                              profile?.currentLocation?.state}

                            <br />
                            {profile?.currentLocation?.zipCode}
                          </h1>
                        </div>
                      )}
                    </>
                  )}
                  {profile?.role == "hospital" && (
                    <div className="p-3">
                      <h1 className="font-normal  text-center">
                        {profile?.corporateAddress[0]?.street
                          .charAt(0)
                          .toUpperCase() +
                          profile.corporateAddress[0].street.slice(1) +
                          ", " +
                          profile?.corporateAddress[0]?.city +
                          ", " +
                          profile?.corporateAddress[0]?.state}
                        <br />
                        {profile?.corporateAddress[0]?.zipCode}
                      </h1>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="border border-gray-100 !my-10 bg-white m-auto 2xl:w-[346px] h-auto lg:w-[280px]"
                style={{
                  // height: "353px",
                  // width: "344px",
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
                <div className="px-4 font-normal pb-4 md:text-center lg:text-start xl:text-start 2xl:text-start">
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
            <div className="flex flex-col !gap-5 md:px-5 lg:px-0">
              <div
                className="flex items-center gap-6 2xl:px-5 px-3 border border-gray-100 bg-white 2xl:w-[760px] lg:w-[666px] sm:w-full"
                style={{
                  height: "100px",
                  borderRadius: "10px",
                }}
              >
                <div>
                  <img
                    src={profile?.image ? profile?.image : user}
                    style={{
                      height: "80px",
                      width: "80px",
                      borderRadius: "40px",
                    }}
                  />
                </div>
                <div className="border border-gray-100 rounded-lg justify-center w-10/12 items-center">
                  <input
                    className="border border-gray-100 appearance-none  rounded  w-full  h-11 py-2 px-3 text-gray-700 leading-tight  focus:outline-none focus:shadow-outline "
                    id="inline-full-name"
                    type="text"
                    placeholder="Start a post"
                    onClick={openModal}
                  />
                </div>
                <Modal isOpen={modalOpen} onClose={closeModal}>
                  <div
                    className={`${
                      uploadedFiles.length > 2
                        ? " h-[750px] overflow-y-scroll"
                        : "h-full"
                    } w-full rounded-lg`}
                  >
                    <div className="w-full h-auto bg-white xl:p-[35px] p-[25px] border-1 border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-[20px]">
                        <div className="flex items-center sm:gap-4 gap-3.5">
                          <img
                            src={profile?.image}
                            style={{
                              // height: "80px",
                              // width: "80px",
                              borderRadius: "40px",
                            }}
                            className="lg:w-[60px] lg:h-[60px] md:w-[60px] md:h-[60px] w-[45px] h-[45px]"
                          />
                          <div>
                            <h5 className="text-lg font-medium leading-5 Avenir">
                              {profile?.name
                                ? profile?.name
                                : profile?.firstName + " " + profile?.lastName}
                            </h5>
                            <p className="text-sm text-gray-400 font-medium leading-5 Avenir mt-[3px]">
                              Share with everyone
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center sm:gap-4 gap-2">
                          <button
                            className="border-1 text-sm text-gray-500 font-medium leading-5 border-gray-500 sm:rounded-[30px] rounded-[10px] sm:py-[8px] sm:px-[25px] py-[3px] px-[6px] hover:bg-sky-400 hover:text-white hover:border-none"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                          {/* <button
                            className="border-1 text-sm text-gray-500 font-medium leading-5 border-gray-500 sm:rounded-[30px] rounded-[10px] sm:py-[8px] sm:px-[25px] py-[3px] px-[6px] hover:bg-sky-400 hover:text-white hover:border-none"
                            onClick={Idmodal ? handleUpdatePost : handleAddPost}
                            // onClick={handlePost}
                          >
                            <ToastContainer />
                            {Idmodal ? "Update" : "Publish"}
                          </button> */}
                          <button
                            className={`border-1 text-sm text-gray-500 font-medium leading-5 border-gray-500 sm:rounded-[30px] rounded-[10px] sm:py-[8px] sm:px-[25px] py-[3px] px-[6px] hover:bg-sky-400 hover:text-white hover:border-none ${
                              isPublishButtonDisabled
                                ? "disabled:opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={handleAddPost}
                            disabled={isPublishButtonDisabled}
                          >
                            {Idmodal ? "Update" : "Publish"}
                          </button>
                          <ToastContainer />

                          {/* <button onClick={handleUpdatePost}>Update</button> */}
                        </div>
                      </div>
                      <ToastContainer />
                      <input
                        // id="imageInput"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      <div className="w-full h-auto border-1 border-gray-200 rounded">
                        <div className="flex items-center justify-between border-b-[1px] py-3 px-2">
                          <div className="flex items-center gap-2">
                            <label htmlFor="imageInput">
                              <img
                                src={imgicon}
                                alt="Upload Image"
                                // onClick={handleImageClick}
                                onClick={openImagePopup}
                                style={{ cursor: "pointer" }}
                              />
                            </label>

                            <img
                              src={playicon}
                              alt=""
                              onClick={openvideoPopup}
                              style={{ cursor: "pointer" }}
                            />
                            <Modal isOpen={videoOpen} onClose={closevideopopup}>
                              <div
                                id="popup"
                                className={`fixed  flex inset-0 justify-center items-center bg-black bg-opacity-50 z-50 `}
                              >
                                <div className="bg-white p-14 rounded-lg w-full max-w-screen-md h-[513px] md:mx-0 mx-3">
                                  <h2 className="text-xl font-medium leading-20 tracking-wider text-[#333333]">
                                    Select your video
                                  </h2>

                                  <div className="mt-3 cursor-pointer h-[300px] top-182 left-450 rounded-6  border-gray-600 flex items-center justify-center border-dashed  border-2 rounded-md">
                                    {videoUploading ? (
                                      <Loader />
                                    ) : uploadedFiles?.length > 0 ? (
                                      <video
                                        // width="400"
                                        controls
                                        onLoadedData={() =>
                                          setVideoLoaded(true)
                                        }
                                        className="h-full w-full rounded-md"
                                      >
                                        <source
                                          src={uploadedFiles}
                                          type="video/mp4"
                                        />
                                      </video>
                                    ) : (
                                      <div className="relative">
                                        <div className=" flex justify-center mb-3.5">
                                          <img
                                            src={videoupload}
                                            alt=""
                                            onChange={handleVideoChange}
                                            className="absolute cursor-pointer"
                                          />
                                          <input
                                            type="file"
                                            accept="video/*"
                                            defaultValue={video}
                                            onChange={(e) =>
                                              handleVideoChange(e)
                                            }
                                            className="opacity-0 w-[100px] cursor-pointer"
                                          />
                                        </div>
                                        <div className="mt-3">
                                          Drop your video file here
                                        </div>
                                        <h2 className="flex justify-center m-3.5">
                                          OR
                                        </h2>
                                        {/* <button className="w-[192px] h-[44px] border border-[#333333]-700 rounded-[100px] text-sm text-[#333333]">
                                          Select video to share{" "}
                                        </button> */}

                                        <div className="relative ">
                                          <div className="flex justify-center mb-3.5 ">
                                            <button
                                              className="w-[192px] h-[44px] border border-[#333333]-700 rounded-[100px] text-sm text-[#333333] cursor-pointer absolute"
                                              onClick={(e) =>
                                                handleUpload(e?.target?.files)
                                              }
                                            >
                                              <div className="cursor-pointer">
                                                Select video to share
                                              </div>
                                            </button>

                                            <input
                                              type="file"
                                              accept="video/*"
                                              defaultValue={video}
                                              onChange={(e) =>
                                                handleVideoChange(e)
                                              }
                                              className="opacity-0 w-[100px]"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <div></div>
                                  </div>
                                  <div className="mt-10 flex justify-end">
                                    <button
                                      className="h-12 w-32 rounded-full bg-slate-200"
                                      onClick={handleRemoveVideo}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      className={`h-12 w-32 rounded-full ${
                                        videoLoaded
                                          ? "bg-[#009CDE] text-[#FFFFFF]"
                                          : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                      } ml-8`}
                                      onClick={closevideopopup}
                                      disabled={!videoLoaded}
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </Modal>

                            <Modal isOpen={imageOpen} onClose={closeImagepopup}>
                              <div
                                id="popup"
                                className={`fixed  flex inset-0 justify-center items-center bg-black bg-opacity-50 z-50 `}
                              >
                                <div
                                  className={`bg-white p-14 rounded-lg w-full max-w-screen-md  md:mx-0 !mx-3 ${
                                    uploadedFiles.length > 4
                                      ? "h-auto"
                                      : "h-[513px]"
                                  }  `}
                                >
                                  <h2 className="text-xl font-medium leading-20 tracking-wider text-[#333333]">
                                    Select your Image
                                  </h2>

                                  <div
                                    className={`mt-3  top-182 left-450 rounded-6  border-gray-600 ${
                                      uploadedFiles.length > 0
                                        ? "grid grid-cols-2 h-auto  border-0"
                                        : "flex border-dashed h-[300px]  border-2"
                                    }  items-center justify-center  rounded-md`}
                                  >
                                    {!selectedImage &&
                                      uploadedFiles.length > 0 && (
                                        <div>
                                          <img
                                            src={uploadedFiles[0]}
                                            alt="Selected Image"
                                            style={{
                                              width: "400px",
                                              height: "200px",
                                              padding: "20px",
                                              borderRadius: "10px",
                                            }}
                                            onClick={() =>
                                              setSelectedImage(uploadedFiles[0])
                                            }
                                          />
                                        </div>
                                      )}

                                    {selectedImage && (
                                      <div>
                                        <img
                                          src={selectedImage}
                                          alt="Selected Image"
                                          style={{
                                            width: "400px",
                                            height: "200px",
                                            padding: "20px",
                                            borderRadius: "10px",
                                          }}
                                          onClick={() => setSelectedImage(null)}
                                        />
                                      </div>
                                    )}

                                    <div
                                      className={`${
                                        uploadedFiles.length > 0
                                          ? "grid grid-cols-2 gap-2 p-2 border border-gray-600 rounded-lg	h-auto"
                                          : ""
                                      }`}
                                    >
                                      {uploadedFiles.length > 0 ? (
                                        uploadedFiles?.map((preview, index) => (
                                          <>
                                            <div
                                              key={index}
                                              onClick={() =>
                                                setSelectedImage(preview)
                                              }
                                            >
                                              <img
                                                key={index}
                                                src={preview}
                                                className="rounded-lg	h-[100px] w-[200px]"
                                                alt={`Preview ${index}`}
                                                onLoad={() =>
                                                  setImageLoaded(true)
                                                }
                                              />
                                            </div>
                                          </>
                                        ))
                                      ) : (
                                        <div className="relative">
                                          <div className="flex justify-center mb-3.5">
                                            <img
                                              src={videoupload}
                                              alt=""
                                              onChange={(e) =>
                                                handleUpload(e.target.files)
                                              }
                                              className="absolute"
                                            />
                                            <input
                                              type="file"
                                              accept="image/*"
                                              defaultValue={files}
                                              multiple
                                              onChange={(e) =>
                                                handleUpload(e.target.files)
                                              }
                                              className="opacity-0 w-[100px]"
                                            />
                                          </div>
                                          <div className="mt-3">
                                            Drop your Image file here
                                          </div>
                                          <h2 className="flex justify-center m-3.5">
                                            OR
                                          </h2>
                                          <div className="relative">
                                            <div className="flex justify-center mb-3.5">
                                              <button
                                                className="w-[192px] h-[44px] border border-[#333333]-700 rounded-[100px] text-sm text-[#333333] !cursor-pointer absolute"
                                                onClick={(e) =>
                                                  handleUpload(e.target.files)
                                                }
                                              >
                                                Select Image to share
                                              </button>
                                              <input
                                                type="file"
                                                accept="image/*"
                                                defaultValue={files}
                                                multiple
                                                onChange={(e) =>
                                                  handleUpload(e.target.files)
                                                }
                                                className="opacity-0 w-[100px]"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="mt-10 flex justify-end">
                                    {uploadedFiles.length < 5 ? (
                                      <div className="relative">
                                        <div className="flex justify-center mb-3.5">
                                          <img
                                            src={plus}
                                            alt=""
                                            onClick={(e) =>
                                              handleUpload(e.target.files)
                                            }
                                            width={40}
                                            height={40}
                                            className="absolute"
                                          />
                                          <input
                                            type="file"
                                            accept="image/*"
                                            defaultValue={files}
                                            multiple
                                            onChange={(e) =>
                                              handleUpload(e?.target?.files)
                                            }
                                            className="opacity-0 w-[100px]"
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    <button
                                      className="h-12 w-32 rounded-full bg-slate-200"
                                      onClick={() => {
                                        setUploadedFiles([]);
                                        closeImagepopup();
                                      }}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      className={`h-12 w-32 rounded-full ${
                                        imageLoaded
                                          ? "bg-[#009CDE] text-[#FFFFFF]"
                                          : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                      } ml-8`}
                                      onClick={closeImagepopup}
                                      disabled={!imageLoaded}
                                    >
                                      Done
                                    </button>
                                  </div>

                                  {/* {uploadedFiles.length > 0 ?   <div className="relative">
                                          <div className="flex justify-center mb-3.5">
                                            <img
                                              src={plus}
                                              alt=""
                                              onChange={(e) =>
                                                handleUpload(e.target.files)
                                              }
                                              width={30}
                                              height={30}
                                              className="absolute"
                                            />
                                            <input
                                              type="file"
                                              accept="image/*"
                                              defaultValue={files}
                                              multiple
                                              onChange={(e) =>
                                                handleUpload(e.target.files)
                                              }
                                              className="opacity-0 w-[100px]"
                                            />
                                          </div>
                                       
                                        </div>:""} */}
                                </div>
                              </div>
                              <>
                                {/* <div
                                  id="popup"
                                  className={`fixed flex inset-0 justify-center items-center bg-black bg-opacity-50 z-50 `}
                                >
                                  <div className="bg-white p-14 rounded-lg w-full max-w-screen-md mx-auto h-[513px] ">
                                    <h2 className="text-xl font-medium leading-20 tracking-wider text-[#333333]">
                                      Select your Images
                                    </h2>

                                    <div className="mt-4 m-2 h-76 w-full flex flex-wrap">
                                      {uploadedFiles.length > 0 ? (
                                        uploadedFiles?.map((preview, index) => (
                                          <img
                                            key={index}
                                            src={preview}
                                            alt={`Preview ${index}`}
                                            style={{
                                              width: "200px",
                                              height: "auto",
                                            }}
                                            onLoad={() => setImageLoaded(true)}
                                          />
                                        ))
                                      ) : (
                                        <div className="relative">
                                          <div className="flex justify-center mb-3.5">
                                            <img
                                              src={videoupload}
                                              alt=""
                                              onChange={(e) =>
                                                handleUpload(e.target.files)
                                              }
                                              className="absolute"
                                            />
                                            <input
                                              type="file"
                                              accept="image/*"
                                              defaultValue={files}
                                              multiple
                                              onChange={(e) =>
                                                handleUpload(e.target.files)
                                              }
                                              className="opacity-0 w-[100px]"

                                             
                                            />
                                          </div>
                                          <div className="mt-3">
                                            Drop your Image file here
                                          </div>
                                          <h2 className="flex justify-center m-3.5">
                                            OR
                                          </h2>
                                          <button className="w-[192px] h-[44px] border border-[#333333]-700 rounded-[100px] text-sm text-[#333333]">
                                            Select Image to share
                                          </button>
                                        </div>
                                      )}
                                    </div>


                                 

                                    <div className="mt-10 flex justify-end">
                                      <button
                                        className="h-12 w-32 rounded-full bg-slate-200"
                                        onClick={() => {
                                          setUploadedFiles([]);
                                          closeImagepopup();
                                        }}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        className={`h-12 w-32 rounded-full ${
                                          imageLoaded
                                            ? "bg-[#009CDE] text-[#FFFFFF]"
                                            : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                        } ml-8`}
                                        onClick={closeImagepopup}
                                        disabled={!imageLoaded}
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>
                                </div> */}
                              </>

                              {/* <>
                                <div
                                  id="popup"
                                  className={`fixed  flex inset-0 justify-center items-center bg-black bg-opacity-50 z-50 `}
                                >
                                  <div className="bg-white p-8 rounded-lg w-full max-w-screen-md mx-auto h-[513px] ">
                                    <h2>Upload Image</h2>

                                    <div className="mt-4 m-2">
                                      {uploadedFiles?.map((preview, index) => (
                                        <img
                                          key={index}
                                          src={preview}
                                          alt={`Preview ${index}`}
                                          style={{
                                            width: "200px",
                                            height: "auto",
                                          }}
                                        />
                                      ))}
                                    </div>

                                    <form onSubmit={miltipleImageUpload}>
                                      <input
                                        type="file"
                                        multiple
                                        onChange={handleMultipleImage}
                                      />
                                      <button className="uploadBtn">
                                        Upload
                                      </button>
                                    </form>
                                    <div className="mt-10 flex justify-end">
                                      <button
                                        className="h-12 w-32 rounded-full bg-slate-200"
                                        onClick={closeImagepopup}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        className={`h-12 w-32 rounded-full ${
                                          imageLoaded
                                            ? "bg-[#009CDE] text-[#FFFFFF]"
                                            : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                        } ml-8`}
                                        onClick={closeImagepopup}
                                        disabled={!imageLoaded}
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </> */}
                            </Modal>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleUpload(e?.target?.files)}
                              style={{ display: "none" }}
                              // ref={fileInputRef} // Add a ref to the file input
                            />

                            {/* <button onClick={handleUploadvideo}>
                            Upload Video
                          </button> */}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium leading-5">
                              {caption?.length}/400
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <textarea
                            rows={6}
                            className="border-gray-300 border-none w-full h-auto outline-none p-[20px]"
                            placeholder="Enter caption for the post"
                            value={caption}
                            onChange={handleTextChange}
                          />

                          <div
                            className={`${
                              uploadedFiles.length <= 2
                                ? "grid-first-upload"
                                : ""
                            } ${
                              uploadedFiles.length > 2
                                ? `flex flex-wrap relative justify-between gap-3 p-6 upload-image-grid ${
                                    uploadedFiles.length >= 4
                                      ? "grid-three-upload"
                                      : ""
                                  } ${
                                    uploadedFiles.length === 5
                                      ? "grid-four-upload"
                                      : ""
                                  } ${
                                    uploadedFiles.length === 6
                                      ? "grid-five-upload"
                                      : ""
                                  } `
                                : "flex relative !p-6 gap-3"
                            } `}
                          >
                            {uploadedFiles.length > 0 &&
                              uploadedFiles.map((data, index) => (
                                <div
                                  key={index}
                                  className="relative w-[50%] h-auto"
                                >
                                  {/* <img
                                    src={data}
                                    className="h-full w-full rounded-[2rem]"
                                    alt=""
                                  /> */}

                                  {isImage(data) && (
                                    <img
                                      src={data}
                                      className="h-full w-full rounded-[2rem]"
                                      alt=""
                                    />
                                  )}
                                  {isvideo(data, index) && (
                                    <video
                                      key={index}
                                      controls
                                      className="h-auto w-full p-6 !rounded-[2rem]"
                                    >
                                      <source src={data} type="video/mp4" />
                                    </video>
                                  )}
                                  <button
                                    className="absolute top-2 right-3 p-1 rounded-full text-white cursor-pointer w-[30px] h-[30px] flex items-center justify-center bg-black"
                                    onClick={() => handleImageRemove(index)}
                                  >
                                    x
                                  </button>
                                </div>
                              ))}
                            {/* {uploadedFiles.length > 0 &&
                              uploadedFiles?.map((data, index) => {
                                return (
                                  <>
                                    <video
                                      controls
                                      className="w-[50%]  h-auto   top-8  p-6 !rounded-[2rem]"
                                    >
                                      <source
                                        key={index}
                                        src={data}
                                        type="video/mp4"
                                      />
                                    </video>
                                  </>
                                );
                              })} */}

                            {/* {storevideo?.data?.map((data, index) => {
                              const handleVideoRemove = () => {
                                const updatedStorevideo =
                                  storevideo.data.filter((_, i) => i !== index);
                                setStorevideo({ data: updatedStorevideo });
                              };
                              return (
                                <div
                                  key={index}
                                  className="relative w-[50%] h-auto"
                                >
                                  {isvideo(data, index) && (
                                    <video
                                      key={index}
                                      controls
                                      className="h-auto w-full p-6 !rounded-[2rem]"
                                    >
                                      <source src={data} type="video/mp4" />
                                    </video>
                                  )}

                                  <button
                                    className="absolute top-1 right-2 p-1 rounded-full  text-white cursor-pointer w-[30px] h-[30px] flex items-center justify-center bg-black"
                                    onClick={() => handleVideoRemove(index)}
                                  >
                                    x
                                  </button>
                                </div>
                              );
                            })} */}
                          </div>
                        </div>
                      </div>
                      {error && (
                        <p className="text-red-500 mt-2">
                          Character limit exceeded (max: 400 characters).
                        </p>
                      )}
                    </div>
                  </div>
                </Modal>
              </div>
              <div className="flex flex-col !gap-5">
                {allInterestJobs.map((item, index) => (
                  <StaffCard
                    handleFileChange={handleFileChange}
                    {...item}
                    hidePost={hidePost}
                    setHidePost={setHidePost}
                    updateComment={updateComment}
                    setUpdateComment={setUpdateComment}
                    handleidData={handleidData}
                    Idmodal={Idmodal}
                    openModal={openModal}
                    handleSubmit={handleSubmit}
                    myProfile={profile}
                    handlePost={handlePost}
                  />
                ))}
              </div>
              <ToastContainer />
            </div>
            <div
              className="p-4 border border-gray-100 bg-white rounded-[10px] xl:block hidden"
              style={{
                height: "727px",
                width: "344px",
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

export default Staff;
