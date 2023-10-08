import React from 'react';
import { connect } from 'react-redux';
import ErrorState from '../../theme_1/staffSignUp/components/errorState';
import edit_note from '../../assets/images/edit_note.svg';
import user from '../../assets/images/user.svg';
import calendar from '../../assets/images/calendar.png';
import { SET_SP_PROFILE, SET_AUTH } from '../../../constants/actionTypes';
import { callApi, setSession } from '../../../action';
import Loader from '../../modals/Loader'

const mapStateToProps = state => {
  return {
    // _id: state.staffProfile._id,
    //   accountName: state.staffProfile.name,
    //   bankName: state.staffProfile.bankName,
    //   routingNumber: state.staffProfile.routingNumber,
    //   accountNumber: state.staffProfile.accountNumber
  }};

const mapDispatchToProps = dispatch => ({
    setStaffProfile: (data) => dispatch({type: SET_SP_PROFILE, data}),
    setAuth: (data) => dispatch({type: SET_AUTH, data})
});

class AccountDetails extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            getData : {},
            accountName: '',
            bankName: '',
            routingNumber: '',
            accountNumber: '',
            day: '',
            month: '',
            year : '',
            modalShow: 'none',    
            maccountName: '',
            mbankName: '',
            mroutingNumber: '',
            maccountNumber: '',
            mday : '',
            mmonth: '',
            myear: '',   
            error: {
                accountName: 'none',
                bankName: 'none',
                routingNumber: 'none',
                accountNumber: 'none',
                day : 'none',
                month : 'none',
                year : 'none'
            },   
            showLoader : false,
            linkLoader : false     
        }
    }

    componentWillReceiveProps = (newProps) => {
        this.initState(newProps);
    }

    componentWillMount =  () => {
        this.initState(this.props);
       
    }

    initState = (props) => {
        this.setState({            
            accountName: props.accountName,
            bankName: props.bankName,
            routingNumber: props.routingNumber,
            accountNumber: props.accountNumber
        })
    }
    
    componentDidMount = async() => {
        this.setState({ showLoader : true })
        this.props.setCurPos("accountDetails");
        window.scrollTo({top: 0, behavior: 'smooth'});
        var id = window.localStorage.getItem('_id')
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var res = await callApi("GET", `v1/LHS/staff/getById/${id}`, Authorization);
        console.log(res.data.bankName);
       if(res.data) {
        this.setState({ 
            getData : res.data,
        bankName: res.data.bankName,
        accountName: res.data.bankUserName,
        accountNumber: res.data.accountNumber,
        routingNumber: res.data.routingNumber,
        day : res.data.dob && res.data.dob.day ,
        month : res.data.dob && res.data.dob.month ,
        year : res.data.dob && res.data.dob.year ,
        showLoader : false
 })
 console.log(this.state.showLoader, 'if res.data');
}
 else{
    this.setState({ showLoader : false })
 }

 console.log(new Date().toLocaleTimeString() > new Date(this.state.getData.linkExpiryDate).toLocaleTimeString() ? 'generate' : 'else' );
    }

    edit = () => {
        this.setState({            
            maccountName: this.state.accountName,
            mbankName: this.state.bankName,
            mroutingNumber: this.state.routingNumber,
            maccountNumber: this.state.accountNumber,
            mday : this.state.day,
            mmonth : this.state.month,
            myear : this.state.year,
            modalShow: 'block',
            error: {
                accountName: 'none',
                bankName: 'none',
                routingNumber: 'none',
                accountNumber: 'none',
                day : 'none',
                month : 'none',
                year : 'none'
            }
        });
    }
    

    formatInput = (e) => {
        // Prevent characters that are not numbers ("e", ".", "+" & "-") âœ¨
        let checkIfNum;
        if (e.key !== undefined) {
          // Check if it's a "e", ".", "+" or "-"
          checkIfNum = e.key === "e" || e.key === "." || e.key === "+" || e.key === "-" ;
        }
        else if (e.keyCode !== undefined) {
          // Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
          checkIfNum = e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189;
        }
        return checkIfNum && e.preventDefault();
    }

    setAccountName = (e) => {
        if(e.target.value.length < 51){
            var error = this.state.error;
            error.accountName = 'none';
            this.setState({maccountName: e.target.value, error: error});
        }
    }
    
    setBankName = (e) => {
        if(e.target.value.length < 51){
            var error = this.state.error;
            error.bankName = 'none';
            this.setState({mbankName: e.target.value, error: error});
        }
    }
    
    setRoutingNumber = (e) => {
        if(e.target.value.length < 10){
            var error = this.state.error;
            error.routingNumber = 'none';
            this.setState({mroutingNumber: e.target.value, error: error});
        }
    }
    
    setAccountNumber = (e) => {
        if(e.target.value.length < 20){
            var error = this.state.error;
            error.accountNumber = 'none';
            this.setState({maccountNumber: e.target.value, error: error});
        }
    }

    setDay = (e) => {
        if(e.target.value.length < 3){
            var error = this.state.error;
            error.day = 'none';
            this.setState({mday: e.target.value, error: error});
        }
    }

    setMonth = (e) => {
        if(e.target.value.length < 3){
            var error = this.state.error;
            error.month = 'none';
            this.setState({mmonth: e.target.value, error: error});
        }
    }

    setYear = (e) => {
        if(e.target.value.length < 5){
            var error = this.state.error;
            error.year = 'none';
            this.setState({myear: e.target.value, error: error});
        }
    }

    modalClose = () => {
        this.setState({
            modalShow: 'none',
            error: {
                accountName: 'none',
                bankName: 'none',
                routingNumber: 'none',
                accountNumber: 'none',
                day : 'none',
                month : 'none',
                year : 'none'
            }
        });
        
    }

    generateLink = async() => {
        this.setState({ linkLoader : true })
        var token =  "Bearer " + localStorage.getItem('token');
        var linkData = await callApi("POST", `v1/LHS/payment/gateway/verify`, token);
    
        // console.log(linkData.raw.message, 'linknknknknknk');
        if(linkData.Message === "Account Verified..." ){
            this.componentDidMount();
            this.setState({ linkLoader : false })
            alert('Link Generated')
        } else {
            if(linkData.statusCode === 400) {
                alert(linkData.raw.message)
                this.setState({ linkLoader : false })
       }
       else {
   this.setState({ linkLoader : false })
       }
        }
       
    }

    continueToNext = async() => {
        var state = this.state;
        var maccountName = state.error.accountName === 'block' || state.maccountName === '' ? 'block' : 'none';
        var mbankName =  state.error.bankName === 'block' || state.mbankName === '' ? 'block' : 'none';
        var mroutingNumber =  state.error.routingNumber === 'block' || state.mroutingNumber === '' ? 'block' : 'none';
        var maccountNumber =  state.error.accountNumber === 'block' || state.maccountNumber === '' ? 'block' : 'none';
        var mday =  state.error.day === 'block' || state.mday === '' ? 'block' : 'none';
        var mmonth =  state.error.month === 'block' || state.mmonth === '' ? 'block' : 'none';
        var myear =  state.error.year === 'block' || state.myear === '' ? 'block' : 'none';

        var error = {
            accountName: maccountName,
            bankName: mbankName,
            routingNumber: mroutingNumber,
            accountNumber: maccountNumber,
            day : mday,
            month : mmonth,
            year : myear
        }
        this.setState({error: {...error}}); 

        // if(maccountName==='none' &&  mbankName==='none' && mroutingNumber==='none' && maccountNumber==='none'){
        //     this.updateDB();           
        // }
        var data = {
            bankUserName: this.state.maccountName,
            bankName: this.state.mbankName,
            routingNumber: this.state.mroutingNumber,
            accountNumber: this.state.maccountNumber,
            dob :{
                day: this.state.mday,
                month: this.state.mmonth,
                year : this.state.myear
            }

        }
    var token =  "Bearer " + localStorage.getItem('token');
   //  var _id = this.props._id;
   var id = window.localStorage.getItem('_id')

    var res = await callApi("PUT", `v1/LHS/staff/update/${id}`, token, data);
//   const res = await axios.patch(`${process.env.REACT_APP_API_URL}v1/LHS/staff/update${id}`,data, { headers: { Authorization: AuthStr } })


    // setSession( res.token, res.data._id, 'staff');
    
    if (maccountName==='none' &&  mbankName==='none' && mroutingNumber==='none' && maccountNumber==='none' && mday === 'none' && mmonth === 'none' && myear === 'none') {
        // this.setState({
        //    bankName: res.data.bankName,
        //    accountName: res.data.name,
        //    accountNumber: res.data.accountNumber,
        //    routingNumber: res.data.routingNumber  
        // })
    this.modalClose();
    this.componentDidMount();
    }
    }

    updateDB = async () => {
        var data = {
                 name: this.state.maccountName,
                 bankName: this.state.mbankName,
                 routingNumber: this.state.mroutingNumber,
                 accountNumber: this.state.maccountNumber
             }
         var token =  "Bearer " + localStorage.getItem('token');
        //  var _id = this.props._id;
        var id = window.localStorage.getItem('_id')

         var res = await callApi("PATCH", `v1/LHS/staff/update${id}`, token, data);
         setSession( res.token, res.data._id, 'staff');
         if (res.Message === 'Staff Updated Successfully') {
             this.setState({
                bankName: res.data.bankName,
                accountName: res.data.bankUserName,
                accountNumber: res.data.accountNumber,
                routingNumber: res.data.routingNumber  
             })
         }
         this.modalClose();
           //t (res.data);
         data = {            
             name: res.data.name, 
             type: 'staff', 
             avatar: res.data.avatar,
             badge: res.data.badge
         }
         this.props.setAuth(data);
    }
   
   render() {
    return (
        <div className="t2_sp_work">
           { this.state.showLoader ? <Loader /> : <React.Fragment> 
            <div className="t2_sp_work_title">
                Account Details
                <img alt="icon.svg" src={edit_note} width="15px" style={{marginTop: 4, float: 'right', cursor: 'pointer'}} onClick={this.edit}/>                
            </div>
            <div className="row t2_sp_work_container">
                <div className="col-md-6 col-sm-12">
                    <h6 style={{fontSize:14}}> Bank Name </h6>
                    <h5 className="t2_detail_textbox" title={this.state.bankName}> {this.state.bankName} </h5>
                    <hr style={{marginTop: 24}}/>
                </div>
                <div className="col-md-6 col-sm-12">                    
                    <h6 style={{fontSize:14}}> Account Name </h6>
                    <h5 className="t2_detail_textbox" title={this.state.accountName}> {this.state.accountName} </h5>
                    <hr style={{marginTop: 24}}/>
                </div>
                <div className="col-md-6 col-sm-12">                                      
                    <h6 style={{fontSize:14}}> Routing Number </h6>
                    <h5 className="t2_detail_textbox"> {this.state.routingNumber} </h5>
                    <hr style={{marginTop: 24}}/>
                </div>
                <div className="col-md-6 col-sm-12">                                      
                    <h6 style={{fontSize:14}}> Account Number </h6>
                    <h5 className="t2_detail_textbox"> {this.state.accountNumber} </h5>
                </div>
                <div className="col-md-6 col-sm-12">                                      
                    <h6 style={{fontSize:14}}> DOB </h6>
                    <h5 className="t2_detail_textbox"> {`${this.state.month}/${this.state.day}/${this.state.year}`} </h5>
                </div>
            </div>
            <div style={{marginTop : '10px' }} className="t2_sp_work_title">
                Verification Details
            </div>
            <div className="row t2_sp_work_container">
          {/* {!this.state.getData.bankVerified &&     */}
        {this.state.getData.bankVerified ? '' :   <div className="col-md-6 col-sm-12">
                    <h6 style={{fontSize:14}}> Verification Link </h6>
                    <a target="_blank" style={{ marginTop : '5px', pointerEvents : this.state.getData.bankVerificationLink === '' && 'none' }} href={this.state.getData.bankVerificationLink} target_blank className="t2_detail_textbox" title={this.state.bankName}> Verify </a>
                    <hr style={{marginTop: 24}}/>
                </div> }
                 {/* } */}
                {/* {!this.state.getData.bankVerified &&    */}
                {this.state.getData.bankVerified ? '' :       <div className="col-md-6 col-sm-12">                    
                    <h6 style={{fontSize:14}}> Link Expiration Date </h6>
                    <h5 className="t2_detail_textbox" title={this.state.getData.linkExpiryDate}> {this.state.getData.linkExpiryDate !== '' ? new Date(this.state.getData.linkExpiryDate).toLocaleString() : '--'} </h5>
                    <hr style={{marginTop: 24}}/>
                </div> }
                {/* } */}
                <div className="col-md-6 col-sm-12">                                      
                    <h6 style={{fontSize:14}}> Verification Status </h6>
                    <h5 className="t2_detail_textbox" style={{color : this.state.getData.bankVerified ? 'green' : 'red'}}> {this.state.getData.bankVerified ? 'Verified' : 'Not Verified'} </h5>
                </div>
                {this.state.getData.bankVerified ? '' :   <div className="col-md-6 col-sm-12">                                      
                    {/* <h6 style={{fontSize:14}}> Account Number </h6> */}
                    <button style={{ width : '50%' }} className="ssu2_modal1_button1" onClick={this.generateLink}> 
                    {/* <a className="ssu2_modal1_button1" target="_blank" style={{ textAlign :'center', textDecoration:'none', paddingTop:'5px' }} href={this.state.getData.bankVerificationLink} target_blank  title={this.state.bankName}>  */}
                 {this.state.linkLoader ? <Loader />  : " Request Verification Link" }
                     {/* </a> */}
                     </button>
                </div> }
            </div>
            <div className="w3-modal" style={{display: this.state.modalShow}} >
                <div className="w3-modal-content ssu2_modal1" style={{maxHeight: 600, overflowY: 'auto'}}>
                    <div className="w3-container">
                        <div className="ssu2_modal1_text1">Edit Account Details</div>
                        <hr style={{margin: '30px 0px 0px'}}/>                      
                        <div className="ssu2_modal1_input" style={{marginTop: 30}}>
                            <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                <div className="input_left_icon">
                                    <img width="18px" height="15px" alt="img" src={user} />
                                </div>
                                <input className="ssu2_modal3_select" placeholder="Bank Name" type="text" value={this.state.mbankName} onChange={this.setBankName}
                                    onKeyUp={(e)=>{if(e.key === 'Enter') this.continueToNext()}}/>
                            </div>
                            <ErrorState show={this.state.error.bankName} name={"Bank Name is required."} />
                        </div>
                        <div className="ssu2_modal1_input">
                            <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                <div className="input_left_icon">
                                    <img alt="img" width="18px" height="15px" src={user} />
                                </div>
                                <input className="ssu2_modal3_select" placeholder="Account Name" type="text" value={this.state.maccountName} onChange={this.setAccountName} onKeyDown={this.preventNumberInput}
                                    onKeyUp={(e)=>{if(e.key === 'Enter') this.continueToNext()}}/>
                            </div>
                            <ErrorState show={this.state.error.accountName} name="Account Name is required. "/>
                        </div>
                        <div className="ssu2_modal1_input">
                            <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                <div className="input_left_icon">
                                    <img width="18px" height="15px" alt="img" src={user} />
                                </div>
                                <input className="ssu2_modal3_select" placeholder="Routing Number" type="number"  onKeyDown={ this.formatInput } value={this.state.mroutingNumber} onChange={this.setRoutingNumber}
                                    onKeyUp={(e)=>{if(e.key === 'Enter') this.continueToNext()}}/>
                            </div>
                            <ErrorState show={this.state.error.routingNumber} name="Routing Number is required." />
                        </div>
                        <div className="ssu2_modal1_input">
                            <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                <div className="input_left_icon">
                                    <img width="18px" height="15px" alt="img"src={user} />
                                </div>
                                <input className="ssu2_modal3_select" placeholder="Account Number" type="number" onKeyDown={ this.formatInput } value={this.state.maccountNumber} onChange={this.setAccountNumber}
                                    onKeyUp={(e)=>{if(e.key === 'Enter') this.continueToNext()}}/>
                            </div>
                            <ErrorState show={this.state.error.accountNumber} name="Account Number is required" />
                        </div>
                        <hr style={{margin: '60px 0px 0px'}}/>
                        <div style={{marginTop : '10px'}} className="ssu2_modal1_text1">Date Of Birth</div>
                        <div className="ssu2_modal1_input">
                            <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                            <div className="input_left_icon">
                                    <img width="18px" height="15px" alt="img"src={calendar} />
                                </div>
                                <input className="ssu2_modal3_select" placeholder="Day" type="number" onKeyDown={ this.formatInput } value={this.state.mday} onChange={this.setDay}
                                    onKeyUp={(e)=>{if(e.key === 'Enter') this.continueToNext()}}/>
                            </div>
                            <ErrorState show={this.state.error.day} name="Day for DOB is required" />
                        </div>
                        <div className="ssu2_modal1_input">
                            <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                            <div className="input_left_icon">
                                    <img width="18px" height="15px" alt="img"src={calendar} />
                                </div>
                                <input className="ssu2_modal3_select" placeholder="Month" type="number" onKeyDown={ this.formatInput } value={this.state.mmonth} onChange={this.setMonth}
                                    onKeyUp={(e)=>{if(e.key === 'Enter') this.continueToNext()}}/>
                            </div>
                            <ErrorState show={this.state.error.month} name="Month for DOB is required" />
                        </div>
                        <div className="ssu2_modal1_input">
                            <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                            <div className="input_left_icon">
                                    <img width="18px" height="15px" alt="img"src={calendar} />
                                </div>
                                <input className="ssu2_modal3_select" placeholder="Year" type="number" onKeyDown={ this.formatInput } value={this.state.myear} onChange={this.setYear}
                                    onKeyUp={(e)=>{if(e.key === 'Enter') this.continueToNext()}}/>
                            </div>
                            <ErrorState show={this.state.error.year} name="Year for DOB is required" />
                        </div>
                        <div className="row ssu_bottom">
                            <button className="ssu2_modal1_button1" onClick={this.continueToNext}> SAVE </button>
                            <button className="ssu2_modal1_button2" onClick={this.modalClose}> CANCEL </button>
                        </div>
                    </div>
                </div>
            </div>
            </React.Fragment> } </div>
    );
  }
}

export default AccountDetails;
