import React from 'react';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import { Document, Page, pdfjs } from 'react-pdf';
import $ from 'jquery';
import "./findStaff.css";
import "./applicantMember.css";
import ErrorState from "../../../theme_1/staffSignUp/components/errorState";
import avatar from '../../../assets/images/avatar.png';
import badge from '../../../assets/images/badge.png';
import NurseLicence from '../../../assets/images/nurseLicence.png';
import calendar from '../../../assets/images/calendar.png';
import left_arrow from '../../../../components/assets/images/left_arrow.png';
import { callApi } from '../../../../action';
import ViewDoc from '../../../../components/modals/viewDoc';
import axios from 'axios';
import { AddReasonModal } from './../../../../containers/staff/myJobs/myJob';
import moment from 'moment';
import { CometChat } from "@cometchat-pro/chat";
import Loader from '../../../modals/Loader';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
};

const mapDispatchToProps = dispatch => ({
});
class ApplicantMember extends React.Component {
    constructor(props) {
        super(props);
        // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
        this.state = {
            showReview: false,
            showPdf: 'none',
            staffRating: '',
            src: "",
            format: "",
            numPages: null,
            pageNumber: 1,
            viewResume: false,
            avatar: "",
            processReview: "",
            processInterview: "",
            processOffer: "",
            processHire: "",
            processTimeReview: "",
            processTimeInterview: "",
            processTimeOffer: "",
            processTimeHire: "",
            showView: "none",
            showReviewView: 'none',
            expStartDate: null,
            expEndDate: null,
            error: {
                dateStart: "none",
                dateEnd: "none",
            },
            showReasonModal: "",
            rejectReason: "",
            showInterestModal: false,
            allJobIds: [],
            selectedJobId: "",
            jobDetails: {},
            interviewLoader : false,
            jobOfferLoader: false,
            confirmHiringLoader : false
        }
    }
    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }
    handleprops = () => {
        props = this.props.applicantData
    }
    componentWillMount = async () => {
        console.log(localStorage.getItem('token'));
        var token = "Bearer " + localStorage.getItem('token');
        // var res = await callApi("GET", "v1/LHS/hospital/generalJobList/?skip=10&sort=asc", token);
        // console.log(res);
        this.initState(this.props);
        this.getAllJobList();
    }
    componentWillReceiveProps = (newProps) => {
        this.initState(newProps);
    }
    initState = (props) => {
        console.log(props.auth);
        this.setState({
            avatar: props.auth.avatar !== '' ? props.auth.avatar : avatar,
        })
    }
    handleProcess = (param) => {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        if (hour >= 0 && hour < 12) {
            var AP = "AM";
        } else {
            var AP = "PM";
        }
        var nowTime = day + "/" + month + "/" + year + " " + hour + ":" + min + " " + AP;
        if (param === "review")
            if (this.state.processReview !== "")
                // this.setState({ processReview:"", processTimeReview:"", processInterview:"", processTimeInterview:"", processOffer:"", processTimeOffer:"", processHire:"", processTimeHire:"" });
                this.setState({ processReview: "", processTimeReview: "" });
            else
                this.setState({ processReview: param, processTimeReview: nowTime });
        else if (param === "interview")
            if (this.state.processInterview !== "")
                // this.setState({ processInterview:"", processTimeInterview:"", processOffer:"", processTimeOffer:"", processHire:"", processTimeHire:"" });
                this.setState({ processInterview: "", processTimeInterview: "" });
            else
                this.setState({ processInterview: param, processTimeInterview: nowTime });
        else if (param === "offer")
            if (this.state.processOffer !== "")
                // this.setState({ processOffer:"", processTimeOffer:"", processHire:"", processTimeHire:"" });
                this.setState({ processOffer: "", processTimeOffer: "" });
            else
                this.setState({ processOffer: param, processTimeOffer: nowTime });
        else if (param === "hire")
            if (this.state.processHire !== "")
                this.setState({ processHire: "", processTimeHire: "" });
            else
                this.setState({ processHire: param, processTimeHire: nowTime, showView: "block" });
    }

    changeJobStatus = async () => {
        this.setState({interviewLoader : true})
        let obj = {
            status: "Interview"
        }
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        const res = await axios.post(`${process.env.REACT_APP_API_URL}v1/LHS/job/changeApplicationStatus/${this.props.applicantData._id}`, obj, { headers: { Authorization: Authorization } });
        if (res) {
            /*-------- CometChat SignUp ----------*/
            let authKey = "3b150f16cb126d01ff19132bd8b2b56021189cc6";
            var uid = this.props.applicantData.staff

            var user = new CometChat.User(uid);
            user.setName(this.props.applicantData.name);

            CometChat.login(uid, authKey).then(
                user => {
                    console.log("Login Successful:", { user });
                    let data = {
                        accepted: [`${this.props.applicantData.staff}`]
                    }
                    let headers = {
                        "apiKey": "52f43f2e72dff3ba8c24f8dc537c1d6993c77394",
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                    let resData = axios.post(`https://206961e2dbe5aa43.api-us.cometchat.io/v3/users/${this.props.applicantData.hospital}/friends`, data, { headers: headers });
                    if (resData) {
                        CometChat.login(this.props.applicantData.hospital, authKey).then(
                            user => {
                                console.log("Login Successful:", { user });
                            },
                            error => {
                                console.log("Login failed with exception:", { error });
                            }
                        );
                    }
        this.setState({interviewLoader : false})
                },
                error => {
                    console.log("Login failed with exception:", { error });
                }
            );
            /*----------- CometChat SignUp end ----------*/
            this.getAllJobList();
            this.props.handleMember(this.props.applicantData.job, this.props.applicantData.staff);
        this.setState({interviewLoader : false})
        }
    }

    rejectJobOffer = async () => {
        let obj = {
            rejectionReason: this.state.rejectReason
        }
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        const res = await axios.post(`${process.env.REACT_APP_API_URL}v1/LHS/job/jobApplication/reject/${this.props.applicantData._id}`, obj, { headers: { Authorization: Authorization } });
        if (res) {
            this.setState({
                showReasonModal: false
            })
            this.props.handleMember(this.props.applicantData.job, this.props.applicantData.staff);
        }
    }

    jobOfferToUser = async () => {
        this.setState({ confirmHiringLoader : true })
        if (this.state.expStartDate === null) {
            var error = this.state.error;
            error.dateStart = 'block';
            this.setState({ error: error , confirmHiringLoader : false });
        }
        else if (this.props.applicantData && this.props.applicantData.natureOfJob && this.state.jobDetails.contractType === "Temporary Position" && this.state.expEndDate === null) {
            var error = this.state.error;
            error.dateEnd = 'block';
            this.setState({ error: error, confirmHiringLoader : false });
        }
        else {
            var date1 = new Date(this.state.expStartDate);
            var date2 = new Date(this.state.expEndDate);
            date1 = `${date1.getMonth() + 1}/${date1.getDate()}/${date1.getFullYear()}`;
            date2 = `${date2.getMonth() + 1}/${date2.getDate()}/${date2.getFullYear()}`;
            var dateFind1 = new Date(date1);
            var dateFind2 = new Date(date2);
            var difference_In_Time = dateFind2.getTime() - dateFind1.getTime();
            var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);
            let obj = {};
            if (this.state.jobDetails.contractType === "Temporary Position") {
                obj.startDate = date1,
                    obj.endDate = date2,
                    obj.totalDays = difference_In_Days
            }
            else {
                obj.startDate = date1,
                    obj.endDate = date2,
                    obj.totalDays = 0
            }
            var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
            const res = await axios.post(`${process.env.REACT_APP_API_URL}v1/LHS/job/jobApplication/offer/${this.props.applicantData._id}`, obj, { headers: { Authorization: Authorization } });
            if (res) {
                this.setState({ showView: "none" });
                this.setState({ showReview: false, confirmHiringLoader : false });
                this.props.handleMember(this.props.applicantData.job, this.props.applicantData.staff);
            }
            else {
        this.setState({ confirmHiringLoader : false })
            }
        }
    }

    showInterest = async () => {
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        const res = await axios.post(`${process.env.REACT_APP_API_URL}v1/LHS/hospital/showIntrest?job=${this.state.selectedJobId}&user=${this.props.applicantData._id}`, {}, { headers: { Authorization: Authorization } });
        if (res) {
            this.props.handleMember(this.props.applicantData._id, this.props.applicantData.staff);
            this.setState({
                showInterestModal: false,
            })
        }
        else{
        }
    }

    getAllJobList = async () => {
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        const res = await axios.get(`${process.env.REACT_APP_API_URL}v1/LHS/job/getByName`, { headers: { Authorization: Authorization } });
        if (res.status === 200) {
            const resData = await axios.get(`${process.env.REACT_APP_API_URL}v1/LHS/job/get/${this.props.applicantData.job}`, { headers: { Authorization: Authorization } });
            let data = res.data.data.job.map((v) => {
                return {
                    name: v.jobTitle,
                    id: v._id,
                }
            })
            this.setState({
                allJobIds: data,
                jobDetails: resData.data.data
            })
        }
    }

    openReview = () => {
        this.setState({ showView: "block" });
    }
    closeReview = () => {
        this.setState({ showView: "none" });
        this.setState({ showReview: false })
    }
    setExpStartDate = (date) => {
        this.setState({ expStartDate: date });
        if (date === null) {
            var error = this.state.error;
            error.dateStart = 'block';
            this.setState({ error: error });
        }
        else {
            var error = this.state.error;
            error.dateStart = 'none';
            this.setState({ error: error });
        }
    }
    setExpEndDate = (date) => {
        console.log(date);
        this.setState({ expEndDate: date });
        if (date === null) {
            var error = this.state.error;
            error.dateEnd = 'block';
            this.setState({ error: error });
        }
        else {
            var error = this.state.error;
            error.dateEnd = 'none';
            this.setState({ error: error });
        }

    }
    handleConfirm = () => {
        console.log(this.state.expStartDate);
        // console.log(this.state.expStartDate);
        // console.log(this.state.error.dateStart);
        // var expStartDate = this.state.error.dateStart === 'block' || this.state.expStartDate === false ? 'block' : 'none';
        // var expStartDate = this.state.error.dateEnd === 'block' || this.state.expEndDate === false ? 'block' : 'none';
        // this.setState({expStartDate: expStartDate, expStartDate: expStartDate});
    }
    handleReview = async () => {
        console.log('in handlereview');
        var userID = this.props.applicantData.staff
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var res = await callApi("GET", `v1/LHS/rating/getStaffRating/${userID}`, Authorization);
        this.setState({ staffRating: res.data })
        this.setState({ showReviewView: 'block' })
        this.setState({ showReview: true })
    }

    getFileType = (file) => {
        let type = file.split(".");
        let c = type[type.length - 1];
        return c;
    }

    render() {

        console.log(this.state.jobDetails, "jobDetailsjobDetailsjobDetails")
        const { pageNumber, numPages } = this.state;

        return (
            <div className="applicantMember">
                <div className="staffOne row staffOneBorderNone">
                    <div className="col-md-7 col-sm-7 col-7 staffOneData">
                        <div className="row">
                            <div className="avatar_img col-md-3 col-sm-3 col-4">
                                <img width="100%" src={this.props.applicantData.avatar && this.props.applicantData.avatar !== '' ? this.props.applicantData.avatar : avatar} alt="avatar.png" style={{ borderRadius: '50%' }} />
                                <img src={badge} alt="badge.png" className="avatar_badge" />
                            </div>
                            <div className="col-md-4 col-sm-4 col-4 marginLeft">
                                <p className="username">{this.props.applicantData.name}</p>
                                <p className="nurse">{this.props.applicantData.jobTitle}</p>
                                <p className="available" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>Availability: {this.props.applicantData.immediatelyStart ? "Immediately" : moment(this.props.applicantData.startWorkDate).format("MM-DD-YYYY")}</p>
                                <div className="position">
                                    <svg width="13" height="16" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8C16 9.892 15.598 11.13 14.5 12.5L8 20L1.5 12.5C0.402 11.13 0 9.892 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315ZM11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8Z" fill="#333333" fill-opacity="0.7" />
                                    </svg>
                                    <p className="position_text">{this.props.applicantData.currentLocation && this.props.applicantData.currentLocation.name + ", " + this.props.applicantData.currentLocation.state}</p>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-4 available_BTNs marginLeft">
                                <div className="available_BTN">
                                    <p className="BTN_text">Weekend availability</p>
                                    {this.props.applicantData.weekendAvailiblity ? <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M0 7C0 5.14348 0.737498 3.36301 2.05025 2.05025C3.36301 0.737498 5.14348 0 7 0C8.85652 0 10.637 0.737498 11.9497 2.05025C13.2625 3.36301 14 5.14348 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14C5.14348 14 3.36301 13.2625 2.05025 11.9497C0.737498 10.637 0 8.85652 0 7H0ZM6.60053 9.996L10.6307 4.95787L9.90267 4.37547L6.46613 8.66973L4.032 6.6416L3.43467 7.3584L6.60053 9.99693V9.996Z" fill="#6FCF97" />
                                    </svg>
                                        :
                                        <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0ZM9.58438 9.65938L8.55313 9.65469L7 7.80313L5.44844 9.65312L4.41563 9.65781C4.34688 9.65781 4.29063 9.60312 4.29063 9.53281C4.29063 9.50312 4.30156 9.475 4.32031 9.45156L6.35313 7.02969L4.32031 4.60938C4.30143 4.58647 4.29096 4.5578 4.29063 4.52812C4.29063 4.45937 4.34688 4.40312 4.41563 4.40312L5.44844 4.40781L7 6.25938L8.55156 4.40938L9.58281 4.40469C9.65156 4.40469 9.70781 4.45937 9.70781 4.52969C9.70781 4.55937 9.69688 4.5875 9.67813 4.61094L7.64844 7.03125L9.67969 9.45312C9.69844 9.47656 9.70938 9.50469 9.70938 9.53438C9.70938 9.60313 9.65313 9.65938 9.58438 9.65938Z" fill="#FF3A44" />
                                        </svg>
                                    }

                                </div>
                                <div className="available_BTN BTN">
                                    <p className="BTN_text">Nursing License</p>
                                    {this.props.applicantData.nursingLicense && this.props.applicantData.nursingLicense.length === 0 ?
                                        <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0ZM9.58438 9.65938L8.55313 9.65469L7 7.80313L5.44844 9.65312L4.41563 9.65781C4.34688 9.65781 4.29063 9.60312 4.29063 9.53281C4.29063 9.50312 4.30156 9.475 4.32031 9.45156L6.35313 7.02969L4.32031 4.60938C4.30143 4.58647 4.29096 4.5578 4.29063 4.52812C4.29063 4.45937 4.34688 4.40312 4.41563 4.40312L5.44844 4.40781L7 6.25938L8.55156 4.40938L9.58281 4.40469C9.65156 4.40469 9.70781 4.45937 9.70781 4.52969C9.70781 4.55937 9.69688 4.5875 9.67813 4.61094L7.64844 7.03125L9.67969 9.45312C9.69844 9.47656 9.70938 9.50469 9.70938 9.53438C9.70938 9.60313 9.65313 9.65938 9.58438 9.65938Z" fill="#FF3A44" />
                                        </svg>
                                        :
                                        <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M0 7C0 5.14348 0.737498 3.36301 2.05025 2.05025C3.36301 0.737498 5.14348 0 7 0C8.85652 0 10.637 0.737498 11.9497 2.05025C13.2625 3.36301 14 5.14348 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14C5.14348 14 3.36301 13.2625 2.05025 11.9497C0.737498 10.637 0 8.85652 0 7H0ZM6.60053 9.996L10.6307 4.95787L9.90267 4.37547L6.46613 8.66973L4.032 6.6416L3.43467 7.3584L6.60053 9.99693V9.996Z" fill="#6FCF97" />
                                        </svg>
                                    }
                                </div>
                                <div className="available_BTN BTN">
                                    <p className="BTN_text">Liability Insurance</p>
                                    {this.props.applicantData.liabilityInsurance && this.props.applicantData.liabilityInsurance.insuranceProvider
                                        ?
                                        <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M0 7C0 5.14348 0.737498 3.36301 2.05025 2.05025C3.36301 0.737498 5.14348 0 7 0C8.85652 0 10.637 0.737498 11.9497 2.05025C13.2625 3.36301 14 5.14348 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14C5.14348 14 3.36301 13.2625 2.05025 11.9497C0.737498 10.637 0 8.85652 0 7H0ZM6.60053 9.996L10.6307 4.95787L9.90267 4.37547L6.46613 8.66973L4.032 6.6416L3.43467 7.3584L6.60053 9.99693V9.996Z" fill="#6FCF97" />
                                        </svg>
                                        :
                                        <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0ZM9.58438 9.65938L8.55313 9.65469L7 7.80313L5.44844 9.65312L4.41563 9.65781C4.34688 9.65781 4.29063 9.60312 4.29063 9.53281C4.29063 9.50312 4.30156 9.475 4.32031 9.45156L6.35313 7.02969L4.32031 4.60938C4.30143 4.58647 4.29096 4.5578 4.29063 4.52812C4.29063 4.45937 4.34688 4.40312 4.41563 4.40312L5.44844 4.40781L7 6.25938L8.55156 4.40938L9.58281 4.40469C9.65156 4.40469 9.70781 4.45937 9.70781 4.52969C9.70781 4.55937 9.69688 4.5875 9.67813 4.61094L7.64844 7.03125L9.67969 9.45312C9.69844 9.47656 9.70938 9.50469 9.70938 9.53438C9.70938 9.60313 9.65313 9.65938 9.58438 9.65938Z" fill="#FF3A44" />
                                        </svg>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-3 staffOneData">
                        <div className="review_info">
                            <div className="middle_line"></div>
                            <svg width="33" height="31.6" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M40.0185 13.9063L27.621 12.1045L22.079 0.869159C21.9277 0.561542 21.6786 0.312518 21.371 0.161151C20.5995 -0.219709 19.662 0.0976744 19.2763 0.869159L13.7343 12.1045L1.33684 13.9063C0.995041 13.9551 0.682541 14.1162 0.443283 14.3604C0.154034 14.6577 -0.005356 15.0576 0.000137431 15.4724C0.00563086 15.8871 0.175558 16.2828 0.47258 16.5723L9.44231 25.3174L7.32317 37.666C7.27347 37.9533 7.30526 38.2487 7.41492 38.5188C7.52459 38.7889 7.70774 39.0229 7.94362 39.1942C8.17949 39.3656 8.45865 39.4674 8.74943 39.4881C9.04022 39.5088 9.331 39.4477 9.58879 39.3115L20.6777 33.4815L31.7665 39.3115C32.0693 39.4727 32.4208 39.5264 32.7577 39.4678C33.6073 39.3213 34.1786 38.5156 34.0322 37.666L31.913 25.3174L40.8827 16.5723C41.1269 16.333 41.288 16.0205 41.3368 15.6787C41.4687 14.8242 40.873 14.0332 40.0185 13.9063Z" fill="#009CDE" />
                            </svg>
                            <p className="marks">{this.props.applicantData.ratings && this.props.applicantData.ratings.ratingSum.toFixed(1)}</p>
                            <div>    <p style={{}} className="review">{this.props.applicantData.ratings && this.props.applicantData.ratings.totalRatings}
                                {' '} Review</p>
                                {this.props.applicantData.ratings && this.props.applicantData.ratings.totalRatings !== 0 ? <span className="rating_view_link"
                                    // onClick={() => this.openReview(staff)}
                                    onClick={this.handleReview}
                                >
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

                        {console.log(this.props.applicantData, "{this.props.applicantData")}

                    </div>
                    <div className="col-md-2 col-sm-2 staffOneData">
                        <div className="review_info">
                            <div className="middle_line"></div>

                            <div>
                                {/* {this.props.applicantData.status && this.props.applicantData.status === "Review" ?
                                    <div className="reviewBTN" onClick={this.changeJobStatus}>Interview</div> : this.props.applicantData.status === "Interview" ?
                                        <div className="reviewBTN" onClick={this.openReview}>Job Offer</div>
                                        : null}
                                <br /> */}

                                {this.props.applicantData.status && this.props.applicantData.status === "Review" && <div className="reviewBTN" onClick={this.changeJobStatus}> {this.state.interviewLoader ? <Loader /> : 'Interview' } </div>}
                                {this.props.applicantData.status && this.props.applicantData.status === "Interview" && <div className="reviewBTN" onClick={this.openReview}>Job Offer</div>}
                                {this.props.applicantData.status && this.props.applicantData.status === "Completed" && <div className="reviewBTN">Completed</div>}
                                {this.props.applicantData.status && this.props.applicantData.status === "Offer Declined" && <div className="reviewBTN">Offer Declined</div>}
                                {this.props.applicantData.status && this.props.applicantData.status === "In Progress" && <div className="reviewBTN">In-Progress</div>}
                                {this.props.applicantData.status && this.props.applicantData.status === "Job Offered" && <div className="reviewBTN">Job Offered</div>}
                                {this.props.applicantData.status && this.props.applicantData.status === "Rejected" && <div className="reviewBTN">Rejected</div>}
                                <br />
                                {this.props.applicantData.status && this.props.applicantData.status !== "Completed" && this.props.applicantData.status !== "Job Offered" && this.props.applicantData.status !== "Offer Declined" && this.props.applicantData.status !== "In Progress" && this.props.applicantData.status !== "Rejected" &&
                                    <div className="reviewBTN reviewBTN_underline" onClick={() => this.setState({
                                        showReasonModal: true
                                    })}>Rejected</div>
                                }

                                {this.props.applicantData &&
                                    (this.state.allJobIds || []).map(v => v.id).sort().join(',') !== (this.props.applicantData.jobIntrest || []).sort().join(',')
                                    && !this.props.applicantData.status
                                    && <div className="reviewBTN" onClick={() => this.setState({ showInterestModal: true })}>Show Interest</div>}
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showReasonModal && (
                    <AddReasonModal
                        userData={this.props.applicantData}
                        show={this.state.showReasonModal}
                        applicationType=""
                        onHide={() => this.setState({ showReasonModal: false })}
                        setRejectReason={(e) => this.setState({ rejectReason: e.target.value })}
                        rejectJobOffer={this.rejectJobOffer}
                        rejectReason={this.state.rejectReason}
                    />
                )}

                {this.state.showInterestModal ? <div className="w3-modal viewModal" id="modal3" style={{ display: this.state.showInterestModal ? 'block' : 'none' }}>
                    <div className="w3-modal-content ssu2_modal2">
                        <div className="w3-container">
                            <div className="ssu2_modal1_text1">
                                <p className="reviewStaff">{this.props.applicantData.name}</p>
                                <p className="reviewEach">{this.props.applicantData.ratings && this.props.applicantData.ratings.totalRatings} Review</p>
                                <p className="reviewMark reviewMarkhidden">{this.props.applicantData.ratings && this.props.applicantData.ratings.ratingSum.toFixed(1)}</p>
                                <svg className='reviewSvg reviewSvghidden' width="33" height="31.6" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M40.0185 13.9063L27.621 12.1045L22.079 0.869159C21.9277 0.561542 21.6786 0.312518 21.371 0.161151C20.5995 -0.219709 19.662 0.0976744 19.2763 0.869159L13.7343 12.1045L1.33684 13.9063C0.995041 13.9551 0.682541 14.1162 0.443283 14.3604C0.154034 14.6577 -0.005356 15.0576 0.000137431 15.4724C0.00563086 15.8871 0.175558 16.2828 0.47258 16.5723L9.44231 25.3174L7.32317 37.666C7.27347 37.9533 7.30526 38.2487 7.41492 38.5188C7.52459 38.7889 7.70774 39.0229 7.94362 39.1942C8.17949 39.3656 8.45865 39.4674 8.74943 39.4881C9.04022 39.5088 9.331 39.4477 9.58879 39.3115L20.6777 33.4815L31.7665 39.3115C32.0693 39.4727 32.4208 39.5264 32.7577 39.4678C33.6073 39.3213 34.1786 38.5156 34.0322 37.666L31.913 25.3174L40.8827 16.5723C41.1269 16.333 41.288 16.0205 41.3368 15.6787C41.4687 14.8242 40.873 14.0332 40.0185 13.9063Z" fill="#009CDE" />
                                </svg>
                            </div>

                            <div className="my-5">
                                <p className="modalName modalNameUnder mb-0 mt-5"> Select Job </p>
                                <select className="job_drodown job_drodown_hospital position-relative" name="option" value={this.state.selectedJobId} onChange={(e) => this.setState({ selectedJobId: e.target.value })}>
                                    <option>Select</option>
                                    {this.state.allJobIds.filter((value) => !this.props.applicantData.jobIntrest.includes(value.id)).map((v, i) => {
                                        return <option key={i} value={v.id}>{v.name}</option>
                                    })}
                                </select>
                            </div>


                            <div className="row modalLast">
                                <div className="col-md-3"></div>
                                <div className="col-md-3 modalBTNCHL" onClick={this.showInterest}>
                                    Confirm
                                </div>
                                <div className="col-md-3 modalBTNCHR" onClick={() => this.setState({ showInterestModal: false })}>
                                    Cancel
                                </div>
                                <div className="col-md-3"></div>
                            </div>
                        </div>
                    </div>
                </div> : null}

                {this.state.showReview ? <div className="w3-modal viewModal" id="modal3" style={{ display: this.state.showReviewView }}>
                    <div className="w3-modal-content ssu2_modal2">
                        <div className="w3-container">
                            <div className="ssu2_modal1_text1">
                                <p className="reviewStaff">{this.props.applicantData.name}</p>
                                <p className="reviewEach">{this.props.applicantData.ratings && this.props.applicantData.ratings.totalRatings} Review</p>
                                <p className="reviewMark reviewMarkhidden">{this.props.applicantData.ratings && this.props.applicantData.ratings.ratingSum.toFixed(1)}</p>
                                <svg className='reviewSvg reviewSvghidden' width="33" height="31.6" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M40.0185 13.9063L27.621 12.1045L22.079 0.869159C21.9277 0.561542 21.6786 0.312518 21.371 0.161151C20.5995 -0.219709 19.662 0.0976744 19.2763 0.869159L13.7343 12.1045L1.33684 13.9063C0.995041 13.9551 0.682541 14.1162 0.443283 14.3604C0.154034 14.6577 -0.005356 15.0576 0.000137431 15.4724C0.00563086 15.8871 0.175558 16.2828 0.47258 16.5723L9.44231 25.3174L7.32317 37.666C7.27347 37.9533 7.30526 38.2487 7.41492 38.5188C7.52459 38.7889 7.70774 39.0229 7.94362 39.1942C8.17949 39.3656 8.45865 39.4674 8.74943 39.4881C9.04022 39.5088 9.331 39.4477 9.58879 39.3115L20.6777 33.4815L31.7665 39.3115C32.0693 39.4727 32.4208 39.5264 32.7577 39.4678C33.6073 39.3213 34.1786 38.5156 34.0322 37.666L31.913 25.3174L40.8827 16.5723C41.1269 16.333 41.288 16.0205 41.3368 15.6787C41.4687 14.8242 40.873 14.0332 40.0185 13.9063Z" fill="#009CDE" />
                                </svg>
                            </div>
                            <div className="mainView">
                                {this.state.staffRating && this.state.staffRating.map((staff) => {
                                    return (
                                        <div className="" key={staff._id}>
                                            <div className="ViewOne">
                                                <div className="HospitalData">
                                                    <img width="72px" src={staff.hospital && staff.hospital.avatar !== '' ? staff.hospital.avatar : avatar} alt="avatar" style={{ borderRadius: '50%' }} />
                                                    <div className="HospitalInfo">
                                                        <p className="hospitalName">{staff.hospital && staff.hospital.healthCareInstitution.name}</p>
                                                        {/* <p className="hospitalCity">San Francisco, California</p> */}
                                                    </div>
                                                    <div className="HospitalMark">
                                                        <svg className='reviewSvg' width="33" height="31.6" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M40.0185 13.9063L27.621 12.1045L22.079 0.869159C21.9277 0.561542 21.6786 0.312518 21.371 0.161151C20.5995 -0.219709 19.662 0.0976744 19.2763 0.869159L13.7343 12.1045L1.33684 13.9063C0.995041 13.9551 0.682541 14.1162 0.443283 14.3604C0.154034 14.6577 -0.005356 15.0576 0.000137431 15.4724C0.00563086 15.8871 0.175558 16.2828 0.47258 16.5723L9.44231 25.3174L7.32317 37.666C7.27347 37.9533 7.30526 38.2487 7.41492 38.5188C7.52459 38.7889 7.70774 39.0229 7.94362 39.1942C8.17949 39.3656 8.45865 39.4674 8.74943 39.4881C9.04022 39.5088 9.331 39.4477 9.58879 39.3115L20.6777 33.4815L31.7665 39.3115C32.0693 39.4727 32.4208 39.5264 32.7577 39.4678C33.6073 39.3213 34.1786 38.5156 34.0322 37.666L31.913 25.3174L40.8827 16.5723C41.1269 16.333 41.288 16.0205 41.3368 15.6787C41.4687 14.8242 40.873 14.0332 40.0185 13.9063Z" fill="#009CDE" />
                                                        </svg>
                                                        <p className="reviewMark">{staff.rating && staff.rating}</p>
                                                    </div>
                                                </div>
                                                <div className="reviewContent">
                                                    <p>{staff.review && staff.review}</p>
                                                </div>
                                            </div>
                                        </div>)
                                })}
                            </div>
                            <div className="row ssu_bottom">
                                <button className="ssu2_modal1_button2 closeReview" onClick={this.closeReview}> CANCEL </button>
                            </div>
                        </div>
                    </div>
                </div> : ''}
                <div className={this.state.processInterview ? "callRoom" : "callRoom display"}>
                    <div className="row callChat">
                        <div className="col-md-3 videoCall">VIDEO CALL</div>
                        <div className="col-md-3 chat">CHAT</div>
                        <div className="col-md-3 voiceCall">VOICE CALL</div>
                    </div>
                </div>
                {/* <div className="row process">
                    <div className="col-md-3 col-sm-3 col-10 processEach colReview" onClick={()=>this.handleProcess("review")}>
                        <svg className="reviewSVG" width="45" height="45" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_d_1798_318)">
                                <circle cx="40" cy="35" r="30" fill={this.state.processReview!="review"?"#F8F8F8":"#009CDE"} stroke={this.state.process!="review"?"black":""} stroke-opacity="0.1"/>
                            </g>
                            <path d="M50.0498 47H36.5498C36.3509 47 36.1601 46.921 36.0195 46.7803C35.8788 46.6397 35.7998 46.4489 35.7998 46.25V29.75C35.7998 29.5511 35.8788 29.3603 36.0195 29.2197C36.1601 29.079 36.3509 29 36.5498 29H50.0498C50.2487 29 50.4395 29.079 50.5801 29.2197C50.7208 29.3603 50.7998 29.5511 50.7998 29.75V46.25C50.7998 46.4489 50.7208 46.6397 50.5801 46.7803C50.4395 46.921 50.2487 47 50.0498 47ZM37.2998 45.5H49.2998V30.5H37.2998V45.5Z"  fill={this.state.processReview!="review"?"#333333":"white"}/>
                            <path d="M38.7998 33.5H47.7998V35H38.7998V33.5Z" fill={this.state.processReview!="review"?"#333333":"white"}/>
                            <path d="M38.7998 36.5H47.7998V38H38.7998V36.5Z" fill={this.state.processReview!="review"?"#333333":"white"}/>
                            <path d="M38.7998 39.5H47.7998V41H38.7998V39.5Z" fill={this.state.processReview!="review"?"#333333":"white"}/>
                            <path d="M31.2998 39.5V24.5H44.7998V23.75C44.7998 23.5511 44.7208 23.3603 44.5801 23.2197C44.4395 23.079 44.2487 23 44.0498 23H30.5498C30.3509 23 30.1601 23.079 30.0195 23.2197C29.8788 23.3603 29.7998 23.5511 29.7998 23.75V40.25C29.7998 40.4489 29.8788 40.6397 30.0195 40.7803C30.1601 40.921 30.3509 41 30.5498 41H31.2998V39.5Z" fill={this.state.processReview!="review"?"#333333":"white"}/>
                            <path d="M34.2998 42.5V27.5H47.7998V26.75C47.7998 26.5511 47.7208 26.3603 47.5801 26.2197C47.4395 26.079 47.2487 26 47.0498 26H33.5498C33.3509 26 33.1601 26.079 33.0195 26.2197C32.8788 26.3603 32.7998 26.5511 32.7998 26.75V43.25C32.7998 43.4489 32.8788 43.6397 33.0195 43.7803C33.1601 43.921 33.3509 44 33.5498 44H34.2998V42.5Z" fill={this.state.processReview!="review"?"#333333":"white"}/>
                            <defs>
                                <filter id="filter0_d_1798_318" x="0" y="0" width="80" height="80" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dy="5"/>
                                    <feGaussianBlur stdDeviation="5"/>
                                    <feComposite in2="hardAlpha" operator="out"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1798_318"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1798_318" result="shape"/>
                                </filter>
                            </defs>
                        </svg>
                        <div className={this.state.processReview=="review"?"reviewProcess":"reviewProcess interviewText"}>
                            <p className="review">Review</p>
                            <p className={this.state.processReview=="review"?"reviewDate":"display"}>{this.state.processTimeReview}</p>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-3 col-12 processEach" onClick={()=>this.handleProcess("interview")}>
                        <svg className="arrow" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 15L17 8L10 0.999999" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M17 8L1 8" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg className="interviewSVG" width="35" height="35" viewBox="0 0 62 62" fill={this.state.processInterview!="interview"?"none":"#009CDE"} xmlns="http://www.w3.org/2000/svg">
                            <circle cx="31" cy="31" r="30" fill={this.state.processInterview!="interview"?"#333333":"#009CDE"} fill-opacity={this.state.processInterview!="interview"?"0.1":"1"} stroke="black" stroke-opacity="0.1"/>
                            <path d="M19.3686 30.8141C19.4655 30.8869 19.5758 30.9399 19.6932 30.9701C19.8105 31.0003 19.9327 31.007 20.0527 30.99C20.1727 30.9729 20.2881 30.9324 20.3924 30.8707C20.4968 30.809 20.5879 30.7274 20.6607 30.6305C21.2184 29.8868 21.9414 29.2829 22.7726 28.8665C23.6037 28.4501 24.5203 28.2326 25.4499 28.2311C26.3795 28.2296 27.2967 28.4442 28.1292 28.858C28.9617 29.2718 29.6866 29.8733 30.2467 30.6153C30.2686 30.6452 30.2923 30.6739 30.3176 30.701C30.3203 30.7039 30.3232 30.7065 30.3259 30.7094C30.3436 30.7281 30.362 30.7463 30.3815 30.7638C30.3883 30.77 30.3954 30.7754 30.4023 30.7811C30.4154 30.7922 30.4279 30.8036 30.4417 30.8141C30.4443 30.816 30.447 30.8171 30.4495 30.819C30.4833 30.8437 30.5188 30.866 30.5557 30.8859C30.5668 30.892 30.578 30.8976 30.5891 30.9032C30.6245 30.9208 30.661 30.9361 30.6984 30.9491C30.7101 30.9531 30.7221 30.956 30.734 30.9595C30.7643 30.9685 30.7949 30.9759 30.8259 30.9817C30.8379 30.984 30.8498 30.9868 30.8618 30.9887C30.9003 30.9941 30.9391 30.9971 30.978 30.9977C30.9837 30.9978 30.9895 30.999 30.9953 30.999C31.0038 30.999 31.0125 30.9979 31.021 30.9975C31.0383 30.9971 31.0556 30.996 31.0729 30.9947C31.0872 30.9935 31.1015 30.9923 31.1158 30.9904C31.1363 30.9877 31.1568 30.9839 31.1771 30.98C31.1884 30.9777 31.1997 30.9759 31.2109 30.9732C31.2393 30.9665 31.2674 30.9584 31.2952 30.9487C31.2985 30.9476 31.3019 30.9469 31.3052 30.9457C31.336 30.9347 31.3663 30.922 31.3958 30.9077C31.4068 30.9025 31.4173 30.8961 31.428 30.8904C31.4465 30.8807 31.4648 30.8708 31.4826 30.8598C31.4951 30.8521 31.5069 30.8436 31.5191 30.8351C31.5296 30.828 31.5404 30.8215 31.5507 30.8139C31.5562 30.8096 31.561 30.8049 31.5665 30.8006C31.5773 30.7922 31.5877 30.7833 31.5982 30.7742C31.6155 30.7594 31.6321 30.744 31.6479 30.7281C31.6553 30.7208 31.6625 30.7136 31.6696 30.7061C31.6903 30.6838 31.7099 30.6607 31.7283 30.637C31.73 30.6347 31.732 30.6328 31.7338 30.6305C32.2926 29.8855 33.0172 29.2808 33.8501 28.8644C34.683 28.4479 35.6015 28.2311 36.5328 28.2311C37.464 28.231 38.3825 28.4478 39.2155 28.8643C40.0484 29.2807 40.773 29.8853 41.3318 30.6303C41.4042 30.7281 41.4953 30.8106 41.5998 30.8731C41.7042 30.9356 41.82 30.9768 41.9405 30.9944C42.0609 31.0119 42.1837 31.0054 42.3016 30.9753C42.4196 30.9452 42.5304 30.8921 42.6277 30.819C42.725 30.7459 42.8069 30.6542 42.8687 30.5493C42.9304 30.4444 42.9708 30.3284 42.9875 30.2078C43.0042 30.0872 42.9969 29.9645 42.9659 29.8468C42.935 29.7291 42.8811 29.6186 42.8073 29.5218C41.9895 28.4261 40.8988 27.5639 39.6439 27.0211C40.3309 26.3938 40.8123 25.5734 41.0248 24.6676C41.2372 23.7618 41.1709 22.813 40.8345 21.9455C40.498 21.0781 39.9072 20.3327 39.1396 19.807C38.3719 19.2814 37.4633 19.0001 36.5329 19.0001C35.6025 19.0001 34.6939 19.2814 33.9262 19.807C33.1585 20.3327 32.5677 21.0781 32.2313 21.9455C31.8949 22.813 31.8285 23.7618 32.041 24.6676C32.2535 25.5734 32.7348 26.3938 33.4219 27.0211C32.5159 27.4118 31.6926 27.9717 30.9963 28.6708C30.3 27.9717 29.4768 27.4118 28.5708 27.021C29.2579 26.3937 29.7393 25.5733 29.9517 24.6675C30.1642 23.7617 30.0979 22.8128 29.7615 21.9454C29.425 21.078 28.8342 20.3326 28.0665 19.8069C27.2989 19.2813 26.3902 19 25.4599 19C24.5295 19 23.6208 19.2813 22.8532 19.8069C22.0855 20.3326 21.4947 21.078 21.1583 21.9454C20.8218 22.8128 20.7555 23.7617 20.968 24.6675C21.1805 25.5733 21.6618 26.3937 22.3489 27.021C21.0938 27.5638 20.003 28.4261 19.1852 29.5219C19.1124 29.6188 19.0594 29.7291 19.0292 29.8465C18.999 29.9638 18.9923 30.086 19.0093 30.206C19.0264 30.326 19.0669 30.4414 19.1285 30.5457C19.1902 30.6501 19.2718 30.7412 19.3687 30.814L19.3686 30.8141ZM33.7646 23.6172C33.7646 23.0697 33.927 22.5344 34.2311 22.0792C34.5353 21.624 34.9677 21.2691 35.4735 21.0596C35.9793 20.8501 36.5359 20.7953 37.0729 20.9021C37.6099 21.0089 38.1032 21.2726 38.4904 21.6597C38.8775 22.0469 39.1412 22.5401 39.248 23.0771C39.3548 23.6141 39.3 24.1707 39.0904 24.6766C38.8809 25.1824 38.5261 25.6147 38.0709 25.9189C37.6156 26.2231 37.0804 26.3855 36.5329 26.3855C35.7989 26.3846 35.0953 26.0927 34.5763 25.5737C34.0573 25.0548 33.7654 24.3511 33.7646 23.6172ZM22.6915 23.6172C22.6915 23.0697 22.8538 22.5344 23.158 22.0792C23.4622 21.624 23.8945 21.2691 24.4004 21.0596C24.9062 20.8501 25.4628 20.7953 25.9998 20.9021C26.5368 21.0089 27.0301 21.2726 27.4172 21.6597C27.8044 22.0469 28.068 22.5401 28.1748 23.0771C28.2817 23.6141 28.2268 24.1707 28.0173 24.6766C27.8078 25.1824 27.453 25.6147 26.9977 25.9189C26.5425 26.2231 26.0073 26.3855 25.4597 26.3855C24.7258 26.3846 24.0222 26.0927 23.5032 25.5737C22.9842 25.0548 22.6923 24.3511 22.6915 23.6172ZM39.6437 39.0169C40.3308 38.3896 40.8122 37.5692 41.0247 36.6634C41.2372 35.7576 41.1709 34.8087 40.8345 33.9413C40.4981 33.0738 39.9073 32.3284 39.1396 31.8027C38.3719 31.2771 37.4633 30.9958 36.5329 30.9958C35.6025 30.9958 34.6938 31.2771 33.9262 31.8027C33.1585 32.3284 32.5677 33.0738 32.2313 33.9413C31.8948 34.8087 31.8285 35.7576 32.041 36.6634C32.2535 37.5692 32.7349 38.3896 33.422 39.0169C32.5159 39.4077 31.6926 39.9677 30.9963 40.6669C30.3 39.9678 29.4767 39.4079 28.5706 39.0171C29.2577 38.3898 29.7391 37.5694 29.9516 36.6636C30.1641 35.7578 30.0978 34.809 29.7614 33.9415C29.4249 33.0741 28.8341 32.3286 28.0665 31.803C27.2988 31.2773 26.3901 30.996 25.4597 30.996C24.5294 30.996 23.6207 31.2773 22.853 31.803C22.0854 32.3286 21.4945 33.0741 21.1581 33.9415C20.8217 34.809 20.7554 35.7578 20.9679 36.6636C21.1804 37.5694 21.6618 38.3898 22.3489 39.0171C21.0938 39.5599 20.0028 40.4222 19.185 41.5181C19.1122 41.615 19.0592 41.7252 19.029 41.8426C18.9989 41.96 18.9921 42.0821 19.0092 42.2021C19.0262 42.3221 19.0667 42.4376 19.1284 42.5419C19.1901 42.6462 19.2717 42.7374 19.3686 42.8101C19.4655 42.8829 19.5758 42.9359 19.6932 42.9661C19.8105 42.9962 19.9327 43.003 20.0527 42.9859C20.1727 42.9689 20.2881 42.9284 20.3924 42.8667C20.4968 42.805 20.5879 42.7234 20.6607 42.6265C21.2184 41.8828 21.9414 41.2789 22.7726 40.8625C23.6037 40.4461 24.5203 40.2286 25.4499 40.2271C26.3795 40.2256 27.2967 40.4402 28.1292 40.854C28.9617 41.2678 29.6866 41.8694 30.2467 42.6113C30.2686 42.6413 30.2923 42.6699 30.3176 42.697C30.3203 42.6999 30.3232 42.7025 30.3259 42.7054C30.3436 42.7241 30.3619 42.7423 30.3814 42.7599C30.3883 42.766 30.3956 42.7714 30.4025 42.7774C30.4155 42.7883 30.4279 42.7998 30.4417 42.8101C30.4443 42.812 30.4469 42.8131 30.4495 42.815C30.4834 42.8397 30.5189 42.8621 30.5559 42.8819C30.5669 42.888 30.5778 42.8937 30.589 42.8992C30.6245 42.9169 30.6611 42.9323 30.6986 42.9452C30.7101 42.9491 30.7217 42.9519 30.7333 42.9554C30.7641 42.9645 30.7952 42.972 30.8268 42.9779C30.8383 42.9802 30.8498 42.9828 30.8615 42.9846C30.9003 42.9901 30.9394 42.9932 30.9785 42.9938C30.9842 42.9938 30.9897 42.995 30.9953 42.995C31.0036 42.995 31.0118 42.9939 31.0201 42.9937C31.0381 42.9932 31.0561 42.9921 31.0739 42.9906C31.0878 42.9894 31.1014 42.9882 31.1151 42.9865C31.1365 42.9837 31.1576 42.9798 31.1788 42.9757C31.1894 42.9735 31.2 42.9719 31.2104 42.9693C31.2403 42.9622 31.2699 42.9537 31.299 42.9436C31.3009 42.9429 31.3029 42.9426 31.3047 42.9419C31.3359 42.9308 31.3664 42.918 31.3961 42.9036C31.4066 42.8986 31.4167 42.8925 31.427 42.8871C31.4458 42.8771 31.4645 42.867 31.4827 42.8557C31.4951 42.848 31.5069 42.8396 31.5189 42.8313C31.5294 42.824 31.5404 42.8176 31.5507 42.8099C31.5562 42.8057 31.561 42.8009 31.5665 42.7967C31.5773 42.7882 31.5877 42.7794 31.5982 42.7702C31.6155 42.7554 31.6321 42.74 31.6479 42.7241C31.6553 42.7168 31.6625 42.7096 31.6696 42.7021C31.6903 42.6798 31.7099 42.6567 31.7283 42.633C31.73 42.6307 31.732 42.6288 31.7338 42.6265C32.2926 41.8815 33.0172 41.2769 33.8501 40.8604C34.683 40.4439 35.6015 40.2271 36.5328 40.2271C37.464 40.227 38.3825 40.4438 39.2155 40.8603C40.0484 41.2767 40.773 41.8813 41.3318 42.6263C41.4042 42.7241 41.4953 42.8067 41.5998 42.8691C41.7042 42.9316 41.82 42.9728 41.9405 42.9904C42.0609 43.0079 42.1837 43.0014 42.3016 42.9713C42.4196 42.9413 42.5304 42.8881 42.6277 42.815C42.725 42.7419 42.8069 42.6502 42.8687 42.5453C42.9304 42.4405 42.9708 42.3244 42.9875 42.2038C43.0042 42.0832 42.9969 41.9605 42.9659 41.8428C42.935 41.7251 42.8811 41.6146 42.8073 41.5178C41.9895 40.4221 40.8988 39.5599 39.6439 39.0171L39.6437 39.0169ZM22.6915 35.6131C22.6915 35.0656 22.8538 34.5303 23.158 34.0751C23.4622 33.6199 23.8945 33.265 24.4004 33.0555C24.9062 32.846 25.4628 32.7912 25.9998 32.898C26.5368 33.0048 27.0301 33.2684 27.4172 33.6556C27.8044 34.0428 28.068 34.536 28.1748 35.073C28.2817 35.61 28.2268 36.1666 28.0173 36.6724C27.8078 37.1783 27.453 37.6106 26.9977 37.9148C26.5425 38.219 26.0073 38.3814 25.4597 38.3814C24.7258 38.3805 24.0222 38.0886 23.5032 37.5696C22.9842 37.0507 22.6923 36.347 22.6915 35.6131ZM33.7646 35.6131C33.7646 35.0656 33.927 34.5303 34.2311 34.0751C34.5353 33.6199 34.9677 33.265 35.4735 33.0555C35.9793 32.846 36.5359 32.7912 37.0729 32.898C37.6099 33.0048 38.1032 33.2684 38.4904 33.6556C38.8775 34.0428 39.1412 34.536 39.248 35.073C39.3548 35.61 39.3 36.1666 39.0904 36.6724C38.8809 37.1783 38.5261 37.6106 38.0709 37.9148C37.6156 38.219 37.0804 38.3814 36.5329 38.3814C35.7989 38.3805 35.0953 38.0886 34.5763 37.5696C34.0573 37.0507 33.7654 36.347 33.7646 35.6131Z" fill={this.state.processInterview!="interview"?"#333333":"white"} fill-opacity="0.5"/>
                        </svg>
                        <div className={this.state.processInterview=="interview"?"reviewProcess":"reviewProcess interviewText"}>
                            <p className="review">Interview</p>
                            <p className={this.state.processInterview=="interview"?"reviewDate":"display"}>{this.state.processTimeInterview}</p>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-3 col-12 processEach" onClick={()=>this.handleProcess("offer")}>
                        <svg className="arrow" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 15L17 8L10 0.999999" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M17 8L1 8" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg className="interviewSVG" width="35" height="35" viewBox="0 0 62 62" fill={this.state.processOffer!="offer"?"none":"#009CDE"} xmlns="http://www.w3.org/2000/svg">
                            <circle cx="31" cy="31" r="30" fill={this.state.processOffer!="offer"?"#333333":"#009CDE"} fill-opacity={this.state.processOffer!="offer"?"0.1":"1"} stroke="black" stroke-opacity="0.1"/>
                            <path d="M24.9558 19L24.7998 19.813L23.7998 25.438V29H23.8938C24.0323 29.9666 24.3706 30.8937 24.8871 31.7224C25.4036 32.551 26.087 33.263 26.8938 33.813C23.3268 35.343 20.7998 38.883 20.7998 43H22.7998C22.7982 41.7998 23.0671 40.6146 23.5864 39.5326C24.1058 38.4506 24.8623 37.4995 25.7998 36.75V37.406L26.0808 37.719L30.0808 41.719L30.7998 42.406L31.5188 41.719L35.5188 37.719L35.7998 37.406V36.75C36.7373 37.4995 37.4938 38.4506 38.0132 39.5326C38.5326 40.6146 38.8014 41.7998 38.7998 43H40.7998C40.7998 38.883 38.2728 35.344 34.7058 33.812C35.5125 33.2621 36.1958 32.5503 36.7123 31.7218C37.2289 30.8933 37.5672 29.9664 37.7058 29H37.7998V25.437L36.7998 19.813L36.6438 19H24.9558ZM26.6438 21H34.9558L35.7998 25.781V27H25.7998V25.781L26.6438 21ZM29.7998 22V23H28.7998V25H29.7998V26H31.7998V25H32.7998V23H31.7998V22H29.7998ZM25.8938 29H35.7058C35.4749 30.1303 34.8603 31.146 33.9662 31.875C33.0721 32.604 31.9534 33.0014 30.7998 33C29.6462 33.0014 28.5275 32.604 27.6334 31.875C26.7393 31.146 26.1247 30.1303 25.8938 29ZM30.7998 35C31.8266 34.9946 32.8449 35.1857 33.7998 35.563V36.563L30.7998 39.563L27.7998 36.563V35.563C28.7547 35.1857 29.7731 34.9946 30.7998 35Z" fill={this.state.processOffer!="offer"?"#333333":"white"} fill-opacity="0.5"/>
                        </svg>
                        <div className={this.state.processOffer=="offer"?"reviewProcess":"reviewProcess interviewText"}>
                            <p className="review">Offer job</p>
                            <p className={this.state.processOffer=="offer"?"reviewDate":"display"}>{this.state.processTimeOffer}</p>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-3 col-12 processEach" onClick={()=>this.handleProcess("hire")}>
                        <svg className="arrow" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 15L17 8L10 0.999999" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M17 8L1 8" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg className="interviewSVG" width="35" height="35" viewBox="0 0 62 62" fill={this.state.processHire!="hire"?"none":"#009CDE"} xmlns="http://www.w3.org/2000/svg">
                            <circle cx="31" cy="31" r="30" fill={this.state.processHire!="hire"?"##F8F8F8":"#009CDE"} stroke="black" stroke-opacity="0.1"/>
                            <path d="M40.3375 24.9953L38.1063 22.7641C37.6124 22.2746 36.9453 22 36.25 22H25.6187C24.925 22 24.2547 22.2766 23.7625 22.7641L21.5312 24.9953H16V36.9813H19C19.825 36.9813 20.4906 36.3156 20.4953 35.4953H20.9219L24.8875 39.0766C26.3359 40.2531 28.3469 40.2812 29.8375 39.2547C30.4234 39.7609 31.0562 40 31.7641 40C32.6172 40 33.4188 39.6531 34.0516 38.875C35.0875 39.2828 36.3109 38.9969 37.0516 38.0875L38.2797 36.5734C38.5422 36.25 38.7063 35.8797 38.7906 35.4953H41.5047C41.5094 36.3156 42.1797 36.9813 43 36.9813H46V24.9953H40.3375ZM18.25 35.4813C17.8375 35.4813 17.5 35.1438 17.5 34.7313C17.5 34.3188 17.8375 33.9813 18.25 33.9813C18.6625 33.9813 19 34.3188 19 34.7313C19 35.1484 18.6625 35.4813 18.25 35.4813ZM36.5312 35.1578L35.3078 36.6672C35.1766 36.8266 34.9422 36.8547 34.7781 36.7234L33.6578 35.8141L32.2516 37.525C31.9703 37.8672 31.5484 37.75 31.4078 37.6375L29.6828 36.1609L28.9516 37.0609C28.3 37.8625 27.1141 37.9844 26.3594 37.3703L21.7984 33.2453H20.5V27.2406H22.4641L25.3563 24.3531C25.45 24.3156 25.5297 24.2828 25.6234 24.2453H28.2812L26.4672 25.9094C25.0891 27.1703 25.0094 29.2984 26.2609 30.6578C26.9547 31.4172 29.1297 32.5891 31.0187 30.8641L31.4031 30.5125L36.475 34.6281C36.6344 34.7594 36.6578 34.9984 36.5312 35.1578ZM41.5 33.2453H38.2562C38.1484 33.1141 38.0266 32.9922 37.8953 32.8844L33.0812 28.975L33.6672 28.4406C33.9719 28.1594 33.9953 27.6859 33.7141 27.3813L33.2031 26.8328C32.9219 26.5281 32.4484 26.5094 32.1437 26.7859L29.5563 29.1578C29.1109 29.5656 28.3516 29.5984 27.9344 29.1578C27.4984 28.6937 27.5359 27.9813 27.9906 27.5688L31.0656 24.7516C31.4125 24.4328 31.8625 24.2594 32.3312 24.2594L36.2547 24.25C36.3531 24.25 36.4469 24.2875 36.5125 24.3578L39.4047 27.2453H41.5V33.2453ZM43.75 35.4813C43.3375 35.4813 43 35.1438 43 34.7313C43 34.3188 43.3375 33.9813 43.75 33.9813C44.1625 33.9813 44.5 34.3188 44.5 34.7313C44.5 35.1484 44.1625 35.4813 43.75 35.4813Z" fill={this.state.processHire!="hire"?"#333333":"white"} fill-opacity="0.5"/>
                        </svg>
                        <div className={this.state.processHire=="hire"?"reviewProcess":"reviewProcess interviewText"}>
                            <p className="review">Hired</p>
                            <p className={this.state.processHire=="hire"?"reviewDate":"display"}>{this.state.processTimeHire}</p>
                        </div>
                    </div>
                </div> */}

                {this.props.applicantData.status === "Interview" ? <div>
                    <div className="row callChat justify-content-center mt-3">
                        <div className="col-md-3 chat" onClick={() => this.props.redirectTo() && this.props.redirectTo()}>CHAT</div>
                    </div>
                </div> : null}

                <p className="MSettingTitle">Medical Settings</p>
                <div className="MSettingDiv">
                    <div className="care">{this.props.applicantData.medicalSettings && this.props.applicantData.medicalSettings}</div>
                    {/* <div className="care">Other long-term care facilities</div> */}
                </div>
                <p className="MSettingTitle">Nursing License</p>
                {this.props.applicantData.nursingLicense && this.props.applicantData.nursingLicense.map((nursing) => {
                    return (<div className="row nursingDIV">
                        <div >
                            {/* className="col-md-6 col-sm-12 col-12 padNoneLeft" */}
                            <div className="row nursingRightDIV">
                                <div className="col-md-6 col-sm-6 col-6">
                                    <img src={nursing.image} className="nurseLicence" alt="NurseLicence" />
                                    <p className="nurseNum">Number</p>
                                    <p className="nurseNumber">{nursing.number}</p>
                                </div>
                                <div className="col-md-6 col-sm-6 col-6">
                                    <p className="nurseNum nurseName">Name</p>
                                    <p className="nurseNumber">{nursing.name}</p>
                                    <p className="nurseNum nurseDate">Expiration Date</p>
                                    <p className="nurseNumber">{nursing.expirationDate && moment(nursing.expirationDate).subtract(1, 'd').format("MM-DD-YYYY")}</p>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-md-6 col-sm-12 col-12 padNoneRight">
                        <div className="row nursingLeftDIV">
                            <div className="col-md-6 col-sm-6 col-6">
                                <img src={NurseLicence} className="nurseLicence" alt="NurseLicence" />
                                <p className="nurseNum">Number</p>
                                <p className="nurseNumber">54875424120</p>
                            </div>
                            <div className="col-md-6 col-sm-6 col-6">
                                <p className="nurseNum nurseName">Name</p>
                                <p className="nurseNumber">CNA</p>
                                <p className="nurseNum nurseDate">Expiration Date</p>
                                <p className="nurseNumber">10/01/2016</p>
                            </div>
                        </div>
                    </div> */}
                    </div>)
                })}
                <p className="MSettingTitle">Liability insurance</p>
                <div className="row insurance">
                    <div className="col-md-6 col-sm-6 col-6">
                        <p className="nurseNum nurseName">Insurance provider</p>
                        <p className="nurseNumber">{this.props.applicantData.liabilityInsurance && this.props.applicantData.liabilityInsurance.insuranceProvider}</p>
                    </div>
                    <div className="col-md-6 col-sm-6 col-6">
                        <p className="nurseNum nurseName">Policy number </p>
                        <p className="nurseNumber">{this.props.applicantData.liabilityInsurance && this.props.applicantData.liabilityInsurance.policyNumber}</p>
                    </div>
                </div>
                <p className="MSettingTitle">Certifications</p>
                {this.props.applicantData.certifications && this.props.applicantData.certifications.map((certification) => {
                    return (
                        <div className="row nursingDIV">
                            <div
                            // className="col-md-6 col-sm-12 col-12 padNoneLeft"
                            >
                                <div className="row nursingRightDIV">
                                    <div className="col-md-8 col-sm-8 col-8">
                                        <p className="nurseNum nurseName">Certification</p>
                                        <p className="nurseNumber">{certification.name}</p>
                                        <p className="nurseNum nurseDate">Certifying Authority</p>
                                        <p className="nurseNumber">{certification.certifyingAuthority}</p>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-4">
                                        <p className="nurseNum nurseName">Date Received</p>
                                        <p className="nurseNumber">{certification.receivedOn && moment(certification.receivedOn).subtract(1, 'd').format("MM-DD-YYYY")}</p>
                                        <p className="nurseNum nurseDate">Expiration Date</p>
                                        <p className="nurseNumber">{certification.expirationDate && moment(certification.expirationDate).subtract(1, 'd').format("MM-DD-YYYY")}</p>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-md-6 col-sm-12 col-12 padNoneRight">
                        <div className="row nursingLeftDIV">
                            <div className="col-md-8 col-sm-8 col-8">
                                <p className="nurseNum nurseName">Certification</p>
                                <p className="nurseNumber">CNA</p>
                                <p className="nurseNum nurseDate">Certifying Authority</p>
                                <p className="nurseNumber">North central Missouri College</p>
                            </div>
                            <div className="col-md-4 col-sm-4 col-4">
                                <p className="nurseNum nurseName">Date Received</p>
                                <p className="nurseNumber">10/04/2016</p>
                                <p className="nurseNum nurseDate">Expiration Date</p>
                                <p className="nurseNumber">10/04/2019</p>
                            </div>
                        </div>
                    </div> */}
                        </div>)
                })}
                <p className="MSettingTitle">Education Level</p>
                <div className="row insurance">
                    <div className="col-md-5 col-sm-5 col-5">
                        <p className="nurseNum nurseName">Degree</p>
                        <p className="nurseNumber">{this.props.applicantData.education && this.props.applicantData.education.degree}</p>
                    </div>
                    <div className="col-md-5 col-sm-5 col-5">
                        <p className="nurseNum nurseName">College/University</p>
                        <p className="nurseNumber">{this.props.applicantData.education && this.props.applicantData.education.college}</p>
                    </div>
                    <div className="col-md-2 col-sm-2 col-2">
                        <p className="nurseNum nurseName">Date Received</p>
                        <p className="nurseNumber">{this.props.applicantData.education && this.props.applicantData.education.receivedOn && moment(this.props.applicantData.education.receivedOn).subtract(1, 'd').format("MM-DD-YYYY")}</p>
                    </div>
                </div>
                <p className="MSettingTitle">Available for</p>
                {/* {this.props.applicantData.natureOfJob && this.props.applicantData.natureOfJob.map( (job) => { return ( */}
                <div className="MSettingDiv">
                    <div className="care">{this.props.applicantData.natureOfJob && this.props.applicantData.natureOfJob[0]}</div>
                    {this.props.applicantData.natureOfJob && this.props.applicantData.natureOfJob.length === 2 ? <div className="care">{this.props.applicantData.natureOfJob && this.props.applicantData.natureOfJob[1]}</div> : null}
                </div>
                {/* // ) } )} */}
                <p className="MSettingTitle">Available for Part Time or Full time Work Schedule</p>
                <div className="MSettingDiv">
                    <div className="care">{this.props.applicantData.workSchedule && this.props.applicantData.workSchedule[0]}</div>
                    {this.props.applicantData.workSchedule && this.props.applicantData.workSchedule.length === 2 ? <div className="care">{this.props.applicantData.workSchedule && this.props.applicantData.workSchedule[1]}</div> : null}
                </div>
                <p className="MSettingTitle">Available for Other Location</p>
                {this.props.applicantData.otherCities && this.props.applicantData.otherCities.map((index) => {
                    return (


                        <div className="MSettingDiv">
                            <div className="care">
                                <svg width="13" height="18" style={{ marginTop: -3 + "px" }} viewBox="0 0 28 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.80761 4.80761L4.10051 4.10051L4.80761 4.80761ZM23.1924 4.80761L23.8995 4.10051L23.1924 4.80761ZM24.5625 21.3125L25.3182 21.9674C25.3266 21.9577 25.3348 21.9479 25.3428 21.9379L24.5625 21.3125ZM14 33.5L13.2443 34.1549C13.4343 34.3741 13.71 34.5 14 34.5C14.29 34.5 14.5657 34.3741 14.7557 34.1549L14 33.5ZM3.4375 21.3125L2.65719 21.9379C2.66521 21.9479 2.67341 21.9577 2.68181 21.9674L3.4375 21.3125ZM14 0C10.287 0 6.72601 1.475 4.10051 4.10051L5.51472 5.51472C7.76516 3.26428 10.8174 2 14 2V0ZM23.8995 4.10051C21.274 1.475 17.713 0 14 0V2C17.1826 2 20.2348 3.26428 22.4853 5.51472L23.8995 4.10051ZM28 14C28 10.287 26.525 6.72601 23.8995 4.10051L22.4853 5.51472C24.7357 7.76516 26 10.8174 26 14H28ZM25.3428 21.9379C26.2927 20.7527 26.9683 19.59 27.3996 18.289C27.8293 16.9924 28 15.6079 28 14H26C26 15.4666 25.8441 16.6252 25.5011 17.6597C25.1597 18.6898 24.6166 19.646 23.7822 20.6871L25.3428 21.9379ZM14.7557 34.1549L25.3182 21.9674L23.8068 20.6576L13.2443 32.8451L14.7557 34.1549ZM2.68181 21.9674L13.2443 34.1549L14.7557 32.8451L4.19319 20.6576L2.68181 21.9674ZM0 14C0 15.6079 0.170675 16.9924 0.600445 18.289C1.03169 19.59 1.70731 20.7527 2.65719 21.9379L4.21781 20.6871C3.38344 19.646 2.84031 18.6898 2.49887 17.6597C2.15595 16.6252 2 15.4666 2 14H0ZM4.10051 4.10051C1.475 6.72601 0 10.287 0 14H2C2 10.8174 3.26428 7.76516 5.51472 5.51472L4.10051 4.10051ZM14 19.875C17.2447 19.875 19.875 17.2447 19.875 14H17.875C17.875 16.1401 16.1401 17.875 14 17.875V19.875ZM8.125 14C8.125 17.2447 10.7553 19.875 14 19.875V17.875C11.8599 17.875 10.125 16.1401 10.125 14H8.125ZM14 8.125C10.7553 8.125 8.125 10.7553 8.125 14H10.125C10.125 11.8599 11.8599 10.125 14 10.125V8.125ZM19.875 14C19.875 10.7553 17.2447 8.125 14 8.125V10.125C16.1401 10.125 17.875 11.8599 17.875 14H19.875Z" fill="#333333" />
                                </svg> &nbsp;
                                {index.name}
                            </div>
                            {/* <div className="care">
                        <svg width="13" height="18" style={{marginTop:-3+"px"}} viewBox="0 0 28 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.80761 4.80761L4.10051 4.10051L4.80761 4.80761ZM23.1924 4.80761L23.8995 4.10051L23.1924 4.80761ZM24.5625 21.3125L25.3182 21.9674C25.3266 21.9577 25.3348 21.9479 25.3428 21.9379L24.5625 21.3125ZM14 33.5L13.2443 34.1549C13.4343 34.3741 13.71 34.5 14 34.5C14.29 34.5 14.5657 34.3741 14.7557 34.1549L14 33.5ZM3.4375 21.3125L2.65719 21.9379C2.66521 21.9479 2.67341 21.9577 2.68181 21.9674L3.4375 21.3125ZM14 0C10.287 0 6.72601 1.475 4.10051 4.10051L5.51472 5.51472C7.76516 3.26428 10.8174 2 14 2V0ZM23.8995 4.10051C21.274 1.475 17.713 0 14 0V2C17.1826 2 20.2348 3.26428 22.4853 5.51472L23.8995 4.10051ZM28 14C28 10.287 26.525 6.72601 23.8995 4.10051L22.4853 5.51472C24.7357 7.76516 26 10.8174 26 14H28ZM25.3428 21.9379C26.2927 20.7527 26.9683 19.59 27.3996 18.289C27.8293 16.9924 28 15.6079 28 14H26C26 15.4666 25.8441 16.6252 25.5011 17.6597C25.1597 18.6898 24.6166 19.646 23.7822 20.6871L25.3428 21.9379ZM14.7557 34.1549L25.3182 21.9674L23.8068 20.6576L13.2443 32.8451L14.7557 34.1549ZM2.68181 21.9674L13.2443 34.1549L14.7557 32.8451L4.19319 20.6576L2.68181 21.9674ZM0 14C0 15.6079 0.170675 16.9924 0.600445 18.289C1.03169 19.59 1.70731 20.7527 2.65719 21.9379L4.21781 20.6871C3.38344 19.646 2.84031 18.6898 2.49887 17.6597C2.15595 16.6252 2 15.4666 2 14H0ZM4.10051 4.10051C1.475 6.72601 0 10.287 0 14H2C2 10.8174 3.26428 7.76516 5.51472 5.51472L4.10051 4.10051ZM14 19.875C17.2447 19.875 19.875 17.2447 19.875 14H17.875C17.875 16.1401 16.1401 17.875 14 17.875V19.875ZM8.125 14C8.125 17.2447 10.7553 19.875 14 19.875V17.875C11.8599 17.875 10.125 16.1401 10.125 14H8.125ZM14 8.125C10.7553 8.125 8.125 10.7553 8.125 14H10.125C10.125 11.8599 11.8599 10.125 14 10.125V8.125ZM19.875 14C19.875 10.7553 17.2447 8.125 14 8.125V10.125C16.1401 10.125 17.875 11.8599 17.875 14H19.875Z" fill="#333333"/>
                        </svg> &nbsp;
                        Beverly Hills
                    </div> */}
                        </div>)
                })}
                {/* <p className="MSettingTitle">Professional Summary</p>
                <div className="MSettingDiv">
                    {this.props.applicantData.professionalSummary && this.props.applicantData.professionalSummary}
                </div> */}
                <p className="MSettingTitle">Resume</p>

                {this.props.applicantData.resume && this.props.applicantData.resume.link ? <div className="row MSettingDiv">
                    <div className="col-md-8 col-sm-9 col-9" style={{ color: "#009CDE" }}>
                        {this.props.applicantData.name + '   Resume'}
                    </div>
                    <div className="col-md-4 d-flex col-sm-3 col-3">

                        <button className="viewResume"
                            onClick={() => {
                                this.setState({ showPdf: 'block' })
                            }}
                        >
                            {/* { this.state.viewResume } */}
                            {/* <Link to={this.props.applicantData.resume.link}> */}
                            {/* <a src={this.props.applicantData.resume.link} >       View Resume </a>
                   */}


                            {/* </Link>  */}
                            View Resume </button>

                        <button className="viewResume ml-3"
                            onClick={() => {
                                window.open(this.props.applicantData.resume.link)
                            }}
                        >
                            {/* { this.state.viewResume } */}
                            {/* <Link to={this.props.applicantData.resume.link}> */}
                            {/* <a src={this.props.applicantData.resume.link} >       View Resume </a>
                   */}


                            {/* </Link>  */}
                            Download Resume </button>



                    </div>
                </div> : <p>No resume available</p>}


                <div className="w3-modal viewModal sendReview" id="modal3" style={{ display: this.state.showPdf }}>
                    <div className="w3-modal-content ssu2_modal2" style={{ width: '690px !important' }}>


                        <div className="w3-container">

                            {console.log(this.props.applicantData.resume)}
                            {this.props.applicantData && this.props.applicantData.resume ?

                                this.getFileType(this.props.applicantData.resume.link) === "pdf" ?

                                    <div>
                                        <Document file={this.props.applicantData.resume.link} onLoadSuccess={this.onDocumentLoadSuccess}>

                                            {Array.apply(null, Array(numPages))
                                                .map((x, i) => i + 1)
                                                .map(page => <Page pageNumber={page} />)}
                                        </Document>
                                        {/* <p>
                                            Page {pageNumber} of {numPages}
                                        </p> */}
                                    </div>


                                    :

                                    <ViewDoc link={this.props.applicantData.resume && this.props.applicantData.resume.link} /> : null}

                            <div className="row modalLast">
                                <div className="col-md-4"></div>
                                <div className="col-md-4 modalBTNCHR" onClick={() => {
                                    this.setState({
                                        showPdf: 'none'
                                    })
                                }}>
                                    Close
                                </div>
                                <div className="col-md-4"></div>
                            </div>
                        </div>



                    </div>
                </div>



                <div className="w3-modal viewModal sendReview" id="modal3" style={{ display: this.state.showView }}>
                    <div className="w3-modal-content ssu2_modal2">
                        <div className="w3-container">
                            <div className="staffOne row modalStaffOne">
                                <div className="col-md-9 col-sm-9 col-9 staffOneData">
                                    <div className="row">
                                        <div className="avatar_img col-md-3 col-sm-3 col-4 modalAvatar">
                                            <img width="100%" src={this.props.applicantData.avatar && this.props.applicantData.avatar !== '' ? this.props.applicantData.avatar : avatar} alt="avatar.png" style={{ borderRadius: '50%' }} />
                                            <img src={badge} alt="badge.png" className="avatar_badge" />
                                        </div>
                                        <div className="col-md-4 col-sm-4 col-4 marginLeft">
                                            {console.log(this.state.staffRating, "staffRatingstaffRating")}
                                            <p className="username modalName">{this.props.applicantData.name}</p>
                                            <p className="nurse modalNurse">{this.props.applicantData.jobTitle}</p>
                                            <p className="available modalAvailable">Availability: {this.props.applicantData.immediatelyStart ? "Immediately" : moment(this.props.applicantData.startWorkDate).format("MM-DD-YYYY")}</p>
                                            <div className="position">
                                                <svg width="13" height="16" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8C16 9.892 15.598 11.13 14.5 12.5L8 20L1.5 12.5C0.402 11.13 0 9.892 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315ZM11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8Z" fill="#333333" fill-opacity="0.7" />
                                                </svg>
                                                <p className="position_text modalText">{this.props.applicantData.currentLocation && this.props.applicantData.currentLocation.name + ", " + this.props.applicantData.currentLocation.state}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-sm-4 col-4 available_BTNs">
                                            <div className="available_BTN">
                                                <p className="BTN_text">Weekend availability</p>
                                                {this.props.applicantData.weekendAvailiblity ? <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M0 7C0 5.14348 0.737498 3.36301 2.05025 2.05025C3.36301 0.737498 5.14348 0 7 0C8.85652 0 10.637 0.737498 11.9497 2.05025C13.2625 3.36301 14 5.14348 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14C5.14348 14 3.36301 13.2625 2.05025 11.9497C0.737498 10.637 0 8.85652 0 7H0ZM6.60053 9.996L10.6307 4.95787L9.90267 4.37547L6.46613 8.66973L4.032 6.6416L3.43467 7.3584L6.60053 9.99693V9.996Z" fill="#6FCF97" />
                                                </svg>
                                                    :
                                                    <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0ZM9.58438 9.65938L8.55313 9.65469L7 7.80313L5.44844 9.65312L4.41563 9.65781C4.34688 9.65781 4.29063 9.60312 4.29063 9.53281C4.29063 9.50312 4.30156 9.475 4.32031 9.45156L6.35313 7.02969L4.32031 4.60938C4.30143 4.58647 4.29096 4.5578 4.29063 4.52812C4.29063 4.45937 4.34688 4.40312 4.41563 4.40312L5.44844 4.40781L7 6.25938L8.55156 4.40938L9.58281 4.40469C9.65156 4.40469 9.70781 4.45937 9.70781 4.52969C9.70781 4.55937 9.69688 4.5875 9.67813 4.61094L7.64844 7.03125L9.67969 9.45312C9.69844 9.47656 9.70938 9.50469 9.70938 9.53438C9.70938 9.60313 9.65313 9.65938 9.58438 9.65938Z" fill="#FF3A44" />
                                                    </svg>
                                                }

                                            </div>
                                            <div className="available_BTN BTN">
                                                <p className="BTN_text">Nursing License</p>
                                                {this.props.applicantData.nursingLicense && this.props.applicantData.nursingLicense.length === 0 ?
                                                    <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0ZM9.58438 9.65938L8.55313 9.65469L7 7.80313L5.44844 9.65312L4.41563 9.65781C4.34688 9.65781 4.29063 9.60312 4.29063 9.53281C4.29063 9.50312 4.30156 9.475 4.32031 9.45156L6.35313 7.02969L4.32031 4.60938C4.30143 4.58647 4.29096 4.5578 4.29063 4.52812C4.29063 4.45937 4.34688 4.40312 4.41563 4.40312L5.44844 4.40781L7 6.25938L8.55156 4.40938L9.58281 4.40469C9.65156 4.40469 9.70781 4.45937 9.70781 4.52969C9.70781 4.55937 9.69688 4.5875 9.67813 4.61094L7.64844 7.03125L9.67969 9.45312C9.69844 9.47656 9.70938 9.50469 9.70938 9.53438C9.70938 9.60313 9.65313 9.65938 9.58438 9.65938Z" fill="#FF3A44" />
                                                    </svg>
                                                    :
                                                    <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M0 7C0 5.14348 0.737498 3.36301 2.05025 2.05025C3.36301 0.737498 5.14348 0 7 0C8.85652 0 10.637 0.737498 11.9497 2.05025C13.2625 3.36301 14 5.14348 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14C5.14348 14 3.36301 13.2625 2.05025 11.9497C0.737498 10.637 0 8.85652 0 7H0ZM6.60053 9.996L10.6307 4.95787L9.90267 4.37547L6.46613 8.66973L4.032 6.6416L3.43467 7.3584L6.60053 9.99693V9.996Z" fill="#6FCF97" />
                                                    </svg>
                                                }
                                            </div>
                                            <div className="available_BTN BTN">
                                                <p className="BTN_text">Liability Insurance</p>
                                                {this.props.applicantData.liabilityInsurance && this.props.applicantData.liabilityInsurance.insuranceProvider
                                                    ?
                                                    <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M0 7C0 5.14348 0.737498 3.36301 2.05025 2.05025C3.36301 0.737498 5.14348 0 7 0C8.85652 0 10.637 0.737498 11.9497 2.05025C13.2625 3.36301 14 5.14348 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14C5.14348 14 3.36301 13.2625 2.05025 11.9497C0.737498 10.637 0 8.85652 0 7H0ZM6.60053 9.996L10.6307 4.95787L9.90267 4.37547L6.46613 8.66973L4.032 6.6416L3.43467 7.3584L6.60053 9.99693V9.996Z" fill="#6FCF97" />
                                                    </svg>
                                                    :
                                                    <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0ZM9.58438 9.65938L8.55313 9.65469L7 7.80313L5.44844 9.65312L4.41563 9.65781C4.34688 9.65781 4.29063 9.60312 4.29063 9.53281C4.29063 9.50312 4.30156 9.475 4.32031 9.45156L6.35313 7.02969L4.32031 4.60938C4.30143 4.58647 4.29096 4.5578 4.29063 4.52812C4.29063 4.45937 4.34688 4.40312 4.41563 4.40312L5.44844 4.40781L7 6.25938L8.55156 4.40938L9.58281 4.40469C9.65156 4.40469 9.70781 4.45937 9.70781 4.52969C9.70781 4.55937 9.69688 4.5875 9.67813 4.61094L7.64844 7.03125L9.67969 9.45312C9.69844 9.47656 9.70938 9.50469 9.70938 9.53438C9.70938 9.60313 9.65313 9.65938 9.58438 9.65938Z" fill="#FF3A44" />
                                                    </svg>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-3 staffOneData">
                                    <div className="review_info">
                                        <div className="middle_line modal_middle_line"></div>
                                        <div className="modalRating">
                                            <div className="modalRatingMark">
                                                <svg className="modalMarkSVG" width="33" height="31.6" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M40.0185 13.9063L27.621 12.1045L22.079 0.869159C21.9277 0.561542 21.6786 0.312518 21.371 0.161151C20.5995 -0.219709 19.662 0.0976744 19.2763 0.869159L13.7343 12.1045L1.33684 13.9063C0.995041 13.9551 0.682541 14.1162 0.443283 14.3604C0.154034 14.6577 -0.005356 15.0576 0.000137431 15.4724C0.00563086 15.8871 0.175558 16.2828 0.47258 16.5723L9.44231 25.3174L7.32317 37.666C7.27347 37.9533 7.30526 38.2487 7.41492 38.5188C7.52459 38.7889 7.70774 39.0229 7.94362 39.1942C8.17949 39.3656 8.45865 39.4674 8.74943 39.4881C9.04022 39.5088 9.331 39.4477 9.58879 39.3115L20.6777 33.4815L31.7665 39.3115C32.0693 39.4727 32.4208 39.5264 32.7577 39.4678C33.6073 39.3213 34.1786 38.5156 34.0322 37.666L31.913 25.3174L40.8827 16.5723C41.1269 16.333 41.288 16.0205 41.3368 15.6787C41.4687 14.8242 40.873 14.0332 40.0185 13.9063Z" fill="#009CDE" />
                                                </svg>
                                                <p className="marks modalMarks">{this.props.applicantData.ratings && this.props.applicantData.ratings.ratingSum.toFixed(1)}</p>
                                            </div>
                                            <p className="review modalTotalMarks">{this.props.applicantData.ratings && this.props.applicantData.ratings.totalRatings} Review</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sendMain">
                                <div className="ViewOne reviewDiv modalView">
                                    {/* <p className="modalName modalNameUnder"> Shift Schedule </p>
                                    <div className="ssu2_modal1_input modalSelect">
                                        <div className="ssu2_modal1_input ssu2_modal3_selectBox modalSelectBox">
                                            <select className="ssu2_modal3_select" name="option">
                                                <option value="" disabled selected > Select</option>
                                                <option value="" > Select a state</option>
                                                <option value="" > Select a state</option>
                                            </select>
                                        </div>
                                    </div> */}
                                    <p className="modalName modalNameUnder"> Hiring Timeline </p>

                                    <div className="row">
                                        <div className="col-md-6 modalCalLeft MLDIV" style={{ paddingLeft: "0px" }}>
                                            <div className="ssu2_modal1_input ssu2_modal3_selectBox modalCalLeft">
                                                <div className="input_left_icon" onClick={() => $(".startDate").focus()}>
                                                    <img width="22px" height="17px" alt="img" src={calendar} />
                                                </div>
                                                <DatePicker
                                                    className="ssu2_modal3_date startDate"
                                                    selected={this.state.expStartDate}
                                                    onChange={(date) => this.setExpStartDate(date)}
                                                    placeholderText={'Start Date'}
                                                    minDate={new Date()}
                                                />
                                            </div>
                                            <ErrorState show={this.state.error.dateStart} name="Start Date is required." />
                                        </div>
                                        {this.props.applicantData && this.props.applicantData.natureOfJob && this.state.jobDetails.contractType === "Temporary Position" && <div className="col-md-6 modalCalLeft MRDIV" style={{ paddingRight: "0px" }}>
                                            <div className="ssu2_modal1_input ssu2_modal3_selectBox modalCalLeft">
                                                <div className="input_left_icon" onClick={() => $(".endDate").focus()}>
                                                    <img width="22px" height="17px" alt="img" src={calendar} />
                                                </div>
                                                <DatePicker
                                                    className="ssu2_modal3_date endDate"
                                                    selected={this.state.expEndDate}
                                                    onChange={(date) => this.setExpEndDate(date)}
                                                    placeholderText={'End Date'}
                                                    minDate={new Date(this.state.expStartDate)}
                                                />
                                            </div>
                                            <ErrorState show={this.state.error.dateEnd} name="End Date is required." />
                                        </div>}

                                    </div>
                                    {/* <p className="modalName modalNameUnder"> Roles and Responsibilities </p>
                                    <div className="reviewContent commit">
                                        <textarea id="story" name="story" rows="5" cols="33" placeholder="Please write the list of job responsibilities" />
                                    </div> */}
                                </div>
                            </div>
                            <div className="row modalLast">
                                <div className="col-md-3"></div>
                                <div className="col-md-3 modalBTNCHL" onClick={this.jobOfferToUser}>
                                    {this.state.confirmHiringLoader ? <Loader /> :  "Confirm Hiring"}
                                </div>
                                <div className="col-md-3 modalBTNCHR" onClick={this.closeReview}>
                                    Cancel
                                </div>
                                <div className="col-md-3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ApplicantMember;
