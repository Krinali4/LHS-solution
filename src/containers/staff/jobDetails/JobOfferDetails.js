import React, { useEffect, useState } from "react";
import NewNavigation from "../../../components/theme_2/components/newNavigation";
import Header from "./../../../components/theme_2/components/header";
import right_arrow from "../../../components/assets/images/right_arrow.png";
import jobImg from "../../../components/assets/images/doctors-nurse-walking-corridor 1.png";
import tickIcon from "../../../components/assets/images/tickIcon.png";
import { Tab, Tabs, Modal, Button } from "react-bootstrap";
import voice_call from "../../../components/assets/images/voice_call.png";
import video_call from "../../../components/assets/images/video_call.png";
import chat from "../../../components/assets/images/chat.png";
import JobDetailsSection from './../../../components/containers/staff/job_details_section';

import right_arrow_black from "../../../components/assets/images/right_arrow_black.png"

import applied_active from "../../../components/assets/images/applied_active.png"
import under_review_active from "../../../components/assets/images/under_review_active.png"
import interview_inactive from "../../../components/assets/images/interview_inactive.png"
import interview_active from "../../../components/assets/images/interview_active.png"
import job_offer_inactive from "../../../components/assets/images/job_offer_inactive.png"
import job_offer_active from "../../../components/assets/images/job_offer_active.png"
import hired_inactive from "../../../components/assets/images/hired_inactive.png"
import hired_active from "../../../components/assets/images/hired_active.png"
import { callApi } from "../../../action";
import RateReviewModal from './../../../components/containers/staff/rate_review_modal';
import { changeDateFormat } from './../constants';
import moment from 'moment';
import { AddReasonModal } from './../myJobs/myJob';

const AddReasonModall = (props) => {
    const [showErr, setShowErr] = useState(false);
    console.log(props.userData, "userData")
    return <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName=""
    >
        <Modal.Body>
            <div className="px-lg-5">

                {/* <div className="row m-0 justify-content-center align-items-center">
                    <div className="col-12 p-lg-0 p-2 d-flex justify-content-center align-items-center">
                        <p className="mb-0 rate_reviw_modal_heading">Prime Healthcare</p>
                    </div>
                </div> */}

                <div className="row m-0 mt-3 hide_in_web">
                    <div className="col-12 p-0 mobile_devider">

                    </div>
                </div>

                <div className="row m-0 mt-4">
                    <div className="col-12 p-0 p-lg-4 p-1">

                        <div className="row m-0">
                            <div className="col-lg-6 col-12 d-flex align-items-center p-0">
                                <img
                                    alt="avatar.png"
                                    src={jobImg}
                                    width="70px"
                                    height="70px"
                                    className="job_image"
                                    style={{ borderRadius: "50%" }}
                                />

                                <div className="ms-4">
                                    <p className="mb-0 username ">{props.userData ? props.userData.jobTitle : "Michael Pollak"}</p>
                                    {/* <p className="mb-0 role">{props.userData ? props.userData.healthCareLocation : "Adventist Health"}</p> */}
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-center my-4">
                            <p className="mb-0 ">
                                {props.applicationType === "withdrawn" ? "Reason for withdraw application" : "Reason for rejecting"}
                            </p>
                        </div>

                        <div className="row m-0 rate_reviw_card_comment mt-3">
                            <textarea
                                id="w3review"
                                name="w3review"
                                rows="4"
                                cols="50"
                                placeholder="Write your comment here"
                                style={{ borderColor: showErr && props.rejectReason === "" ? 'red' : '' }}
                                onChange={props.setRejectReason}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="row m-0 justify-content-center align-items-center rate_reviw_card_footer mt-3">
                    <div className="col-12 p-0 ps-lg-0 pe-lg-0 ps-1 pe-1 d-flex justify-content-center align-items-center">
                        <Button
                            variant="primary"
                            onClick={() => {
                                setShowErr(true);
                                if (props.rejectReason) {
                                    props.rejectJobOffer();
                                    setShowErr(false);
                                }
                            }}
                            className="post_review_btn"
                        >
                            SUBMIT
                        </Button>
                    </div>
                </div>
            </div>
        </Modal.Body>
    </Modal>
}

const JobOfferDetails = (props) => {
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [reviewModal, setShowReviewModal] = useState(false);
    const [applicationType, setApplicationType] = useState("");
    const [reviewData, setReviewData] = useState([]);
    const [data, setData] = useState({});
    const [status, setStatus] = useState("");
    const [rejectReason, setrejectReason] = useState("");

    useEffect(() => {
        if (props.location.state) {
            setStatus(props.location.state.status);
            setData(props.location.state.data);
            // getJobOfferDetailsById(props.location.state.data._id);
        }
    }, [props.location.state]);

    const getAllReviews = async (id) => {
        var token = localStorage.getItem("accessToken");
        const data = await callApi(
            "GET",
            `v1/LHS/rating/getHospitalRating/${id}`,
            `Bearer ${token}`
        );
        if (data.status === 200) {
            setReviewData(data.data)
        }
    }

    // const getJobOfferDetailsById = async (id) => {
    //     var token = localStorage.getItem("accessToken");
    //     const data = await callApi(
    //         "GET",
    //         `v1/LHS/job/get/${id}`,
    //         `Bearer ${token}`
    //     );
    //     if (data) {
    //         setData(data.data);
    //         console.log(data, "DDDDDD");
    //     }
    // }

    const acceptJobOffer = async (id) => {
        var token = localStorage.getItem("accessToken");
        const data = await callApi(
            "POST",
            `v1/LHS/staff/accept/${id}`,
            `Bearer ${token}`
        );
        if (data.status === 200) {
            setData(data.data);
            props.history.push("/main/staff/my-jobs");
        }
    }

    const rejectJobOffer = async (id) => {
        var token = localStorage.getItem("accessToken");
        let obj = {
            rejectionReason: rejectReason,
        }
        if (applicationType !== "withdrawn") {
            obj.isJobRejected = true;
            obj.status = "Rejected",
                obj.rejectedBy = "staff"
        }
        let url = applicationType === "withdrawn" ? `v1/LHS/staff/withdraw/${data._id}` : `v1/LHS/staff/reject/${data._id}`;
        const responseData = await callApi(
            "POST",
            url,
            `Bearer ${token}`,
            obj
        );
        setShowReasonModal(false)
        if (responseData.status === 200) {
            setData(responseData.data);
            props.history.push("/main/staff/my-jobs");
        }
    }


    return (
        <div className="theme2">
            <NewNavigation />
            <div className="theme2_container">
                <Header page="My Jobs" />

                <div className="theme2_main_container">
                    <div className="d-flex align-items-center mb-3">
                        <img
                            alt="right_arrow.png"
                            src={right_arrow}
                            style={{ borderRadius: "50%", cursor: "pointer" }}
                            onClick={() => props.history.push("/main/staff/my-jobs")}
                        />
                        <p className="mb-0 d-flex align-items-center">
                            <span
                                className="mb-0 go_back_link ps-3"
                                style={{ cursor: "pointer" }}
                                onClick={() => props.history.push("/main/staff/my-jobs")}
                            >
                                My Jobs &nbsp;
                            </span>{" "}
                            / &nbsp;
                            <span className="hospital_name_link">{data.jobTitle}</span>
                        </p>
                    </div>

                    <div className="job_offer_details_background py-4">
                        <div className="row m-0 find_jobs_card find_jobs_card_non_background d-flex align-items-center mt-4">
                            <div
                                className="col-2 p-0 d-flex align-items-center justify-content-center"
                                style={{ width: "12%" }}
                            >
                                <div className="t2_sp_avatar_img position-relative">
                                    <img
                                        alt="avatar.png"
                                        src={jobImg}
                                        className="job_image"
                                        style={{ borderRadius: "50%" }}
                                    />
                                    <img src={tickIcon} alt="badge.png" className="tick_icon" />
                                </div>
                            </div>
                            <div className="col-3 p-0">
                                <p className="job_name mb-1">{data.jobTitle}</p>
                                {/* <p className="job_location mb-1">
                                        <span style={{ marginRight: 8 }}>
                                            <img alt="place" width="13px" height="16px" src={place} />
                                        </span>{" "}
                                        Los Angeles, CA
                                    </p> */}
                                    {console.log(data, 'in jobs detailssssssssss')}
                                {/* <p className="job_date mb-1">Expected Start Date: {data.expectedStartDate && moment(data.expectedStartDate).format("MM-DD-YYYY") || "---"}</p> */}
                                <p className="job_date mb-1">Expected Start Date: {data.startDate ? moment(data.startDate).format("MM-DD-YYYY") : moment(data.expectedStartDate).format("MM-DD-YYYY")}</p>
                            </div>
                            <div className="col-2 p-0">
                                <div className="permanent_position_btn">
                                    <button>{data.contractType}</button>
                                    {data.contractType !== "Permanent Position" && <>
                                        {data.weekendAvailiblity && <button className="mt-2">Weekend Job</button>}
                                        {data.timeCommitment && <button className="mt-2">{data.timeCommitment === "Full Time" ? "Full Time (8hrs or more)" : data.timeCommitment}</button>}
                                    </>}
                                </div>
                            </div>
                            <div
                                className="col-2 p-0 d-flex align-items-center flex-column justify-content-center job_work_name ms-5"
                                style={{ width: "17%" }}
                            >
                                {console.log(data, "DATATATTATATAT")}
                                <p className="mb-0 name_tag">Contract Length</p>
                                <p className="mb-0 job_rating_count justify-content-center">
                                    {/* <img
                                            src={starIcon}
                                            alt="badge.png"
                                            className=""
                                            width="25px"
                                            height="25px"
                                        />
                                        4.5 */}
                                    {data.contractType !== "Permanent Position" ? <> {props.location.state.onGoingJobs ? <span>{data.totalDays} Days</span> : <span>{data.contractLength && data.contractLength.duration} {data.contractLength && data.contractLength.length}</span>}</> :
                                        <span>Permanent</span>
                                    }


                                </p>
                            </div>

                            {status === "completed" && <div className="job_appliction_btn completed col-3 d-flex align-items-center justify-content-center p-0">
                                <button className="completed">COMPLETED</button>
                            </div>}

                            {status === "onGoing" && <div className="col-3 pl-5 d-flex align-items-center justify-content-center">
                                <p className="mb-0 justify-content-center">
                                    {data.daysWorked} of {data.totalDays} days completed
                                </p>
                            </div>}

                            {status === "InterestJob" && <div className="col-3 d-flex align-items-center justify-content-center p-0">
                                <button className="apply_job_btn">Shows Interest</button>
                            </div>}

                            {status === "appliedJobs" && <div className="col-3 d-flex align-items-center justify-content-center p-0">
                                <button className="apply_job_btn" onClick={() => {
                                    setShowReasonModal(true);
                                    setApplicationType("withdrawn");
                                }}>Withdraw Application</button>
                            </div>}
                            {status === "jobOffer" && <div className="mt-3 col-3 d-flex flex-column align-items-center justify-content-center p-0">
                                <button className="apply_job_btn" onClick={() => acceptJobOffer(data._id)}>Accept Offer</button>
                                <p className="mb-0 mt-2 reject_job_link" onClick={() => {
                                    setShowReasonModal(true);
                                    setApplicationType("rejectOffer");
                                }}>Reject Offer</p>
                            </div>}

                            {status === "rejected" && <div className="col-3 d-flex align-items-center justify-content-center p-0">
                                <button style={{ backgroundColor: '#EB5757', border: 'none' }} className="apply_job_btn">Rejected</button>
                            </div>}
                            {status === "withdrawn" && <div className="col-3 d-flex align-items-center justify-content-center p-0">
                                <button style={{ backgroundColor: '#EB5757', border: 'none' }} className="apply_job_btn">Withdrawn</button>
                            </div>}
                        </div>

                        {status === "onGoing" && status === "jobOffer" && <div className="px-5 mt-4">
                            <hr />

                            <div className="row m-0 d-flex justify-content-center align-items-center">

                                <div className="col-3">
                                    <div onClick={() => props.history.push("/main/staff/chats")} className="job_offer_details_btn d-flex align-items-center justify-content-center">
                                        <img src={chat} width="24px" alt="" />
                                        <p className="mb-0 ps-3">CHAT</p>
                                    </div>
                                </div>

                            </div>
                        </div>}



                        {/* {status !== "rejected" && status !== "withdrawn" && <div className="row m-0 mx-5 mt-4 job_offer_process_flow">
                            <div className="col-12 p-0 pt-3">
                                <div className="job_details_area_box_card py-4 row m-0">
                                    <div className="col-3 px-3 d-flex align-items-center">
                                        <div className="d-flex align-items-center m-0">
                                            <div className="active_icon">
                                                <img src={applied_active} alt="" />
                                            </div>

                                            <div className="ps-3">
                                                <p className="mb-0 mb-1 appication_status">Applied</p>
                                                <p className="mb-0 appication_status_date">01/09/2021  10:30 AM</p>
                                            </div>
                                        </div>

                                        <img src={right_arrow_black} width="30px" className="ps-3" alt="" />
                                    </div>

                                    <div className="col-3 p-0 d-flex align-items-center">
                                        <div className="d-flex align-items-center m-0">
                                            <div className="active_icon">
                                                <img src={under_review_active} alt="" />
                                            </div>

                                            <div className="ps-3">
                                                <p className="mb-0 mb-1 appication_status">Under Review </p>
                                                <p className="mb-0 appication_status_date">01/09/2021  10:30 AM</p>
                                            </div>
                                        </div>

                                        <img src={right_arrow_black} width="30px" className="ps-3" alt="" />
                                    </div>

                                    <div className="col-2 p-0 d-flex align-items-center">
                                        <div className="d-flex align-items-center m-0">
                                            <div className={`${(status === "onGoing" || status === "jobOffer") ? "active_icon" : "inactive_icon"}`}>
                                                <img src={(status === "onGoing" || status === "jobOffer") ? interview_active : interview_inactive} alt="" />
                                            </div>

                                            <div className="ps-3">
                                                <p className="mb-0 mb-1 appication_status">Interview </p>
                                            </div>
                                        </div>

                                        <img src={right_arrow_black} width="30px" className="ps-3" alt="" />
                                    </div>

                                    <div className="col-2 p-0 d-flex align-items-center">
                                        <div className="d-flex align-items-center m-0">
                                            <div className={`${(status === "onGoing" || status === "jobOffer") ? "active_icon" : "inactive_icon"}`}>
                                                <img src={(status === "onGoing" || status === "jobOffer") ? job_offer_active : job_offer_inactive} alt="" />
                                            </div>

                                            <div className="ps-3">
                                                <p className="mb-0 mb-1 appication_status">Job Offer  </p>
                                            </div>
                                        </div>

                                        <img src={right_arrow_black} width="30px" className="ps-3" alt="" />
                                    </div>

                                    <div className="col-2 p-0 d-flex align-items-center">
                                        <div className="d-flex align-items-center m-0">
                                            <div className={`${status === "onGoing" ? "active_icon" : "inactive_icon"}`}>
                                                <img src={status === "onGoing" ? hired_active : hired_inactive} alt="" />
                                            </div>

                                            <div className="ps-3">
                                                <p className="mb-0 mb-1 appication_status">Hired  </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>} */}


                        <JobDetailsSection setModalShow={() => {
                            setShowReviewModal(true);
                            console.log(data, "sASasAS")
                            getAllReviews(status === "onGoing" ? data.job.hospital._id : data.ratings ? data.hospital._id : data.hospital._id);
                        }} data={data} status={status} />
                    </div>
                </div>
            </div>

            {reviewModal && reviewData.length && <RateReviewModal
                show={reviewModal}
                onHide={() => setShowReviewModal(false)}
                reviewData={reviewData}
                data={data}
            />}


            {showReasonModal && (
                <AddReasonModal
                    userData={data}
                    show={showReasonModal}
                    applicationType={applicationType}
                    onHide={() => setShowReasonModal(false)}
                    setRejectReason={(e) => setrejectReason(e.target.value)}
                    rejectJobOffer={rejectJobOffer}
                    rejectReason={rejectReason}
                    keyValue={true}
                />
            )}
        </div>
    );
};

export default JobOfferDetails;
