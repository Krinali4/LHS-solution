import React from 'react';
import "./jobPosting.css";
import search from '../../../assets/images/search.svg';
import { callApi } from '../../../../action';
import Pagination from '../../admin/pagination';
import Loader from '../../../modals/Loader';

class JobPosting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropShow: false,
            sortingkey: false,
            filter: false,
            search: "",
            searchKind: "Name",
            sorting: "desc",
            filterKey: "Filter",
            applicant: false,
            jobs: [],
            curPage: 1,
            total: 3,
            showView: "none",
            jobId: "",
            jobTitle: "",
            skip: 0,
            showLoader : false
        }
    }
    componentWillMount = async () => {
        this.getAllJobPosting(this.state.search, this.state.sorting, this.state.skip);
    }

    getAllJobPosting = async (searchValue, sortingkey, skip) => {
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var res = await callApi("GET", `v1/LHS/job/getByName?search=${searchValue}&sort=${sortingkey}&skip=${skip}`, Authorization);
        console.log(res.data, "RESSS");
        if (res.data) {
            this.setState({ jobs: res.data.job });
        }
        else {
            this.setState({ jobs: [] });
        }
        var totalCount = res.data.count
        var page = Math.ceil(totalCount / 10);
        this.setState({ total: page });
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
    handleSorting = async (sort) => {
        await this.setState({ sorting: sort.target.value });
        await this.setState({ curPage: 1, skip: 0 });
        this.setState({ sortingkey: false });
        this.getAllJobPosting(this.state.search, sort.target.value, this.state.skip);
    }
    handleSymboleFilter = () => {
        this.setState({ filter: !this.state.filter })
    }
    handleFilter = (filter) => {
        this.setState({ filterKey: filter });
        this.setState({ filter: false })
    }
    handleApplicant = (jobTitle) => {
        this.props.applicant(jobTitle);
    }
    handleEdit = (job) => {
        var jobEdit = JSON.stringify(job)
        window.localStorage.setItem("jobEdit", jobEdit);
        var jobTitle = "Edit Job";
        this.props.applicant(jobTitle);
    }
    setCurPage = async (num) => {
        this.setState({ curPage: num });
        var skip = (num - 1) * 10;
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var res = await callApi("GET", `v1/LHS/job/getByName?search=${this.state.search}&sort=${this.state.sorting}&skip=${skip}`, Authorization);
        if (res.data) {
            this.setState({ jobs: res.data.job, skip: skip });
        }
        else {
            this.setState({ jobs: [] });
        }
        var totalCount = res.data.count
        var page = Math.ceil(totalCount / 10);
        this.setState({ total: page });
    }
    handleSearch = async (e) => {
        await this.setState({ curPage: 1, skip: 0 });
        var sendData = e.target.value;
        this.setState({ search: sendData });
        await this.getAllJobPosting(e.target.value, this.state.sorting, this.state.skip);
    }
    openReview = (job) => {
        this.setState({ jobId: job._id, jobTitle: job.jobTitle });
        this.setState({ showView: "block" });
    }
    closeReview = () => {
        this.setState({ showView: "none" });
    }
    handleDelete = async () => {
        this.setState({ showLoader : true})
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var res = await callApi("DELETE", "v1/LHS/job/delete/" + this.state.jobId, Authorization);
        console.log(res);
        this.setState({ showView: "none", showLoader: false });
        this.componentWillMount();
    }

    render() {
        return (
            <div>
                <div className="top_NSF">
                    <div className="col-md-5 col-sm-12 col-12 top_NSearch">
                        {/* <div className="col-md-3 col-sm-3 col-3 name">
                            <select className="form-select selectname" arial-label="Default select example">
                                <option value="Name" selected>Name</option>
                                <option value="Name">Title</option>
                                <option value="Education">Education</option>
                                <option value="Certification">Certification</option>
                            </select>
                        </div> */}
                        <div className="col-md-9 col-sm-9 col-9">
                            <img className="theme2_header_search_img searchMark" alt="search.svg" src={search} />
                            <input className="theme2_header_search searchText" placeholder="Search By Job Title" type="text" onKeyUp={(e) =>  this.handleSearch(e) } />
                        </div>
                    </div>
                    <div className="col-md-2 col-sm-12 col-12 top_S">
                        <select className="form-select selectsorting selectSortAfter" value={this.state.sorting} arial-label="Default select example" onChange={this.handleSorting}>
                            <option value="" disabled selected hidden>Sorting</option>
                            <option value="desc">Latest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>
                    <div className="col-md-2 col-sm-12 col-12 top_P" onClick={() => this.handleApplicant("Post New Job")}>
                        Post New job
                    </div>
                    <div className="col-md-2 col-sm-12 col-12">
                        {/* <div className="row">
                            <div className="col-md-1 col-sm-1 col-1 top_Filter_SVG">
                                <svg width="16" height="16" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 1L1 6L11 11L21 6L11 1Z" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M1 16L11 21L21 16" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M1 10.9999L11 15.9999L21 10.9999" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div className="col-md-10 col-sm-10 col-10">
                                <select className="form-select selectsorting" arial-label="Default select example">
                                    <option selected>Filter</option>
                                    <option value="1">Medical setting</option>
                                    <option value="2">Nursing license</option>
                                    <option value="3">Liability Insurance</option>
                                    <option value="4">Weekend Availability</option>
                                    <option value="4">Job Type</option>
                                    <option value="4">Job Position</option>
                                </select>
                            </div>
                        </div> */}
                    </div>

                </div>
                <div className="overFlowX">
                    <div className="applicants_main">
                        <div className="applicants_header">
                            <div className="row headText">
                                <div className="col-md-4 col-sm-4 col-4">Job Title</div>
                                <div className="col-md-2 col-sm-2 col-2">Job Type</div>
                                <div className="col-md-1 col-sm-1 col-1">Positions</div>
                                <div className="col-md-4 col-sm-4 col-4">Healthcare Institution Location</div>
                                <div className="col-md-1 col-sm-1 col-1">Actions</div>
                            </div>
                            <div className="applicantsContent" style={{ marginTop: "15px" }}>
                                {this.state.jobs.map((job) => {
                                    return (
                                        !job.isDeleted ?
                                            <div className="applicantsEach" style={{ marginTop: "15px" }}>
                                                <div className="row applicantsEachContent">
                                                    <div className="col-md-4 col-sm-4 col-4 applicantClick">{job.jobTitle}</div>
                                                    <div className="col-md-2 col-sm-2 col-2">{job.contractType}</div>
                                                    <div className="col-md-1 col-sm-1 col-1">{job.openPositions}</div>
                                                    <div className="col-md-4 col-sm-4 col-4">{job.healthCareLocation}</div>
                                                    <div className="col-md-1 col-sm-1 col-1">
                                                        <svg className="jobEdit" width="15" height="15" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => this.handleEdit(job)}>
                                                            <path d="M21.8924 0L26.0003 4.10786L22.8687 7.24078L18.7608 3.13293L21.8924 0ZM6.84668 19.1536H10.9545L20.9325 9.17558L16.8247 5.06773L6.84668 15.0457V19.1536Z" fill="#333333" />
                                                            <path d="M21.9086 23.2614H7.06278C7.02717 23.2614 6.9902 23.2751 6.9546 23.2751C6.90942 23.2751 6.86423 23.2628 6.81767 23.2614H2.73857V4.09141H12.1141L14.8526 1.35284H2.73857C1.22825 1.35284 0 2.57972 0 4.09141V23.2614C0 24.7731 1.22825 26 2.73857 26H21.9086C22.6349 26 23.3315 25.7115 23.845 25.1979C24.3586 24.6843 24.6471 23.9877 24.6471 23.2614V11.3924L21.9086 14.131V23.2614Z" fill="#333333" />
                                                        </svg>
                                                        <svg className="jobDelete" width="15" height="15" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => this.openReview(job)} >
                                                            <path d="M23 4.5H19V2C19 0.896875 18.1031 0 17 0H7C5.89687 0 5 0.896875 5 2V4.5H1C0.446875 4.5 0 4.94688 0 5.5V6.5C0 6.6375 0.1125 6.75 0.25 6.75H2.1375L2.90938 23.0938C2.95938 24.1594 3.84063 25 4.90625 25H19.0938C20.1625 25 21.0406 24.1625 21.0906 23.0938L21.8625 6.75H23.75C23.8875 6.75 24 6.6375 24 6.5V5.5C24 4.94688 23.5531 4.5 23 4.5ZM16.75 4.5H7.25V2.25H16.75V4.5Z" fill="#333333" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            ""
                                    )
                                })}
                                {!this.state.jobs.length && <p className="text-center mt-5">No record found</p>}
                            </div>
                            {this.state.jobs.length ? <Pagination curPage={this.state.curPage} totalPage={this.state.total} setCurPage={this.setCurPage} /> : null}
                        </div>
                    </div>
                </div>
                <div className="w3-modal viewModal sendReview" id="modal3" style={{ display: this.state.showView }}>
                    <div className="w3-modal-content ssu2_modal2">
                        <div className="w3-container">
                            <div className="staffOne modalStaffOne deleteJob">
                                Delete “{this.state.jobTitle}”
                            </div>
                            <div className="sendMain deleteMain">
                                Are you sure you want to delete “{this.state.jobTitle}”
                            </div>
                            <div className="row modalLast">
                                <div className="col-md-3"></div>
                                <div className="col-md-3 modalBTNCHL" onClick={this.handleDelete}>
                                  {this.state.showLoader ? <Loader /> :"DELETE" }  
                                </div>
                                <div className="col-md-3 modalBTNCHR" onClick={this.closeReview}>
                                    CANCEL
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

export default JobPosting
