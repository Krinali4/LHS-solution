import NewNavigation from "../../../components/theme_2/components/newNavigation";
import Header from './../../../components/theme_2/components/header';
import React from 'react';
import place from "../../../components/assets/images/place.svg";
import jobImg from "../../../components/assets/images/doctors-nurse-walking-corridor 1.png";
import tickIcon from "../../../components/assets/images/tickIcon.png";
import starIcon from "../../../components/assets/images/star_icon.svg";
import right_arrow from "../../../components/assets/images/right_arrow.png";

import MobileProfilePic from "../../../components/assets/images/MobileProfilePic.png";
import Location from "../../../components/assets/images/Location.png";
import MobileStar from "../../../components/assets/images/MobileStar.png";

import RateReviewModal from './../../../components/containers/staff/rate_review_modal';
import JobDetailsSection from './../../../components/containers/staff/job_details_section';
import { useEffect, useState } from 'react';
import { callApi } from "../../../action";
import { Spinner } from 'react-bootstrap';
import { changeDateFormat } from './../constants';
import moment from 'moment';

const JobDetails = (props) => {

    const [modalShow, setModalShow] = useState(false);
    const [data, setData] = useState({});
    const userId = localStorage.getItem("_id");
    const [showSpinnerApplyJob, setshowSpinnerApplyJob] = useState("");
    const [reviewData, setReviewData] = useState([]);

    useEffect(() => {
        if (props.location.state) {
            setData(props.location.state);
            if (props.location.state.hospital) {
                getAllReviews(props.location.state.hospital._id)
            }
        }
    }, [props.location.state]);

    const applyJobFunc = async (id) => {
        setshowSpinnerApplyJob(id);
        var token = localStorage.getItem("accessToken");
        const resData = await callApi(
            "POST",
            `v1/LHS/job/apply/${id}`,
            `Bearer ${token}`
        );
        if (resData.token === 200) {
            // props.history.push('/main/staff/find-jobs')
            let copyData = { ...data };
            console.log(copyData);
            copyData.appliedBy.push(userId);
            setData(copyData);
            console.log(copyData);
            setshowSpinnerApplyJob("");
        }
    }

    const getAllReviews = async (id) => {
        var token = localStorage.getItem("accessToken");
        const data = await callApi(
            "GET",
            `v1/LHS/rating/getHospitalRating/${id}`,
            `Bearer ${token}`
        );
        if (data.status === 200) {
            console.log(data)
            setReviewData(data.data)
        }
    }

    console.log(data)

    return <div className="theme2">
        <NewNavigation />
        <div className="theme2_container">
            <Header page="Find Jobs" />

            {Object.keys(data).length ? <div className="theme2_main_container">
                <div className="d-flex align-items-center mb-3">
                    <img
                        alt="right_arrow.png"
                        src={right_arrow}
                        style={{ borderRadius: "50%", cursor: "pointer" }}
                        onClick={() => props.history.push('/main/staff/find-jobs')}
                    />
                    <p className="mb-0 d-flex align-items-center" >
                        <span className="mb-0 go_back_link ps-3" style={{ cursor: "pointer" }} onClick={() => props.history.push('/main/staff/find-jobs')}>
                            Find Jobs &nbsp;
                        </span>  /  &nbsp;<span className="hospital_name_link">{data.jobTitle}</span></p>
                </div>
                <div className="job_details_bk py-5 w-100">

                    <div className="row m-0 mb-4 web_cards_parent">
                        <div className="col-12 p-0">
                            <div className="row m-0 find_jobs_card find_jobs_card_non_background align-items-center">
                                <div className="col-2 p-0 d-flex align-items-center justify-content-center"
                                    style={{ width: "14%" }} >

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
                                    <p className="job_date mb-1">Expected Start Date: {data.expectedStartDate && moment(data.expectedStartDate).format("MM-DD-YYYY") || "---"}</p>
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

                                <div className="col-3 p-0 d-flex align-items-center flex-column justify-content-center job_work_name ms-5"
                                    style={{ width: "22%" }} >

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
                                        {data.contractType !== "Permanent Position" ? <span>{data.contractLength.duration} {data.contractLength.length}</span> :
                                            <span>Permanent</span>
                                        }
                                    </p>
                                </div>


                                {data.openPositions === data.positionsFilled ? <div className="col-2 d-flex align-items-center justify-content-center p-0">
                                    <button
                                        className="apply_job_btn apply_job_btn_disabled"
                                        disabled
                                    >
                                        Positions Filled
                                    </button></div>
                                    : <div className="col-2 d-flex align-items-center justify-content-center p-0">
                                        {data.appliedBy.includes(userId) ? (
                                            <button className="apply_job_btn apply_job_btn_disabled" disabled>
                                                APPLIED
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    applyJobFunc(data._id);
                                                }}
                                                className="apply_job_btn"
                                            >
                                                {showSpinnerApplyJob === data._id ? <Spinner animation="border" /> : "APPLY JOB"}
                                            </button>
                                        )}
                                    </div>}



                            </div>
                        </div>
                    </div>

                    <div className="row m-0 mobile_cards_parent">
                        <div className="col-12 p-0 mobile_cards_inner">

                            <div className="row m-0">
                                <div className="col-12 p-3 card_type_one card_type_two">
                                    <div className="row m-0">
                                        <div className="col-4 p-0 d-flex align-items-center">
                                            <img src={MobileProfilePic} alt="" />
                                        </div>
                                        <div className="col-8 p-0 d-flex flex-column align-items-left justify-content-center">
                                            <p className="mb-0 post_type">
                                                {data.jobTitle}
                                            </p>
                                            <p className="mb-0 mt-1 post_address">
                                                {" "}
                                                <img className="mb-1" src={Location} alt="" /> &nbsp;
                                                {/* {v.healthCareLocation} */}Los Angeles, CA
                                            </p>
                                            <p className="mb-0 mt-1 post_esd">
                                                Expected Start Date: {data.expectedStartDate && moment(data.expectedStartDate).format("MM-DD-YYYY") || "---"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="row m-0 mt-3">
                                        <div className="col-12 p-0">
                                            <button className="mobile_perm_position">
                                                {data.contractType}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="row m-0 mt-4">
                                        <div className="col-12 p-0">
                                            <p className="mb-0 prime_healthcare text-center">
                                                {/* {v.medicalSettings} */}Contract Length
                                            </p>
                                            <p className="mb-0 mt-2 contract_period text-center">
                                                {data.contractLength.duration} {data.contractLength.length}
                                            </p>
                                        </div>
                                    </div>

                                    {data.openPositions === data.positionsFilled ? <div className="col-2 d-flex align-items-center justify-content-center p-0">
                                        <button
                                            className="apply_job_btn apply_job_btn_disabled"
                                            disabled
                                        >
                                            Positions Filled
                                        </button></div>
                                        : <div className="row m-0 mt-4">
                                            <div className="col-12 p-0">

                                                {data.appliedBy.includes(userId) ? (
                                                    <button className="mobile_apply_job apply_job_btn_disabled" disabled>
                                                        APPLIED
                                                    </button>
                                                ) : (
                                                    <button className="mobile_apply_job" onClick={(e) => {
                                                        e.stopPropagation();
                                                        applyJobFunc(data._id);
                                                    }}>
                                                        {showSpinnerApplyJob === data._id ? <Spinner animation="border" /> : "APPLY JOB"}
                                                    </button>
                                                )}


                                            </div>
                                        </div>}


                                </div>
                            </div>

                        </div>
                    </div>

                    <JobDetailsSection setModalShow={setModalShow} data={data} />
                </div>

                {reviewData.length ?
                    <RateReviewModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        reviewData={reviewData}
                        data={data}
                    /> : null}




            </div> : null}
        </div>
    </div>
}

export default JobDetails;