import React from 'react';
import { connect } from 'react-redux';
import "./hired.css";
import search from '../../../assets/images/search.svg';
import avatar from '../../../assets/images/avatar.png';
import badge from '../../../assets/images/badge.png';
import left_arrow from "../../../assets/images/left_arrow.png";
import { callApi } from '../../../../action';
import Pagination from '../../admin/pagination';
import { AddReviewModal } from '../../../../containers/staff/myJobs/myJob';
import RateReviewModal from './../../../containers/staff/rate_review_modal';
import moment from 'moment';
import Loader from '../../../modals/Loader';

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
};

const mapDispatchToProps = dispatch => ({
});
class Hired extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            dropShow: false,
            sortingkey: false,
            filter: false,
            searchKind: "Name",
            sorting: "Sorting",
            filterKey: "Filter",
            searchResultNone: false,
            sortName: "asc",
            sortOther: "desc",
            avatar: "",
            showView: "none",
            staffs: [],
            searchField: "Name",
            selectStaff: {
                name: "",
                ratings: {
                    totalRatings: "",
                    ratingSum: ""
                }
            },
            curPage: 1,
            total: 0,
            star: 0,
            totalStaff: 0,
            skip: 0,
            sortValue: "",
            search: "",
            showReviewModal: false,
            showAddReviewModal: false,
            staffData: {},
            reviewData: [],
            showLoader : false
        }
    }
    componentDidMount = () => {
        console.log(localStorage.getItem('token'));
        this.initState(this.props);
        this.getCompletedStaff();
    }

    getCompletedStaff = async () => {
        this.setState({ showLoader : true })
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var res = await callApi("GET", `v1/LHS/hospital/completed?skip=${this.state.skip}&sort=1`, Authorization);
        // res.data.shift();
        if (res.data.data) {
            var totalCount = res.data.count
            var page = Math.ceil(totalCount / 10);
            this.setState({ total: page, totalStaff: totalCount });
            this.setState({ staffs: res.data.data, showLoader : false });
        }
        else {
            this.setState({ staffs: [], showLoader : false });
        }
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
    handleSorting = (sort) => {
        this.setState({ sorting: sort });
        this.setState({ sortingkey: false })
    }
    handleSymboleFilter = () => {
        this.setState({ filter: !this.state.filter })
    }

    openReview = async (staff) => {
        var selectedStaff = this.state.selectStaff;
        selectedStaff.name = staff.name;
        selectedStaff.ratings.totalRatings = staff.ratings.totalRatings;
        selectedStaff.ratings.ratingSum = staff.ratings.ratingSum;
        this.setState({ showView: "block", selectStaff: selectedStaff });
        console.log(this.state.selectStaff);
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var userID = staff._id;
        var res = await callApi("GET", "v1/LHS/rating/getStaffRating/" + userID, Authorization);
        console.log(res);
    }
    closeReview = () => {
        this.setState({ showView: "none" });
    }
    handleSearch = async (e) => {
        var sendData = e.target.value;
        this.setState({
            search: e.target.value,
            curPage : 1
        })
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        if (this.state.searchField === "Name") {
        this.setState ({ showLoader : true })
            var res = await callApi("GET", `v1/LHS/hospital/completed?search=${sendData}`, Authorization);

            if (res.status === 404) {
                this.setState({ staffs: [], searchResultNone: true, showLoader : false });
            }
            else {
                var totalCount = res.data.count
                var page = Math.ceil(totalCount / 10);
                this.setState({ total: page });
                this.setState({ staffs: res.data.data, searchResultNone: false, showLoader : false });
            }
        }
        else if (this.state.searchField === "Education") {
            if (sendData === "")
                alert("Please insert Education search key.");
            else {
                var res = await callApi("GET", "v1/LHS/hospital/staffByEducation/?skip=0&education=" + sendData + "&sort=rating&filter=Commitment&value=Part Time&sortValue=-1", Authorization);
                if (res.status === 404) {
                    this.setState({ staffs: [], searchResultNone: true });
                }
                else if (res.status === 500) {
                    this.setState({ staffs: [], searchResultNone: true });
                }
                else {
                    var totalCount = res.data[0].count
                    var page = Math.ceil(totalCount / 10);
                    this.setState({ total: page });
                    res.data.shift();
                    this.setState({ staffs: res.data, searchResultNone: false });
                }
            }
        }
        else if (this.state.searchField === "Certification") {
            if (sendData === "")
                alert("Please insert Certification search key.");
            else {
                var res = await callApi("GET", "v1/LHS/hospital/staffByCertification/?skip=0&certification=" + sendData + "&sort=rating&sortValue=1&filter=weekendAvailiblity&value=true", Authorization);
                if (res.status === 404) {
                    this.setState({ staffs: [], searchResultNone: true });
                }
                else if (res.status === 500) {
                    this.setState({ staffs: [], searchResultNone: true });
                    alert("500");
                }
                else {
                    var totalCount = res.data[0].count
                    var page = Math.ceil(totalCount / 10);
                    this.setState({ total: page });
                    res.data.shift();
                    this.setState({ staffs: res.data, searchResultNone: false });
                }
            }
        }
        // this.setState({staffs:res.data});
        console.log(res);
    }
    handleSelect = (event) => {
        this.setState({ searchField: event.target.value });
    }
    setCurPage = async (num) => {
        // this.setState({curPage: num});
        // var skip = (num-1)*10;
        // var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        // var res = await callApi("GET", "v1/LHS/hospital/generalJobList/?skip="+skip+"&sort=asc", Authorization);
        // var totalCount = res.data[0].count
        // var page = Math.ceil(totalCount/10);
        // this.setState({ total: page });
        // res.data.shift();
        // console.log(res);
        // this.setState({staffs:res.data});
       this.setState({showLoader : true, staffs : [] })
        const value = (num * 10) - 10;
        await this.setState({ curPage: num, skip: value });
        this.getCompletedStaff(this.state.skip)
    }

    handleSort = async (event) => {
        var sorting = event.target.value;
        if (sorting === "-1")
            await this.setState({ sort: "rating", sortValue: -1 });
        else if (sorting === "1")
            await this.setState({ sort: "rating", sortValue: 1 });
        this.handleSearch({
            target: {
                value: this.state.search
            }
        });
    }

    handleFilter = async (e) => {
        let filterValue = e.target.value;
        if (filterValue === "full_time_commitment")
            await this.setState({ filter: "timecommitment", filterKey: "Full Time" });
        else if (filterValue === "part_time_commitment") {
            await this.setState({ filter: "timecommitment", filterKey: "Part Time" });
        }
        else if (filterValue === "weekend_avaibility")
            await this.setState({ filter: "weekendavailiblity", filterKey: true });
        else if (filterValue === "no_weekend_avaibility")
            await this.setState({ filter: "weekendavailiblity", filterKey: false });
        this.handleSearch({
            target: {
                value: this.state.search
            }
        });
    }

    handleRating = (val) => {
        if (this.state.star === 1 && val === 1) {
            this.setState({ star: 0 });
        } else {
            this.setState({ star: val });
        }
    }
    hired = (selected) => {
        this.props.applicant(selected);
    }

    postReview = async (review, reviewCount) => {
        if (!this.state.loader) {
            let obj = {
                ratingTo: this.state.staffData.staff,
                rating: reviewCount,
                review: review
            }
            var token = localStorage.getItem("accessToken");
            let url = `v1/LHS/rating/save`;
            var res = await callApi("POST", url, `Bearer ${token}`, obj);
            if (res.status === 200) {
                this.setState({
                    showAddReviewModal: false,
                    loader: false
                });
                this.handleSearch({
                    target: {
                        value: ""
                    }
                });
            }
        }
    }

    getAllReviews = async (id) => {
        var token = localStorage.getItem("accessToken");
        const data = await callApi(
            "GET",
            `v1/LHS/rating/getStaffRating/${id}`,
            `Bearer ${token}`
        );
        if (data) {
            this.setState({
                reviewData: data.data
            })
        }
    }

    render() {
        return (
            <div>
                <div className="top_NSF">
                    <div className="col-md-8 col-sm-12 col-12 top_NSearch">
                        <div className="col-md-9 col-sm-9 col-9">
                            <img className="theme2_header_search_img searchMark" alt="search.svg" src={search} />
                            <input className="theme2_header_search searchText" placeholder="Search by name" type="text" value={this.state.search} onChange={(e) => { this.handleSearch(e) }} />
                        </div>
                    </div>
                    {/* <div className="col-md-2 col-sm-12 col-12 top_S">
                        <select className="form-select selectsorting selectSortAfter" arial-label="Default select example" onChange={this.handleSort}>
                            <option selected>Sorting</option>
                            <option value="1">Highest Rating</option>
                            <option value="-1">Lowest Rating</option>
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
                                    <option selected>Filter</option>
                                    <option value="full_time_commitment">Full Time Commitment</option>
                                    <option value="part_time_commitment">Part Time Commitment</option>
                                    <option value="weekend_avaibility">Weekend Availability</option>
                                    <option value="no_weekend_avaibility">No Weekend Availability</option>
                                </select>
                            </div>
                        </div>
                    </div> */}
                </div>

                {!this.state.searchResultNone || !this.state.showLoader ? this.state.staffs.map((staff) => {
                    return (
                    <div className="staffOne row">
                        <div className="col-md-7 col-sm-7 col-7 staffOneData">
                            <div className="row">
                                <div className="avatar_img col-md-3 col-sm-3 col-4">
                                    <img width="100%" src={staff.avatar == "" ? avatar : staff.avatar} alt="avatar.png" style={{ borderRadius: '50%' }} />
                                    {staff.badge ?
                                        <img src={badge} alt="badge.png" className="avatar_badge" />
                                        : ""
                                    }
                                </div>
                                <div className="col-md-4 col-sm-4 col-4 marginLeft">
                                    <p className="username">{staff.name}</p>
                                    <p className="nurse">{staff.jobTitle}</p>
                                    <p className="available">Availability: {staff.immediatelyStart ? "Immediately" : moment(staff.startWorkDate).format("MM-DD-YYYY")}</p>
                                    <div className="position">
                                        <svg width="13" height="16" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8C16 9.892 15.598 11.13 14.5 12.5L8 20L1.5 12.5C0.402 11.13 0 9.892 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315ZM11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8Z" fill="#333333" fillOpacity="0.7" />
                                        </svg>
                                        <p className="position_text">{staff.currentLocation.name + ", " + staff.currentLocation.state}</p>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-4 col-4 available_BTNs marginLeft">
                                    <div className="available_BTN">
                                        <p className="BTN_text">Weekend availability</p>
                                        {staff.weekendAvailiblity ?
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
                                        {staff.nursingLicense.length === 0 ?
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
                                        {staff.liabilityInsurance && staff.liabilityInsurance.insuranceProvider === "" ?
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
                                <p className="marks">{staff.ratings.ratingSum.toFixed(1)}</p>
                                <div> <p className="review">{staff.ratings.totalRatings.toFixed(0)} Review</p>
                                    {staff.ratings.totalRatings !== 0 ? <div>
                                        <span className="rating_view_link"
                                            onClick={async (e) => {
                                                await this.getAllReviews(staff.staff);
                                                await this.setState({
                                                    staffData: staff
                                                });
                                                this.setState({ showReviewModal: true })
                                            }}>
                                            See all{" "}
                                            <img
                                                className="ms-2"
                                                src={left_arrow}
                                                width="7"
                                                alt=""
                                            />
                                        </span>
                                    </div> : null}
                                    <span style={{ fontSize: '12px', textDecoration: 'underline', cursor: "pointer" }} onClick={(e) => {
                                        e.stopPropagation();
                                        this.setState({
                                            staffData: staff
                                        })
                                        this.setState({ showAddReviewModal: true })
                                    }}>
                                        + Add Review
                                    </span>
                                </div>

                            </div>

                        </div>
                        <div className="col-md-2 col-sm-2 d-flex align-items-center justify-content-center mb-3">
                            {/* <div className="review_info URdiv">
                                <div className="middle_line"></div>
                                <div className="staffOneData CLData">
                                    <div className="CLength">Contract Length</div>
                                    <div className="CLday">45 Day(s)</div>
                                </div>
                                <svg className="circle" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0 40C0 62.0914 17.9086 80 40 80V40H0Z" fill="#333333" fill-opacity="0.1" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M80 40C80 62.0914 62.0914 80 40 80V40H80Z" fill="#333333" fill-opacity="0.1" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0 40C0 17.9086 17.9086 0 40 0V40H0Z" fill="#009CDE" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M80 40C80 17.9086 62.0914 0 40 0V40H80Z" fill="#333333" fill-opacity="0.1" />
                                    <circle cx="40" cy="40" r="31.0204" fill="white" />
                                    <path d="M32.4133 42.944H26.4613L30.0293 39.408C31.1653 38.288 32.3173 37.152 32.3173 35.424C32.3173 33.472 30.7173 32.48 28.8933 32.48C27.1493 32.48 25.8213 33.504 25.5013 35.184L26.7173 35.312C26.9573 34.224 27.8373 33.536 28.9733 33.536C30.1893 33.536 31.1653 34.272 31.1653 35.52C31.1653 36.56 30.4133 37.376 29.7253 38.08L25.2133 42.672V44H32.4133V42.944ZM40.7759 32.672H34.9999L34.8879 38.544C35.6079 38.16 36.4239 37.92 37.2399 37.92C38.8559 37.92 40.0239 39.008 40.0239 40.608C40.0239 42.016 38.9039 43.136 37.4639 43.136C36.4719 43.136 35.6719 42.56 35.2399 41.68L34.1039 42.176C34.7119 43.488 35.9439 44.192 37.3679 44.192C39.5439 44.192 41.1759 42.688 41.1759 40.496C41.1759 38.416 39.7199 36.864 37.5919 36.864C37.0799 36.864 36.5519 36.944 36.0719 37.136L36.1359 33.728H40.7759V32.672ZM48.4666 35.28C48.4666 33.712 47.2346 32.48 45.6506 32.48C44.0666 32.48 42.8346 33.712 42.8346 35.28C42.8346 36.848 44.0666 38.08 45.6506 38.08C47.2346 38.08 48.4666 36.848 48.4666 35.28ZM47.5066 35.28C47.5066 36.336 46.6586 37.12 45.6506 37.12C44.6426 37.12 43.7946 36.336 43.7946 35.28C43.7946 34.224 44.6426 33.44 45.6506 33.44C46.6586 33.44 47.5066 34.224 47.5066 35.28ZM54.9466 41.392C54.9466 39.824 53.7146 38.592 52.1306 38.592C50.5466 38.592 49.3146 39.824 49.3146 41.392C49.3146 42.96 50.5466 44.192 52.1306 44.192C53.7146 44.192 54.9466 42.96 54.9466 41.392ZM53.9866 41.392C53.9866 42.448 53.1386 43.232 52.1306 43.232C51.1226 43.232 50.2746 42.448 50.2746 41.392C50.2746 40.336 51.1226 39.552 52.1306 39.552C53.1386 39.552 53.9866 40.336 53.9866 41.392ZM52.8986 32.608L52.0826 32.176L44.8666 44.064L45.6986 44.496L52.8986 32.608Z" fill="#333333" />
                                </svg>

                            </div> */}
                            <div className="reviewBTN">Completed</div>
                        </div>
                    </div>
                    )
                })
                    :
                    null
                }

                {!this.state.staffs.length && !this.state.showLoader && <p className="searchResultNone">No results found</p>}

                {this.state.staffs.length ? <Pagination curPage={this.state.curPage} totalPage={this.state.total} setCurPage={this.setCurPage} /> : null}
{this.state.showLoader && <Loader />}

                {this.state.showAddReviewModal && (
                    <AddReviewModal
                        show={this.state.showAddReviewModal}
                        postReview={(review, reviewCount) => this.postReview(review, reviewCount)}
                        onHide={() => this.setState({ showAddReviewModal: false })}
                        data={this.state.staffData}
                        type="hospital"
                        showLoader={(value) => this.setState({ loader: value })}
                        loader={this.state.loader}
                    />
                )}

                {this.state.showReviewModal && <RateReviewModal
                    show={this.state.showReviewModal}
                    onHide={() => this.setState({ showReviewModal: false })}
                    reviewData={this.state.reviewData}
                    data={this.state.staffData}
                    type={'staff'}
                />}



                <div className="w3-modal viewModal sendReview" id="modal3" style={{ display: this.state.showView }}>
                    <div className="w3-modal-content ssu2_modal2">
                        <div className="w3-container">
                            <div className="ssu2_modal1_text1">
                                <p className="reviewStaff sendStaff">{this.state.selectStaff.name}</p>
                            </div>
                            <div className="sendMain">
                                <div className="ViewOne reviewDiv">
                                    <div className="sendDiv">
                                        <img width="72px" src={this.props.auth.avatar ? this.props.auth.avatar : avatar} alt="avatar" style={{ borderRadius: '50%' }} />
                                        <img src={badge} alt="badge.png" className="avatar_badge modalBadge" />
                                        <div className="HSInfo">
                                            <p className="hospitalName">{this.props.auth.hospitalName}</p>
                                            <p className="hospitalCity">{this.props.auth.city}, {this.props.auth.state}</p>
                                        </div>
                                    </div>
                                    <div className="ratingStar">
                                        <svg width="25" height="25" onClick={() => this.handleRating(1)} viewBox="0 0 40 39" style={{ cursor: "pointer" }} fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M38.7072 14.2489L26.7159 12.5062L21.3555 1.63902C21.2091 1.34148 20.9683 1.10062 20.6707 0.95421C19.9245 0.585831 19.0177 0.892814 18.6446 1.63902L13.2843 12.5062L1.29303 14.2489C0.962436 14.2962 0.660176 14.452 0.428758 14.6882C0.148986 14.9757 -0.00518049 15.3626 0.000132928 15.7637C0.00544635 16.1649 0.169805 16.5475 0.457094 16.8276L9.1329 25.2861L7.0832 37.2301C7.03514 37.508 7.06588 37.7937 7.17195 38.055C7.27802 38.3163 7.45518 38.5426 7.68332 38.7083C7.91147 38.874 8.18148 38.9724 8.46273 38.9925C8.74399 39.0125 9.02524 38.9534 9.27459 38.8217L20.0001 33.1827L30.7256 38.8217C31.0184 38.9776 31.3585 39.0295 31.6843 38.9729C32.5061 38.8312 33.0587 38.0519 32.917 37.2301L30.8673 25.2861L39.5431 16.8276C39.7792 16.5962 39.9351 16.2939 39.9823 15.9633C40.1098 15.1368 39.5337 14.3717 38.7072 14.2489Z" fill={this.state.star >= 1 ? "#009CDE" : "black"} fill-opacity={this.state.star >= 1 ? "1" : "0.1"} />
                                        </svg>
                                        <svg width="25" height="25" onClick={() => this.handleRating(2)} style={{ marginLeft: "15px", cursor: "pointer" }} viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M38.7072 14.2489L26.7159 12.5062L21.3555 1.63902C21.2091 1.34148 20.9683 1.10062 20.6707 0.95421C19.9245 0.585831 19.0177 0.892814 18.6446 1.63902L13.2843 12.5062L1.29303 14.2489C0.962436 14.2962 0.660176 14.452 0.428758 14.6882C0.148986 14.9757 -0.00518049 15.3626 0.000132928 15.7637C0.00544635 16.1649 0.169805 16.5475 0.457094 16.8276L9.1329 25.2861L7.0832 37.2301C7.03514 37.508 7.06588 37.7937 7.17195 38.055C7.27802 38.3163 7.45518 38.5426 7.68332 38.7083C7.91147 38.874 8.18148 38.9724 8.46273 38.9925C8.74399 39.0125 9.02524 38.9534 9.27459 38.8217L20.0001 33.1827L30.7256 38.8217C31.0184 38.9776 31.3585 39.0295 31.6843 38.9729C32.5061 38.8312 33.0587 38.0519 32.917 37.2301L30.8673 25.2861L39.5431 16.8276C39.7792 16.5962 39.9351 16.2939 39.9823 15.9633C40.1098 15.1368 39.5337 14.3717 38.7072 14.2489Z" fill={this.state.star >= 2 ? "#009CDE" : "black"} fill-opacity={this.state.star >= 2 ? "1" : "0.1"} />
                                        </svg>
                                        <svg width="25" height="25" onClick={() => this.handleRating(3)} style={{ marginLeft: "15px", cursor: "pointer" }} viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M38.7072 14.2489L26.7159 12.5062L21.3555 1.63902C21.2091 1.34148 20.9683 1.10062 20.6707 0.95421C19.9245 0.585831 19.0177 0.892814 18.6446 1.63902L13.2843 12.5062L1.29303 14.2489C0.962436 14.2962 0.660176 14.452 0.428758 14.6882C0.148986 14.9757 -0.00518049 15.3626 0.000132928 15.7637C0.00544635 16.1649 0.169805 16.5475 0.457094 16.8276L9.1329 25.2861L7.0832 37.2301C7.03514 37.508 7.06588 37.7937 7.17195 38.055C7.27802 38.3163 7.45518 38.5426 7.68332 38.7083C7.91147 38.874 8.18148 38.9724 8.46273 38.9925C8.74399 39.0125 9.02524 38.9534 9.27459 38.8217L20.0001 33.1827L30.7256 38.8217C31.0184 38.9776 31.3585 39.0295 31.6843 38.9729C32.5061 38.8312 33.0587 38.0519 32.917 37.2301L30.8673 25.2861L39.5431 16.8276C39.7792 16.5962 39.9351 16.2939 39.9823 15.9633C40.1098 15.1368 39.5337 14.3717 38.7072 14.2489Z" fill={this.state.star >= 3 ? "#009CDE" : "black"} fill-opacity={this.state.star >= 3 ? "1" : "0.1"} />
                                        </svg>
                                        <svg width="25" height="25" onClick={() => this.handleRating(4)} style={{ marginLeft: "15px", cursor: "pointer" }} viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M38.7072 14.2489L26.7159 12.5062L21.3555 1.63902C21.2091 1.34148 20.9683 1.10062 20.6707 0.95421C19.9245 0.585831 19.0177 0.892814 18.6446 1.63902L13.2843 12.5062L1.29303 14.2489C0.962436 14.2962 0.660176 14.452 0.428758 14.6882C0.148986 14.9757 -0.00518049 15.3626 0.000132928 15.7637C0.00544635 16.1649 0.169805 16.5475 0.457094 16.8276L9.1329 25.2861L7.0832 37.2301C7.03514 37.508 7.06588 37.7937 7.17195 38.055C7.27802 38.3163 7.45518 38.5426 7.68332 38.7083C7.91147 38.874 8.18148 38.9724 8.46273 38.9925C8.74399 39.0125 9.02524 38.9534 9.27459 38.8217L20.0001 33.1827L30.7256 38.8217C31.0184 38.9776 31.3585 39.0295 31.6843 38.9729C32.5061 38.8312 33.0587 38.0519 32.917 37.2301L30.8673 25.2861L39.5431 16.8276C39.7792 16.5962 39.9351 16.2939 39.9823 15.9633C40.1098 15.1368 39.5337 14.3717 38.7072 14.2489Z" fill={this.state.star >= 4 ? "#009CDE" : "black"} fill-opacity={this.state.star >= 4 ? "1" : "0.1"} />
                                        </svg>
                                        <svg width="25" height="25" onClick={() => this.handleRating(5)} style={{ marginLeft: "15px", cursor: "pointer" }} viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M38.7072 14.2489L26.7159 12.5062L21.3555 1.63902C21.2091 1.34148 20.9683 1.10062 20.6707 0.95421C19.9245 0.585831 19.0177 0.892814 18.6446 1.63902L13.2843 12.5062L1.29303 14.2489C0.962436 14.2962 0.660176 14.452 0.428758 14.6882C0.148986 14.9757 -0.00518049 15.3626 0.000132928 15.7637C0.00544635 16.1649 0.169805 16.5475 0.457094 16.8276L9.1329 25.2861L7.0832 37.2301C7.03514 37.508 7.06588 37.7937 7.17195 38.055C7.27802 38.3163 7.45518 38.5426 7.68332 38.7083C7.91147 38.874 8.18148 38.9724 8.46273 38.9925C8.74399 39.0125 9.02524 38.9534 9.27459 38.8217L20.0001 33.1827L30.7256 38.8217C31.0184 38.9776 31.3585 39.0295 31.6843 38.9729C32.5061 38.8312 33.0587 38.0519 32.917 37.2301L30.8673 25.2861L39.5431 16.8276C39.7792 16.5962 39.9351 16.2939 39.9823 15.9633C40.1098 15.1368 39.5337 14.3717 38.7072 14.2489Z" fill={this.state.star >= 5 ? "#009CDE" : "black"} fill-opacity={this.state.star >= 5 ? "1" : "0.1"} />
                                        </svg>
                                    </div>
                                    <div className="reviewContent commit">
                                        <textarea id="story" name="story" rows="5" cols="33" placeholder="Write your comment here" />
                                    </div>
                                </div>
                            </div>
                            <div className="row ssu_bottom">
                                <button className="closeReview GiveReview" onClick={this.closeReview}> POST </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Hired;
