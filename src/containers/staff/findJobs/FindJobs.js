import React, { useEffect, useState } from "react";
import place from "../../../components/assets/images/place.svg";
import jobImg from "../../../components/assets/images/doctors-nurse-walking-corridor 1.png";
import tickIcon from "../../../components/assets/images/tickIcon.png";
import starIcon from "../../../components/assets/images/star_icon.svg";
import searchIcon from "../../../components/assets/images/search_icon.png";
import MobileFilter from "../../../components/assets/images/MobileFilter.png";
import Header from "./../../../components/theme_2/components/header";
import NewNavigation from "../../../components/theme_2/components/newNavigation";
import MobileProfilePic from "../../../components/assets/images/MobileProfilePic.png";
import Location from "../../../components/assets/images/Location.png";
import MobileStar from "../../../components/assets/images/MobileStar.png";
import left_arrow from "../../../components/assets/images/left_arrow.png";
import { callApi } from "./../../../action";
import JobHeader from "./../../../components/containers/staff/job_header";
import moment from "moment";
import Pagination from '../../../components/theme_2/admin/pagination';

// import '../../../containers/staff/staff_components.css';
import { Modal, Spinner } from "react-bootstrap";
import RateReviewModal from "../../../components/containers/staff/rate_review_modal";
import { changeDateFormat } from './../constants';

const FindJobs = (props) => {
  const [allJobList, setAllJobList] = useState([]);

  const userId = localStorage.getItem("_id");

  const [showSearchMobileFilter, setshowSearchMobileFilter] = useState(false);

  const [searchFilter, setSearchFilter] = useState("medicalSettings");
  const [skip, setskip] = useState(0);
  const [showSpinnerApplyJob, setshowSpinnerApplyJob] = useState("");

  let [sort, setsort] = useState("latestFirst");
  const [filter, setfilter] = useState("");

  const [value, setvalue] = useState(false);

  const [search, setsearch] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [data, setData] = useState({});

  const [curPage, setcurPage] = useState(1);
  const [total, seTotal] = useState(3);

  useEffect(async () => {
    if (searchFilter === "medicalSettings") {
      await seTotal(3);
      await setcurPage(1);
      await setskip(0);
      GetAllJobListByMedicalSettings(skip);
    } else if (searchFilter === "jobTitle") {
      await seTotal(3);
      await setcurPage(1);
      await setskip(0);
      GetAllJobListByJobTitle(skip);
    }
  }, [searchFilter, sort, filter, search]);

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

  const GetAllJobListByMedicalSettings = async (skip) => {
    let filterName = "";
    let sortValue = "";
    if (sort === "latestFirst") {
      sortValue = "";
      sort = "latestFirst";
    } else if (sort === "oldestFirst") {
      sortValue = "";
      sort = "oldestFirst";
    } else if (sort === "rating_high") {
      sortValue = "-1";
      sort = "rating";
    } else if (sort === "rating_low") {
      sortValue = "1";
      sort = "rating";
    }
    if (filter === "Full Time" || filter === "Part Time") {
      filterName = "Commitment";
    } else if (filter === "medicalSettings") {
      filterName = "medicalSettings";
    } else if (filter === "true" || filter === "false") {
      filterName = "weekendAvailiblity";
    }
    var token = localStorage.getItem("accessToken");
    const data = await callApi(
      "GET",
      `v1/LHS/staff/jobListByMedicalSettings?skip=${skip}&sortValue=${sortValue}&sort=${sort}&filter=${filterName}&value=${filter}&search=${search}`,
      `Bearer ${token}`
    );
    if (data.data) {
      setAllJobList(data.data.data || []);
    }
    else {
      setAllJobList([]);
    }
    setshowSpinnerApplyJob("");
    var totalCount = data.data.count
    var page = Math.ceil(totalCount / 10);
    seTotal(page);
  };

  const GetAllJobListByJobTitle = async (skip) => {
    let filterName = "";
    let sortValue = "";
    if (sort === "latestFirst") {
      sortValue = "";
      sort = "latestFirst";
    } else if (sort === "oldestFirst") {
      sortValue = "";
      sort = "oldestFirst";
    } else if (sort === "rating_high") {
      sortValue = "-1";
      sort = "rating";
    } else if (sort === "rating_low") {
      sortValue = "1";
      sort = "rating";
    }
    if (filter === "Full Time" || filter === "Part Time") {
      filterName = "Commitment";
    } else if (filter === "medicalSettings") {
      filterName = "medicalSettings";
    } else if (filter === "true" || filter === "false") {
      filterName = "weekendAvailiblity";
    }
    var token = localStorage.getItem("accessToken");
    const data = await callApi(
      "GET",
      `v1/LHS/staff/jobListByJobTitle?skip=${skip}&sortValue=${sortValue}&sort=${sort}&filter=${filterName}&value=${filter}&search=${search}`,
      `Bearer ${token}`
    );
    if (data.data) {
      setAllJobList(data.data.data || []);
    }
    else {
      setAllJobList([]);
    }
    var totalCount = data.data.count
    var page = Math.ceil(totalCount / 10);
    seTotal(page);
  };

  const applyJobFunc = async (id) => {
    setshowSpinnerApplyJob(id);
    var token = localStorage.getItem("accessToken");
    const data = await callApi(
      "POST",
      `v1/LHS/job/apply/${id}`,
      `Bearer ${token}`
    );
    if (data) {
      await setsearch("");
      await GetAllJobListByMedicalSettings(skip);
    }
  };

  const setCurPageFunc = async (num) => {
    await setcurPage(num);
    var skip = (num - 1) * 10;
    await setskip(skip);
    if (searchFilter === "medicalSettings") {
      GetAllJobListByMedicalSettings(skip);
    } else if (searchFilter === "jobTitle") {
      GetAllJobListByJobTitle(skip);
    }

  }

  return (
    <div className="theme2">
      <NewNavigation />

      <div className="theme2_container">
        <Header page="Find Jobs" />

        <div className="theme2_main_container">
          <div className="row m-0 find_jobs_background web_cards_parent">
            <JobHeader
              hideLocation
              hideHospitalName
              setSearchFilter={(val) => {
                setcurPage(1);
                seTotal(3);
                setSearchFilter(val)
              }}
              setSorting={(val) => {
                seTotal(3);
                setcurPage(1);
                setskip(0);
                setsort(val);
              }}
              setFilter={(val) => {
                seTotal(3);
                setcurPage(1);
                setskip(0);
                setfilter(val)
              }}
              setSearch={setsearch}
              search={search}
              sortingValue={sort}
              sortingOptions={[
                {
                  label: "Latest First",
                  value: "latestFirst",
                },
                {
                  label: "Oldest First",
                  value: "oldestFirst",
                },
                {
                  label: "Rating highest",
                  value: "rating_high",
                },
                {
                  label: "Rating Lowest",
                  value: "rating_low",
                },
              ]}
              filterOptions={[
                {
                  label: "Full Time Commitment",
                  value: "Full Time",
                },
                {
                  label: "Part Time Commitment",
                  value: "Part Time",
                },
                {
                  label: "Weekend Availability",
                  value: "true",
                },
                {
                  label: "No Weekend Availability",
                  value: "false",
                },
              ]}
            />

            <div className="d-flex justify-content-between mb-4">
              <p className="jobs_count mb-0">{allJobList.filter(v => !v.isDeleted).length} Jobs</p>
              {/* {allJobList.length ? <p className="pagination_count mb-0">1 of 20</p> : null} */}
            </div>

            <div className="row m-0 find_jobs_cards mb-4">
              {(allJobList || []).filter(v => !v.isDeleted).map((v, i) => {
                return (
                  <div className="col-12 p-0 mb-4" key={i}>
                {  console.log(v,'staff data line 260')}
                    <div
                      className="row m-0 find_jobs_card align-items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        props.history.push({
                          pathname: "/main/staff/jobDetails",
                          state: v,
                        });
                      }}
                    >
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
                        <p className="job_name mb-1">{v.jobTitle}</p>
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
                          Expected Start Date: {v.expectedStartDate && moment(v.expectedStartDate).format("MM-DD-YYYY") || "---"}
                        </p>
                     {v.costPerHour &&    <p className="job_date mb-1">
                          {`$ ${v.costPerHour}/hr`} 
                        </p>}
                      </div>
                      <div className="col-2 p-0">
                        <div className="permanent_position_btn d-flex flex-column align-items-center justify-content-center">
                          <button>{v.contractType}</button>
                          {v.contractType !== "Permanent Position" && <>
                            {v.weekendAvailiblity && (
                              <button className="mt-2">Weekend Job</button>
                            )}
                            {v.timeCommitment && (
                              <button className="mt-2">{v.timeCommitment === "Full Time" ? "Full Time (8hrs or more)" : v.timeCommitment}</button>

                            )}
                          </>}
                        </div>
                      </div>
                      <div
                        className="col-3 p-0 d-flex align-items-center flex-column justify-content-center job_work_name ms-5"
                        style={{ width: "22%" }}
                      >
                        <p className="mb-0 name_tag">{v.medicalSettings}</p>
                        <p className="mb-0 job_rating_count">
                          <div className="d-flex align-items-center">
                            <img
                              src={starIcon}
                              alt="badge.png"
                              className="me-2"
                              width="25px"
                              height="25px"
                            />
                            {v.hospital ? v.hospital.ratings.ratingSum.toFixed(1) : "0"}
                          </div>
                          <div className="d-flex align-items-center justify-content-center flex-column">
                            <span>
                              {v.hospital
                                ? v.hospital.ratings.totalRatings.toFixed(0)
                                : "0"}{" "}
                              Review
                            </span>
                            {v.hospital.ratings.totalRatings !== 0 ? <span className="rating_view_link"
                              onClick={(e) => {
                                e.stopPropagation();
                                setData(v);
                                getAllReviews(v.hospital._id);
                                setModalShow(true);
                              }}>
                              See all{" "}
                              <img
                                className="ms-2"
                                src={left_arrow}
                                width="7"
                                alt=""
                              />
                            </span> : ''}
                          </div>
                        </p>
                      </div>
                      <div className="col-2 d-flex align-items-center justify-content-center p-0">

                        {v.openPositions === v.positionsFilled ? <button
                          className="apply_job_btn apply_job_btn_disabled"
                          disabled
                        >
                          Positions Filled
                        </button> : <>
                        {console.log(v.rejectedBy && v.rejectedBy.includes(userId),'arrrrrrrrrr')}
                        {console.log((v.appliedBy.includes(userId)),'createddddd')}
                        {console.log(v.rejectedBy && v.rejectedBy,'arrrrrrrrrr dataa')}
                          {(v.appliedBy.includes(userId)) || (v.rejectedBy && v.rejectedBy.includes(userId)) ? (
                            <button
                              className="apply_job_btn apply_job_btn_disabled"
                              disabled
                            >
                              APPLIED
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                applyJobFunc(v._id);
                              }}
                              className="apply_job_btn"
                            >
                              {showSpinnerApplyJob === v._id ? (
                                <Spinner animation="border" />
                              ) : (
                                "APPLY JOB"
                              )}
                            </button>
                          )}
                        </>}


                      </div>
                    </div>
                  </div>
                );
              })}

              {!allJobList.filter(v => !v.isDeleted).length ? (
                <p className="text-center mt-5">No record found</p>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="row m-0 mobile_cards_parent">
            <div className="col-12 p-0 mobile_cards_inner">
              <div className="row m-0">
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
                        onClick={() => setshowSearchMobileFilter(true)}
                      >
                        {" "}
                        <img src={MobileFilter} alt="" />{" "}
                      </span>
                    </div>
                  </div>

                  {/* <!-- Modal --> */}
                  <Modal
                    show={showSearchMobileFilter}
                    onHide={() => setshowSearchMobileFilter(false)}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Body>
                      <div className="row m-0">
                        <div className="col-12 p-0">
                          <p className="mb-0 model_head">Search by</p>
                        </div>
                      </div>

                      <div className="row m-0 mt-2">
                        <div className="col-12 p-3 model_box">
                          <div className="row m-0">
                            <div className="col-6 p-0 d-flex align-items-center justify-content-center">
                              <button
                                onClick={() => setSearchFilter("hospitalName")}
                                className={`model_button ${searchFilter === "hospitalName"
                                  ? "model_active"
                                  : ""
                                  }`}
                              >
                                Hospital Name
                              </button>
                            </div>
                            <div className="col-6 p-0 d-flex align-items-center justify-content-center">
                              <button
                                onClick={() =>
                                  setSearchFilter("medicalSettings")
                                }
                                className={`model_button ${searchFilter === "medicalSettings"
                                  ? "model_active"
                                  : ""
                                  }`}
                              >
                                Medical Settings
                              </button>
                            </div>
                          </div>
                          <div className="row m-0 mt-2">
                            <div className="col-6 p-0 d-flex align-items-center justify-content-center">
                              <button
                                onClick={() => setSearchFilter("jobTitle")}
                                className={`model_button ${searchFilter === "jobTitle"
                                  ? "model_active"
                                  : ""
                                  }`}
                              >
                                Job Title
                              </button>
                            </div>
                            <div className="col-6 p-0 d-flex align-items-center justify-content-center">
                              <button
                                onClick={() => setSearchFilter("location")}
                                className={`model_button ${searchFilter === "location"
                                  ? "model_active"
                                  : ""
                                  }`}
                              >
                                Location
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row m-0 mt-3">
                        <div className="col-12 p-0">
                          <p className="mb-0 model_head">Sortings</p>
                        </div>
                      </div>

                      <div className="row m-0 mt-2">
                        <div className="col-12 p-3 model_box">
                          <div className="row m-0">
                            <div className="col-6 p-0 d-flex align-items-center justify-content-center">
                              <button
                                onClick={() => setsort("availability")}
                                className={`model_button ${sort === "availability" ? "model_active" : ""
                                  }`}
                              >
                                Availability
                              </button>
                            </div>
                            <div className="col-6 p-0 d-flex align-items-center justify-content-center">
                              <button
                                onClick={() => setsort("rating")}
                                className={`model_button ${sort === "rating" ? "model_active" : ""
                                  }`}
                              >
                                Rating
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row m-0 mt-3">
                        <div className="col-12 p-0">
                          <p className="mb-0 model_head">Filter</p>
                        </div>
                      </div>

                      <div className="row m-0 mt-2">
                        <div className="col-12 p-3 model_box">
                          <div className="row m-0">
                            <div className="col-6 p-0 d-flex align-items-center justify-content-center">
                              <button
                                onClick={() => setfilter("medicalSettings")}
                                className={`model_button ${filter === "medicalSettings"
                                  ? "model_active"
                                  : ""
                                  }`}
                              >
                                Medical Setting
                              </button>
                            </div>
                            <div className="col-6 p-0 d-flex align-items-center justify-content-center">
                              <button
                                onClick={() => setfilter("weekendAvailiblity")}
                                className={`model_button ${filter === "weekendAvailiblity"
                                  ? "model_active"
                                  : ""
                                  }`}
                              >
                                Weekend Availability
                              </button>
                            </div>
                          </div>
                          <div className="row m-0 mt-2">
                            <div className="col-6 p-0 d-flex align-items-center justify-content-center">
                              <button
                                onClick={() => setfilter("Commitment")}
                                className={`model_button ${filter === "Commitment" ? "model_active" : ""
                                  }`}
                              >
                                Commitment
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row m-0 mt-4">
                        <div className="col-6 p-0 d-flex align-items-center justify-content-center">
                          <button
                            className="model_post_btn btn_save model_active"
                            onClick={() => setshowSearchMobileFilter(false)}
                          >
                            Save
                          </button>
                        </div>
                        <div
                          className="col-6 p-0 d-flex align-items-center justify-content-center"
                          onClick={() => setshowSearchMobileFilter(false)}
                        >
                          <button className="model_post_btn btn_cancel">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>

              <div className="row m-0 mt-3">
                <div className="col-12 m-0 d-flex align-items-center justify-content-between">
                  <p className="mb-0 mobile_cards_related_info">
                    {allJobList.length} Jobs
                  </p>
                  {allJobList.length ? <p className="mb-0 mobile_cards_related_info">1 of 20</p> : null}
                </div>
              </div>

              {(allJobList || []).filter(v => !v.isDeleted).map((v, i) => {
                return (
                  <div
                    className="row m-0 mt-3"
                    style={{ cursor: "pointer" }}
                    key={i}
                    onClick={() =>
                      props.history.push({
                        pathname: "/main/staff/jobDetails",
                        state: v,
                      })
                    }
                  >
                    <div className="col-12 p-3 card_type_one">
                      <div className="row m-0">
                        <div className="col-4 p-0 d-flex align-items-center">
                          <img src={MobileProfilePic} alt="" />
                        </div>
                        <div className="col-8 p-0 d-flex flex-column align-items-left justify-content-center">
                          <p className="mb-0 post_type">{v.jobTitle}</p>
                          <p className="mb-0 mt-1 post_address">
                            {" "}
                            <img className="mb-1" src={Location} alt="" />{" "}
                            &nbsp;
                            {v.healthCareLocation}
                          </p>
                          <p className="mb-0 mt-1 post_esd">
                            Expected Start Date: {v.expectedStartDate && moment(v.expectedStartDate).format("MM-DD-YYYY") || "---"}
                          </p>
                          {v.costPerHour &&    <p className="mb-0 mt-1 post_esd">
                          {`$ ${v.costPerHour}/hr`} 
                        </p>}
                        </div>
                      </div>

                      <div className="row m-0 mt-3">
                        <div className="col-12 p-0">
                          <button className="mobile_perm_position">
                            {v.contractType}
                          </button>
                        </div>
                      </div>

                      <div className="row m-0 mt-3">
                        <div className="col-12 p-0">
                          <p className="mb-0 prime_healthcare">
                            {v.medicalSettings}
                          </p>
                        </div>
                      </div>

                      <div className="row m-0 mt-3">
                        <div className="col-4 p-0" style={{ marginLeft: '49.5px' }}>
                          <p className="mb-0 mobile_rating">
                            {" "}
                            <img
                              className="mb-2"
                              src={MobileStar}
                              alt=""
                            />{" "}
                            &nbsp; 4.5
                          </p>
                        </div>
                        <div className="col-8 p-0">
                          <p className="mb-0 mt-1 mobile_reviews">
                            {v.hospital
                              ? v.hospital.ratings.totalRatings
                              : "0"}{" "}
                            Review
                          </p>
                          {console.log(v.hospital.ratings)}

                          {v.hospital.ratings.totalRatings !== 0 ?
                            <span className="rating_view_link"
                              onClick={(e) => {
                                e.stopPropagation();
                                setData(v);
                                getAllReviews(v.hospital._id);
                                setModalShow(true);
                              }}>
                              See all{" "}
                              <img
                                className="ms-2"
                                src={left_arrow}
                                width="7"
                                alt=""
                              />
                            </span> : ''}
                        </div>
                      </div>

                      <div className="row m-0 mt-3">
                        <div className="col-12 p-0">
                          {v.appliedBy.includes(userId) || v.rejectedBy && v.rejectedBy.includes(userId) ? (
                            <button
                              className="mobile_apply_job mobile_apply_job_disabled"
                              disabled
                            >
                              APPLIED
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                applyJobFunc(v._id);
                              }}
                              className="mobile_apply_job"
                            >
                              {showSpinnerApplyJob === v._id ? (
                                <Spinner animation="border" />
                              ) : (
                                "APPLY JOB"
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {allJobList.filter(v => !v.isDeleted).length ? <Pagination curPage={curPage} totalPage={total} setCurPage={setCurPageFunc} /> : null}

        </div>
        {modalShow && <RateReviewModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          reviewData={reviewData}
          data={data}
        />}
      </div>
    </div>
  );
};

export default FindJobs;
