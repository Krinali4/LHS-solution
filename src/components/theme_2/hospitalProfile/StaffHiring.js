import React from 'react';
import "./staffHiring.css";
import FindStaff from './components/findStaff';
import Applicants from './components/applicants';
import ApplicantJob from './components/applicantJob';
import JobPosting from './components/jobPosting';
import JobPost from "./components/jobPost";
import JobEdit from "./components/jobEdit";
import Header from "../components/header";

class StaffHiring extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeClass:"job",
            applicant: false,
            jobPost: false,
            jobEdit: false,
            applicantjobTile: "",
            cometChat: localStorage.getItem('token'),
            jobDetails: {}
        }
    }
    handleMenu=(val)=>{
        this.setState({activeClass:val});
    }
    handleApplicant=(jobTitle, jobDetails)=>{
        if( jobTitle === "Post New Job" )
            this.setState({applicant:true, jobPost:true, jobEdit:false, applicantjobTile:jobTitle});
        else if(jobTitle === "Edit Job" )
            this.setState({applicant:true, jobPost:false, jobEdit:true, applicantjobTile:jobTitle});
        else
            this.setState({applicant:true, jobPost:false, jobEdit:false, applicantjobTile:jobTitle, jobDetails: jobDetails});
    }
    handleTitle=(userName)=>{
        this.setState({applicantjobTile:userName});
    }
    goBackStaff=()=>{
        this.setState({applicant:false, applicantjobTile:""});
    }

    redirectTo = () => {
        this.props.history.push('/main/hospital/chats')
    }

    render() {
        return (
            <div> 
                <Header page="Staff Hiring" />
                {this.state.applicant?
                    <div className="applicantJobTitle">
                        <div style={{cursor: 'pointer'}} className="d-flex align-items-center"><svg width="20" height="12" style={{marginTop:5+"px"}} viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={this.goBackStaff}>
                            <path d="M11 1L0.999999 11L11 21" stroke="#009CDE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p style={{color:"#009CDE", cursor:"pointer"}} className="mb-0" onClick={this.goBackStaff}>Staff Hiring</p> &nbsp; / &nbsp;  {this.state.applicantjobTile}</div>
                        </div>
                    :""
                }
                <div className="theme2_main_container">
                    <div className="theme2">
                        <div className="staff_main">
                            {!this.state.applicant?
                                <div>
                                    <div className="staff_menu">
                                    <div className={this.state.activeClass=="job"?"col-md-6 col-sm-4 col-4 RSBtn activeMenu":"col-md-6 col-sm-4 col-4 RSBtn"} onClick={()=>this.handleMenu('job')}>JOB POSTING</div>
                                        <div className={this.state.activeClass=="applicants"?"col-md-6 col-sm-4 RSBtn col-4 activeMenu":"col-md-6 col-sm-4 col-4 RSBtn"} onClick={()=>this.handleMenu('applicants')}>APPLICANTS</div>
                                        {/* <div className={this.state.activeClass=="find"?"col-md-4 col-sm-4 col-4 RSBtn activeMenu":"col-md-4 col-sm-4 col-4 RSBtn"} onClick={()=>this.handleMenu('find')}>FIND STAFF</div> */}

                                    </div>
                                    <div className="line"></div>
                                    {
                                        this.state.activeClass=="find"?<FindStaff />:
                                        this.state.activeClass=="applicants"?<Applicants applicant={this.handleApplicant} />:
                                        <JobPosting applicant={this.handleApplicant} />
                                    }
                                </div>
                            :this.state.jobPost?
                                <JobPost goBack={this.goBackStaff} applicant={this.handleApplicant} />
                                :this.state.jobEdit?
                                    <JobEdit goBack={this.goBackStaff} />
                                    :
                                    <ApplicantJob redirectTo={this.redirectTo} titleChange={this.handleTitle} jobDetails={this.state.jobDetails} />
                            }                    
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default StaffHiring
