import React from 'react';
import { connect } from 'react-redux';
import "./inProcess.css";
import search from '../../../assets/images/search.svg';
import avatar from '../../../assets/images/avatar.png';
import badge from '../../../assets/images/badge.png';
import { callApi } from '../../../../action';
import Pagination from '../../admin/pagination';
import moment from 'moment';
import { AddReviewModal } from '../../../../containers/staff/myJobs/myJob';
import RateReviewModal from '../../../containers/staff/rate_review_modal';
import left_arrow from "../../../assets/images/left_arrow.png";
import Loader from '../../../modals/Loader';

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
};

const mapDispatchToProps = dispatch => ({
});
class InProcess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropShow: false,
            sortingkey: "",
            filter: false,
            searchKind: "Name",
            sorting: "Sorting",
            filterKey: "",
            searchResultNone: false,
            showLoader : false,
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
            totalStaff: 0,
            skip : 0,
            sortValue: '',
            search: '',
            showReviewModal: false,
            showAddReviewModal: false,
            staffData: {},
            reviewData: []
        }
    }
    componentDidMount = async () => {
        console.log(this.props.auth);
        
        this.initState(this.props);
        this.getInProgressStaff();
    }

    getInProgressStaff = async() => {
        this.setState({ showLoader : true })
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var res = await callApi("GET", `v1/LHS/hospital/inProgress?skip=${this.state.skip}`, Authorization);

        if (res.data) {
            var totalCount = res.data.count
            var page = Math.ceil(totalCount / 10);
            this.setState({ total: page, totalStaff: res.data.length });
            // res.data.shift();
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
            curPage: 1
        })
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        if (this.state.searchField === "Name") {
        this.setState ({ showLoader : true })
            var res = await callApi("GET", `v1/LHS/hospital/inProgress?filter=${this.state.filter}&value=${this.state.filterKey}&sort=${this.state.sortValue}&search=${sendData}`, Authorization);
            console.log(res, "RESES")
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
        // else if(this.state.searchField==="Education"){
        //     if(sendData==="")
        //         alert("Please insert Education search key.");
        //     else{
        //         var res = await callApi("GET", "v1/LHS/hospital/staffByEducation/?skip=0&education="+sendData+"&sort=rating&filter=Commitment&value=Part Time&sortValue=-1", Authorization);
        //         if(res.status===404){
        //             this.setState({staffs:[], searchResultNone:true});
        //         }
        //         else if(res.status===500){
        //             this.setState({staffs:[], searchResultNone:true});
        //         }
        //         else{
        //             var totalCount = res.data[0].count
        //             var page = Math.ceil(totalCount/10);
        //             this.setState({ total:page });
        //             res.data.shift();
        //             this.setState({staffs:res.data, searchResultNone:false});
        //         }
        //     }
        // }
        // else if(this.state.searchField==="Certification"){
        //     if(sendData==="")
        //         alert("Please insert Certification search key.");
        //     else{
        //         var res = await callApi("GET", "v1/LHS/hospital/staffByCertification/?skip=0&certification="+sendData+"&sort=rating&sortValue=1&filter=weekendAvailiblity&value=true", Authorization);
        //         if(res.status===404){
        //             this.setState({staffs:[], searchResultNone:true});
        //         }
        //         else if(res.status===500){
        //             this.setState({staffs:[], searchResultNone:true});
        //             alert("500");
        //         }
        //         else{
        //             var totalCount = res.data[0].count
        //             var page = Math.ceil(totalCount/10);
        //             this.setState({ total:page });
        //             res.data.shift();
        //             this.setState({staffs:res.data, searchResultNone:false});
        //         }
        //     }
        // }
        // this.setState({staffs:res.data});
        console.log(res);
    }
    handleSelect = (event) => {
        this.setState({ searchField: event.target.value });
    }
    setCurPage = async (num) => {
        this.setState({ staffs : [] })
        const value = (num * 10) - 10;
        await this.setState({ curPage: num, skip: value });
        this.getInProgressStaff(this.state.skip)
        // this.setState({ curPage: num });
        // var skip = (num - 1) * 10;
        // var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        // var res = await callApi("GET", "v1/LHS/hospital/generalJobList/?skip=" + skip + "&sort=asc", Authorization);
        // var totalCount = res.data[0].count
        // var page = Math.ceil(totalCount / 10);
        // this.setState({ total: page });
        // res.data.shift();
        // console.log(res);
        // this.setState({ staffs: res.data });
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
            await this.setState({ filter: "timeCommitment", filterKey: "Full Time" });
        else if (filterValue === "part_time_commitment") {
            await this.setState({ filter: "timeCommitment", filterKey: "Part Time" });
        }
        else if (filterValue === "weekend_avaibility")
            await this.setState({ filter: "weekendAvailiblity", filterKey: true });
        else if (filterValue === "no_weekend_avaibility")
            await this.setState({ filter: "weekendAvailiblity", filterKey: false });
        this.handleSearch({
            target: {
                value: this.state.search
            }
        });
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
                    <div className="col-md-6 col-sm-12 col-12 top_NSearch">
                        {/* <div className="col-md-3 col-sm-3 col-3 name">
                            <select className="form-select selectname" arial-label="Default select example" onChange={this.handleSelect}>
                                <option value="Name" selected>Name</option>
                                <option value="Education">Education</option>
                                <option value="Certification">Certification</option>
                            </select>
                        </div> */}
                        <div className="col-md-9 col-sm-9 col-9">
                            <img className="theme2_header_search_img searchMark" alt="search.svg" src={search} />
                            <input className="theme2_header_search searchText" placeholder="Search by name" type="text" value={this.state.search} onChange={(e) => { this.handleSearch(e) }} />
                        </div>
                    </div>
                    {/* <div className="col-md-3 col-sm-12 col-12 top_S">
                        <select className="form-select selectsorting selectSortAfter" arial-label="Default select example" onChange={this.handleSort}>
                            <option selected>Sorting</option>
                            <option value="1">Highest Rating</option>
                            <option value="-1">Lowest Rating</option>
                        </select>
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
                                    <option disabled selected hidden>Filter</option>
                                    <option value="weekend_avaibility">Weekend Availability</option>
                                    <option value="no_weekend_avaibility">No Weekend Availability</option>
                                </select>
                            </div>
                        </div>
                    </div> */}
                    <div className="col-md-2 col-sm-12 col-12 ">

                    </div>
                </div>

                {(!this.state.searchResultNone && !this.state.showLoader ) ? this.state.staffs.map((staff) => {
                    return (<div className="staffOne row">
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
                                   
                                </div>

                            </div>

                        </div>
                        {/* <div className="col-md-3 col-sm-3 staffOneData">
                            <div className="review_info">
                                <div className="middle_line"></div>
                                <svg width="33" height="31.6" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M40.0185 13.9063L27.621 12.1045L22.079 0.869159C21.9277 0.561542 21.6786 0.312518 21.371 0.161151C20.5995 -0.219709 19.662 0.0976744 19.2763 0.869159L13.7343 12.1045L1.33684 13.9063C0.995041 13.9551 0.682541 14.1162 0.443283 14.3604C0.154034 14.6577 -0.005356 15.0576 0.000137431 15.4724C0.00563086 15.8871 0.175558 16.2828 0.47258 16.5723L9.44231 25.3174L7.32317 37.666C7.27347 37.9533 7.30526 38.2487 7.41492 38.5188C7.52459 38.7889 7.70774 39.0229 7.94362 39.1942C8.17949 39.3656 8.45865 39.4674 8.74943 39.4881C9.04022 39.5088 9.331 39.4477 9.58879 39.3115L20.6777 33.4815L31.7665 39.3115C32.0693 39.4727 32.4208 39.5264 32.7577 39.4678C33.6073 39.3213 34.1786 38.5156 34.0322 37.666L31.913 25.3174L40.8827 16.5723C41.1269 16.333 41.288 16.0205 41.3368 15.6787C41.4687 14.8242 40.873 14.0332 40.0185 13.9063Z" fill="#009CDE" />
                                </svg>
                                <p className="marks">{staff.ratings.ratingSum.toFixed(1)}</p>
                                <p className="review">{staff.ratings.totalRatings} Review</p>
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

                        </div> */}
                        <div className="col-md-2 col-sm-2 d-flex align-items-center mb-4">
                            <div className="review_info URdiv" style={{ width: '80px' }}>
                                <div className="staffOneData">
                                    <p className="mb-0 justify-content-center">
                                        {staff.daysWorked} of {staff.totalDays} days completed
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                })
                    :
                    null
                }

                {(!this.state.staffs.length && !this.state.showLoader )  && <p className="searchResultNone">No results found</p>}
                {(this.state.staffs.length && !this.state.showLoader )? <Pagination curPage={this.state.curPage} totalPage={this.state.total} setCurPage={this.setCurPage} /> : null}

                {this.state.showReviewModal && <RateReviewModal
                    show={this.state.showReviewModal}
                    onHide={() => this.setState({ showReviewModal: false })}
                    reviewData={this.state.reviewData}
                    data={this.state.staffData}
                    type={'staff'}
                />}

{this.state.showLoader && <Loader />}
            </div>
        )
    }
}

export default InProcess;
