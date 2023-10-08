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
import Call from './../../../components/theme_2/hospitalProfile/Call';

const Chat = (props) => {
    return (
        <div className="theme2">
            <NewNavigation />

            <div className="theme2_container">
                {/* <Header page="Find Jobs" /> */}

                <div className="theme2_main_container">

                    <Call />


                </div>

            </div>
        </div>
    );
};

export default Chat;
