import React from 'react';
import "./jobEdit.css";
import DatePicker from "react-datepicker";
import calendar from '../../../assets/images/calendar.png';
import ErrorState from "../../../theme_1/staffSignUp/components/errorState";
import TimeField from 'react-simple-timefield';
import { stateOfUs } from '../../../../constants/otherConstans';
import { callApi } from '../../../../action';
import Loader from '../../../../components/modals/Loader'


const AllMedicalSettings = ["Acute Care Hospitals", "Urgent Care Centers", "Rehabilitation Centers", "Nursing Homes", "Other Long-term Care Facilities", "Specialized Outpatient Services", "Specialized Outpatient Surgery Center"];

class JobEdit extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            expStartDate: "",
            expStartDateError:"none",
            error: {
                dateStart: "none",
            },
            startTime: '10:00',
            endTime: '06:00',
            medicalSetting: "Acute Care Hospitals",
            medicalSettingValue: "none",
            weekend:true,
            contract: "Temporary Position",
            stateOfUs: [],
            selectedState:"",
            selectedStateError:"none",
            jobTitle:"",
            jobTitleError:"none",
            description:"",
            descriptionError:"none",
            startAP:"AM",
            endAP:"PM",
            duration:"0",
            durationError:"none",
            length:"Days",
            openPositions:"0",
            openPositionsError:"none",
            expectedStartDate: "",
            jobId: "",
            jobEdit: [],
            cost: "$0",
            costError : 'none',
            showLoader: false
        }
        this.onTimeChange1 = this.onTimeChange1.bind(this);
        this.onTimeChange2 = this.onTimeChange2.bind(this);
    }
    componentWillMount = async () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        var temp = [];
        for(var i = 0; i < stateOfUs.length; i++){
            var temp1 = {
                name: stateOfUs[i],
                num: i
            };
            temp.push(temp1);
        }
        this.setState({stateOfUs: [...temp]});
        var jobEdit = JSON.parse(window.localStorage.getItem("jobEdit"));
        console.log(jobEdit, "jobEdit")
        this.setState({ 
            jobId: jobEdit._id,
            jobEdit:jobEdit, 
            jobTitle:jobEdit.jobTitle, 
            description:jobEdit.jobDescription, 
            medicalSetting:jobEdit.medicalSettings,
            contract:jobEdit.contractType,
            weekend:jobEdit.weekendAvailiblity,
            duration:jobEdit.contractLength.duration,
            openPositions:jobEdit.openPositions,
            selectedState: jobEdit.healthCareLocation,
            expStartDate: new Date(jobEdit.expectedStartDate),
            startTime: jobEdit.shiftStartTime ? jobEdit.shiftStartTime.split(" ")[0] : "",
            endTime: jobEdit.shiftEndTime ? jobEdit.shiftEndTime.split(" ")[0] : "",
            startAP: jobEdit.shiftStartTime ? jobEdit.shiftStartTime.split(" ")[1] : "",
            endAP: jobEdit.shiftEndTime ? jobEdit.shiftEndTime.split(" ")[1] : "",
            cost: jobEdit.costPerHour
        });
        console.log(jobEdit);
    }
    onTimeChange1(event, time) {
        this.setState({ startTime:time});
    }
    onTimeChange2(event, time) {
        this.setState({ endTime:time});
    }
    setExpStartDate = (date) => {
        console.log(date);
        this.setState({expStartDate: date});
        if(date === null){
            var error = this.state.error;
            error.dateStart = 'block';
            this.setState({error: error});
        }
        else{
            var error = this.state.error;
            error.dateStart = 'none';
            this.setState({error: error});
        }
    }
    handleSetting=(setting)=>{
        this.setState({medicalSetting:setting});
        if(setting !== ""){
            this.setState({medicalSettingValue: "none"})
        }
    }
    handleWeekend=(value)=>{
        this.setState({weekend:value});
    }
    handleContract=(value)=>{
        this.setState({contract:value});
    }
    handleState=(e)=>{
        this.setState({ selectedState:e.target.value, selectedStateError:"none" });
    }
    handleJobtitle=(e)=>{
        this.setState({ jobTitle:e.target.value });
        if(e.target.value==="")
            this.setState({ jobTitleError:"block" });
        else
            this.setState({ jobTitleError:"none" });
    }
    handleDescription=(e)=>{
        this.setState({ description:e.target.value })
        if(e.target.value==="")
            this.setState({ descriptionError:"block" });
        else
            this.setState({ descriptionError:"none" });
    }
    handleStartAP=(e)=>{
        this.setState({ startAP:e.target.value });
    }
    handleEndAP=(e)=>{
        this.setState({ endAP:e.target.value });
    }
    handleContractLength=(e)=>{
        this.setState({ duration:e.target.value });
        if(e.target.value==="" || e.target.value==="0")
            this.setState({ durationError:"block" });
        else
            this.setState({ durationError:"none" });
    }
    handleLength=(e)=>{
        this.setState({ length:e.target.value });
    }
    handleCostPerHour = (e) => {
        this.setState({ cost:e.target.value });
        if(e.target.value==="" || e.target.value==="0")
            this.setState({ costError:"block" });
        else
            this.setState({ costError:"none" });
    }
    handleOpenPositions=(e)=>{
        this.setState({ openPositions:e.target.value });
        if(e.target.value==="" || e.target.value==="0")
            this.setState({ openPositionsError:"block" });
        else
            this.setState({ openPositionsError:"none" });
    }

    convertTime12to24 = (time12h) => {
        const [time, modifier] = time12h.split(' ');

        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }

        return `${hours}:${minutes}`;
    }

    calculateTime() {
        //get values
        var valuestart = this.convertTime12to24(`${this.state.startTime} ${this.state.startAP}`);
        var valuestop = this.convertTime12to24(`${this.state.endTime} ${this.state.endAP}`);

        //create date format          
        var timeStart = new Date("01/01/2007 " + valuestart).getHours();
        var timeEnd = new Date("01/01/2007 " + valuestop).getHours();

        var hourDiff = timeEnd - timeStart;

        return hourDiff;

    }

    jobPost=async()=>{
        if(this.state.selectedState==="")
            this.setState({ selectedStateError:"block" });
        if(this.state.jobTitle==="")
            this.setState({ jobTitleError:"block" });
        if(this.state.description==="")
            this.setState({ descriptionError:"block" });
        if(this.state.contract !== "Permanent Position" && (this.state.duration=== "" || this.state.duration=== "0")){
            this.setState({ durationError:"block" });
        }
        if(this.state.medicalSetting === "" || this.state.medicalSetting === "Others"){
            this.setState({ medicalSettingValue:"block" });
        }
        if(!this.state.expStartDate){
            var error = this.state.error;
            error.dateStart = 'block';
            this.setState({error: error});
        }
        if(this.state.cost === "" || this.state.cost === "0") {
            this.setState({ costError: 'block'})
        }
        console.log(this.state.costError);
        if(this.state.openPositions=== "" || this.state.openPositions=== "0")
            this.setState({ openPositionsError:"block" });
        if(this.state.medicalSettingValue === "none" && this.state.costError === "none" && this.state.medicalSetting !== "" && this.state.selectedStateError==="none" && this.state.jobTitleError==="none" && this.state.descriptionError==="none" && this.state.durationError==="none" && this.state.error.dateStart==="none" && this.state.openPositionsError==="none"){
           this.setState({ showLoader : true })
            var data={
                healthCareLocation:this.state.selectedState,
                jobTitle:this.state.jobTitle,
                jobDescription:this.state.description,
                medicalSettings:this.state.medicalSetting,
                contractType:this.state.contract,
                timeCommitment: this.calculateTime() >= 8 ? "Full Time" : "Part Time",
                shiftStartTime: `${this.state.startTime} ${this.state.startAP}`,
                shiftEndTime: `${this.state.endTime} ${this.state.endAP}`,
                weekendAvailiblity:this.state.weekend,
                contractLength:{
                    duration:this.state.duration,
                    length:this.state.length
                },
                expectedStartDate:this.state.expStartDate,
                openPositions:this.state.openPositions,
                costPerHour: this.state.cost
            }
            console.log(data);
            console.log(localStorage.getItem('token'));
            var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
            var res = await callApi("PUT", `v1/LHS/job/update/${this.state.jobId}`, Authorization, data);
            if(res.data){
                this.setState({ showLoader : false })
                this.props.goBack();
            }
        }
    }

    render() {
        const {startTime} = this.state;
        const {endTime} = this.state;
        return (
            <div> 
                <p className="modalName PostLocation"> Healthcare Institution Location* </p>
                <div className="modalSelect">
                    <div className="ssu2_modal3_selectBox modalSelectBox" style={{textAlign:"center", lineHeight:"43px"}}>
                        <select className="locationSelect" name="option" onChange={this.handleState}>
                            <option value="" disabled > Select</option>
                            {
                                this.state.stateOfUs.map((state) => {
                                    return <option selected={this.state.selectedState === state.name} key={state.num} value={state._id}> {state.name} </option>
                                })
                            }
                        </select>
                    </div>
                </div>
                <ErrorState show={this.state.selectedStateError} name="Please Select Healthcare Institution Location." /> 
                <p className="modalName PostLocation" style={{marginTop: "40px"}}> Job title* </p>
                <div className="modalSelect">
                    <div className="ssu2_modal3_selectBox modalSelectBox">
                        <input 
                            className="theme2_header_search searchText" 
                            style={{paddingLeft:"10px"}} 
                            type="text"
                            value={this.state.jobTitle}
                            onChange={this.handleJobtitle}
                        />
                    </div>
                </div>
                <ErrorState show={this.state.jobTitleError} name="Please Insert Your Job Title." />
                <p className="modalName PostLocation" style={{marginTop: "40px"}}> Job Description and Key Result Areas? </p>
                <div className="reviewContent commit">
                    <textarea 
                        id="story" 
                        name="story" 
                        rows="5" cols="33"
                        value={this.state.description}
                        placeholder="Describe the responsibilities of this job, required work experience, skills, or education." 
                        onChange={this.handleDescription}
                    />
                </div>
                <ErrorState show={this.state.descriptionError} name="Please Insert Your Job Description and Key Result Areas." /> 
                <p className="modalName PostLocation" style={{marginTop: "40px"}}> What best describes the Medical Setting for this job? </p>
                <div className='row medicalSettings'>
                    <div className={this.state.medicalSetting === "Acute Care Hospitals" ? 'col-md-3 col-sm-3 col-12 settings background' : 'col-md-3 col-sm-3 col-12 settings'} onClick={() => this.handleSetting("Acute Care Hospitals")} >Acute Care Hospitals</div>
                    <div className={this.state.medicalSetting === "Urgent Care Centers" ? 'col-md-3 col-sm-3 col-12 settings background' : 'col-md-3 col-sm-3 col-12 settings'} onClick={() => this.handleSetting("Urgent Care Centers")} >Urgent Care Centers</div>
                    <div className={this.state.medicalSetting === "Rehabilitation Centers" ? 'col-md-3 col-sm-3 col-12 settings background' : 'col-md-3 col-sm-3 col-12 settings'} onClick={() => this.handleSetting("Rehabilitation Centers")} >Rehabilitation Centers</div>
                </div>
                <div className='row medicalSettings' style={{ marginTop: "30px" }}>
                    <div className={this.state.medicalSetting === "Nursing Homes" ? 'col-md-3 col-sm-3 col-12 settings background' : 'col-md-3 col-sm-3 col-12 settings'} onClick={() => this.handleSetting("Nursing Homes")} >Nursing Homes</div>
                    <div className={this.state.medicalSetting === "Other Long-term Care Facilities" ? 'col-md-3 col-sm-3 col-12 settings background' : 'col-md-3 col-sm-3 col-12 settings'} onClick={() => this.handleSetting("Other Long-term Care Facilities")} >Other Long-term Care Facilities</div>
                    <div className={this.state.medicalSetting === "Specialized Outpatient Services" ? 'col-md-3 col-sm-3 col-12 settings background' : 'col-md-3 col-sm-3 col-12 settings'} onClick={() => this.handleSetting("Specialized Outpatient Services")} >Specialized Outpatient Services</div>
                </div>
                <div className='row medicalSettings' style={{ marginTop: "30px" }}>
                    <div className={this.state.medicalSetting === "Specialized Outpatient Surgery Center" ? 'col-md-3 col-sm-3 col-12 settings background' : 'col-md-3 col-sm-3 col-12 settings'} onClick={() => this.handleSetting("Specialized Outpatient Surgery Center")} >Specialized Outpatient Surgery Center</div>
                    <div className={!AllMedicalSettings.includes(this.state.medicalSetting) ? 'col-md-3 col-sm-3 col-12 settings background' : 'col-md-3 col-sm-3 col-12 settings'} onClick={() => this.handleSetting("")} >Others</div>
                    <div className={this.state.medicalSetting === "" ? 'col-md-3 col-sm-3 col-12' : 'col-md-3 col-sm-3 col-12'} >
                        {!AllMedicalSettings.includes(this.state.medicalSetting) && <div className='col-12 setting'>
                            <input
                                style={{ border: 'none' }}
                                className=""
                                value={this.state.medicalSetting}
                                type="text"
                                placeholder='Others'
                                onChange={(e) => this.handleSetting(e.target.value)}
                            />
                        </div>}

                    </div>
                    {/* <div className={this.state.medicalSetting === "Med spa" ? 'col-md-3 col-sm-3 col-12 settings background' : 'col-md-3 col-sm-3 col-12 settings'} onClick={() => this.handleSetting("Med spa")} >Med spa</div>
                    <div className={this.state.medicalSetting === "Hospital" ? 'col-md-3 col-sm-3 col-12 settings background' : 'col-md-3 col-sm-3 col-12 settings'} onClick={() => this.handleSetting("Hospital")} >Hospital</div> */}
                </div>
                <div className="row m-0">
                    <div className="col-8"></div>
                    <div className="col-4 d-flex justify-content-center text-center p-0"><ErrorState show={this.state.medicalSettingValue} name="Others is required." /></div>
                </div>
                <p className="modalName PostLocation" style={{marginTop: "40px"}}> Please specify the contract type for this job? </p>
                <div className='row medicalSettings'>
                    <div className='col-md-5 col-sm-5 col-12 setting' onClick={()=>this.handleContract("Temporary Position")}>
                        {this.state.contract==="Temporary Position"?
                            <svg width="15" height="15" style={{marginRight:"10px", cursor:"pointer"}} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 7.5C10.86 7.5 7.5 10.86 7.5 15C7.5 19.14 10.86 22.5 15 22.5C19.14 22.5 22.5 19.14 22.5 15C22.5 10.86 19.14 7.5 15 7.5ZM15 0C6.72 0 0 6.72 0 15C0 23.28 6.72 30 15 30C23.28 30 30 23.28 30 15C30 6.72 23.28 0 15 0ZM15 27C8.37 27 3 21.63 3 15C3 8.37 8.37 3 15 3C21.63 3 27 8.37 27 15C27 21.63 21.63 27 15 27Z" fill="#009CDE"/>
                            </svg>
                            :
                            <svg width="15" height="15" style={{marginRight:"10px", cursor:"pointer"}} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 0C6.72 0 0 6.72 0 15C0 23.28 6.72 30 15 30C23.28 30 30 23.28 30 15C30 6.72 23.28 0 15 0ZM15 27C8.37 27 3 21.63 3 15C3 8.37 8.37 3 15 3C21.63 3 27 8.37 27 15C27 21.63 21.63 27 15 27Z" fill="#009CDE"/>
                            </svg>
                        }
                        Temporary Position
                    </div>
                    <div className='col-md-5 col-sm-5 col-12 setting' onClick={()=>this.handleContract("Permanent Position")}>
                        {this.state.contract==="Permanent Position"?
                            <svg width="15" height="15" style={{marginRight:"10px", cursor:"pointer"}} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 7.5C10.86 7.5 7.5 10.86 7.5 15C7.5 19.14 10.86 22.5 15 22.5C19.14 22.5 22.5 19.14 22.5 15C22.5 10.86 19.14 7.5 15 7.5ZM15 0C6.72 0 0 6.72 0 15C0 23.28 6.72 30 15 30C23.28 30 30 23.28 30 15C30 6.72 23.28 0 15 0ZM15 27C8.37 27 3 21.63 3 15C3 8.37 8.37 3 15 3C21.63 3 27 8.37 27 15C27 21.63 21.63 27 15 27Z" fill="#009CDE"/>
                            </svg>
                            :
                            <svg width="15" height="15" style={{marginRight:"10px", cursor:"pointer"}} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 0C6.72 0 0 6.72 0 15C0 23.28 6.72 30 15 30C23.28 30 30 23.28 30 15C30 6.72 23.28 0 15 0ZM15 27C8.37 27 3 21.63 3 15C3 8.37 8.37 3 15 3C21.63 3 27 8.37 27 15C27 21.63 21.63 27 15 27Z" fill="#009CDE"/>
                            </svg>
                        }
                        Permanent Position
                    </div>
                </div>
                {this.state.contract === "Temporary Position" && <>
                <p className="modalName PostLocation" style={{marginTop: "40px"}}> How much commitment is required from the staff per day? </p>
                <div className='row medicalSettings'>
                    <div className='col-md-5 timeDiv'>
                        <p className='timeText'>Shift Start Time</p>
                        <div className='time'>
                            <div>
                                <svg width="15" height="15" style={{marginTop:"13px", marginRight:"15px"}} viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M33.494 11.162H23.6722C23.5034 11.162 23.3652 11.3001 23.3652 11.4689V13.3105C23.3652 13.4793 23.5034 13.6174 23.6722 13.6174H33.494C33.6628 13.6174 33.8009 13.4793 33.8009 13.3105V11.4689C33.8009 11.3001 33.6628 11.162 33.494 11.162ZM28.3529 16.3798H23.6722C23.5034 16.3798 23.3652 16.5179 23.3652 16.6867V18.5283C23.3652 18.6972 23.5034 18.8353 23.6722 18.8353H28.3529C28.5217 18.8353 28.6598 18.6972 28.6598 18.5283V16.6867C28.6598 16.5179 28.5217 16.3798 28.3529 16.3798ZM15.55 7.72815H13.8887C13.6508 7.72815 13.459 7.91998 13.459 8.15786V17.6728C13.459 17.8109 13.5242 17.9375 13.6355 18.0181L19.3483 22.1847C19.5401 22.3228 19.8087 22.2844 19.9468 22.0926L20.9328 20.7459V20.7421C21.0709 20.5503 21.0287 20.2817 20.8369 20.1436L15.9758 16.6292V8.15786C15.9797 7.91998 15.784 7.72815 15.55 7.72815Z" fill="#333333"/>
                                    <path d="M28.1151 21.2102H25.8975C25.6826 21.2102 25.4793 21.3215 25.3642 21.5056C24.8769 22.2768 24.3091 22.9904 23.6569 23.6427C22.5327 24.7668 21.2244 25.6492 19.7703 26.2631C18.2625 26.9 16.6626 27.2223 15.0129 27.2223C13.3593 27.2223 11.7594 26.9 10.2554 26.2631C8.80132 25.6492 7.49302 24.7668 6.36888 23.6427C5.24474 22.5185 4.36231 21.2102 3.74844 19.7561C3.11156 18.2522 2.78928 16.6523 2.78928 14.9987C2.78928 13.3451 3.11156 11.749 3.74844 10.2412C4.36231 8.78712 5.24474 7.47882 6.36888 6.35468C7.49302 5.23054 8.80132 4.3481 10.2554 3.73424C11.7594 3.09735 13.3631 2.77507 15.0129 2.77507C16.6665 2.77507 18.2664 3.09735 19.7703 3.73424C21.2244 4.3481 22.5327 5.23054 23.6569 6.35468C24.3091 7.00691 24.8769 7.72053 25.3642 8.4917C25.4793 8.67585 25.6826 8.78712 25.8975 8.78712H28.1151C28.3798 8.78712 28.5486 8.51088 28.4297 8.27684C25.9282 3.3007 20.8561 0.0663935 15.1932 0.00117028C6.90217 -0.102419 0.0153728 6.68463 2.62113e-05 14.968C-0.0153204 23.2667 6.71034 30 15.009 30C20.7448 30 25.9013 26.7542 28.4297 21.7205C28.5486 21.4865 28.3759 21.2102 28.1151 21.2102Z" fill="#333333"/>
                                </svg>
                                <TimeField value={startTime} onChange={this.onTimeChange1} style={{width: "52px",position: "relative",top: "8px",border: "0px"}} />
                            </div>
                            <select className="AM" name="option" value={this.state.startAP} onChange={this.handleStartAP}>
                                <option value="AM" selected > AM </option>
                                <option value="PM" > PM </option>
                            </select>
                        </div>
                    </div>
                    <div className='col-md-5 timeDiv'>
                        <p className='timeText'>Shift End Time</p>
                        <div className='time'>
                            <div>
                                <svg width="15" height="15" style={{marginTop:"13px", marginRight:"15px"}} viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M33.494 11.162H23.6722C23.5034 11.162 23.3652 11.3001 23.3652 11.4689V13.3105C23.3652 13.4793 23.5034 13.6174 23.6722 13.6174H33.494C33.6628 13.6174 33.8009 13.4793 33.8009 13.3105V11.4689C33.8009 11.3001 33.6628 11.162 33.494 11.162ZM28.3529 16.3798H23.6722C23.5034 16.3798 23.3652 16.5179 23.3652 16.6867V18.5283C23.3652 18.6972 23.5034 18.8353 23.6722 18.8353H28.3529C28.5217 18.8353 28.6598 18.6972 28.6598 18.5283V16.6867C28.6598 16.5179 28.5217 16.3798 28.3529 16.3798ZM15.55 7.72815H13.8887C13.6508 7.72815 13.459 7.91998 13.459 8.15786V17.6728C13.459 17.8109 13.5242 17.9375 13.6355 18.0181L19.3483 22.1847C19.5401 22.3228 19.8087 22.2844 19.9468 22.0926L20.9328 20.7459V20.7421C21.0709 20.5503 21.0287 20.2817 20.8369 20.1436L15.9758 16.6292V8.15786C15.9797 7.91998 15.784 7.72815 15.55 7.72815Z" fill="#333333"/>
                                    <path d="M28.1151 21.2102H25.8975C25.6826 21.2102 25.4793 21.3215 25.3642 21.5056C24.8769 22.2768 24.3091 22.9904 23.6569 23.6427C22.5327 24.7668 21.2244 25.6492 19.7703 26.2631C18.2625 26.9 16.6626 27.2223 15.0129 27.2223C13.3593 27.2223 11.7594 26.9 10.2554 26.2631C8.80132 25.6492 7.49302 24.7668 6.36888 23.6427C5.24474 22.5185 4.36231 21.2102 3.74844 19.7561C3.11156 18.2522 2.78928 16.6523 2.78928 14.9987C2.78928 13.3451 3.11156 11.749 3.74844 10.2412C4.36231 8.78712 5.24474 7.47882 6.36888 6.35468C7.49302 5.23054 8.80132 4.3481 10.2554 3.73424C11.7594 3.09735 13.3631 2.77507 15.0129 2.77507C16.6665 2.77507 18.2664 3.09735 19.7703 3.73424C21.2244 4.3481 22.5327 5.23054 23.6569 6.35468C24.3091 7.00691 24.8769 7.72053 25.3642 8.4917C25.4793 8.67585 25.6826 8.78712 25.8975 8.78712H28.1151C28.3798 8.78712 28.5486 8.51088 28.4297 8.27684C25.9282 3.3007 20.8561 0.0663935 15.1932 0.00117028C6.90217 -0.102419 0.0153728 6.68463 2.62113e-05 14.968C-0.0153204 23.2667 6.71034 30 15.009 30C20.7448 30 25.9013 26.7542 28.4297 21.7205C28.5486 21.4865 28.3759 21.2102 28.1151 21.2102Z" fill="#333333"/>
                                </svg>
                                <TimeField value={endTime} onChange={this.onTimeChange2} style={{width: "52px",position: "relative",top: "8px",border: "0px"}} />
                            </div>
                            <select className="PM" name="option" value={this.state.endAP} onChange={this.handleEndAP}>
                                <option value="AM" > AM </option>
                                <option value="PM" selected > PM </option>
                            </select>
                        </div>
                    </div>
                </div>
                <p className="modalName PostLocation" style={{marginTop: "40px"}}> Is weekend availability required from the staff? </p>
                <div className='row medicalSettings'>
                    <div className='col-md-5 col-sm-5 col-12 setting' onClick={()=>this.handleWeekend(true)}>
                        {this.state.weekend===true?
                            <svg width="15" height="15" style={{marginRight:"10px", cursor:"pointer"}} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 7.5C10.86 7.5 7.5 10.86 7.5 15C7.5 19.14 10.86 22.5 15 22.5C19.14 22.5 22.5 19.14 22.5 15C22.5 10.86 19.14 7.5 15 7.5ZM15 0C6.72 0 0 6.72 0 15C0 23.28 6.72 30 15 30C23.28 30 30 23.28 30 15C30 6.72 23.28 0 15 0ZM15 27C8.37 27 3 21.63 3 15C3 8.37 8.37 3 15 3C21.63 3 27 8.37 27 15C27 21.63 21.63 27 15 27Z" fill="#009CDE"/>
                            </svg>
                            :
                            <svg width="15" height="15" style={{marginRight:"10px", cursor:"pointer"}} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 0C6.72 0 0 6.72 0 15C0 23.28 6.72 30 15 30C23.28 30 30 23.28 30 15C30 6.72 23.28 0 15 0ZM15 27C8.37 27 3 21.63 3 15C3 8.37 8.37 3 15 3C21.63 3 27 8.37 27 15C27 21.63 21.63 27 15 27Z" fill="#009CDE"/>
                            </svg>
                        }
                        Yes
                    </div>
                    <div className='col-md-5 col-sm-5 col-12 setting' onClick={()=>this.handleWeekend(false)}>
                        {this.state.weekend===false?
                            <svg width="15" height="15" style={{marginRight:"10px", cursor:"pointer"}} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 7.5C10.86 7.5 7.5 10.86 7.5 15C7.5 19.14 10.86 22.5 15 22.5C19.14 22.5 22.5 19.14 22.5 15C22.5 10.86 19.14 7.5 15 7.5ZM15 0C6.72 0 0 6.72 0 15C0 23.28 6.72 30 15 30C23.28 30 30 23.28 30 15C30 6.72 23.28 0 15 0ZM15 27C8.37 27 3 21.63 3 15C3 8.37 8.37 3 15 3C21.63 3 27 8.37 27 15C27 21.63 21.63 27 15 27Z" fill="#009CDE"/>
                            </svg>
                            :
                            <svg width="15" height="15" style={{marginRight:"10px", cursor:"pointer"}} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 0C6.72 0 0 6.72 0 15C0 23.28 6.72 30 15 30C23.28 30 30 23.28 30 15C30 6.72 23.28 0 15 0ZM15 27C8.37 27 3 21.63 3 15C3 8.37 8.37 3 15 3C21.63 3 27 8.37 27 15C27 21.63 21.63 27 15 27Z" fill="#009CDE"/>
                            </svg>
                        }
                        No
                    </div>
                </div>
                <p className="modalName PostLocation" style={{marginTop: "40px"}}> Contract Length* </p>
                <div className='row medicalSettings'>
                    <div className='col-md-5 col-sm-5 col-12 setting'>
                        <input 
                            className="theme2_header_search" 
                            placeholder='0' type="number"
                            value={this.state.duration}
                            onChange={this.handleContractLength}
                        />
                    </div>
                    <div className='col-md-5 col-sm-5 col-12 setting'>
                        <select className="days" name="option" onChange={this.handleLength}>
                            <option value="" selected > Day(s)</option>
                            {/* <option value="" > Select a state</option>
                            <option value="" > Select a state</option> */}
                        </select>
                    </div>
                </div>
                <ErrorState show={this.state.durationError} name={this.state.duration === "" ? "Please Insert Contract Length." : "Contract length should not be zero."} />
                <p className="modalName PostLocation" style={{marginTop: "40px"}}> Cost Per Hour* </p>
                <div className="modalSelect">
                    <div className="ssu2_modal3_selectBox modalSelectBox">
                        <input 
                            className="theme2_header_search searchText" 
                            style={{paddingLeft:"10px"}} 
                            placeholder='$' 
                            type="number"
                            value={this.state.cost}
                            onChange={this.handleCostPerHour}
                        />
                    </div>
                </div>
                <ErrorState show={this.state.costError} name={this.state.cost === "" ? "Please Add cost per hour" : "Cost Per Hour can't be zero"} />

                </>}
               
                <p className="modalName PostLocation" style={{marginTop: "40px"}}> Expected Start Date* </p>
                <div className="col-md-12 modalCalLeft MRDIV" style={{paddingRight:"0px"}}>
                    <div className="ssu2_modal3_selectBox modalCalLeft">
                        <div className="input_left_icon"  onClick={()=>$(".endDate").focus()}>
                            <img width="22px" height="17px" alt="img"src={calendar}/>
                        </div>
                        <DatePicker
                            className="ssu2_modal3_date startDate"
                            selected={this.state.expStartDate}
                            minDate={new Date()}
                            onChange={(date) => this.setExpStartDate(date)}
                            placeholderText={'Select Start Date'}
                        />
                    </div>
                    <ErrorState show={this.state.error.dateStart} name="Start Date is required." />
                </div>
                <p className="modalName PostLocation" style={{marginTop: "40px"}}> How many hires do you want to make for this position?* </p>
                <div className="modalSelect">
                    <div className="ssu2_modal3_selectBox modalSelectBox">
                        <input 
                            className="theme2_header_search searchText" 
                            style={{paddingLeft:"10px"}} 
                            placeholder='Select' 
                            type="number"
                            value={this.state.openPositions}
                            onChange={this.handleOpenPositions}
                        />
                    </div>
                </div>
                <ErrorState show={this.state.openPositionsError} name={this.state.openPositions === "" ? "Please Insert Open Positions." : "Open positions should not be zero."} />
                <div className="row" style={{marginTop: "40px"}}>
                    <div className="col-md-3"></div>
                    <div className="col-md-3 modalBTNCHL" onClick={this.jobPost}>
                  {this.state.showLoader ? <Loader /> :       "Submit"}
                    </div>
                    <div className="col-md-3 modalBTNCHR JobCancel" onClick={this.props.goBack}>
                        Cancel
                    </div>
                    <div className="col-md-3"></div>
                </div>
            </div>
        )
    }
}

export default JobEdit