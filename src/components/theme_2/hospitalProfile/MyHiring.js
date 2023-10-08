import React from 'react';
import "./MyHiring.css";
import InProcess from './components/inProcess';
import Hired from './components/hired';
import SelectHiringStaff from "./components/selectHiringStaff";
import Header from "../components/header";

class MyHiring extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeClass:"inProcess",
            applicant: false,
            hired: false,
            applicantjobTile: "",
            selectedStaff: false,
            selectStaffData: []
        }
    }
    handleMenu=(val)=>{
        if(val==="hired")
            this.setState({hired:true, activeClass:val});
        else{
            this.setState({hired:false, activeClass:val});
        }
    }
    handleApplicant=(userData)=>{
        this.setState({hired:true, applicantjobTile:userData.name, selectedStaff:true, selectStaffData:userData});
    }
    goBackStaff=()=>{
        this.setState({hired:false, applicantjobTile:"",  selectedStaff:false});
    }
    render() {
        return (
            <div> 
                <Header page="My Staff" />
                {this.state.hired && this.state.applicantjobTile!==""?
                    <div className="applicantJobTitle">
                        <svg width="20" height="12" style={{marginTop:5+"px"}} viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 1L0.999999 11L11 21" stroke="#009CDE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p style={{color:"#009CDE", cursor:"pointer"}} onClick={this.goBackStaff}>My Staff</p> &nbsp; / &nbsp;  {this.state.applicantjobTile}</div>
                    :""
                }
                <div className="theme2_main_container">
                    <div className="theme2">
                        <div className="staff_main">
                            {!this.state.selectedStaff?
                                <div>
                                    <div className="staff_menu myHiringHeadBorder">
                                        <div className={this.state.activeClass=="inProcess"?"myHiringHead RSBtn activeMenu":" myHiringHead RSBtn"} onClick={()=>this.handleMenu('inProcess')}>IN PROGRESS</div>
                                        <div className={this.state.activeClass=="hired"?"myHiringHead RSBtn activeMenu":"myHiringHead RSBtn"} onClick={()=>this.handleMenu('hired')}>COMPLETED</div>
                                    </div>
                                    <div className="line"></div>
                                    {
                                        this.state.activeClass=="inProcess"?<InProcess />:
                                        this.state.activeClass=="hired"?<Hired  applicant={this.handleApplicant}/>:
                                        ""
                                    }
                                </div>
                                :<SelectHiringStaff selectStaffData={this.state.selectStaffData} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MyHiring
