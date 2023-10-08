import React from 'react';
import { connect } from 'react-redux';
import SubHeader from './components/subHeader';
import img from '../../assets/images/5-5.png';
import './staffSignUp_4.css';
import { SET_PAGE_VISITED, INIT_STATE } from '../../../constants/actionTypes';
import { callApi } from '../../../action';
import ErrorState from './components/errorState';
import Pending from '../../modals/pending';
import { CometChat } from "@cometchat-pro/chat";
import moment from 'moment'


const mapStateToProps = state => {
    return {
        redo: state.staffSignUp.pageVisited,
        jobType: state.staffSignUp.jobType,
        curCity: state.staffSignUp.curCity,
        nearCity: state.staffSignUp.nearCity,
        nurseLicences: state.staffSignUp.nurseLicence,
        insurance: state.staffSignUp.insurance,
        degree: state.staffSignUp.degree,
        certs: state.staffSignUp.cert,
        experiences: state.staffSignUp.selectedExp,
        contactDetails: state.staffSignUp.contactDetails
    }
};

const mapDispatchToProps = dispatch => ({
    setPageVisited: (data) => dispatch({ type: SET_PAGE_VISITED, data }),
    initState: () => dispatch({ type: INIT_STATE })
});

class StaffSignUp_4 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redo: [],
            userName: 'Olivia',
            agreement: false,
            error: false,
            showAlert: 'none',
            showPending: 'none',
            mm: '',
            yy: '',
            dd: '',
            month: '',
            date: '',
            after_date: 'th',
            agreementData: ''
        }
    }
    componentWillReceiveProps(newProps) {
        let fullname = newProps.contactDetails.fullName;
        let name = fullname.split(' ')[0];
        this.setState({ userName: name });
    }

    componentWillMount = async () => {
        console.log(this.props.contactDetails, 'contact detailsssssssss');
        // if (!this.props.redo[3]) {
            this.props.history.push('/staffSignUp')
        // } else {
        //     window.scrollTo({ top: 0, behavior: 'smooth' });
        //     let fullname = this.props.contactDetails.fullName;
        //     let name = fullname.split(' ')[0];
        //     this.setState({ userName: name });
        //     var redo = this.props.redo;
        //     redo[4] = true;
        //     this.props.setPageVisited(redo);
        //     var date = new Date();
        //     const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        //     var dat = date.getDate();
        //     var after_date = 'th';
        //     if (dat === 1 || dat === 21 || dat === 31) {
        //         after_date = 'st';
        //     } else if (dat === 2 || dat === 22) {
        //         after_date = 'nd';
        //     }
        //     var mm = date.getMonth() + 1;
        //     var month = months[mm - 1];
        //     var yy = date.getFullYear();
        //     var dd = dat < 10 ? '0' + dat : dat;
        //     mm = mm < 10 ? '0' + mm : mm;
        //     this.setState({ yy: yy, dd: dd, mm: mm, month: month, date: dat, after_date: after_date });
        // }
    }

    componentDidMount() {
        this.getAgreementFunc();
    }

    getAgreementFunc = async () => {
        const getAgreementData = await callApi("GET", "v1/LHS/agreement/get");
        this.setState({
            agreementData: getAgreementData?.data[0]?.agreement
        })
        console.log(getAgreementData?.data[0]?.agreement);
    }

    setAgreement = (e) => {
        this.setState({ agreement: e.target.checked, showAlert: 'none' });
    }

    finishSignUp = async () => {
        if (this.state.agreement) {
            this.setState({ showPending: 'block' });
            var props1 = this.props;
            // var file = { file: props.contactDetails.file };
            // console.log(file);
            // var res = await callApi('POST', 'v1/LHS/file/upload', null, file, true);
            // console.log(res);
            // var resume = res.upload.upload.link + "";
            let startWorkdate = "";
            if (props1.jobType.startDate) {
                let d = new Date(props.jobType.startDate);
                let date = `${d.getFullYear()}-${(d.getMonth() + 1)}-${d.getDate()}`;
                startWorkdate = date;
            }
            var natureOfJob = [];
            if (props1.jobType.permanentPos)
                natureOfJob.push("Permanent Position");
            if (props1.jobType.tempPos)
                natureOfJob.push("Temporary Position");

            var workSchedule = [];
            if (props1.jobType.fullTime)
                workSchedule.push("Full Time");
            if (props1.jobType.partTime)
                workSchedule.push("Part Time");

            var otherCities = [];
            for (var i = 0; i < props1.nearCity.length; i++)
                otherCities.push({
                    name: props1.nearCity[i].name,
                    state: props1.nearCity[i].state,
                    zipCode: props1.nearCity[i].zipCode
                });

            var nursingLicences = []; console.log(props1.nurseLicences);
            for (var key in props1.nurseLicences) {
                if (props1.nurseLicences[key].licences.length) {
                    nursingLicences.push({
                        name: props1.nurseLicences[key].licences[0].name,
                        state: key,
                        number: props1.nurseLicences[key].licences[0].number,
                        expirationDate: moment( props1.nurseLicences[key].licences[0].expDate).add(1,'d'),
                        image: props1.nurseLicences[key].licences[0].image
                    });
                }
            }

            var certifications = [];
            for (i = 0; i < props1.certs.length; i++)
                certifications.push({
                    name: props1.certs[i].cert,
                    certifyingAuthority: props1.certs[i].auth,
                    receivedOn: moment( props1.certs[i].receivedOn).add(1,'d'),
                    expirationDate: moment( props1.certs[i].expirationDate).add(1,'d')
                });

            var data = {
                socialSecurityNumber: props1.contactDetails.ssn,
                name: props1.contactDetails.fullName,
                email: props1.contactDetails.email,
                phone: props1.contactDetails.phone,
                password: props1.contactDetails.psw,
                jobTitle: props1.contactDetails.jobTitle,
                dob: {
                    day: props1?.contactDetails?.dob?.slice(8, 10),
                    month: props1?.contactDetails?.dob?.slice(5, 7),
                    year: props1?.contactDetails?.dob?.slice(0, 4)
                },
                resume: {
                    link: props1?.contactDetails?.file,
                    lastUpdated: new Date()
                },
                natureOfJob: natureOfJob,
                workSchedule: workSchedule,
                weekendAvailiblity: props1.jobType.availableWeekEnd,
                startWorkDate: !props1.jobType.startDate ? new Date() : startWorkdate,
                immediatelyStart: !props1.jobType.startDate ? true : false,
                medicalSettings: props1.experiences,
                currentLocation: {
                    name: props1.curCity.name,
                    state: props1.curCity.state,
                    zipCode: props1.curCity.zipCode
                },
                otherCities: otherCities,
                nursingLicense: nursingLicences,
                liabilityInsurance: {
                    policyNumber: props1.insurance.number,
                    insuranceProvider: props1.insurance.provider
                },
                certifications: certifications,
                education: props1.degree.degree !== "" ? {
                    degree: props1.degree.degree,
                    college: props1.degree.collage,
                    receivedOn: moment(props1.degree.receivedOn).add(1,'d')
                } : null,
                experiencedIn: props1.experiences,
                avatar: '',
                badge: true,
                drugTest: {
                },
                agreement: {
                    text: this.state.agreementData
                }
            };
            console.log(data);
            var res = await callApi("POST", "v1/LHS/staff/signup", null, data);
            this.setState({ showPending: 'none' });
            this.props.initState();
            /*-------- CometChat SignUp ----------*/
            let authKey = "3b150f16cb126d01ff19132bd8b2b56021189cc6";
            var uid = res.data._id;
            var name = res.data.name;

            var user = new CometChat.User(uid);
            user.setName(name);
            user.setRole("hospital");
            CometChat.createUser(user, authKey).then(
                user => {
                    console.log("user created", user);
                }, error => {
                    console.log("error", error);
                }
            )
            /*----------- CometChat SignUp end ----------*/
            this.props.history.push("/login");
        } else
            this.setState({ showAlert: "block" });
    }

    render() {
        return (
            <div className="outer_container" style={{ backgroundColor: '#009CDE' }}>
                <div className="main_container" style={{ padding: '30px 0px 90px' }}>
                    <div className="ssu_container">
                        <SubHeader num="5" title="Agreement" redo={this.state.redo[4]}
                            next={false} prev="/staffSignUp_3"
                            history={this.props.history} img={img} />
                        <div className="ssu4_body">
                            <div className="ssu_txt1">
                                {/* Congrats, {this.props.contactDetails.fullName}, you're on the last step! */}
                            </div>
                            <div className="ssu4_text2">
                                Please go through to the agreement and provide your consent
                            </div>
                            <hr style={{ margin: '40px 0px 0px' }} />
                            <div className="ssu4_text3">
                                {this.state.agreementData}
                            </div>
                                {/* <div className="ssu4_text3">
                                This Agreement (the “Agreement”) entered into this {this.state.date + this.state.after_date} day of {this.state.month}, {this.state.yy} (“Effective Date – {this.state.mm}/{this.state.dd}/{this.state.yy}”),
                                by and between LINKHEALTHSTAFF LLC (“LHS”), a Nevada registered corporation with its corporate office
                                located Los Angeles, CA, and {this.props.contactDetails.fullName} (hereinafter referred to as “MEDICAL STAFF/PERSONNEL”).
                                WHEREAS, LHS operates an on-demand healthcare staffing platform that facilitates hiring of healthcare
                                personnel to provide services to MEDICAL FACILITIES. WHEREAS, LHS Platform desires to facilitate acquisition
                                services of a Medical Professional set forth in this agreement in accordance with the terms and conditions of
                                the MEDICAL FACILITY job posting.
                            </div>
                            <div className="ssu4_text3">
                                NOW THEREFORE, in consideration of the mutual promises and covenants between LHS and
                                HEALTHCARE PERSONNEL, (jointly hereinafter referred to as “Party/Parties”), the Parties hereby agree:
                            </div>
                            <div className="ssu4_text3">
                                The Medical Professional is a licensed and duly qualified to perform the services expected within the disciplines
                                and job description in the State where healthcare services are being requested. The Medical Professional shall
                                report to the Medical Facility assigned on time as requested by the Medical Facility for the services requested
                                on the LHS Platform.
                            </div>
                            <div className="ssu4_text3">
                                The term of this Agreement is for a period of one (1) year from and automatically renewed every year thereafter
                                unless terminated by either party. This Agreement may be reviewed and revised as necessary.
                            </div>
                            <div className="ssu4_text3">
                                Notwithstanding the foregoing, this Agreement may be terminated by either party anytime.
                                The Medical Professional acknowledges that only the LHS Platform is authorized to bill for service rendered by
                                the Medical Professional to all Medical Facilities served by the Medical Professional. Medical Professional
                                acknowledges that only licensed and qualified personnel will be accepted by LHS Platform for service. At the
                                completion of the Medical Professional’s agreed to shift, the Medical Professional shall provide documentation
                                to be reviewed by the LHS Platform prior to payment. If any discrepancies are found, the LHS Platform shall
                                advise the Medical Professional to correct deficiencies noted in the course of such review. Payment to the Medical
                                Professional shall be in accordance with schedule of the LHS Platform that is immediately after submission of notes
                                and documentation after successful completion of medical shift. Delayed notes and documentation, including
                                deficiencies, shall delay payments until correction shall have been made. LHS Platform reserves the right to
                                require the Medical Professional to correct notes and documentation found to be deficient.
                            </div> */}
                            <div className="ssu4_confirm">
                                <div style={{ width: '100%', maxWidth: '730px', margin: '0px auto' }}>
                                    <input type="checkbox" className="w3-check ssu4_checkBox" onChange={this.setAgreement} />
                                    <b style={{ fontWeight: 'normal' }}>I provide my consent to Medical Staff Agreement</b>
                                </div>
                                <ErrorState show={this.state.showAlert} name="Please provide your consent to Medical Staff Agreement." />
                            </div>
                        </div>
                        <hr style={{ margin: '30px 0px 0px' }} />
                        <div className="ssu_bottom">
                            <div className="ssu_button" onClick={this.finishSignUp}>CONTINUE</div>
                        </div>
                    </div>
                </div>

                <Pending display={this.state.showPending} title="Creating your profile" />
            </div>
        );
    }
}

export default StaffSignUp_4;
