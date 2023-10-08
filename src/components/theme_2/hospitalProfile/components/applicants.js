import React from 'react';
import "./applicants.css";
import search from '../../../assets/images/search.svg';
import { callApi } from '../../../../action';
import Pagination from '../../admin/pagination';

class Applicants extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropShow: false,
            sortingkey: false,
            filter: false,
            searchKind: "Name",
            sorting: "desc",
            filterKey: "Filter",
            applicant: false,
            jobs: [],
            curPage: 1,
            total: 3,
            search: ""
        }
    }
    componentWillMount = async () => {
        this.getAllApplications(this.state.search, this.state.sorting);
    }

    getAllApplications = async (searchValue, sortingkey) => {
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var res = await callApi("GET", `v1/LHS/job/getByName?search=${searchValue}&sort=${sortingkey}&skip=0`, Authorization);
        console.log(res.data, "RESSS");
        if(res.data){
            this.setState({ jobs: res.data.job });
        }
        else{
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
        this.setState({ sorting: sort.target.value });
        await this.setState({ curPage: 1 });
        this.setState({ sortingkey: false })
        this.getAllApplications(this.state.search, sort.target.value)
    }
    handleSymboleFilter = () => {
        this.setState({ filter: !this.state.filter })
    }
    handleFilter = (filter) => {
        this.setState({ filterKey: filter });
        this.setState({ filter: false })
    }
    handleApplicant = (jobTitle, jobDetails) => {
        this.props.applicant(jobTitle, jobDetails);
    }
    setCurPage = async (num) => {
        console.log("Aaaa")
        this.setState({ curPage: num });
        var skip = (num-1)*10;
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var res = await callApi("GET", `v1/LHS/job/getByName?search=${this.state.search}&sort=${this.state.sorting}&skip=${skip}`, Authorization);
        var totalCount = res.data.count
        var page = Math.ceil(totalCount / 10);
        this.setState({ total: page });
        if(res.data){
            this.setState({ jobs: res.data.job });
        }
        else{
            this.setState({ jobs: [] });
        }
    }

    search = async (e) => {
        this.setState({
            search: e.target.value
        });
        await this.setState({ curPage: 1 });
        this.getAllApplications( e.target.value, this.state.sorting);
    }

    render() {
        return (
            <div>
                <div className="top_NSF">
                    <div className="col-md-6 col-sm-12 col-12 top_NSearch">
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
                            <input className="theme2_header_search searchText" placeholder="Search By Job Title" type="text" value={this.state.search} onChange={this.search} />
                        </div>
                    </div>
                    <div className="col-md-2 col-sm-12 col-12 top_S">
                        <select className="form-select selectsorting selectSortAfter" value={this.state.sorting} arial-label="Default select example" onChange={this.handleSorting}>
                            <option value="" disabled selected hidden>Sorting</option>
                            <option value="desc">Latest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>
                    <div className="col-md-3 col-sm-12 col-12">
                        {/* <div className="row">
                            <div className="col-md-1 col-sm-1 col-1">
                                <svg width="16" height="16" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 1L1 6L11 11L21 6L11 1Z" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M1 16L11 21L21 16" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M1 10.9999L11 15.9999L21 10.9999" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
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
                                <div className="col-md-1 col-sm-1 col-1">Applicants</div>
                            </div>
                            {this.state.jobs.map((job) => {
                                return (
                                    !job.isDeleted ?
                                        <div className="applicantsContent" style={{ marginTop: "15px" }}>
                                            <div className="applicantsEach">
                                                <div className="row applicantsEachContent">
                                                    <div className="col-md-4 col-sm-4 col-4 applicantClick" onClick={() => this.handleApplicant(job.jobTitle, job)}>{job.jobTitle}</div>
                                                    <div className="col-md-2 col-sm-2 col-2">{job.contractType}</div>
                                                    <div className="col-md-1 col-sm-1 col-1">{job.openPositions}</div>
                                                    <div className="col-md-4 col-sm-4 col-4">{job.healthCareLocation}</div>
                                                    <div className="col-md-1 col-sm-1 col-1"><p className="applicantBadge">{job.appliedBy.length}</p></div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        ""
                                )
                            })}
                            {!this.state.jobs.length && <p className="text-center mt-5">No record found</p>}
                            {this.state.jobs.length ? <Pagination curPage={this.state.curPage} totalPage={this.state.total} setCurPage={this.setCurPage} /> : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Applicants
