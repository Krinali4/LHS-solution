import React from 'react';
import { connect } from 'react-redux';
import "./findStaff.css";
import "./applicantJob.css";
import search from '../../../assets/images/search.svg';
import avatar from '../../../assets/images/avatar.png';
import badge from '../../../assets/images/badge.png';
import ApplicantMember from './applicantMember';
import { callApi, setSession, removeSession } from '../../../../action';
import { Avatar } from '@material-ui/core';
import axios from 'axios';
import left_arrow from '../../../../components/assets/images/left_arrow.png';
import moment from 'moment';
import Pagination from './../../admin/pagination';

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
};

const mapDispatchToProps = dispatch => ({
});
class ApplicantJob extends React.Component {
    constructor(props) {
        super(props);
        console.log(props, "PPP")
        this.state = {
            dropShow: false,
            sortingkey: false,
            filter: "",
            searchKind: "Name",
            sorting: "",
            sortValue: "",
            filterKey: "",
            avatar: "",
            showView: "none",
            member: false,
            memberName: "",
            search: "",
            jobApplicantsList: [],
            staffRating: [],
            currApplicantData: {},
            viewStaffData: [],
            curPage: 1,
            total: 3,
        }
    }
    componentWillMount = async () => {
        this.getAllApplicationsList(this.state.search, this.state.sortValue, this.state.filter, this.state.filterKey, 0);
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

    getAllApplicationsList = async (searchValue, sort, filter, filterValue, skip) => {
        console.log(localStorage.getItem('token'));
        var token = "Bearer " + localStorage.getItem('token');
        var res = await callApi("GET", `v1/LHS/hospital/viewJobApplicant/?job=${this.props.jobDetails._id}&search=${searchValue}&sort=${sort}&filter=${filter}&value=${filterValue}&skip=${skip}`, token);
        console.log(res);
        if (res.status === 404) {
            this.setState({ jobApplicantsList: [] });
        }
        else {
            this.setState({
                jobApplicantsList: res.data.data
            })
        }
        var totalCount = res.data.count
        var page = Math.ceil(totalCount / 10);
        this.setState({ total: page });
        this.initState(this.props);
    }

    handleSymbole = () => {
        this.setState({ dropShow: !this.state.dropShow })
    }
    handleSearchKind = (searchKind) => {
        this.setState({ searchKind: searchKind });
        this.setState({ dropShow: false })
    }
    handleSymboleSort = () => {
        this.setState({ sortingkey: !this.state.sortingkey })
    }
    handleSorting = async (event) => {
        var sorting = event.target.value;
        if (sorting === "-1")
            await this.setState({ sort: "rating", sortValue: -1 });
        else if (sorting === "1")
            await this.setState({ sort: "rating", sortValue: 1 });
        else if (sorting === "") {
            await this.setState({ sort: "rating", sortValue: "" });
        }
        this.setState({ curPage: 1 });
        this.getAllApplicationsList(this.state.search, this.state.sortValue, this.state.filter, this.state.filterKey, 0);
    }
    handleSymboleFilter = () => {
        this.setState({ filter: !this.state.filter })
    }

    searchApplicants = async (e) => {
        await this.setState({
            search: e.target.value
        })
        this.setState({ curPage: 1 });
        this.getAllApplicationsList(this.state.search, this.state.sortValue, this.state.filter, this.state.filterKey, 0);
    }

    handleFilter = async (e) => {
        let filterValue = e.target.value;
        if (filterValue === "immediately_available")
            await this.setState({ filter: "immediatelyStart", filterKey: true });
        else if (filterValue === "not_immediately_available") {
            await this.setState({ filter: "immediatelyStart", filterKey: false });
        }
        else if (filterValue === "weekend_avaibility")
            await this.setState({ filter: "weekendAvailiblity", filterKey: true });
        else if (filterValue === "no_weekend_avaibility")
            await this.setState({ filter: "weekendAvailiblity", filterKey: false });
        else if (filterValue === "")
            await this.setState({ filter: "", filterKey: "" });
        this.setState({ curPage: 1 });
        this.getAllApplicationsList(this.state.search, this.state.sortValue, this.state.filter, this.state.filterKey, 0);
    }
    openReview = async (data) => {
        this.setState({
            currApplicantData: data
        })
        var token = "Bearer " + localStorage.getItem('token');
        var res = await callApi("GET", `v1/LHS/rating/getStaffRating/${data.staff}`, token);
        console.log(res.data);
        this.setState({ showView: "block", staffRating: res.data });
    }
    closeReview = () => {
        this.setState({ showView: "none" });
    }
    goToMember = (name) => {
        this.setState({ member: true, memberName: name });
        this.props.titleChange(name);
    }

    handleMember = async (jobId, user, applicantId, statusValue) => {
        let obj = {
            status: "Review"
        }
        if (statusValue === "Applied") {
            var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
            const res = await axios.post(`${process.env.REACT_APP_API_URL}v1/LHS/job/changeApplicationStatus/${applicantId}`, obj, { headers: { Authorization: Authorization } });
            if (res) {
                this.setState({ member: true });
                var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
                const res = await axios.get(`${process.env.REACT_APP_API_URL}v1/LHS/hospital/viewApplicant?job=${jobId}&user=${user}`, { headers: { Authorization: Authorization } })
                console.log(res.data);
                this.setState({ viewStaffData: res.data.data[0] })
            }
        }
        else {
            this.setState({ member: true });
            var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
            const res = await axios.get(`${process.env.REACT_APP_API_URL}v1/LHS/hospital/viewApplicant?job=${jobId}&user=${user}`, { headers: { Authorization: Authorization } })
            console.log(res.data);
            this.setState({ viewStaffData: res.data.data[0] })
        }
    }

    setCurPage = async (num) => {
        console.log(num, "NNNN")
        this.setState({ curPage: num });
        if (this.state.search.length > 0) {
            this.setState({ curPage: 1 });
        }
        var skip = (num - 1) * 10;
        this.getAllApplicationsList(this.state.search, this.state.sortValue, this.state.filter, this.state.filterKey, skip);
    }

    redirectTo = () => {
        this.props.redirectTo();
    }

    render() {
        const { currApplicantData } = this.state;
        return (
            <div>
                {!this.state.member ?
                    <div>
                        <div className="top_NSF">
                            <div className="col-md-6 col-sm-12 col-12 top_NSearch">
                                {/* <div className="col-md-3 col-sm-3 col-3 name">
                                    <select className="form-select selectname" arial-label="Default select example">
                                        <option selected>Name</option>
                                        <option value="1">Name1</option>
                                        <option value="2">Name2</option>
                                        <option value="3">Name3</option>
                                        <option value="4">Name4</option>
                                    </select>
                                </div> */}
                                <div className="col-md-9 col-sm-9 col-9">
                                    <img className="theme2_header_search_img searchMark" alt="search.svg" src={search} />
                                    <input className="theme2_header_search searchText" placeholder="Search by name" type="text" value={this.state.search} onChange={this.searchApplicants} />
                                </div>
                            </div>
                            <div className="col-md-2 col-sm-12 col-12 top_S">
                                <select className="form-select selectsorting selectSortAfter" arial-label="Default select example" onChange={this.handleSorting}>
                                    <option value="" disabled selected hidden>Sorting</option>
                                    <option value="-1">Highest Rating</option>
                                    <option value="1">Lowest Rating</option>
                                </select>
                            </div>
                            <div className="col-md-3 col-sm-12 col-12 top_F">
                                <div className="row">
                                    <div className="col-md-1 col-sm-1 col-1">
                                        <svg width="16" height="16" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 1L1 6L11 11L21 6L11 1Z" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M1 16L11 21L21 16" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M1 10.9999L11 15.9999L21 10.9999" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="col-md-10 col-sm-10 col-10">
                                        <select className="form-select selectsorting" arial-label="Default select example" onChange={this.handleFilter}>
                                            <option value="" disabled selected hidden>Filter</option>
                                            <option value="immediately_available">Immediately Available</option>
                                            <option value="not_immediately_available">Not Immediately Available</option>
                                            <option value="weekend_avaibility">Weekend Availability</option>
                                            <option value="no_weekend_avaibility">No Weekend Availability</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="applicantDetail">
                            <p className="applicantApp">Applicants</p>
                            {/* <p className="applicantNum">10 of 20</p> */}
                        </div>
                        <div className="staffAll">
                            {this.state.jobApplicantsList.map((v, i) => {
                                return <div className="staffOne row" key={i} onClick={(e) => {
                                    e.stopPropagation();
                                    this.handleMember(v.job, v.staff, v._id, v.status)
                                }}>
                                    <div className="col-md-7 col-sm-7 col-7 staffOneData">
                                        <div className="row">
                                            <div className="avatar_img col-md-3 col-sm-3 col-4">
                                                <img width="100%" src={v.avatar && v.avatar !== '' ? v.avatar : avatar} alt="avatar.png" style={{ borderRadius: '50%' }} />
                                                <img src={badge} alt="badge.png" className="avatar_badge" />
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-4 marginLeft">
                                                <p className="username">{v.name}</p>
                                                <p className="nurse">{v.jobTitle}</p>
                                                <p className="available" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>  Availability: {v.immediatelyStart ? "Immediately" : moment(v.startWorkDate).format("MM-DD-YYYY")}</p>
                                                <div className="position">
                                                    <svg width="13" height="16" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8C16 9.892 15.598 11.13 14.5 12.5L8 20L1.5 12.5C0.402 11.13 0 9.892 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315ZM11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8Z" fill="#333333" fill-opacity="0.7" />
                                                    </svg>
                                                    <p className="position_text">{v.currentLocation.name}, {v.currentLocation.state}</p>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-4 available_BTNs marginLeft">
                                                <div className="available_BTN">
                                                    <p className="BTN_text">Weekend availability</p>
                                                    {v.weekendAvailiblity ?
                                                        <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                                    {v.nursingLicense.length === 0 ?
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
                                                    {v.liabilityInsurance && v.liabilityInsurance.insuranceProvider === "" ?
                                                        <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0ZM9.58438 9.65938L8.55313 9.65469L7 7.80313L5.44844 9.65312L4.41563 9.65781C4.34688 9.65781 4.29063 9.60312 4.29063 9.53281C4.29063 9.50312 4.30156 9.475 4.32031 9.45156L6.35313 7.02969L4.32031 4.60938C4.30143 4.58647 4.29096 4.5578 4.29063 4.52812C4.29063 4.45937 4.34688 4.40312 4.41563 4.40312L5.44844 4.40781L7 6.25938L8.55156 4.40938L9.58281 4.40469C9.65156 4.40469 9.70781 4.45937 9.70781 4.52969C9.70781 4.55937 9.69688 4.5875 9.67813 4.61094L7.64844 7.03125L9.67969 9.45312C9.69844 9.47656 9.70938 9.50469 9.70938 9.53438C9.70938 9.60313 9.65313 9.65938 9.58438 9.65938Z" fill="#FF3A44" />
                                                        </svg>
                                                        :
                                                        <svg className="available_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M0 7C0 5.14348 0.737498 3.36301 2.05025 2.05025C3.36301 0.737498 5.14348 0 7 0C8.85652 0 10.637 0.737498 11.9497 2.05025C13.2625 3.36301 14 5.14348 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14C5.14348 14 3.36301 13.2625 2.05025 11.9497C0.737498 10.637 0 8.85652 0 7H0ZM6.60053 9.996L10.6307 4.95787L9.90267 4.37547L6.46613 8.66973L4.032 6.6416L3.43467 7.3584L6.60053 9.99693V9.996Z" fill="#6FCF97" />
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
                                            <p className="marks">{v.ratings.ratingSum.toFixed(1)}</p>
                                            {/* <p className="review" onClick={() => this.openReview(v)} style={{cursor: 'pointer', textDecoration: 'underline'}}>
                                          
                                            </p> */}
                                            <div className="mt-3" style={{ display: 'inline-block' }}>   <p className=" available"
                                            //  style={{ fontSize : '20px', fontStyle : 'normal', color : '#333333' }} 

                                            >{v.ratings.totalRatings} Review</p>
                                                {v.ratings.totalRatings && v.ratings.totalRatings !== 0 ?
                                                    <span className="rating_view_link"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            this.openReview(v)
                                                        }}
                                                    >
                                                        See all{" "}
                                                        <img
                                                            className="ms-2"
                                                            src={left_arrow}
                                                            width="7"
                                                            alt=""
                                                        />
                                                    </span> : ''} </div>
                                        </div>

                                    </div>
                                    <div className="col-md-2 col-sm-2 staffOneData">
                                        <div className="review_info">
                                            <div className="middle_line"></div>
                                            <div className="d-flex flex-column align-items-center justify-content-center">
                                                <div className="reviewBTN">{v.status === "In Progress" ? "In Progress" : v.status}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}

                            {!this.state.jobApplicantsList.length && <p className="text-center mt-5">No record found</p>}

                            {this.state.jobApplicantsList.length ? <Pagination curPage={this.state.curPage} totalPage={this.state.total} setCurPage={this.setCurPage} /> : null}
                        </div>

                        <div className="w3-modal viewModal" id="modal3" style={{ display: this.state.showView }}>
                            <div className="w3-modal-content ssu2_modal2">
                                <div className="w3-container">
                                    <div className="ssu2_modal1_text1">
                                        <p className="reviewStaff">{currApplicantData.name}</p>
                                        <p className="reviewEach">{currApplicantData.ratings && currApplicantData.ratings.totalRatings} Review</p>
                                        <p className="reviewMark reviewMarkhidden">{currApplicantData.ratings && currApplicantData.ratings.ratingSum.toFixed(1)}</p>
                                        <svg className='reviewSvg reviewSvghidden' width="33" height="31.6" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M40.0185 13.9063L27.621 12.1045L22.079 0.869159C21.9277 0.561542 21.6786 0.312518 21.371 0.161151C20.5995 -0.219709 19.662 0.0976744 19.2763 0.869159L13.7343 12.1045L1.33684 13.9063C0.995041 13.9551 0.682541 14.1162 0.443283 14.3604C0.154034 14.6577 -0.005356 15.0576 0.000137431 15.4724C0.00563086 15.8871 0.175558 16.2828 0.47258 16.5723L9.44231 25.3174L7.32317 37.666C7.27347 37.9533 7.30526 38.2487 7.41492 38.5188C7.52459 38.7889 7.70774 39.0229 7.94362 39.1942C8.17949 39.3656 8.45865 39.4674 8.74943 39.4881C9.04022 39.5088 9.331 39.4477 9.58879 39.3115L20.6777 33.4815L31.7665 39.3115C32.0693 39.4727 32.4208 39.5264 32.7577 39.4678C33.6073 39.3213 34.1786 38.5156 34.0322 37.666L31.913 25.3174L40.8827 16.5723C41.1269 16.333 41.288 16.0205 41.3368 15.6787C41.4687 14.8242 40.873 14.0332 40.0185 13.9063Z" fill="#009CDE" />
                                        </svg>
                                    </div>
                                    <div className="mainView">
                                        {this.state.staffRating ? this.state.staffRating.map((rating, i) => {
                                            return <div className="" key={i}>
                                                <div className="ViewOne">
                                                    <div className="HospitalData">
                                                        <img width="72px" src={rating.hospital && rating.hospital.avatar!== '' ? rating.hospital.avatar :   avatar} alt="avatar" style={{ borderRadius: '50%' }} />
                                                        <div className="HospitalInfo">
                                                            <p className="hospitalName">{rating.hospital.healthCareInstitution.name}</p>
                                                            {/* <p className="hospitalCity">Ohio</p> */}
                                                        </div>
                                                        <div className="HospitalMark">
                                                            <svg className='reviewSvg' width="33" height="31.6" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M40.0185 13.9063L27.621 12.1045L22.079 0.869159C21.9277 0.561542 21.6786 0.312518 21.371 0.161151C20.5995 -0.219709 19.662 0.0976744 19.2763 0.869159L13.7343 12.1045L1.33684 13.9063C0.995041 13.9551 0.682541 14.1162 0.443283 14.3604C0.154034 14.6577 -0.005356 15.0576 0.000137431 15.4724C0.00563086 15.8871 0.175558 16.2828 0.47258 16.5723L9.44231 25.3174L7.32317 37.666C7.27347 37.9533 7.30526 38.2487 7.41492 38.5188C7.52459 38.7889 7.70774 39.0229 7.94362 39.1942C8.17949 39.3656 8.45865 39.4674 8.74943 39.4881C9.04022 39.5088 9.331 39.4477 9.58879 39.3115L20.6777 33.4815L31.7665 39.3115C32.0693 39.4727 32.4208 39.5264 32.7577 39.4678C33.6073 39.3213 34.1786 38.5156 34.0322 37.666L31.913 25.3174L40.8827 16.5723C41.1269 16.333 41.288 16.0205 41.3368 15.6787C41.4687 14.8242 40.873 14.0332 40.0185 13.9063Z" fill="#009CDE" />
                                                            </svg>
                                                            <p className="reviewMark">{rating.rating}</p>
                                                        </div>
                                                    </div>
                                                    <div className="reviewContent">
                                                        <p> {rating.review} </p>
                                                    </div>
                                                </div>
                                            </div>
                                        }) : <h1 style={{}}> 'No rating found' </h1>}
                                    </div>
                                    <div className="row ssu_bottom">
                                        <button className="ssu2_modal1_button2 closeReview" onClick={this.closeReview}> CANCEL </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <ApplicantMember redirectTo={this.redirectTo} handleMember={this.handleMember} memberName={this.state.memberName} applicantData={this.state.viewStaffData} />
                }

            </div>
        )
    }
}

export default ApplicantJob;
