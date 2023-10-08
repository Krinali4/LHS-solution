import React, { useEffect, useRef, useState } from "react";
import dots from "../assets/images/dots.png";
import hideEye from "../assets/images/hide.png";
import like_true from "../assets/images/like_true.png";
import reply from "../assets/images/reply.png";
import comment from "../assets/images/comment.png";
import share from "../assets/images/share.png";
import avatar from "../assets/images/avatar.png";
import neurologistDoctor from "../assets/images/neurologist-doctor.svg";
import edit from "../assets/images/edit.png";
import user from "../assets/images/user.png";
import deletebox from "../assets/images/deletebox.png";
import Modal from "../common/modal";
import "../../components/theme_1/global.css";
import "../theme_1/main/hospital";
import { useHistory } from "react-router-dom";
import LightboxComponent from "./Lightbox";
import { RWebShare } from "react-web-share";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./staffCard";
import { axiosInstance } from "../../config/axiosConfig";
import {
  showErrorToast,
  showSuccessToast,
} from "../common/toastMeassage/ToastMeassage";
import like from "../assets/images/like.png";
import { format } from "date-fns";
import likedTrue from "../assets/images/likedTrue.png";
import moment from "moment";
import { userLoggedInUserInfo } from "../../config/userLoggedInUserInfo";
export default function StaffCard(props) {
  const {
    handleidData,
    updateComment,
    setUpdateComment,
    id,
    handlePost,
    profilePic,
    name,
    role,
    time,
    title,
    decs,
    image,
    _id,
    handleImageUpdate,
    handleFileChange,
    Idmodal,
    openModal,
    handleSubmit,
    message,
    myProfile,
  } = props || {};
  const history = useHistory();
  const [hidePost, setHidePost] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [isButtonHidden, setIsButtonHidden] = useState(true);
  const token = localStorage.getItem("type");
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [updateReplyId, setUpdateReplyId] = useState(null);
  const [updateReplyText, setUpdateReplyText] = useState(null);
  const [readMore, setReadMore] = useState(false);
  const [updatecommntId, setUpdateCommentId] = useState("");
  const [allReplyByCommntId, setAllReplyByCommntId] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [commentIds, setCommentids] = useState(null);
  const [updateReply, setUpdateReply] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [hide, setHide] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [updateCommentOption, setUpdateCommentOption] = useState(false);

  const { profile } = userLoggedInUserInfo();

  const isMyPost =
    props.userId && myProfile && props.userId._id === myProfile._id;
  const toggleReadMore = () => {
    setReadMore(!readMore);
  };

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
    setIsButtonHidden(true);
  };
  const openIsModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setText("");
    setError(false);
  };
  const editCommentPopup = useRef();
  const editPostPopup = useRef();
  const updateReplyPopup = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editPostPopup.current &&
        !editPostPopup.current.contains(event.target)
      ) {
        setHidePost(false);
      }

      if (
        editCommentPopup?.current &&
        !editCommentPopup.current.contains(event.target)
      ) {
        setUpdateCommentOption(false);
      }

      if (
        updateReplyPopup?.current &&
        !updateReplyPopup.current.contains(event.target)
      ) {
        setUpdateReplyId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  // const GetNotification = async () => {
  //   try {
  //     let url = `v2/LHS/User/getNotification?page=1&limit=10`;
  //     const response = await axiosInstance.get(url);
  //     if (response.data) {
  //       if (response?.data?.data) {
  //         setNotifications(response?.data?.data.notifications);
  //         console.log(response?.data?.data.notifications, "resresres");
  //       } else {
  //         setNotifications([]);
  //       }
  //       showSuccessToast("notification successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching interest jobs:", error);
  //   }
  // };

  const getAllCommentByPostId = async () => {
    try {
      let url = `v2/LHS/User/getAllCommentByPostId?postId=${props?._id}`;
      const response = await axiosInstance.get(url);
      if (response?.data?.data) {
        console.log("commentdat", response?.data?.data);
        setAllComments(response?.data?.data?.commentData);
        setCommentCount(response?.data?.data?.commentCount);
      }
    } catch (error) {
      console.error("Error fetching interest jobs:", error);
    }
  };

  const handleAllReplyByCommntId = async () => {
    try {
      let url = `/v2/LHS/User/getAllReplyByCommentId?page=1&limit=10&commentId=${currentCommentId}`;
      const response = await axiosInstance.get(url);

      if (response.data) {
        if (response?.data?.data) {
          setAllReplyByCommntId(response?.data?.data);
        } else {
          setAllReplyByCommntId([]);
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    getAllCommentByPostId();
    getAllLikeByPostId();
    // GetNotification()
  }, []);
  useEffect(() => {
    if (currentCommentId) {
      handleAllReplyByCommntId();
    }
  }, [currentCommentId]);

  const handleUpdateComment = async (commentIds) => {
    try {
      const url = `v2/LHS/User/updateComment/${commentIds}`;
      await axiosInstance.put(url, {
        comment: commentText,
      });

      getAllCommentByPostId();
      setIsButtonHidden(false);
      setCommentText("");
      setCommentids(null);
      setUpdateComment("");
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handlePostComment = async () => {
    try {
      const formData = {
        postId: props?._id,
        comment: commentText,
      };
      let url = "v2/LHS/User/addComment";
      await axiosInstance.post(url, formData);
      setCommentText("");
      getAllCommentByPostId();
      setIsButtonHidden(false);
      showSuccessToast("Comment added successfully!");
      console.log("url, formData", url, formData);
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  const handleDeleteReply = (_id) => {
    let url = `v2/LHS/User/deleteReply/${_id}`;
    axiosInstance
      .delete(url)

      .then((data) => {
        handleAllReplyByCommntId();
        getAllCommentByPostId();
        showSuccessToast("Reply deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTogglePopup = (commentId) => {
    if (updateComment === commentId) {
      setUpdateComment(null);
    } else {
      setUpdateComment(commentId);
    }
  };
  const handleEditComment = (commenttext) => {
    setCommentids(commenttext?._id);
    setCommentText(commenttext?.comment);
    setIsButtonHidden(true);
  };

  const handleToggleReplyPopup = (replyId) => {
    if (updateReplyId === replyId) {
      setUpdateReplyId(null);
    } else {
      setUpdateReplyId(replyId);
    }
  };
  const handleEditReply = (replytext) => {
    setUpdateReply(true);
    setUpdateReplyText(replytext?.comment);
  };

  const getAllLikeByPostId = async () => {
    let url = `v2/LHS/User/getAllLikesByPostId/${props?._id}?page=1&limit=10`;
    const response = await axiosInstance
      .get(url)
      .then((response1) => {
        const data = response1?.data;
        if (data.data?.success === true) {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [count, setCount] = useState(props.likeCount || 0);

  // const handleButtonClick = () => {
  //   // Toggle between increment and decrement based on the current count
  //   if (count === 0) {
  //     setCount(1); // Increment
  //   } else {
  //     setCount(0); // Decrement
  //   }
  // };

  const [likeCount, setLikeCount] = useState(props.likeCount || 0);
  const [dislikeCount, setDislikeCount] = useState(props.dislikeCount || 0);
  const [isLiked, setIsLiked] = useState(false);

  const [isDisliked, setIsDisliked] = useState(false);

  // useEffect(() => {
  //   const totalLikes = isLiked ? likeCount + 1 : likeCount;
  //   const totalDislikes = isDisliked ? dislikeCount + 1 : dislikeCount;
  //   // Display the total counts
  //   console.log(`Likes: ${totalLikes}, Dislikes: ${totalDislikes}`);
  // }, [likeCount, dislikeCount, isLiked, isDisliked]);

  // const handleLikePost = async () => {
  //   if (!isLiked) {
  //     let url = "v2/LHS/User/likeDislikePost";
  //     try {
  //       const response = await axiosInstance.post(url, {
  //         postId: props._id,
  //       });
  //       console.log(response.data);
  //       setLikeCount(likeCount + 1);
  //       setIsLiked(true);
  //       if (isDisliked) {
  //         setDislikeCount(dislikeCount - 1);
  //         setIsDisliked(false);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   } else {
  //     // If already liked, unliking
  //     unLikePost();
  //   }
  // };

  // const unLikePost = async () => {
  //   let url = "v2/LHS/User/likeDislikePost";
  //   try {
  //     const response = await axiosInstance.post(url, {
  //       postId: props._id,
  //       action: "unlike",
  //     });
  //     console.log(response.data,"responseeeeeeeeeeeee");
  //     setLikeCount(likeCount - 1);
  //     setIsLiked(false);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const handleDeleteComment = (_id) => {
    let url = `v2/LHS/User/deleteComment/${_id}`;
    axiosInstance
      .delete(url)

      .then((data) => {
        if (data?.data?.success == true) {
          getAllCommentByPostId();
          showSuccessToast("Comment deleted successfully!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleHidePost = async () => {
    let url = `v2/LHS/User/hidePost`;
    axiosInstance
      .post(url, { postId: props?._id })
      .then(() => {
        setHide(true);
        showSuccessToast("Post hidden successfully");
      })
      .catch((err) => {
        showErrorToast("Error adding post hide!");
      });
  };

  const handleReplyComment = async (commentId) => {
    try {
      const formData = {
        commentId: commentId,
        comment: replyText,
      };
      await axiosInstance.post("v2/LHS/User/addReply", formData);
      showSuccessToast("Reply added successfully!");
    } catch (error) {
      showErrorToast("Something went wrong");
    } finally {
      setReplyText("");
      getAllCommentByPostId();
      handleAllReplyByCommntId();
    }
  };

  const handleUpdateReply = async (commentId) => {
    try {
      const formData = {
        comment: updateReplyText,
      };
      const response = await axiosInstance.put(
        `v2/LHS/User/updateReply/${commentId}`,
        formData
      );
      setUpdateReplyText("");
      setUpdateReplyId(null);
      showSuccessToast("Reply updated successfully!");
    } catch (error) {
      showErrorToast("Something went wrong");
    } finally {
      handleAllReplyByCommntId();
      getAllCommentByPostId();
    }
  };

  const handleLikePost = () => {
    let url = `/v2/LHS/User/likeDislikePost`;
    axiosInstance
      .post(url, { postId: props?._id })
      .then((res) => {
        console.log("res?.data?.message", res?.data?.message);
        showSuccessToast(res?.data?.message);
        if (likeState) {
          setLikeState(false);
          setCount((s) => s - 1);
        } else {
          setLikeState(true);
          setCount((s) => s + 1);
        }
      })
      .catch((err) => {
        showErrorToast("Something went wrong!");
      });
  };

  const handleLikeComment = async (commentId) => {
    let url = `/v2/LHS/User/likeDislikeComment`;
    axiosInstance
      .post(url, { commentId: commentId })
      .then((res) => {
        showSuccessToast(res?.data?.message);
        getAllCommentByPostId();
      })
      .catch((err) => {
        showErrorToast("Something went wrong!");
      });
  };

  const [likeState, setLikeState] = useState(props?.isLiked);

  const renderImage = (isLiked) => {
    if (isLiked ?? likeState) {
      return (
        <img
          src={likedTrue}
          alt="Liked"
          style={{ height: "20px", width: "20px" }}
        />
      );
    } else {
      return (
        <img src={like} alt="Like" style={{ height: "20px", width: "20px" }} />
      );
    }
  };

  const isImage = (url) => {
    const fileExtension = url.split(".").pop().toLowerCase();
    return ["png", "jpeg", "jpg", "svg"].includes(fileExtension);
  };
  const isvideo = (url) => {
    const fileExtension = url.split(".").pop().toLowerCase();
    return ["mp4", "avi", "mkv", "mov"].includes(fileExtension);
  };

  const postImages = props?.fileUrl
    ?.filter((item) => isImage(item))
    .map((src) => {
      return { src: src, alt: "" };
    });
  const postVideos = props?.fileUrl?.filter((item) => isvideo(item));
  const userRole = props?.userId?.role.split(/(?=[A-Z])/);
  const JoinRole = userRole.join(" ");

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
      <ToastContainer />
      {hide ? null : (
        <div
          id={id}
          className="p-4 border border-gray-100 bg-white 2xl:w-[760px] lg:w-[666px] sm:w-full"
          style={{
            // width: "670px",
            borderRadius: "5px",
            // margin: "0 auto",
          }}
          onClick={() => handleidData(props)}
        >
          <div>
            <div className=" flex justify-between">
              <div className=" flex items-center">
                <img
                  src={props?.userId?.image ? props.userId.image : user}
                  style={{
                    height: "80px",
                    width: "80px",
                    borderRadius: "40px",
                  }}
                />
                <div className="ml-4">
                  <h1 className="font-medium text-[18px] ">
                    {" "}
                    {props?.userId?.name
                      ? props?.userId?.name
                      : props?.userId?.firstName +
                        " " +
                        props?.userId?.lastName}
                  </h1>
                  <h1 className="text-gray-500 text-[15px] mt-1">
                    {props?.userId?.jobTitle
                      ? props?.userId?.jobTitle
                      : JoinRole}
                  </h1>
                  <h1 className="text-gray-500 text-[15px] mt-1">
                    {calculateTime(props?.createdAt)}
                  </h1>
                </div>
              </div>
              <div className="flex flex-col w-[10%]">
                <div className="flex justify-end relative">
                  <img
                    src={dots}
                    className="w-4 h-1 mt-4"
                    onClick={() => setHidePost((s) => !s)}
                  />
                  {hidePost && (
                    // <div className="absolute flex flex-wrap z-10 justify-between items-center border border-gray-100 mt-3 rounded-md px-2 py-4 shadow-current w-[150px] max-h-24 ml-auto top-[63%] bg-gradient-to-b from-opacity-10 via-opacity-10 to-white shadow-sm">
                    <div
                      ref={editPostPopup}
                      className="absolute flex flex-wrap justify-center items-center z-10  bg-white border border-gray-100 mt-5 rounded-md px-2 py-2 w-[150px] max-h-24 ml-auto "
                    >
                      {(isMyPost || token === "superAdmin") && (
                        <div>
                          <div className="flex items-center">
                            <img
                              src={edit}
                              style={{
                                width: "15px",
                                height: "15px",
                                marginRight: "10px",
                                cursor: "pointer",
                              }}
                              onClick={() => handlePost(props)}
                            />
                            <h2
                              className="ml-2 text-base cursor-pointer"
                              onClick={() => handlePost(props)}
                            >
                              Edit post
                            </h2>
                          </div>
                          <div className="flex items-center mt-2">
                            <img
                              src={deletebox}
                              style={{
                                width: "17px",
                                height: "18px",
                                marginRight: "8px",
                                cursor: "pointer",
                              }}
                            />
                            <h2
                              className="text-base ml-2 cursor-pointer"
                              onClick={openIsModal}
                              // ()=>handleSubmit(props._id)}
                            >
                              Delete Post
                            </h2>
                          </div>
                        </div>
                      )}
                      {token !== "superAdmin" && !isMyPost && (
                        <div className="flex items-center">
                          <img
                            src={hideEye}
                            style={{
                              width: "20px",
                              height: "15px",
                              marginRight: "10px",
                              cursor: "pointer",
                            }}
                          />
                          <h1
                            className="text-base leading-5 cursor-pointer"
                            onClick={handleHidePost}
                          >
                            Hide post
                          </h1>
                        </div>
                      )}
                      {isMyPost && (
                        <Modal
                          isOpen={modalOpen}
                          onClose={closeModal}
                          className="w-[600px]"
                        >
                          {/* Modal content for hiding the post */}
                        </Modal>
                      )}
                      {modalOpen && (
                        // <Modal
                        //   isOpen={modalOpen}
                        //   // onClose={closeModal}
                        //   // className="w-[300px]"
                        // >
                        <div
                          className="fixed inset-0 flex items-center justify-center z-50"
                          isOpen={modalOpen}
                        >
                          <div className="absolute inset-0 bg-black opacity-50"></div>
                          <div className="bg-white z-10 w-full h-full max-w-[600px] max-h-[284px] rounded-lg">
                            <div className="p-12">
                              <h1 className="font-medium text-xl text-center mb-5">
                                Delete post?
                              </h1>
                              <p className="text-base w-[26rem] m-auto mb-5">
                                Are you sure you want to permanently remove this{" "}
                                <span className="m-auto">
                                  post from LinkHealthStaff?
                                </span>
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
                                  // onClick={handleSubmit}
                                  onClick={() => {
                                    handleSubmit(props._id);
                                    setModalOpen(false);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        // </Modal>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {readMore ? (
              <p className="font-normal mt-2 w-full break-words">
                {props?.caption}
              </p>
            ) : (
              <p className="font-normal mt-4 text-container  w-full break-words">
                {props?.caption?.slice(0, 150)}{" "}
                {props?.caption?.length > 150 && (
                  <span
                    onClick={toggleReadMore}
                    className="cursor-pointer text-blue-600"
                  >
                    Read More
                  </span>
                )}
              </p>
            )}
            {props?.caption?.length > 100 && readMore && (
              <span
                onClick={toggleReadMore}
                className="cursor-pointer text-blue-600"
              >
                Read Less
              </span>
            )}

            {(postImages?.length > 0 || postVideos?.length > 0) && (
              <div className="mt-3 flex !gap-4 flex-wrap rounded-s h-auto w-full p-2 border border-gray-100">
                <LightboxComponent images={postImages} />
                {postVideos.map((item) => (
                  <video controls className="w-[100%] h-auto rounded-2xl">
                    <source src={item} type="video/mp4" />
                  </video>
                ))}
              </div>
            )}

            <div>
              <div className="mt-10 ">
                <LightboxComponent images={image} />
                <div
                  className={`mt-3 flex items-center  ${
                    count > 0 ? "justify-between" : "justify-end"
                  }`}
                >
                  {count > 0 && (
                    <div
                      className="flex items-center"
                      onClick={() =>
                        history.push({
                          pathname: "/likedPostList",
                          state: { postId: props._id },
                        })
                      }
                    >
                      <img
                        src={like_true}
                        style={{
                          height: "20px",
                          width: "20px",
                          marginRight: "10px",
                        }}
                      />
                      <h1>{count} </h1>
                    </div>
                  )}
                  {commentCount > 0 && (
                    <div
                      className="flex items-center justify-end"
                      onClick={() => setShowCommentModal(!showCommentModal)}
                    >
                      <h1 className="mr-2">{commentCount}</h1>
                      <h1>Comments</h1>
                    </div>
                  )}
                </div>
              </div>
              <div className="border border-[#000000]-600 mt-3 opacity-30	"></div>
              <div className="flex items-center justify-between  mt-3">
                <div className="flex items-center justify-center">
                  <div
                    className="flex items-center justify-center"
                    onClick={() => handleLikePost()}
                  >
                    {renderImage()}
                    <button className="ml-2">Like</button>
                  </div>
                </div>

                <div
                  className="flex items-center justify-center  "
                  onClick={() => setShowCommentModal(!showCommentModal)}
                >
                  <img
                    src={comment}
                    style={{
                      height: "19px",
                      width: "20px",
                    }}
                  />
                  <h1 className="ml-2">Comment</h1>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src={share}
                    style={{
                      height: "19px",
                      width: "20px",
                    }}
                  />
                  <RWebShare
                    data={{
                      text: "Link Health Care",
                      url: "http://localhost:80",
                      title: "GfG",
                    }}
                    onClick={() => console.log("shared successfully!")}
                  >
                    <button className="ml-2">Share</button>
                  </RWebShare>
                </div>
              </div>
            </div>

            {!showCommentModal &&
              allComments.slice(0, 1).map((data, index) => {
                const userRole = data?.userId?.role.split(/(?=[A-Z])/);
                const JoinRole = userRole.join(" ");
                const isMyComment = myProfile._id === data.userId._id;
                return (
                  <div onClick={() => setShowCommentModal(!showCommentModal)}>
                    <div key={index}>
                      <div className="flex items-center mt-10">
                        <img
                          src={data?.userId?.image ? data?.userId?.image : user}
                          style={{
                            height: "54px",
                            width: "54px",
                            borderRadius: "40px",
                            marginRight: "15px",
                          }}
                        />
                        <div
                          onClick={() => handleTogglePopup(data?._id)}
                          className="border border-gray-100 justify-between bg-slate-300  flex items-start py-2 px-3   rounded-lg"
                          style={{
                            backgroundColor: "#F3F2EF",
                            width: "100%",
                          }}
                        >
                          <div className="w-3/6">
                            <h1 className="font-[#333333] mt-2 text-lg font-medium leading-5 tracking-wide">
                              {data?.userId?.name
                                ? data?.userId?.name
                                : data?.userId?.firstName +
                                  " " +
                                  data?.userId?.lastName}
                            </h1>
                            <h1 className="text-gray-500 text-[15px]  mt-2">
                              {data?.userId?.role == "staff"
                                ? data?.userId?.jobTitle
                                : JoinRole}
                            </h1>
                            <h1 className="text-base font-normal leading-6 tracking-wide mt-2">
                              {data?.comment}
                            </h1>
                          </div>

                          <div className="flex item-center mt-2 w-[90px] justify-end">
                            <h1 className="font-extralight mr-2">
                              {calculateTime(data?.createdAt)}
                            </h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            {showCommentModal && (
              <div className="mt-3 p-2">
                <div>
                  <div className="flex items-center mt-3">
                    <img
                      src={profile?.image ? profile?.image : user}
                      style={{
                        height: "54px",
                        width: "54px",
                        borderRadius: "40px",
                        marginRight: "15px",
                      }}
                    />
                    <div className="border-gray-100 border rounded-lg justify-center w-10/12 items-center">
                      <input
                        className="border-gray-100 appearance-none border rounded w-full h-11 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="inline-full-name"
                        type="text"
                        placeholder="Add a comment"
                        value={commentText}
                        onChange={handleCommentChange}
                      />
                    </div>
                  </div>
                  <div className="flex items-center mt-3 ml-14">
                    {commentText?.length > 0 ? (
                      <div className="mb-10">
                        {isButtonHidden && (
                          <>
                            {" "}
                            <button
                              className="h-12 w-32 rounded-full bg-slate-200"
                              onClick={() => {
                                setCommentText("");
                                setIsButtonHidden(false);
                                setCommentids(null);
                                setUpdateComment("");
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              className="h-12 w-40 rounded-full bg-[#009CDE] ml-8"
                              onClick={() => {
                                if (commentIds) {
                                  handleUpdateComment(commentIds);
                                } else {
                                  handlePostComment();
                                }
                                setIsButtonHidden(true);
                              }}
                            >
                              {commentIds ? "Update comment" : "Post comment"}
                            </button>
                          </>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                {allComments.map((data, index) => {
                  const userRole = data?.userId?.role.split(/(?=[A-Z])/);
                  const JoinRole = userRole.join(" ");
                  const isMyComment = myProfile._id === data.userId._id;
                  return (
                    <div>
                      <div key={index}>
                        <div className="flex items-center">
                          <img
                            src={
                              data?.userId?.image ? data?.userId?.image : user
                            }
                            style={{
                              height: "54px",
                              width: "54px",
                              borderRadius: "40px",
                              marginRight: "15px",
                            }}
                          />
                          <div
                            onClick={() => handleTogglePopup(data?._id)}
                            className="border border-gray-100 justify-between bg-slate-300  flex items-start py-2 px-3   rounded-lg"
                            style={{
                              backgroundColor: "#F3F2EF",
                              width: "100%",
                            }}
                          >
                            <div className="w-3/6">
                              <h1 className="font-[#333333] mt-2 text-lg font-medium leading-5 tracking-wide">
                                {data?.userId?.name
                                  ? data?.userId?.name
                                  : data?.userId?.firstName +
                                    " " +
                                    data?.userId?.lastName}
                              </h1>
                              <h1 className="text-gray-500 text-[15px]  mt-2">
                                {/* {data?.userId?.role} */}
                                {/* {JoinRole} */}
                                {data?.userId?.role == "staff"
                                  ? data?.userId?.jobTitle
                                  : JoinRole}
                              </h1>
                              <h1 className="text-base font-normal leading-6 tracking-wide mt-2">
                                {data?.comment}
                              </h1>
                            </div>

                            <div className="flex item-center mt-2 w-[90px] justify-end">
                              <h1 className="font-extralight mr-2">
                                {calculateTime(data?.createdAt)}
                              </h1>
                              {console.log(
                                updateComment === data?._id,
                                isMyComment,
                                updateCommentOption,
                                "fghfghfghfgh"
                              )}
                              {updateComment === data?._id && isMyComment && (
                                <div
                                  ref={editCommentPopup}
                                  className="justify-center flex items-center z-10  bg-white border border-gray-100 mt-5 w-96 rounded-md px-2 py-4 absolute max-w-[200px]"
                                >
                                  <div>
                                    <div>
                                      <div className="flex items-center">
                                        <img
                                          src={edit}
                                          style={{
                                            width: "20px",
                                            height: "15px",
                                            marginRight: "10px",
                                            cursor: "pointer",
                                          }}
                                        />
                                        <h1
                                          onClick={() =>
                                            handleEditComment(data)
                                          }
                                          className="cursor-pointer"
                                        >
                                          Edit comment
                                        </h1>
                                      </div>
                                    </div>

                                    <div
                                      className="flex items-center mt-2"
                                      onClick={() =>
                                        handleDeleteComment(data?._id)
                                      }
                                    >
                                      <img
                                        src={deletebox}
                                        style={{
                                          width: "20px",
                                          height: "15px",
                                          marginRight: "10px",
                                          cursor: "pointer",
                                        }}
                                      />
                                      <h1 className="cursor-pointer">
                                        Delete comment
                                      </h1>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {isMyComment && (
                                <div className="justify-end">
                                  <img
                                    src={dots}
                                    className="w-4 h-1 align-top mt-1"
                                    onClick={() =>
                                      setUpdateCommentOption((s) => !s)
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-10/12 flex items-center ml-16 py-2 px-3">
                        <div
                          className="flex items-center py-2 px-2"
                          onClick={() => handleLikeComment(data._id)}
                        >
                          {renderImage(data?.isLiked)}
                        </div>
                        {data?.likeCount > 0 ? (
                          <button
                            onClick={() =>
                              history.push({
                                pathname: "/LikedCommentList",
                                state: {
                                  commentId: data?._id,
                                },
                              })
                            }
                          >
                            {data?.likeCount} Like
                          </button>
                        ) : (
                          <p>Likes</p>
                        )}

                        <div
                          className="flex items-center py-2 px-3"
                          onClick={() => setCurrentCommentId(data._id)}
                        >
                          <img
                            src={reply}
                            style={{
                              height: "12px",
                              width: "12px",
                              marginRight: "10px",
                              cursor: "pointer",
                            }}
                          />
                          <h1 className="cursor-pointer">
                            {data?.replies?.length} replies
                          </h1>
                        </div>
                      </div>
                      {currentCommentId == data._id &&
                        allReplyByCommntId?.replyData?.map((item) => {
                          const isMyReply = myProfile._id === item.userId._id;
                          console.log(isMyReply, "isMyReplyisMyReply");
                          return (
                            <>
                              <div className="flex justify-end">
                                {updateReplyId &&
                                  updateReplyId == item?._id &&
                                  !updateReply && (
                                    <div
                                      ref={updateReplyPopup}
                                      className="justify-center flex items-center z-10  bg-white border border-gray-100 mt-16 w-80 rounded-md px-2 py-4 absolute max-w-[200px]"
                                    >
                                      <div>
                                        <div>
                                          <div className="flex items-center">
                                            <img
                                              src={edit}
                                              style={{
                                                width: "20px",
                                                height: "15px",
                                                marginRight: "10px",
                                                cursor: "pointer",
                                              }}
                                            />
                                            <h1
                                              onClick={() =>
                                                handleEditReply(item)
                                              }
                                              className="cursor-pointer"
                                            >
                                              Edit reply
                                            </h1>
                                          </div>
                                        </div>

                                        <div
                                          className="flex items-center mt-2"
                                          onClick={() => {}}
                                        >
                                          <img
                                            src={deletebox}
                                            style={{
                                              width: "20px",
                                              height: "15px",
                                              marginRight: "10px",
                                              cursor: "pointer",
                                            }}
                                          />
                                          <h1
                                            onClick={() =>
                                              handleDeleteReply(item?._id)
                                            }
                                            // onClick={() =>
                                            //   handleDeleteComment(data?._id)
                                            // }
                                            className="cursor-pointer"
                                          >
                                            Delete reply
                                          </h1>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                <div className="flex items-center w-11/12">
                                  <img
                                    src={
                                      item?.userId?.image
                                        ? item.userId.image
                                        : user
                                    }
                                    style={{
                                      height: "54px",
                                      width: "54px",
                                      borderRadius: "40px",
                                      marginRight: "15px",
                                    }}
                                  />

                                  <div
                                    className="border border-gray-100 justify-between bg-slate-300 flex items-start py-2 px-3 rounded-lg mt-4"
                                    style={{
                                      backgroundColor: "#F3F2EF",
                                      width: "84%",
                                    }}
                                  >
                                    <div>
                                      <h1 className="font-[#333333] mt-2 text-lg font-medium leading-5 tracking-wide">
                                        {item?.userId?.name
                                          ? item?.userId?.name
                                          : item?.userId?.firstName +
                                            " " +
                                            item?.userId?.lastName}
                                      </h1>

                                      <h1 className="text-gray-500 text-[15px] mt-2">
                                        {item?.userId?.jobTitle
                                          ? item?.userId?.jobTitle
                                          : JoinRole}
                                      </h1>

                                      <h1 className="font-[#333333]  text-base mt-2 w-40 leading-5 tracking-wide font-normal">
                                        {item?.comment}
                                      </h1>
                                    </div>

                                    {/* {isMyReply && ( */}
                                    <div className="flex item-center mt-2 w-[90px] justify-end">
                                      <h1 className="font-extralight mr-2 ">
                                        {calculateTime(item?.createdAt)}
                                      </h1>
                                      {isMyReply && (
                                        <img
                                          src={dots}
                                          className="w-4 h-1 mt-2"
                                          onClick={() => {
                                            setUpdateReply(false);
                                            handleToggleReplyPopup(item._id);
                                          }}
                                        />
                                      )}
                                    </div>
                                    {/* // )} */}
                                  </div>
                                </div>
                              </div>
                              {updateReplyId == item._id && updateReply && (
                                <div className="flex items-center justify-end mt-3">
                                  <img
                                    src={
                                      item?.userId?.image
                                        ? item?.userId?.image
                                        : user
                                    }
                                    style={{
                                      height: "38px",
                                      width: "38px",
                                      borderRadius: "40px",
                                      marginRight: "15px",
                                    }}
                                  />
                                  <div className="border-gray-100 border rounded-lg justify-center w-10/12 items-center">
                                    <input
                                      className="border-gray-100 appearance-none border rounded w-full h-11 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      id="inline-full-name"
                                      type="text"
                                      placeholder="Update  reply"
                                      value={updateReplyText}
                                      onChange={(e) =>
                                        setUpdateReplyText(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center mt-3 ml-14">
                                {updateReplyId == item._id && updateReply && (
                                  <div className="mb-10">
                                    <button
                                      onClick={() => {
                                        setUpdateReply(false);
                                        setUpdateReplyId(null);
                                        setUpdateReplyText("");
                                      }}
                                      className="h-12 w-32 rounded-full bg-slate-200"
                                    >
                                      Cancel
                                    </button>
                                    {updateReplyText && (
                                      <button
                                        onClick={() =>
                                          handleUpdateReply(item._id)
                                        }
                                        className="h-12 w-40 rounded-full bg-[#009CDE] ml-8"
                                      >
                                        Update Reply
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        })}
                      {currentCommentId == data._id && (
                        <div className="flex items-center justify-end mt-3">
                          <img
                            src={profile?.image ? profile?.image : user}
                            style={{
                              height: "38px",
                              width: "38px",
                              borderRadius: "40px",
                              marginRight: "15px",
                            }}
                          />
                          <div className="border-gray-100 border rounded-lg justify-center w-10/12 items-center">
                            <input
                              className="border-gray-100 appearance-none border rounded w-full h-11 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="inline-full-name"
                              type="text"
                              placeholder="Add a reply"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center mt-3 ml-32">
                        {currentCommentId == data._id && (
                          <div className="mb-10">
                            <button
                              onClick={() => {
                                setCurrentCommentId("");
                                setReplyText("");
                              }}
                              className="h-12 w-32 rounded-full bg-slate-200"
                            >
                              Cancel
                            </button>
                            {replyText && (
                              <button
                                onClick={() => handleReplyComment(data._id)}
                                className="h-12 w-40 rounded-full bg-[#009CDE] ml-8"
                              >
                                Reply
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
