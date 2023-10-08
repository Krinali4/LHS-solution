import React from 'react';
import { connect } from 'react-redux';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import user from '../../assets/images/user.svg';
import email from '../../assets/images/email.svg';
import phone from '../../assets/images/phone.svg';
import key from '../../assets/images/key.svg';
import calendar from '../../assets/images/calendar.png';
import ErrorState from "./components/errorState";
import FileBrowser from "./components/fileBrowser";
import SubHeader from './components/subHeader';
import img from '../../assets/images/4-5.png';
import { SAVE_CONTACT_DETAILS, SET_PAGE_VISITED } from '../../../constants/actionTypes';
import { callApi } from '../../../action';
import './staffSignUp_3.css';
import $ from 'jquery';
import { agreementData } from "../../../constants/otherConstans"
import { Spinner } from 'react-bootstrap';
import moment from 'moment'

const mapStateToProps = state => {
    return {
        redo: state.staffSignUp.pageVisited,
        contactDetails: state.staffSignUp.contactDetails,
    }
};

const mapDispatchToProps = dispatch => ({
    setContactDetails: (data) => dispatch({ type: SAVE_CONTACT_DETAILS, data }),
    setPageVisited: (data) => dispatch({ type: SET_PAGE_VISITED, data }),
});

class StaffSignUp_3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redo: [],
            fullName: '',
            dob: '',
            email: '',
            phone: '',
            psw: '',
            repsw: '',
            ssn: '',
            ssnTitleErr: 'The SSN number is required',
            file: false,
            fileAdded: false,
            error: {
                fullName: 'none',
                dob: "none",
                email: 'none',
                phone: 'none',
                psw: 'none',
                repsw: 'none',
                jobTitle: 'none',
                file: 'none',
                ssn: 'none'
            },
            fname: '',
            delFile: false,
            jobTitle: "",
            jobTitleErr: "Job Title is required",
            pswErr: 'Password is required',
            emailErr: 'Valid email address is required.',
            showLoader: false
        }
    }

    componentWillMount = () => {
        // if (!this.props.redo[2]) {
        //     this.props.history.push('/staffSignUp');
        // } else {
        //     window.scrollTo({ top: 0, behavior: 'smooth' });
        //     this.setState(this.props.contactDetails); console.log(this.props.contactDetails);
        //     this.setState({ repsw: this.props.contactDetails.psw });
        // }
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps.contactDetails);
    }

    togglePassword = (id) => {
        let input = $("#" + id);
        if (input.attr("type") === "password") {
            input.attr("type", "text");
            $("#c_" + id).hide();
            $("#o_" + id).show();
        } else {
            input.attr("type", "password");
            $("#o_" + id).hide();
            $("#c_" + id).show();
        }
    }

    setName = (e) => {
        if (e.target.value.length < 51) {
            this.setState({ fullName: e.target.value });
            if (e.target.value !== '') {
                var error = this.state.error;
                error.fullName = 'none';
                this.setState({ error: error });
            }
        }
    }
    setDOB = (e) => {
        console.log(e.target.value);
        if (e.target.value.length < 11) {
            this.setState({ dob: e.target.value });
            if (e.target.value !== '') {
                var error = this.state.error;
                error.dob = 'none';
                this.setState({ error: error });
            }
        }
    }
    setEmail = (e) => {
        if (e.target.value.length < 51) {
            this.setState({ email: e.target.value, emailErr: 'Valid email address is required.' });
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var valid = re.test(String(e.target.value).toLowerCase());
            var error = this.state.error;
            if (e.target.value !== '' && valid) {
                error.email = 'none';
                this.setState({ error: error });
            } else {
                error.email = 'block';
                this.setState({ error: error });
            }
        }
    }

    setJobTitle = (e) => {
        var error = this.state.error;
        this.setState({ jobTitle: e.target.value });
        if (e.target.value !== '') {
            error.jobTitle = 'none';
            this.setState({ error: error });
        } else {
            error.jobTitle = 'block';
            this.setState({ error: error });
        }
    }

    setSsn = async (e) => {
        var error = this.state.error;
        this.setState({ ssn: e.target.value });
        if (e.target.value !== '') {
            error.ssn = 'none';
            this.setState({ error: error });
        } else {
            error.ssn = 'block';
            this.setState({ error: error });
        }
        var res = await callApi("GET", `v1/LHS/staff/ssn/${e.target.value}`, null);
        if (res.status === 500) {
            var error = this.state.error;
            error.ssn = 'block';
            this.setState({ error: error, ssnTitleErr: "SSN Number already present" });
        }
        else {
            var error = this.state.error;
            error.ssn = 'none';
            this.setState({ error: error, ssnTitleErr: "The SSN number is required" });
        }
    }

    setPhone = (e) => {
        if (e.target.value.length < 11) {
            this.setState({ phone: e.target.value });
            var validate;
            if (e.target.value.match(/\d/g))
                if (e.target.value.match(/\d/g).length === 10)
                    validate = true;
                else
                    validate = false;
            else
                validate = false;

            var error = this.state.error;
            if (e.target.value !== '' && validate) {
                error.phone = 'none';
                this.setState({ error: error });
            } else {
                error.phone = 'block';
                this.setState({ error: error });
            }
        }
        // else {
        //     error = this.state.error;
        //     error.phone = 'block';
        //     this.setState({error: error});
        // }
    }

    formatInput = (e) => {
        // Prevent characters that are not numbers ("e", ".", "+" & "-") âœ¨
        let checkIfNum;
        if (e.key !== undefined) {
            // Check if it's a "e", ".", "+" or "-"
            checkIfNum = e.key === "e" || e.key === "." || e.key === "+" || e.key === "-";
        }
        else if (e.keyCode !== undefined) {
            // Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
            checkIfNum = e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189;
        }
        return checkIfNum && e.preventDefault();
    }

    setPsw = (e) => {
        this.setState({ psw: e.target.value });
        var password = e.target.value;
        var error = this.state.error;
        // Do not show anything when the length of password is zero.
        if (password.length === 0) {
            this.setState({ pswErr: 'Password is required.' });
            error.psw = 'block';
            this.setState({ error: error });
            return;
        } else {
            if (password.length < 6) {
                this.setState({ pswErr: 'Password should have minimum 6 characters, 1 upper case,  1 lower case, 1 special character and 1 number.' });
                error.psw = 'block';
                this.setState({ error: error });
            } else {
                // Create an array and push all possible values that you want in password
                var mached = [];
                mached.push("[$@$!%*#?&]"); // Special Charector
                mached.push("[A-Z]");      // Uppercase Alpabates
                mached.push("[0-9]");      // Numbers
                mached.push("[a-z]");     // Lowercase Alphabates

                // Check the conditions
                var ctr = 0;
                for (var i = 0; i < mached.length; i++) {
                    if (new RegExp(mached[i]).test(password)) {
                        ctr++;
                    }
                }
                // Display it
                switch (ctr) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        this.setState({ pswErr: 'Password should have minimum 6 characters, 1 upper case,  1 lower case, 1 special character and 1 number.' });
                        error.psw = 'block';
                        this.setState({ error: error });
                        break;
                    case 4:
                        error.psw = 'none';
                        this.setState({ error: error });
                        break;
                    default:
                        return;
                }
            }
            if (this.state.repsw !== "") {
                var val = this.state.repsw === e.target.value;
                error = this.state.error;
                if (val) {
                    error.repsw = 'none';
                    this.setState({ error: error });
                } else {
                    error.repsw = 'block';
                    this.setState({ error: error });
                }
            }
        }
    }

    setRepsw = (e) => {
        var validate = this.state.psw === e.target.value;
        this.setState({ repsw: e.target.value });
        var error = this.state.error;
        if (e.target.value !== '' && validate) {
            error.repsw = 'none';
            this.setState({ error: error });
        } else if (e.target.value === "" && this.state.psw === "") {
            error.repsw = 'none';
            this.setState({ error: error });
        } else {
            error.repsw = 'block';
            this.setState({ error: error });
        }
    }

    setDelFile = (del) => {
        this.setState({ delFile: del, file: false });
        if (del && this.state.error.file === 'block')
            this.hideFileErr();
    }

    setFile = (file) => {
        this.uploadFileFunc(file);
        this.setState({ file: file, fname: file.name });
    }

    uploadFileFunc = async (file) => {
        this.setState({
            showLoader: true
        })
        const data = {
            file: file,
            name: "resume"
        }
        var res1 = await callApi("POST", "v1/LHS/file/upload", null, data, true);
        alert(res1.Message);
        this.setState({ file: res1.upload.upload.link, showLoader: false });
    }

    showFileErr = () => {
        var err = this.state.error;
        err.file = "block";
        this.setState({ error: err });
    }
    hideFileErr = () => {
        var err = this.state.error;
        err.file = "none";
        this.setState({ error: err });
    }

    goToNexts = () => {
        // this.props.setContactDetails({
        //     fullName: this.state.fullName,
        //     email: this.state.email,
        //     phone: this.state.phone,
        //     psw: this.state.psw,
        //     file: this.state.file,
        //     resume: this.state.file,
        //     jobTitle: this.state.jobTitle,
        //     ssn: this.state.ssn,
        //     dob: this.state.dob
        // });
        // var redo = this.props.redo;
        // redo[3] = true;
        // this.props.setPageVisited(redo);

        this.props.history.push('/staffSignUp_4');
    }
    preventNumberInput = (e) => {
        var keyCode = (e.keyCode ? e.keyCode : e.which);
        if (((keyCode > 47 && keyCode) < 58 || (keyCode > 95 && keyCode < 107)) && keyCode !== 8 && keyCode !== 9 && keyCode !== 32) {
            e.preventDefault();
        }
    }

    emailRepeatCheck = async () => {
        var data = {
            email: this.state.email
        }

        var res1 = await callApi("POST", "v1/LHS/hospital/emailCheck", null, data);
        var res2 = await callApi("POST", "v1/LHS/staff/emailCheck", null, data);
        var res3 = await callApi("POST", "v1/LHS/admin/emailCheck", null, data);
        if (res1.result === 'OK' && res2.result === 'OK' && res3.result === 'OK') {
            const data = {
                agreement: agreementData(this.state.fullName)
            }
            let uploadAgreement = await callApi("POST", "agreement/save", null, data);
            this.goToNexts();
            // this.props.history.push('/staffSignUp_4');
        } else {
            this.setState({ emailErr: 'This Email address is already in use.' });
            var err = this.state.error;
            err.email = "block";
            this.setState({ error: err });
        }
    }

    componentDidMount() {
        const staffSignUpData = JSON.parse(localStorage.getItem('staffSignUpData'));
        if (staffSignUpData) {
          this.setState({ ...staffSignUpData });
        }
      }

    continueToNext = () => {
        console.log(this.state.dob);
        console.log(this.state.dob.slice(5, 7), 'month');
        console.log(this.state.dob.slice(8, 10), 'day');
        console.log(this.state.dob.slice(0, 4), 'year');
        var state = this.state;
        var fullName = state.error.fullName === 'block' || state.fullName === '' ? 'block' : 'none';
        var email = state.error.email === 'block' || state.email === '' ? 'block' : 'none';
        var phone = state.error.phone === 'block' || state.phone === '' ? 'block' : 'none';
        var psw = state.error.psw === 'block' || state.psw === '' ? 'block' : 'none';
        var repsw = state.error.repsw === 'block' || state.repsw === '' ? 'block' : 'none';
        var file = state.error.file === 'block' || state.file === false ? 'block' : 'none';
        var jobTitle = state.error.jobTitle === 'block' || state.jobTitle === "" ? 'block' : 'none';
        var ssn = state.error.ssn === 'block' || state.ssn === "" ? 'block' : 'none';
        var dob = state.error.dob === 'block' || state.dob === "" ? 'block' : 'none';

        if (psw === '') {
            this.setState({ pswErr: 'Password is required' });
        }

        var error = {
            fullName: fullName,
            email: email,
            phone: phone,
            psw: psw,
            repsw: repsw,
            file: file,
            jobTitle: jobTitle,
            ssn: ssn,
            dob: dob
        };
        this.setState({
            fullName: '',
            dob: '',
            email: '',
            phone: '',
            psw: '',
            repsw: '',
            ssn: '',
            jobTitle: '',
            file: false,
        });
        localStorage.setItem('staffSignUpData', JSON.stringify(this.state));
        // localStorage.removeItem('staffSignUpData');
        this.setState({ error: { ...error } });
        this.props.history.push('/staffSignUp_4');
        // this.setState({delFile: false});

        if (fullName === 'none' && dob === 'none' && email === 'none' && phone === 'none' && psw === 'none' && repsw === 'none' && file === 'none' && jobTitle === 'none' && ssn === 'none') {
            this.emailRepeatCheck();
            // this.props.history.push('/staffSignUp_4');
        }else {
            this.props.history.push('/staffSignUp_4');
           
          }

    }
    saveDataToLocalStorage = () => {
        const { fullName, dob, email, phone, psw, repsw, ssn, jobTitle, file } = this.state;
        const staffSignUpData = {
            fullName,
            dob,
            email,
            phone,
            psw,
            repsw,
            ssn,
            jobTitle,
            file,
        };
        localStorage.setItem('staffSignUpData', JSON.stringify(staffSignUpData));
    }
    dateFocus = (e) => {
        e.currentTarget.type = "date";
        e.currentTarget.placeholder = "Date Of Birth";
    }
    dateBlur = (e) => {
        e.currentTarget.type = "text";
        e.currentTarget.placeholder = "Date Of Birth";
        e.currentTarget.value = moment(this.state.dob).format('MM-DD-YYYY');
    }

    render() {
        return (
            <div className="outer_container" style={{ backgroundColor: '#009CDE' }}>
                <div className="main_container" style={{ padding: '30px 0px 120px' }}>
                    <div className="ssu_container">
                        <SubHeader num="4" title="Contact Information" 
                            next="/staffSignUp_4" prev="/staffSignUp_2"
                            history={this.props.history} img={img} />
                        <div className="ssu3_body" style={{ maxWidth: 800 }}>
                            <div className="ssu_txt1">
                                Please provide your contact details
                            </div>
                            <div className="ssu2_modal1_input" style={{ marginTop: 60 }}>
                                <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                    <div className="input_left_icon">
                                        <img width="18px" height="15px" alt="img" src={user} />
                                    </div>
                                    <input className="ssu2_modal3_select" placeholder="Full Name" type="text" value={this.state.fullName} onChange={this.setName}
                                        onKeyDown={this.preventNumberInput} onKeyUp={(e) => { if (e.key === 'Enter') this.continueToNext() }} />
                                </div>
                                <ErrorState show={this.state.error.fullName} name="Full Name is required." />
                            </div>
                            <div className="ssu2_modal1_input">
                                <div className="ssu2_modal1_input ssu2_modal3_selectBox" style={{ marginTop: '30px' }}>
                                    <div className="input_left_icon">
                                        <img width="18px" height="15px" alt="img" src={calendar} />
                                    </div>
                                    <input className="ssu2_modal3_select" placeholder="DOB" type="text" max={new Date().toISOString().split("T")[0]} value={this.state.dob} onChange={this.setDOB} onKeyDown={this.formatInput}
                                        onFocus={this.dateFocus} onBlur={this.dateBlur}
                                        onKeyUp={(e) => { if (e.key === 'Enter') this.continueToNext() }} />
                                </div>
                                <ErrorState show={this.state.error.dob} name="DOB is required." />
                            </div>
                            <div className="ssu2_modal1_input">
                                <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                    <div className="input_left_icon">
                                        <img width="18px" height="15px" alt="img" src={email} />
                                    </div>
                                    <input className="ssu2_modal3_select" placeholder="Email Address" type="text" value={this.state.email} onChange={this.setEmail}
                                        onKeyUp={(e) => { if (e.key === 'Enter') this.continueToNext() }} />
                                </div>
                                <ErrorState show={this.state.error.email} name={this.state.emailErr} />
                            </div>
                            <div className="ssu2_modal1_input">
                                <div className="ssu2_modal1_input ssu2_modal3_selectBox" style={{ marginTop: '30px' }}>
                                    <div className="input_left_icon">
                                        <img width="18px" height="15px" alt="img" src={phone} />
                                    </div>
                                    <input className="ssu2_modal3_select" placeholder="Phone Number" type="number" min="1" max="9999999999" value={this.state.phone} onChange={this.setPhone} onKeyDown={this.formatInput}
                                        onKeyUp={(e) => { if (e.key === 'Enter') this.continueToNext() }} />
                                </div>
                                <ErrorState show={this.state.error.phone} name="10 digits phone number is required." />
                            </div>
                            <div className="ssu2_modal1_input">
                                <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                    <div className="input_left_icon">
                                        <img width="18px" height="15px" alt="img" src={key} />
                                    </div>
                                    <input id="psw" className="ssu3_password" placeholder="Password" type="password" value={this.state.psw} onChange={this.setPsw}
                                        onKeyUp={(e) => { if (e.key === 'Enter') this.continueToNext() }} />
                                    <div className="ssu3_eye" onMouseDown={() => this.togglePassword('psw')} onMouseUp={() => this.togglePassword('psw')}
                                        onTouchStart={() => this.togglePassword('psw')} onTouchEnd={() => this.togglePassword('psw')} >
                                        <VisibilityOffIcon id="c_psw" style={{ display: 'block' }} />
                                        <VisibilityIcon id="o_psw" style={{ display: 'none' }} />
                                    </div>
                                </div>
                                <ErrorState show={this.state.error.psw} name={this.state.pswErr} />
                            </div>
                            <div className="ssu2_modal1_input">
                                <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                    <div className="input_left_icon">
                                        <img width="18px" height="15px" alt="img" src={key} />
                                    </div>
                                    <input id="rpsw" className="ssu3_password" placeholder="Confirm password" type="password" value={this.state.repsw} onChange={this.setRepsw}
                                        onKeyUp={(e) => { if (e.key === 'Enter') this.continueToNext() }} />
                                    <div className="ssu3_eye" onMouseDown={() => this.togglePassword('rpsw')} onMouseUp={() => this.togglePassword('rpsw')}
                                        onTouchStart={() => this.togglePassword('rpsw')} onTouchEnd={() => this.togglePassword('rpsw')}>
                                        <VisibilityOffIcon id="c_rpsw" style={{ display: 'block' }} />
                                        <VisibilityIcon id="o_rpsw" style={{ display: 'none' }} />
                                    </div>
                                </div>
                                <ErrorState show={this.state.error.repsw} name="Doesn't match with the password." />
                            </div>

                            <div className="ssu2_modal1_input">
                                <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                    <div className="input_left_icon">
                                        <img width="18px" height="15px" alt="img" src={email} />
                                    </div>
                                    <input className="ssu2_modal3_select" placeholder="Job Title" type="text" value={this.state.jobTitle} onChange={this.setJobTitle}
                                        onKeyUp={(e) => { if (e.key === 'Enter') this.continueToNext() }} />
                                </div>
                                <ErrorState show={this.state.error.jobTitle} name={this.state.jobTitleErr} />
                            </div>

                            <div className="ssu2_modal1_input">
                                <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                    <div className="input_left_icon">
                                        <img width="18px" height="15px" alt="img" src={email} />
                                    </div>
                                    <input className="ssu2_modal3_select" placeholder="SSN Number" type="password" value={this.state.ssn} onChange={this.setSsn}
                                        onKeyUp={(e) => { if (e.key === 'Enter') this.continueToNext() }} />
                                </div>
                                <ErrorState show={this.state.error.ssn} name={this.state.ssnTitleErr} />
                                <div className="ssu2_modal1_text2">
                                    Note :- SSN is required for payments.
                                </div>
                            </div>

                            <div className="ssu2_modal1_text2" style={{ marginTop: '60px' }}>
                                Please upload your resume
                            </div>
                            <div className="ssu2_modal1_input">
                                <FileBrowser setFile={this.setFile} validateImage={false} showFileErr={this.showFileErr}
                                    hideFileErr={this.hideFileErr} file={this.state.fileAdded} setDelFile={this.setDelFile} title="RESUME" accept=".pdf, .docx" />
                                <ErrorState show={this.state.error.file} name="The PDF, DOCX file is required." />
                            </div>
                        </div>
                        <div className="ssu2_modal1_text2">
                            Please upload only pdf, docx files
                        </div>
                        <hr style={{ margin: '72px 0px 0px' }} />
                        <div className="ssu_bottom">
                            <div className="ssu_button d-flex align-items-center justify-content-center p-0" onClick={this.continueToNext}>
                                {this.state.showLoader ? <Spinner animation="border" /> : "CONTINUE"}
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default StaffSignUp_3;
