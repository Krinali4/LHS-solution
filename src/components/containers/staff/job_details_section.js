import React from 'react';
import starIcon from "../../../components/assets/images/star_icon.svg";
import place from "../../../components/assets/images/place.svg";
import RightArrow from "../../../components/assets/images/RightArrow.png"
import left_arrow from "../../../components/assets/images/left_arrow.png";

const JobDetailsSection = ({ setModalShow, data, status }) => {
    return <div className="job_details_area px-lg-5 px-3 pt-3">

        <hr className='hide_in_mobile' />

        <p className="job_details_area_heading_names">Job Details</p>

        <div className="job_details_area_box_card p-lg-4 p-2">

            <div className="row m-0 mt-lg-0 mt-2">
                <div className="col-lg-6 col-12">
                    <div className="job_details_area_text">
                        <p className="mb-1 job_details_area_label_name">Medical Setting</p>
                        <p className="job_details_area_name">{data.medicalSettings}</p>
                        {data.contractType !== "Permanent Position" && <hr />}
                    </div>
                </div>
                {data.contractType !== "Permanent Position" && <div className="col-lg-6 col-12">
                    <div className="job_details_area_text">
                        <p className="mb-1 job_details_area_label_name">Weekend availability required from the staff</p>
                        <p className="job_details_area_name">{data.weekendAvailiblity ? "Yes" : "No"}</p>
                        {data.contractType !== "Permanent Position" && <hr />}
                    </div>
                </div>}

            </div>

            {data.contractType !== "Permanent Position" && <div className="row m-0">
                <div className="col-lg-6 col-12">
                    <div className="job_details_area_text">
                        <p className="mb-1 job_details_area_label_name">Commitment is required from the staff per day</p>
                        <p className="job_details_area_name">{data.timeCommitment === "Full Time" ? "Full Time (8hrs or more)" : data.timeCommitment}</p>
                    </div>
                </div>
            </div>}


        </div>

        <p className="job_details_area_heading_names mt-lg-5 mt-4">Hospital Details</p>
        {console.log(data.job && data.job.hospital.healthCareInstitution, status)}

        <div className="job_details_area_box_card p-4 job_details_area_text">
            <div className='web_cards_parent'>
                <div className="d-flex align-items-center justify-content-between">

                    <div>
                        {status === "onGoing" ? <p className="mb-1 job_details_area_heading_names">{data.job ? data.job.hospital.healthCareInstitution.name : "Standford Health Care"}</p> : <p className="mb-1 job_details_area_heading_names">{data.hospital ? data.hospital.healthCareInstitution ? data.hospital.healthCareInstitution.name : data.hospital.name : "Standford Health Care"}</p>}

                        <p className="job_details_area_label_name">
                            <span style={{ marginRight: 8 }}>
                                <img alt="place" width="13px" height="16px" src={place} />
                            </span>{" "}
                            {data.healthCareLocation ? data.healthCareLocation : "8700 Beverly Blvd #2900A, Los Angeles, CA 90048"}</p>
                    </div>

                    <div className="p-0 d-flex align-items-center flex-column justify-content-center job_work_name ms-5">
                        <p className="mb-0 job_rating_count w-100">
                            <img
                                src={starIcon}
                                alt="badge.png"
                                className="me-2"
                                width="25px"
                                height="25px"
                            />

                            {status === "onGoing" ? data.job ? data.job.hospital.ratings.ratingSum.toFixed(1) : "0"
                                : data.ratings ? data.ratings.ratingSum.toFixed(1) : data.hospital && data.hospital.ratings ? data.hospital.ratings.ratingSum.toFixed(1) : "0"
                            }

                            {status === "onGoing" ? <div className="d-flex align-items-center justify-content-center flex-column ms-5">
                                <span className="">{data.job ? data.job.hospital.ratings.totalRatings.toFixed(0) : "0"} Review</span>
                                {data.job && data.job.hospital.ratings.totalRatings !== 0 ? <span className="rating_view_link"
                                    onClick={() => setModalShow(true)}>
                                    See all{" "}
                                    <img
                                        className="ms-2"
                                        src={left_arrow}
                                        width="7"
                                        alt=""
                                    />
                                </span> : ""}
                            </div> : <div className="d-flex align-items-center justify-content-center flex-column ms-5">
                                <span className="">{data.ratings ? data.ratings.totalRatings.toFixed(0) : data.hospital && data.hospital.ratings ? data.hospital.ratings.totalRatings : "0"} Review</span>
                                {data.hospital && data.hospital.ratings && data.hospital.ratings.totalRatings !== 0 ? <span className="rating_view_link"
                                    onClick={() => setModalShow(true)}>
                                    See all{" "}
                                    <img
                                        className="ms-2"
                                        src={left_arrow}
                                        width="7"
                                        alt=""
                                    />
                                </span> : ""}
                            </div>}


                        </p>

                    </div>
                </div>
            </div>

            <div className='row m-0 mobile_cards_parent'>
                <div className='col-12 p-0'>

                    <div className='row m-0'>
                        <div className='col-12 p-0'>
                            <p className="mb-1 job_details_area_heading_names">{data.hospital ? data.hospital.name : "Standford Health Care"}</p>
                        </div>
                    </div>

                    <div className='row m-0 mt-2'>
                        <div className='col-12 p-0 d-flex'>
                            <img className='mt-1' alt="place" width="13px" height="16px" src={place} />
                            &nbsp;&nbsp;
                            <p className="job_details_area_label_name mobile_location_job">
                                {data.healthCareLocation ? data.healthCareLocation : "8700 Beverly Blvd #2900A, Los Angeles, CA 90048"}
                            </p>
                        </div>
                    </div>

                    <div className='row m-0'>

                        <div className='col-4 p-0 d-flex align-items-center'>
                            <img
                                src={starIcon}
                                alt="badge.png"
                                className="me-3 mb-1"
                                width="25px"
                                height="25px"
                            />
                            <p className="mb-0 job_rating_count">{data.hospital && data.hospital.ratings ? data.hospital.ratings.ratingSum.toFixed(1) : "0"}</p>
                        </div>

                        <div className='col-6 p-0 d-flex flex-column align-items-center justify-content-center'>
                            <p className="mb-0 mt-1 total_count_review text-center" onClick={() => setModalShow(true)}>{data.hospital && data.hospital.ratings ? data.hospital.ratings.totalRatings : "0"} Review</p>
                            {/* <p className="mb-0 mt-1 see_all_review text-center" onClick={() => setModalShow(true)} >See All &nbsp; <img className='mb-1' src={RightArrow} alt="" /> </p> */}
                        </div>

                    </div>

                </div>
            </div>

        </div>

        <p className="job_details_area_heading_names mt-5">Job Description and Key Result Areas</p>

        <div className="job_details_area_box_card p-4 job_details_area_text">
            <p className="mb-1 job_details_area_label_name job_details_area_description">{data.jobDescription}</p>
        </div>

    </div>
}

export default JobDetailsSection;