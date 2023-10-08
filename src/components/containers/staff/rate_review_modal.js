import { Modal, Button } from "react-bootstrap";
import React from 'react';
import starIcon from "../../../components/assets/images/star_icon.svg";
import jobImg from "../../../components/assets/images/doctors-nurse-walking-corridor 1.png";
import avatar from '../../../components/assets/images/avatar.png'
import './staff_components.css';

const RateReviewModal = (props) => {
    return <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="rate_review_modal"
    >

        <Modal.Body>
            <div className="p-lg-5 p-2">
                <div className="row m-0 align-items-center">
                {console.log(props.reviewData, "AAAAAAAAAAAA")}

                    <div className="col-lg-6 col-12 p-0">
                        {props.type === "staff" ? <p className="mb-0 rate_reviw_modal_heading">{props.data.staffName ?  props.data.staffName : ""}</p>
                    : <p className="mb-0 rate_reviw_modal_heading">{props.reviewData.length && props.reviewData[0].hospital ?  props.reviewData[0].hospital.healthCareInstitution.name : ""}</p>    
                    
                    }
                    </div>
                    <div className="col-lg-6 col-12 p-0 d-flex align-items-lg-center justify-content-lg-end align-items-left justify-content-start">
                        <div className="p-0 mt-lg-0 mt-2 d-flex align-items-center flex-column justify-content-center job_work_name ms-lg-5">
                            <p className="mb-0 job_rating_count w-100">
                                <img
                                    src={starIcon}
                                    alt="badge.png"
                                    className="me-2"
                                    width="25px"
                                    height="25px"
                                />
                                {props.data.ratings ? props.data.ratings.ratingSum.toFixed(1) : props.data.hospital.ratings ? props.data.hospital.ratings.ratingSum.toFixed(1) : "0"} <span className="ms-4">
                                    {props.data.ratings ? props.data.ratings.totalRatings.toFixed(0) : props.data.hospital.ratings ? props.data.hospital.ratings.totalRatings.toFixed(0) : "0"}{" "}
                                    Review</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row m-0 mt-lg-4 mt-3">
                    {(props.reviewData || []).map((v, i) => {
                        return <div className="col-12 p-0 rate_reviw_card p-lg-4 p-3 mt-4" key={i}>
                            <div className="row m-0">
                                <div className="col-lg-8 col-8 d-flex align-items-center p-0">
                                 {props.type === "staff"   ?
                                  <img
                                        alt="avatar.png"
                                        src={v.hospital && v.hospital.avatar!== '' ? v.hospital.avatar : avatar}
                                        width="70px"
                                        height="70px"
                                        className="job_image"
                                        style={{ borderRadius: "50%" }}
                                    /> : 
                                    <img
                                    alt="avatar.png"
                                    src={v.staff && v.staff.avatar!== ''  ? v.staff.avatar : avatar}
                                    width="70px"
                                    height="70px"
                                    className="job_image"
                                    style={{ borderRadius: "50%" }}
                                />
                                     }

                                    <div className="ms-4">
                                        {props.type === "staff" ?  <p className="mb-0 username modal_username">{v.hospital.healthCareInstitution ? v.hospital.healthCareInstitution.name : "Michael Pollak"}</p> 
                                    
                                    :  <p className="mb-0 username modal_username">{v.staff ? v.staff.name : "Michael Pollak"}</p>
                                    }
                                       
                                        {/* <p className="mb-0 role modal_role">{v.staff ? v.staff.role : "Adventist Health"}</p> */}
                                    </div>
                                </div>

                                <div className="col-lg-4 col-4 rate_reviw_card_ratings d-flex align-items-center justify-content-end p-0">
                                    <img
                                        src={starIcon}
                                        alt="badge.png"
                                        className="me-2"
                                        width="18px"
                                        height="18px"
                                    />
                                    {v.rating}
                                </div>
                            </div>

                            <div className="row m-0 rate_reviw_card_comment mt-3">
                                {v.review}
                            </div>
                        </div>
                    })}
                </div>

                <hr className="hide_in_mobile show_in_mobile" />

                <div className="row m-0 justify-content-center align-items-center rate_reviw_card_footer mt-lg-5 mt-4">
                    <div className="col-12 p-0 d-flex justify-content-center align-items-center">
                        <Button className="modal_button" variant="primary" onClick={() => props.onHide()}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </Modal.Body>
    </Modal>
}

export default RateReviewModal;