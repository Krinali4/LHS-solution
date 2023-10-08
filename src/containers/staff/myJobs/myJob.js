import React, { useState, useEffect } from "react";
import Header from "./../../../components/theme_2/components/header";
import NewNavigation from "../../../components/theme_2/components/newNavigation";
import { Tab, Tabs, Modal, Button, Spinner } from "react-bootstrap";
import JobHeader from "./../../../components/containers/staff/job_header";
import place from "../../../components/assets/images/place.svg";
import jobImg from "../../../components/assets/images/doctors-nurse-walking-corridor 1.png";
import avatar from "../../../components/assets/images/avatar.png";
import tickIcon from "../../../components/assets/images/tickIcon.png";
import starIcon from "../../../components/assets/images/star_icon.svg";
import starIconGray from "../../../components/assets/images/rating_gray.svg";
import searchIcon from "../../../components/assets/images/search_icon.png";
import left_arrow from "../../../components/assets/images/left_arrow.png";
import { callApi } from "./../../../action";
import RateReviewModal from './../../../components/containers/staff/rate_review_modal';
import { changeDateFormat } from './../constants';
import moment from 'moment';
import Pagination from "../../../components/theme_2/admin/pagination";
import Loader from "../../../components/modals/Loader";
import Alert from "../../../components/modals/alert";

export const AddReasonModal = (props) => {
    const [showErr, setShowErr] = useState(false);
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
                        <p className="mb-0 rate_reviw_modal_heading">{props.userData ? props.userData.medicalSettings : "Prime Healthcare"}</p>
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
                                {console.log(props.userData.hospital, 'in line 48 for image')}
                             {props.keyValue ? 
                                <img
                                    alt="avatar.png"
                                    src={props.userData.hospital && props.userData.hospital.avatar!== '' ? props.userData.hospital.avatar : avatar}
                                    width="70px"
                                    height="70px"
                                    className="job_image"
                                    style={{ borderRadius: "50%" }}
                                />
                           :
                           <img
                           alt="avatar.png"
                           src={props.userData && props.userData.avatar!== '' ? props.userData.avatar : avatar}
                           width="70px"
                           height="70px"
                           className="job_image"
                           style={{ borderRadius: "50%" }}
                       />
                           }

                                <div className="ms-4">
                               

                                    {props.keyValue ? <p className="mb-0 username ">{typeof (props.userData.hospital) === "object" ? props.userData.hospital.healthCareInstitution.name : props.userData.hospitalName}</p>
                                        : <p className="mb-0 username ">{typeof (props.userData.hospital) === "object" ? props.userData.hospital.name : props.userData.name}</p>
                                    }


                                    {/* <p className="mb-0 role">{props.userData ? props.userData.jobTitle : "Adventist Health"}</p> */}
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

export const AddReviewModal = (props) => {
    console.log(props, "data")
    const [ratingArr, setratingArr] = useState([true, false, false, false, false]);
    const [review, setReview] = useState("");

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName=""
        >
            <Modal.Body>
                <div className="px-lg-5">
                    {/* <div className="row m-0 justify-content-center align-items-center">
                        <div className="col-12 p-0 d-flex justify-content-center align-items-center">
                            <p className="mb-0 rate_reviw_modal_heading">Prime Healthcare</p>
                        </div>
                    </div> */}

                    <div className="row m-0 mt-3 hide_in_web">
                        <div className="col-12 p-0 mobile_devider">

                        </div>
                    </div>

                    <div className="row m-0 mt-4">
                        <div className="col-12 p-0 p-4">
                            <div className="row m-0">
                                <div className="col-6 d-flex align-items-center p-0">
                                  {props.type ? 
                                   <img
                                   alt="avatar.png"
                                   src={props.data.avatar && props.data.avatar !== '' ? props.data.avatar : avatar}
                                   width="70px"
                                   height="70px"
                                   className="job_image"
                                   style={{ borderRadius: "50%" }}
                               /> : 
                               <img
                               alt="avatar.png"
                               src={props.data.hospital && props.data.hospital.avatar !== '' ? props.data.hospital.avatar : avatar}
                               width="70px"
                               height="70px"
                               className="job_image"
                               style={{ borderRadius: "50%" }}
                           /> 
                                }
                                   

                                    <div className="ms-4">
                                        {props.type ? <p className="mb-0 username">{props.data.name}</p> : 
                                        <p className="mb-0 username">{props.data.hospital.healthCareInstitution && props.data.hospital.healthCareInstitution.name ? props.data.hospital.healthCareInstitution.name : ''}</p>}

                                        {/* <p className="mb-0 role">Adventist Health</p> */}
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center my-4">
                                {ratingArr.map((v, idx) => {
                                    return <img
                                        key={idx}
                                        src={v ? starIcon : starIconGray}
                                        alt="badge.png"
                                        className="me-2"
                                        onClick={() => {
                                            let copyArr = [...ratingArr];
                                            for (let i = 0; i < idx + 1; i++) {
                                                if (!v) {
                                                    copyArr[i] = true;
                                                    setratingArr(copyArr);
                                                }
                                                else {
                                                    copyArr[i] = false;
                                                    setratingArr(copyArr);
                                                }

                                            }
                                        }}
                                        width="24px"
                                        height="24px"
                                    />
                                })}
                            </div>

                            <div className="row m-0 rate_reviw_card_comment mt-3">
                                <textarea
                                    id="w3review"
                                    name="w3review"
                                    rows="4"
                                    cols="50"
                                    placeholder="Write your comment here"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="row m-0 justify-content-center align-items-center rate_reviw_card_footer mt-3">
                        <div className="col-12 p-0 d-flex justify-content-center align-items-center">
                            <Button
                                variant="primary"
                                onClick={() => {
                                    if (review) {
                                        props.showLoader(true);
                                        props.postReview(review, ratingArr.filter(Boolean).length);
                                    }
                                }}
                                className="post_review_btn"
                            >
                                {props.loader ? <Spinner animation="border" /> : "POST"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

const CardCompoenent = ({ v, i, setShowAddReviewModal, setShowReviewModal, setCurrentSelectedItem, comp, jobStatus, redirect, onGoingJobComp, hospitalId, setData, getAllReviews, startDate }) => {
    console.log(v, "vvvvvvvvv")
    return <div
        key={i}
        className="row m-0 find_jobs_cards mb-4"
        onClick={(e) => {
            e.stopPropagation();
            redirect();
        }}
    >
        <div className="col-12 p-0">
            <div className="row m-0 find_jobs_card align-items-center">
                <div
                    className="col-2 p-0 d-flex align-items-center justify-content-center"
                    style={{ width: "14%" }}
                >
                    <div className="t2_sp_avatar_img position-relative">
                        <img
                            alt="avatar.png"
                            src={jobImg}
                            className="job_image"
                            style={{ borderRadius: "50%" }}
                        />
                        <img
                            src={tickIcon}
                            alt="badge.png"
                            className="tick_icon"
                        />
                    </div>
                </div>
                <div className="col-3 p-0">
                    <p className="job_name mb-1">
                        {v.jobTitle}
                    </p>
                    <p className="job_location mb-1">
                        <span style={{ marginRight: 8 }}>
                            <img
                                alt="place"
                                width="13px"
                                height="16px"
                                src={place}
                            />
                        </span>{" "}
                        {v.healthCareLocation}
                    </p>
                    <p className="job_date mb-1">
                        {/* Expected Start Date: {startDate ? moment(startDate).format("MM-DD-YYYY") : moment(v.expectedStartDate).format("MM-DD-YYYY") || "---"} */}
                        Expected Start Date: {startDate ? moment(startDate).format("MM-DD-YYYY") : moment(v.expectedStartDate).format("MM-DD-YYYY")}
                    </p>
                </div>
                <div className="col-2 p-0">
                    <div className="permanent_position_btn">
                        <button>{v.contractType}</button>
                        {v.contractType !== "Permanent Position" && <>
                            {v.weekendAvailiblity && <button className="mt-2">Weekend Job</button>}
                            {v.timeCommitment && <button className="mt-2">{v.timeCommitment === "Full Time" ? "Full Time (8hrs or more)" : v.timeCommitment}</button>}
                        </>}
                    </div>
                </div>
                <div
                    className="col-2 p-0 d-flex align-items-center flex-column justify-content-center job_work_name ms-3"
                    style={{ width: "22%" }}
                >
                    <p className="mb-0 name_tag">
                        {v.medicalSettings}
                    </p>

                    <p className="mb-0 job_rating_count" style={{ width: '184px' }}>
                        <div className="d-flex align-items-center">  <img
                            src={starIcon}
                            alt="badge.png"
                            className="me-2"
                            width="25px"
                            height="25px"
                            style={{ marginLeft: '35.58px' }}
                        />
                            {!onGoingJobComp ? v.hospital ? v.hospital.ratings.ratingSum.toFixed(1) : v.ratings.ratingSum.toFixed(1) : v.ratings.ratingSum.toFixed(1)}
                        </div>

                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <span>
                                {!onGoingJobComp ? v.hospital
                                    ? v.hospital.ratings.totalRatings
                                    : "0" : v.ratings.totalRatings}{" "}
                                Review
                            </span>

                            {v.hospital.ratings.totalRatings !== 0 ? <span className="rating_view_link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setData(v);
                                    setShowReviewModal(true);
                                    getAllReviews(!onGoingJobComp ? v.hospital._id : hospitalId);
                                    setCurrentSelectedItem(v);
                                }}>
                                See all{" "}
                                <img
                                    className="ms-2"
                                    src={left_arrow}
                                    width="7"
                                    alt=""
                                />
                            </span> : ''}

                            {jobStatus === "Completed" ? <span style={{ fontSize: '12px', textDecoration: 'underline' }} onClick={(e) => {
                                e.stopPropagation();
                                setShowAddReviewModal(true);
                                setCurrentSelectedItem(v);
                            }}>
                                + Add Review
                            </span> : null}


                        </div>
                    </p>
                </div>
                {comp}
            </div>
        </div>
    </div>
}

const MyJob = (props) => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showAddReviewModal, setShowAddReviewModal] = useState(false);
    const [loader, showLoader] = useState(false);
    const [currentSelectedItem, setCurrentSelectedItem] = useState({});

    const [data, setData] = useState({});

    const [searchFilter, setSearchFilter] = useState("jobTitle");
    const [activeKey, setActiveKey] = useState("onGoing");
    const [activeKey2, setActiveKey2] = useState("applied_jobs");
    const [mainactiveKey, setMainActiveKey] = useState("jobs");
    const [reviewData, setReviewData] = useState([]);
    const [sort, setsort] = useState("desc");
    const [search, setsearch] = useState("");
    const [filterValue, setfilter] = useState("");

    const [completedJobs, setCompletedJobs] = useState([]);
    const [onGoingJobs, setOnGoingJobs] = useState([]);
    const [allOngoingJobs, setAllOnGoingJobs] = useState([]);
    const [allAppliedJobs, setAllAppliedJobs] = useState([]);
    const [allRejectedJobs, setAllRejectedJobs] = useState([]);
    const [allWithdrawJobs, setAllWithdrawnJobs] = useState([]);

    const [allInterestJobs, setAllInterestJobs] = useState([]);

    const [showReasonModal, setShowReasonModal] = useState(false);
    const [applicationType, setApplicationType] = useState("");
    const [rejectReason, setrejectReason] = useState("");
    const [rejectedId, setrejectedId] = useState("");

    const [curPage, setcurPage] = useState(1)
    const [curProgressPage, setcurProgressPage] = useState(1)
    const [curCompletedPage, setcurCompletedPage] = useState(1)
    const [curApplicationPage, setcurApplicationPage] = useState(1)
    const [curOfferPage, setcurOfferPage] = useState(1)
    const [curWithdrawnPage, setcurWithdrawnPage] = useState(1)
    const [curRejectedPage, setcurRejectedPage] = useState(1)
    const [total, setTotal] = useState(10)
    const [totalPage, setTotalPage] = useState(0)
    const [progressSkip, setProgressSkip] = useState(0)
    const [progressTotalPage, setProgressTotalPage] = useState(0)
    const [completedSkip, setCompletedSkip] = useState(0)
    const [completedTotalPage, setCompletedTotalPage] = useState(0)
    const [offerJobSkip, setOfferJobSkip] = useState(0)
    const [offerTotalPage, setOfferTotalPage] = useState(0)
    const [applicationJobSkip, setApplicationJobSkip] = useState(0)
    const [applicationTotalPage, setApplicationTotalPage] = useState(0)
    const [rejectedJobSkip, setRejectedJobSkip] = useState(0)
    const [rejectedTotalPage, setRejectedTotalPage] = useState(0)
    const [withdrawnJobSkip, setWithdrawnJobSkip] = useState(0)
    const [withdrwanTotalPage, setWithdrwanTotalPage] = useState(0)
    const [acceptJobLoader, setacceptJobLoader] = useState('')
    const [showAlert, setShowAlert] = useState('none')

    useEffect( async () => {
        if (mainactiveKey === "jobs") {
            if (activeKey === "onGoing") {
                GetAllOngoingJobs(searchFilter);
            //    await setSkip(0)
            //    await setTotalPage(0)
            //    await setcurPage(1)
            // console.log(skip, 'skip value in jobsprogress');
            }
            else {
                GetAllCompletedJobs(searchFilter);
            //    await setSkip(0)
            //    await setTotalPage(0)
            //    await setcurPage(1)
            }
        }

        else {
            if (activeKey2 === "applied_jobs") {
                GetAllAppliedJobs(searchFilter);
            }
            else if (activeKey2 === "reject_offer") {
                GetAllRejectedJobs(searchFilter);
            }
            else if (activeKey2 === "withdrawn_offer") {
                GetAllWithdrawnJobs(searchFilter);
            }
            else if (activeKey2 === "intrest_jobs") {
                GetAllInterestJobs(searchFilter);
            }
            else {
                GetAllJobsOffers(searchFilter);
            }
        }
    }, [searchFilter, sort, search, filterValue, showReviewModal,progressSkip,completedSkip, applicationJobSkip, offerJobSkip, withdrawnJobSkip, rejectedJobSkip]);

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

    const acceptJobOffer = async (id) => {
        setacceptJobLoader(id)
        var token = localStorage.getItem("accessToken");
        const data = await callApi(
            "POST",
            `v1/LHS/staff/accept/${id}`,
            `Bearer ${token}`
        );
        if (data.status === 200) {
            GetAllJobsOffers(searchFilter);
            // setacceptJobLoader("")
        }
        else if (data.status === 500) {
            setacceptJobLoader("")
            alert(data.Message)
        }
        else if (data.status === 406) {
            setacceptJobLoader("")
            // alert("Verify Your Bank Details by going to profile section (Profile -> Account Information) ")
            setShowAlert('block')
            
        }
        // else {
        //     setacceptJobLoader("")
        // }
    }

    const rejectJobOffer = async (id) => {
        var token = localStorage.getItem("accessToken");
        let obj = {
            rejectionReason: rejectReason
        }
        if (applicationType !== "withdrawn") {
            obj.isJobRejected = true;
            obj.status = "Rejected",
                obj.rejectedBy = "staff"
        }
        let url = applicationType === "withdrawn" ? `v1/LHS/staff/withdraw/${rejectedId}` : `v1/LHS/staff/reject/${rejectedId}`;
        const responseData = await callApi(
            "POST",
            url,
            `Bearer ${token}`,
            obj
        );
        setShowReasonModal(false)
        if (responseData.status === 200) {
            GetAllJobsOffers(searchFilter);
        }
    }

    const GetAllOngoingJobs = async (searchFilter) => {
        var token = localStorage.getItem("accessToken");
        let url =
            searchFilter === "jobTitle"
                ? `v1/LHS/staff//inProgress?sort=${sort}&skip=${progressSkip}&search=${search}`
                : `v1/LHS/staff//inProgress?sort=${sort}&skip=${progressSkip}&search=${search}`;
        const data = await callApi("GET", url, `Bearer ${token}`);
        console.log(data.data, "DATA")
        if (data.data) {
            console.log(data.data[0],'jobsssssss');
            let totalProgressCount = data.data.count
            let progressPage = Math.ceil(totalProgressCount / 10);
            setProgressTotalPage(progressPage)
            setOnGoingJobs(data.data.data);
            // this.setState({ hospitals: [...res.data.data], totalPage: page, showLoader : '' });
        }
        else {
            setOnGoingJobs([]);
        }
    };

    const GetAllCompletedJobs = async (searchFilter) => {
        var token = localStorage.getItem("accessToken");
        let url =
            searchFilter === "jobTitle"
                ? `v1/LHS/staff/MyCompletedJobsByTitle?sort=${sort}&skip=${completedSkip}&search=${search}`
                : `v1/LHS/staff/MyCompletedJobsByHospital?sort=${sort}&skip=${completedSkip}&search=${search}`;
        const data = await callApi("GET", url, `Bearer ${token}`);
        if (data.data) {
            console.log("asdasd", data.data.data)
            console.log("asdasd", data.data.data.length)
            let completedtotalCount = data.data.count
            let completedpage = Math.ceil(completedtotalCount / 10);
            setCompletedTotalPage(completedpage)
            setCompletedJobs(data.data.data);
        }
        else {
            setCompletedJobs([]);
        }
    }

    const GetAllJobsOffers = async (searchFilter) => {
        let filterName = "";
        if (filterValue === "Temporary Position" || filterValue === "Permanent Position") {
            filterName = "nature";
        }
        else if (filterValue === "Full Time" || filterValue === "Part Time") {
            filterName = "timeCommitment";
        }
        else if (filterValue === "true" || filterValue === "false") {
            filterName = "weekendavailiblity";
        }
        var token = localStorage.getItem("accessToken");
        let url =
            searchFilter === "jobTitle"
                ? `v1/LHS/staff/getMyJobsOffersByJobTitle?sort=${sort}&skip=${offerJobSkip}&search=${search}&filter=${filterName}&value=${filterValue}`
                : `v1/LHS/staff/doGetMyJobsOffersByHospital?sort=${sort}&skip=${offerJobSkip}&search=${search}&filter=${filterName}&value=${filterValue}`;
        const data = await callApi("GET", url, `Bearer ${token}`);
        if (data.data) {
            let joboffertotalCount = data.data.count
            var jobofferpage = Math.ceil(joboffertotalCount / 10);
            setOfferTotalPage(jobofferpage)
            setAllOnGoingJobs(data.data.data);
            setacceptJobLoader("")
        }
        else {
            setAllOnGoingJobs([]);
            setacceptJobLoader("")
        }
    }

    const GetAllAppliedJobs = async (searchFilter) => {
        let filterName = "";
        if (filterValue === "Temporary Position" || filterValue === "Permanent Position") {
            filterName = "nature";
        }
        else if (filterValue === "Full Time" || filterValue === "Part Time") {
            filterName = "timeCommitment";
        }
        else if (filterValue === "true" || filterValue === "false") {
            filterName = "weekendavailiblity";
        }
        var token = localStorage.getItem("accessToken");
        let url =
            searchFilter === "jobTitle"
                ? `v1/LHS/staff/myApplicationsByTitle?sort=${sort}&skip=${applicationJobSkip}&search=${search}&filter=${filterName}&value=${filterValue}`
                : `v1/LHS/staff/myApplicationsByHospitalName?sort=${sort}&skip=${applicationJobSkip}&search=${search}&filter=${filterName}&value=${filterValue}`;
        const data = await callApi("GET", url, `Bearer ${token}`);
        if (data.data) {
            console.log(data.data.data.length, "DDDDAAA");
            let applicationtotalCount = data.data.count
            let applicationpage = Math.ceil(applicationtotalCount / 10);
            setApplicationTotalPage(applicationpage)
            setAllAppliedJobs(data.data.data);
        }
        else {
            setAllAppliedJobs([]);
        }
    }

    const postReview = async (review, reviewCount) => {
        if (!loader) {
            let obj = {
                ratingTo: currentSelectedItem.hospital._id,
                rating: reviewCount,
                review: review
            }
            var token = localStorage.getItem("accessToken");
            let url = `v1/LHS/rating/save`;
            var res = await callApi("POST", url, `Bearer ${token}`, obj);
            if (res.status === 200) {
                GetAllCompletedJobs(searchFilter);
                setShowAddReviewModal(false);
                showLoader(false);
            }
        }
    }

    const GetAllRejectedJobs = async () => {
        var token = localStorage.getItem("accessToken");
        let url = `v1/LHS/staff/myRejectedApplications?search=${search}&sort=${sort}&skip=${rejectedJobSkip}`;
        const data = await callApi("GET", url, `Bearer ${token}`);
        if (data.data) {
            let rejectedtotalCount = data.data.count
            let rejectedpage = Math.ceil(rejectedtotalCount / 10);
            setRejectedTotalPage(rejectedpage)
            setAllRejectedJobs(data.data.data);
        }
        else {
            setAllRejectedJobs([]);
        }
    }

    const GetAllWithdrawnJobs = async () => {
        var token = localStorage.getItem("accessToken");
        let url = `v1/LHS/staff/myWithdrawnApplications?search=${search}&sort=${sort}&skip=${withdrawnJobSkip}`;
        const data = await callApi("GET", url, `Bearer ${token}`);
        if (data.data) {
            let withdrwantotalCount = data.data.count
            let withdrwanpage = Math.ceil(withdrwantotalCount / 10);
            setWithdrwanTotalPage(withdrwanpage)
            setAllWithdrawnJobs(data.data.data);
        }
        else {
            setAllWithdrawnJobs([]);
        }
    }

    const GetAllInterestJobs = async () => {
        console.log("", "console.log(key)console.log(key)")
        var token = localStorage.getItem("accessToken");
        let url = `v1/LHS/staff/myIntrest?search=${search}&sort=${sort}&skip=0`;
        const data = await callApi("GET", url, `Bearer ${token}`);
        if (data.data) {
            setAllInterestJobs(data.data[0].jobIntrest);
        }
        else {
            setAllInterestJobs([]);
        }
    }

    const handleSelect = (key) => {
        setfilter("");
        setsort("desc");
        setsearch("");
        setActiveKey(key);
        if (key === "onGoing") {
            GetAllOngoingJobs(searchFilter);
        }
        else {
            GetAllCompletedJobs(searchFilter);
        }
    }

    const handleSelectSubJobApp = (key) => {
        console.log(key)
        setfilter("");
        setsort("desc");
        setsearch("");
        setActiveKey2(key);
        if (key === "applied_jobs") {
            GetAllAppliedJobs(searchFilter);
        }
        else if (key === "reject_offer") {
            GetAllRejectedJobs(searchFilter);
        }
        else if (key === "withdrawn_offer") {
            GetAllWithdrawnJobs(searchFilter);
        }
        else if (key === "intrest_jobs") {
            GetAllInterestJobs(searchFilter);
        }
        else {
            GetAllJobsOffers(searchFilter);
        }
    }

    const handleSelect2 = (key) => {
        setfilter("");
        setsort("desc");
        setsearch("");
        setMainActiveKey(key);
        if (key === "jobs") {
            GetAllOngoingJobs(searchFilter);
        }
        else {
            GetAllAppliedJobs(searchFilter);
        }
    }

    const calculateDaysTwoDates = (date1, date2, totalDays) => {

        // To calculate the time difference of two dates
        var Difference_In_Time = date2.getTime() - date1.getTime();

        // To calculate the no. of days between two dates
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        //To display the final no. of days (result)
        let returnNumber = (totalDays / Difference_In_Days) * 100;
        return returnNumber.toFixed(0);
    }

    const setProgressCurPage = async (num) => {
        const value = (num * 10) - 10;
        await setcurProgressPage(num)
        await setProgressSkip(value)
        GetAllOngoingJobs(progressSkip)

       
    }

    const setCompletedCurPage = async (num) => {
        const value = (num * 10) - 10;
        // await this.setState({ curPage: num, skip: value });
        await setcurCompletedPage(num)
        await setCompletedSkip(value)
        console.log(skip, 'skip state for pagination');
        console.log(value, 'value for pagination');
        GetAllCompletedJobs(completedSkip)

       
    }

    const setOfferJobCurPage = async (num) => {
        const value = (num * 10) - 10;
        // await this.setState({ curPage: num, skip: value });
        await setcurOfferPage(num)
        await setOfferJobSkip(value)
        GetAllJobsOffers(offerJobSkip)
       
    }

    const setApplicationInProgress = async (num) => {
        const value = (num * 10) - 10;
        // await this.setState({ curPage: num, skip: value });
        await setcurApplicationPage(num)
        await setApplicationJobSkip(value)
        GetAllAppliedJobs(applicationJobSkip)
       
    }

    const setRejectedCurPage = async (num) => {
        const value = (num * 10) - 10;
        await setcurRejectedPage(num)
        await setRejectedJobSkip(value)
        GetAllRejectedJobs(rejectedJobSkip)
    }

    const setWithdrawnCurPage = async (num) => {
        const value = (num * 10) - 10;
        await setcurWithdrawnPage(num)
        await setWithdrawnJobSkip(value)
        GetAllWithdrawnJobs(withdrawnJobSkip)
    }

    return (
        <React.Fragment>
            <div className="theme2">
                <NewNavigation />
                <div className="theme2_container">
                    <Header page="My Jobs" />

                    <div className="theme2_main_container">
                        <div className="my_job_background p-3">
                            <div className="row m-0 justify-content-center pt-5">
                                <Tabs
                                    defaultActiveKey="jobs"
                                    id="uncontrolled-tab-example"
                                    className="mb-3 main_tab"
                                    onSelect={handleSelect2}
                                >
                                    <Tab eventKey="jobs" title="MY JOBS">
                                        <div className="row m-0 justify-content-center mt-3">
                                            <JobHeader
                                                searchText="Search By Job Title"
                                                hideMedicalSetting
                                                hideLocation
                                                setSearchFilter={ setSearchFilter }
                                                setSorting={setsort}
                                                setSearch={ 
                                                    (val) => {
                                                        setcurProgressPage(1);
                                                        setcurCompletedPage(1);
                                                        setProgressSkip(0);
                                                        setCompletedSkip(0);
                                                        setProgressTotalPage(0);
                                                        setCompletedTotalPage(0);
                                                        setsearch(val)
                                                    }
                                                }
                                                hideSearchSelect={true}
                                                hideFilterSelect
                                                sortingValue={sort}
                                                filterValue={filterValue}
                                                search={search}
                                                sortingOptions={[{

                                                    label: "Newest First",
                                                    value: "desc"
                                                }, {
                                                    label: "Oldest First",
                                                    value: "asc"
                                                }]}
                                            />
                                            <Tabs
                                                defaultActiveKey={activeKey}
                                                id="uncontrolled-tab-example"
                                                className="mb-4 sub_tab mb-5 px-3"
                                                onSelect={handleSelect}
                                            >
                                                <Tab eventKey="onGoing" title="Jobs in Progress">
                                                    {/* <JobHeader
                                                        hideMedicalSetting
                                                        hideLocation
                                                        setSearchFilter={setSearchFilter}
                                                        setSorting={setsort}
                                                        setSearch={setsearch}
                                                        hideFilterSelect
                                                        sortingOptions={[{
                                                            label: "Newest First",
                                                            value: "asc"
                                                        }, {
                                                            label: "Oldest First",
                                                            value: "desc"
                                                        }]}
                                                    /> */}
                                                    {!onGoingJobs.length ? (
                                                        <p className="text-center mt-3">No record found</p>
                                                    ) : (
                                                        ""
                                                    )}

                                                    {(onGoingJobs || []).filter(v => v.job).map((v, i) => {
                                                        {console.log(v,'after mapppppppp');}
                                                        return <CardCompoenent getAllReviews={(id) => getAllReviews(id)} setData={(data) => setData(data)} hospitalId={v.hospital._id} onGoingJobComp={v.staff.ratings} startDate={v.startDate} v={{ ...v.job, ...v.hospital, }} i={i} comp={<div
                                                            className="col-3 p-0 d-flex align-items-center justify-content-center p-0"
                                                            style={{ width: "20%" }}
                                                        >
                                                            <div className="d-flex align-items-center justify-content-center flex-column" style={{ width: '290px' }}>
                                                                {" "}
                                                                <p className="mb-0 name_tag">
                                                                    Contract Length{" "}
                                                                </p>
                                                                <span>{v.totalDays} Day(s)</span>
                                                            </div>

                                                            <div className="d-flex align-items-center justify-content-center flex-column">
                                                                <span>{v.daysWorked} of {v.totalDays} days completed</span>
                                                            </div>


                                                            {/* <div className="ps-4 position-relative">
                                                                <div className="d-flex align-items-center justify-content-center" style={{
                                                                    position: 'absolute',
                                                                    top: '17px',
                                                                    left: '36px',
                                                                    fontSize: '12px',
                                                                    width: '25px'
                                                                }}>{calculateDaysTwoDates(v.startDate ? new Date(v.startDate) : new Date(), v.endDate ? new Date(v.endDate) : new Date(), v.totalDays)}%</div>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="50"
                                                                    height="50"
                                                                    viewBox="0 0 80 80"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M0 40C0 62.0914 17.9086 80 40 80V40H0Z"
                                                                        fill="#6FCF97"
                                                                    />
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M80 40C80 62.0914 62.0914 80 40 80V40H80Z"
                                                                        fill="#6FCF97"
                                                                    />
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M0 40C0 17.9086 17.9086 0 40 0V40H0Z"
                                                                        fill="#6FCF97"
                                                                    />
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M80 40C80 17.9086 62.0914 0 40 0V40H80Z"
                                                                        fill="#eee"
                                                                    />
                                                                    <circle
                                                                        cx="40.02"
                                                                        cy="40.02"
                                                                        r="31.02"
                                                                        fill="white"
                                                                    />
                                                                </svg>
                                                            </div> */}

                                                        </div>} setShowReviewModal={() => setShowReviewModal(true)} setCurrentSelectedItem={() => setCurrentSelectedItem(v)}
                                                            redirect={() => {
                                                                props.history.push({
                                                                    pathname: "/main/staff/job-offer-details",
                                                                    state: {
                                                                        data: { ...v.job, ...v.hospital, ...v },
                                                                        status: 'onGoing',
                                                                        onGoingJobs
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    })}
                                              {onGoingJobs.length ?       <Pagination curPage={curProgressPage} totalPage={progressTotalPage} setCurPage={setProgressCurPage} /> : ''}
                                                </Tab>
                                                <Tab eventKey="completed" title="Completed Jobs">
                                                    {!completedJobs.length ? (
                                                        <p className="text-center mt-3">No record found</p>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {(completedJobs || []).map((v, i) => {
                                                        return <CardCompoenent jobStatus="Completed" getAllReviews={(id) => getAllReviews(id)} startDate={v.startDate} setData={(data) => setData(data)} v={{ ...v.job, hospital: v.hospital }} i={i} comp={<div
                                                            className="col-3 p-0 d-flex align-items-center flex-column justify-content-center p-0"
                                                            style={{ width: "20%" }}
                                                        >
                                                            <div className="job_appliction_btn completed">
                                                                <button className="completed">COMPLETED</button>
                                                            </div>
                                                        </div>} setShowReviewModal={() => setShowReviewModal(true)} setShowAddReviewModal={() => setShowAddReviewModal(true)} setCurrentSelectedItem={() => setCurrentSelectedItem(v)} redirect={() => {
                                                            props.history.push({
                                                                pathname: "/main/staff/job-offer-details",
                                                                state: {
                                                                    data: { ...v.job, ...v.hospital, ...v },
                                                                    status: 'completed',
                                                                    onGoingJobs
                                                                }
                                                            })
                                                        }} />
                                                    })}
                                            {completedJobs.length ?         <Pagination curPage={curCompletedPage} totalPage={completedTotalPage} setCurPage={setCompletedCurPage} /> : "" }

                                                </Tab>
                                            </Tabs>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="applications" title="Job Applications">
                                        <div className="row m-0 justify-content-center mt-3">
                                            <JobHeader hideMedicalSetting
                                                hideLocation
                                                searchText="Search By Job Title"
                                                setSearchFilter={setSearchFilter}
                                                setSorting={setsort}
                                                setSearch={(val) => {
                                                    setcurApplicationPage(1);
                                                    setcurOfferPage(1);
                                                    setcurRejectedPage(1);
                                                    setcurWithdrawnPage(1);
                                                    setApplicationJobSkip(0);
                                                    setOfferJobSkip(0);
                                                    setWithdrawnJobSkip(0);
                                                    setRejectedJobSkip(0);
                                                    setApplicationTotalPage(0);
                                                    setOfferTotalPage(0);
                                                    setWithdrwanTotalPage(0);
                                                    setRejectedTotalPage(0);
                                                    setsearch(val);

                                                } }
                                                setFilter={setfilter}
                                                // hideFilterSelect={activeKey2 === "reject_offer" || activeKey2 === "withdrawn_offer" ? true : false}
                                                hideSearchSelect={true}
                                                sortingValue={sort}
                                                hideFilterSelect
                                                filterValue={filterValue}
                                                search={search}
                                                sortingOptions={[
                                                    {
                                                        label: "Newest First",
                                                        value: "desc"
                                                    }, {
                                                        label: "Oldest First",
                                                        value: "asc"
                                                    }]}
                                                filterOptions={[{
                                                    label: "Temporary Position",
                                                    value: "Temporary Position"
                                                }, {
                                                    label: "Permanent Position",
                                                    value: "Permanent Position"
                                                },
                                                {
                                                    label: "Full Time",
                                                    value: "Full Time"
                                                },
                                                {
                                                    label: "Part Time",
                                                    value: "Part Time"
                                                },
                                                {
                                                    label: "Weekend Availability",
                                                    value: "true"
                                                },
                                                {
                                                    label: "No Weekend Availability",
                                                    value: "false"
                                                }]}
                                            />
                                            <Tabs
                                                defaultActiveKey={activeKey2}
                                                id="uncontrolled-tab-example"
                                                className="mb-5 px-3 sub_tab"
                                                onSelect={handleSelectSubJobApp}
                                            >
                                                <Tab eventKey="applied_jobs" title="Applications in Progress">
                                                    {/* <JobHeader /> */}
                                                    {allAppliedJobs && !allAppliedJobs.length ? (
                                                        <p className="text-center mt-3">No record found</p>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {(allAppliedJobs || []).map((v, i) => {
                                                        return <CardCompoenent getAllReviews={(id) => getAllReviews(id)} setData={(data) => setData(data)} v={v} i={i} comp={<div
                                                            className="col-3 p-0 d-flex align-items-center flex-column justify-content-center p-0"
                                                            style={{ width: "20%" }}
                                                        >
                                                            <div className="job_appliction_btn job_appliction_btn_grey">
                                                                <button className="">APPLIED</button>
                                                                {/* <p className="mt-3 mb-0">01/09/2021  10:30 AM</p> */}
                                                            </div>
                                                        </div>} setShowReviewModal={() => setShowReviewModal(true)} setCurrentSelectedItem={() => setCurrentSelectedItem(v)} redirect={() => {
                                                            props.history.push({
                                                                pathname: "/main/staff/job-offer-details",
                                                                state: {
                                                                    data: v,
                                                                    status: 'appliedJobs'
                                                                }
                                                            })
                                                        }} />
                                                    })}
                                              {allAppliedJobs.length && allAppliedJobs.length ?       <Pagination curPage={curApplicationPage} totalPage={applicationTotalPage} setCurPage={setApplicationInProgress} /> : ''}
                                                </Tab>
                                                {/* <Tab eventKey="intrest_jobs" title="Jobs Interest in you">

                                                    {!allInterestJobs.length ? (
                                                        <p className="text-center mt-3">No record found</p>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {(allInterestJobs || []).map((v, i) => {
                                                        return <CardCompoenent getAllReviews={(id) => getAllReviews(id)} setData={(data) => setData(data)} onClick={() => alert(v)} v={v} i={i} comp={<div
                                                            className="col-3 p-0 d-flex align-items-center flex-column justify-content-center p-0"
                                                            style={{ width: "20%" }}
                                                        >
                                                            <div className="job_appliction_btn">
                                                                <div className=" col-12 d-flex flex-column align-items-center justify-content-center p-0">
                                                                    <button className="apply_job_btn">Shows Interest</button>
                                                                </div>
                                                            </div>
                                                        </div>} setShowReviewModal={() => setShowReviewModal(true)} setCurrentSelectedItem={() => setCurrentSelectedItem(v)} redirect={() => {
                                                            props.history.push({
                                                                pathname: "/main/staff/job-offer-details",
                                                                state: {
                                                                    data: v,
                                                                    status: 'InterestJob'
                                                                }
                                                            })
                                                        }} />
                                                    })}

                                                </Tab> */}
                                                <Tab eventKey="job_offer" title="Job Offers">
                                                    {allOngoingJobs && !allOngoingJobs.length ? (
                                                        <p className="text-center mt-3">No record found</p>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {(allOngoingJobs || []).map((v, i) => {
                                                        return <CardCompoenent getAllReviews={(id) => getAllReviews(id)} setData={(data) => setData(data)} onClick={() => alert(v)} v={v} i={i} comp={<div
                                                            className="col-3 p-0 d-flex align-items-center flex-column justify-content-center p-0"
                                                            style={{ width: "20%" }}
                                                        >
                                                            <div className="job_appliction_btn">
                                                                <div className="mt-3 col-12 d-flex flex-column align-items-center justify-content-center p-0">
                                                                    <button className="apply_job_btn" onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        acceptJobOffer(v._id);
                                                                    }}> {acceptJobLoader === v._id   ? <Loader /> : 'Accept Offer'} </button>
                                                                    <p className="mb-0 mt-2 reject_job_link" onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setrejectedId(v._id);
                                                                        setData(v);
                                                                        setShowReasonModal(true);
                                                                        setApplicationType("rejectOffer");
                                                                    }}>REJECT OFFER</p>
                                                                </div>
                                                            </div>
                                                        </div>} setShowReviewModal={() => setShowReviewModal(true)} setCurrentSelectedItem={() => setCurrentSelectedItem(v)} redirect={() => {
                                                            props.history.push({
                                                                pathname: "/main/staff/job-offer-details",
                                                                state: {
                                                                    data: v,
                                                                    status: 'jobOffer'
                                                                }
                                                            })
                                                        }} />
                                                    })}
                                                             <Alert display={showAlert} title={"ALERT"}content={"Verify your bank details by going to profile section (Profile -> Account Information) "} agreeFn={()=> setShowAlert('none')}/>
                                        {allOngoingJobs && allOngoingJobs.length ? <Pagination curPage={curOfferPage} totalPage={offerTotalPage} setCurPage={setOfferJobCurPage} />  : ''}

                                                </Tab>

                                                <Tab eventKey="reject_offer" title="Rejected Applications">
                                                    {allRejectedJobs && !allRejectedJobs.length ? (
                                                        <p className="text-center mt-3">No record found</p>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {(allRejectedJobs || []).map((v, i) => {
                                                        return <CardCompoenent getAllReviews={(id) => getAllReviews(id)} setData={(data) => setData(data)} redirect={() => {
                                                            props.history.push({
                                                                pathname: "/main/staff/job-offer-details",
                                                                state: {
                                                                    data: v,
                                                                    status: 'rejected'
                                                                }
                                                            })
                                                        }} v={v} i={i} comp={<div
                                                            className="col-3 p-0 d-flex align-items-center flex-column justify-content-center p-0"
                                                            style={{ width: "20%" }}

                                                        >
                                                            <div className="job_appliction_btn">
                                                                <button style={{ backgroundColor: '#EB5757', border: 'none' }} className="">REJECTED</button>
                                                            </div>
                                                        </div>} setShowReviewModal={() => setShowReviewModal(true)} setCurrentSelectedItem={() => setCurrentSelectedItem(v)} />
                                                    })}
                                        {allRejectedJobs.length && allRejectedJobs.length ? <Pagination curPage={curRejectedPage} totalPage={rejectedTotalPage} setCurPage={setRejectedCurPage} />  : ''}
                                                </Tab>
                                                <Tab eventKey="withdrawn_offer" title="Withdrawn Applications">
                                                    {allWithdrawJobs && !allWithdrawJobs.length ? (
                                                        <p className="text-center mt-3">No record found</p>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {(allWithdrawJobs || []).map((v, i) => {
                                                        return <CardCompoenent getAllReviews={(id) => getAllReviews(id)} redirect={() => {
                                                            props.history.push({
                                                                pathname: "/main/staff/job-offer-details",
                                                                state: {
                                                                    data: v,
                                                                    status: 'withdrawn'
                                                                }
                                                            })
                                                        }} setData={(data) => setData(data)} v={v} i={i} comp={<div
                                                            className="col-3 p-0 d-flex align-items-center flex-column justify-content-center p-0"
                                                            style={{ width: "20%" }}

                                                        >
                                                            <div className="job_appliction_btn">
                                                                <button style={{ backgroundColor: '#EB5757', border: 'none' }} className="">WITHDRAW</button>
                                                            </div>
                                                        </div>} setShowReviewModal={() => setShowReviewModal(true)} setCurrentSelectedItem={() => setCurrentSelectedItem(v)} />
                                                    })}
                                        {allWithdrawJobs.length && allWithdrawJobs.length ? <Pagination curPage={curWithdrawnPage} totalPage={withdrwanTotalPage} setCurPage={setWithdrawnCurPage} />  : ''}
                                                </Tab>
                                            </Tabs>
                                        </div>

                                        {/* <div className="d-flex justify-content-between mb-4">
                                            <p className="jobs_count mb-0">1,392 Jobs</p>
                                            <p className="pagination_count mb-0">1 of 20</p>
                                        </div>

                                        <hr /> */}


                                    </Tab>
                                </Tabs>
                            </div>
                        </div>

                        {/* <div className="row m-0 mobile_cards_parent">

                            <div className="col-12 p-0">

                                <div className="row m-0">
                                    <div className="col-12 p-0">

                                        <div className="mobile_tab">
                                            <button className={`mobile_tab_buttons active_mobile_tab_buttons`}>MY JOBS</button>
                                            <button className={`mobile_tab_buttons`}>JOBS APPLICATION</button>
                                        </div>

                                    </div>
                                </div>

                                <div className="row m-0 mt-4">
                                    <div className="col-12 p-0">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span
                                                    className="input-group-text search_side_one"
                                                    id="basic-addon1"
                                                >
                                                    {" "}
                                                    <img src={searchIcon} alt="" />{" "}
                                                </span>
                                            </div>

                                            <input
                                                type="text"
                                                className="form-control search_side_two p-0"
                                                placeholder="Search"
                                                aria-label="Username"
                                                aria-describedby="basic-addon1"
                                                onChange={(e) => setsearch(e.target.value)}
                                            />

                                            <div className="input-group-append">
                                                <span
                                                    className="input-group-text search_side_three d-flex align-items-center justify-content-center"
                                                    id="basic-addon2"
                                              
                                                >
                                                    {" "}
                                                    <img src={MobileFilter} alt="" />{" "}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row m-0 mt-2">
                                    <div className="col-6 p-0">
                                        <button className="mobile_jobs_switch active_mobile_jobs_switch">Jobs in Progress</button>
                                    </div>
                                    <div className="col-6 p-0">
                                        <button className="mobile_jobs_switch">Completed Jobs</button>
                                    </div>
                                </div>

                                <div className="row m-0 mt-4">
                                    <div className="col-12 p-0">
                                        <p className="mb-0 mobile_cards_related_info">Ongoing Jobs (1)</p>
                                    </div>
                                </div>

                                <div className="row m-0 mt-3">
                                    <div className="col-12 p-3 card_type_one">
                                        <div className="row m-0">
                                            <div className="col-4 p-0 d-flex align-items-center">
                                                <img src={MobileProfilePic} alt="" />
                                            </div>
                                            <div className="col-8 p-0 d-flex flex-column align-items-left justify-content-center">
                                                <p className="mb-0 post_type">
                                                  
                                                    Registered Nurse (RN)
                                                </p>
                                                <p className="mb-0 mt-1 post_address">
                                                    {" "}
                                                    <img className="mb-1" src={Location} alt="" /> &nbsp;
                                                
                                                    Los Angeles, CA
                                                </p>
                                                <p className="mb-0 mt-1 post_esd">
                                                    Expected Start Date: 08/10/2021
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row m-0 mt-3">
                                            <div className="col-12 p-0">
                                                <button className="mobile_perm_position">
                                                   
                                                    Permanent Position
                                                </button>
                                            </div>
                                        </div>

                                        <div className="row m-0 mt-3">
                                            <div className="col-12 p-0">
                                                <p className="mb-0 prime_healthcare">
                                                  
                                                    Prime Healthcare
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row m-0 mt-3">
                                            <div className="col-3 p-0">
                                                <p className="mb-0 mobile_rating">
                                                    {" "}
                                                    <img className="mb-2" src={MobileStar} alt="" /> &nbsp;
                                                    4.5
                                                </p>
                                            </div>
                                            <div className="col-4 p-0">
                                                <p className="mb-0 mt-1 text-center mobile_reviews">320 Reviews</p>
                                                <p className="mb-0 mt-1 text-center see_all_reviews">See all <img className="mb-1" src={RightArrow} alt=" " /> </p>
                                            </div>
                                        </div>

                                        <div className="row m-0 mt-3">
                                            <div className="col-12 p-0 mobile_devider">
                                                
                                            </div>
                                        </div>

                                        <div className="row m-0 mt-3">
                                            <div className="col-8 p-0 d-flex flex-column justify-content-between">
                                                <p className="mb-0 prime_healthcare">Contract Length</p>
                                                <p className="mb-0 contract_day_count">45 Day(s)</p>
                                            </div>
                                            <div className="col-4 p-0 d-flex align-items-center justify-content-center">
                                                <img src={PercentBar} alt="" />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                
                                <div className="row m-0 mt-3">
                                    <div className="col-12 p-3 card_type_one">
                                        <div className="row m-0">
                                            <div className="col-4 p-0 d-flex align-items-center">
                                                <img src={MobileProfilePic} alt="" />
                                            </div>
                                            <div className="col-8 p-0 d-flex flex-column align-items-left justify-content-center">
                                                <p className="mb-0 post_type">
                                              
                                                    Registered Nurse (RN)
                                                </p>
                                                <p className="mb-0 mt-1 post_address">
                                                    {" "}
                                                    <img className="mb-1" src={Location} alt="" /> &nbsp;
                                                  
                                                    Los Angeles, CA
                                                </p>
                                                <p className="mb-0 mt-1 post_esd">
                                                    Expected Start Date: 08/10/2021
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row m-0 mt-3">
                                            <div className="col-12 p-0">
                                                <button className="mobile_perm_position">
                                                   
                                                    Permanent Position
                                                </button>
                                            </div>
                                        </div>

                                        <div className="row m-0 mt-3">
                                            <div className="col-12 p-0">
                                                <p className="mb-0 prime_healthcare">
                                                 
                                                    Prime Healthcare
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row m-0 mt-3">
                                            <div className="col-3 p-0">
                                                <p className="mb-0 mobile_rating">
                                                    {" "}
                                                    <img className="mb-2" src={MobileStar} alt="" /> &nbsp;
                                                    4.5
                                                </p>
                                            </div>
                                            <div className="col-4 p-0">
                                                <p className="mb-0 mt-1 text-center mobile_reviews">320 Reviews</p>
                                                <p className="mb-0 mt-1 text-center see_all_reviews">See all <img className="mb-1" src={RightArrow} alt=" " /> </p>
                                            </div>
                                        </div>

                                        <div className="row m-0 mt-3">
                                            <div className="col-12 p-0 mobile_devider">
                                                
                                            </div>
                                        </div>

                                        <div className="row m-0 mt-3">
                                            <div className="col-8 p-0 d-flex justify-content-center">
                                                <button className="mobile_job_completion">Job completion</button>
                                            </div>
                                            <div className="col-4 p-0 d-flex align-items-center justify-content-center">
                                                <img src={HundredPercentBar} alt="" />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="row m-0 mt-4">
                                    <div className="col-12 p-0">
                                        <p className="mb-0 mobile_cards_related_info">Jobs (25)</p>
                                    </div>
                                </div>
                                
                                <div className="row m-0 mt-3">
                                    <div className="col-12 p-3 card_type_one">
                                        <div className="row m-0">
                                            <div className="col-4 p-0 d-flex align-items-center">
                                                <img src={MobileProfilePic} alt="" />
                                            </div>
                                            <div className="col-8 p-0 d-flex flex-column align-items-left justify-content-center">
                                                <p className="mb-0 post_type">
                                                 
                                                    Registered Nurse (RN)
                                                </p>
                                                <p className="mb-0 mt-1 post_address">
                                                    {" "}
                                                    <img className="mb-1" src={Location} alt="" /> &nbsp;
                                                  
                                                    Los Angeles, CA
                                                </p>
                                                <p className="mb-0 mt-1 post_esd">
                                                    Expected Start Date: 08/10/2021
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row m-0 mt-3">
                                            <div className="col-12 p-0">
                                                <button className="mobile_perm_position">
                                       
                                                    Temporary Position
                                                </button>
                                                <button className="mobile_perm_position mt-2">
                                             
                                                    Full Time (8hrs or more)
                                                </button>
                                                <button className="mobile_perm_position mt-2">
                                                 
                                                    Weekend Job
                                                </button>
                                            </div>
                                        </div>

                                        <div className="row m-0 mt-3">
                                            <div className="col-12 p-0">
                                                <p className="mb-0 prime_healthcare">
                                                    
                                                    Prime Healthcare
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row m-0 mt-3">
                                            <div className="col-3 p-0">
                                                <p className="mb-0 mobile_rating">
                                                    {" "}
                                                    <img className="mb-2" src={MobileStar} alt="" /> &nbsp;
                                                    4.5
                                                </p>
                                            </div>
                                            <div className="col-4 p-0">
                                                <p className="mb-0 mt-1 text-center mobile_reviews">320 Reviews</p>
                                                <p className="mb-0 mt-1 text-center see_all_reviews">See all <img className="mb-1" src={RightArrow} alt=" " /> </p>
                                            </div>
                                        </div>

                                        <div className="row m-0 mt-3">
                                            <div className="col-12 p-0 d-flex justify-content-center">
                                                <button className="mobile_job_completion_done">Job completion</button>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {showAddReviewModal && (
                <AddReviewModal
                    show={showAddReviewModal}
                    postReview={(review, reviewCount) => postReview(review, reviewCount)}
                    onHide={() => setShowAddReviewModal(false)}
                    data={currentSelectedItem}
                    showLoader={showLoader}
                    loader={loader}
                />
            )}

            {showReviewModal && <RateReviewModal
                show={showReviewModal}
                onHide={() => setShowReviewModal(false)}
                reviewData={reviewData}
                data={data}
            />}

            {showReasonModal && (
                <AddReasonModal
                    show={showReasonModal}
                    applicationType={applicationType}
                    onHide={() => setShowReasonModal(false)}
                    setRejectReason={(e) => setrejectReason(e.target.value)}
                    rejectJobOffer={rejectJobOffer}
                    rejectReason={rejectReason}
                    userData={data}
                    keyValue={true}
                />
            )}
        </React.Fragment>
    );
};

export default MyJob;
