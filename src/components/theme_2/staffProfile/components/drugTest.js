import React from 'react';
import { connect } from 'react-redux';
import edit from '../../../assets/images/edit_note.svg';
import del from '../../../assets/images/delete.svg';
import calendar from '../../../assets/images/calendar.png';
import profile from '../../../assets/images/profile.svg';
import ErrorState from "../../../theme_1/staffSignUp/components/errorState";
import DatePicker from "react-datepicker";
import Confirm from "../../../modals/confirm";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { setSession, callApi } from '../../../../action';
import { SET_SP_PROFILE, SET_AUTH } from '../../../../constants/actionTypes';
import $ from 'jquery';
import moment from "moment";

const mapStateToProps = state => {
    return {
        // _id: state.staffProfile._id,
        // drugTest: state.staffProfile.drugTest
    }
};

const mapDispatchToProps = dispatch => ({
    // setStaffProfile: (data) => dispatch({type: SET_SP_PROFILE, data}),
    // setAuth: (data) => dispatch({type: SET_AUTH, data})
});

class DrugTest extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            drugTest: '',
                report: '',
                testDate: '',
                status: '',
            furl: '',
            showEditModal: 'none',
            file: false,
            // testDate: '',
            // status: '',
            error: {
                file: 'none',
                testDate: 'none',
                status: 'none'
            },
            //--- delete confirm modal
            showConfirm: 'none',
            confirmTitle: '',
            agreeFn: false,
            title: 'Add',
            isAdmin: false
        }
    }

    componentWillMount = () => {
        // this.setState({drugTest: this.props.drugTest});
        this.props.setCurPos('drugTest');
    }
    componentDidMount = async() => {
        let typeData = localStorage.getItem('type')
        if(typeData === 'admin'){
            this.setState({ isAdmin : true })
        }
        if(this.props.admin) {
            var id = window.localStorage.getItem('Staffid')
           }
           else{
            var id = window.localStorage.getItem('_id')
           }
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var res = await callApi("GET", `v1/LHS/staff/getById/${id}`, Authorization);
        if(res.data){
        this.setState({
            drugTest : res.data.drugTest,
            report : res.data.drugTest? res.data.drugTest.report : '',
            testDate : new Date (res.data.drugTest.testDate),
            status : res.data.drugTest.status,
})}
        // console.log(this.state.drugTest && this.state.drugTest);
    }

    componentWillReceiveProps = (newProps) => { 
        // this.setState({drugTest: newProps.drugTest});
        this.componentDidMount();
    }

    addDrugTest = () => {
        $('#finput').val(null);
        this.setState({
            showEditModal: 'block',
            furl: '',
            file: false,
            testDate: '',
            status: '',
            error: {
                file: 'none',
                testDate: 'none',
                status: 'none'
            },
            title: 'Add'
        });
    }

    handleSave = async () => {
        var state = this.state;

        var file = (state.error.file === 'block' || state.file === false ) && state.furl === '' ? "block" : "none";   
        var testDate = state.error.testDate === 'block' || state.testDate === '' ? "block" : "none"; 
        var status = state.error.status === 'block' || state.status === "" ? "block" : "none"; 
        var temp = {
            file: file,
            testDate: testDate,
            status: status
        }    
        this.setState({error: {...temp}});    

        if(file === 'none' && testDate === 'none' && status === 'none'){
            // this.closeModal();
            // var drugTest = {
            //     report: this.state.furl,
            //     testDate: this.state.testDate,
            //     status: this.state.status
            // };
            // this.setState({drugTest: {...drugTest}});
            if(this.state.furl !== this.state.drugTest.report) {
                var res = await callApi('POST', 'v1/LHS/file/upload', null, {file: this.state.file}, true);
                console.log(res);
               this.setState({ report : res.upload.upload.link});
            }
            // this.updateDB(drugTest);
            console.log(this.state.report);
            this.updateDB(this.state.report)
        } 
    }

    updateDB = async (drugTest) => {        
        console.log(drugTest);

        if(this.state.title === 'Add'){
            var passDate =moment(this.state.testDate).add(1,'d')
            
            var data = {
                drugTest : {
                report: drugTest,
                status: this.state.status,
                testDate: this.state.testDate
            } }
            var id = localStorage.getItem('_id');
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
            var res = await callApi("PUT", `v1/LHS/staff/update/${id}`, Authorization, data);
            console.log(res);
           if(res.data){
            this.componentDidMount();
            this.closeModal();
        }
        }

        if(this.state.title === 'Edit'){
            var state = this.state;

            var file = (state.error.file === 'block' || state.file === false ) && state.furl === '' ? "block" : "none";   
            var testDate = state.error.testDate === 'block' || state.testDate === null ? "block" : "none"; 
            var status = state.error.status === 'block' || state.status === "" ? "block" : "none"; 
            var temp = {
                file: file,
                testDate: testDate,
                status: status
            }    
            this.setState({error: {...temp}});
            
            var passDate =moment(this.state.testDate).add(1,'d')
        if(file === 'none' && testDate === 'none' && status === 'none'){

            var data = {
                drugTest : {
                report: drugTest,
                status: this.state.status,
                testDate: this.state.testDate 
            } }
            var id = localStorage.getItem('_id');
            var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
            var res = await callApi("PUT", `v1/LHS/staff/update/${id}`, Authorization, data);
            if(res.data){
                this.componentDidMount();
                this.closeModal();
            }
        }}
        // var data = {drugTest: drugTest};
        // if(this.props.admin)
        //     var token =  "Bearer " + localStorage.getItem('token');
        // else
        //     token =  "Bearer " + localStorage.getItem('token');
        // var type = localStorage.getItem('type');
        // var id = localStorage.getItem('_id');
        // var token = localStorage.getItem('token');
        // var res = await callApi("PUT", "v1/LHS/staff/update/" + id, token, data);
        // if(res.data) { 
        //     this.componentDidMount();
        //     this.closeModal();
        // }
        // setSession( res.token, res.data._id, type);
        //   //t (res.data);
        // data = {            
        //     name: res.data.name, 
        //     type: 'staff', 
        //     avatar: res.data.avatar,
        //     badge: res.data.badge
        // }
        // this.props.setAuth(data);
    }

    closeModal = () => {
        this.setState({showEditModal: 'none'});
    }

    confirmDelete = () => {
        this.setState({
            showConfirm: 'block', 
            confirmTitle: "Drug Test",
            agreeFn: this.delete
        });
    }

    delete = async() => {
    
        var data = { 
                        drugTest : {
                        report: '',
                        testDate: '',
                        status: ''
                    } };
                    var token =  "Bearer " + localStorage.getItem('token');
                    var id = localStorage.getItem('_id');
                    var res = await callApi("PUT", "v1/LHS/staff/update/" + id, token, data);
                   if(res.data){
                    this.setState({showConfirm: 'none'});
                    this.componentDidMount();
                }
        // this.setState({showConfirm: 'none'});

        // this.updateDB({});
    }

    edit = () => {
        $('#finput').val(null);
        this.setState({
            showEditModal: 'block',
            furl: this.state.report,
            file: false,
            testDate: new Date(this.state.testDate),
            status: this.state.status,
            error: {
                file: 'none',
                testDate: 'none',
                status: 'none'
            },
            title: 'Edit'
        });
    }

    clickInput = () => {
        $('#finput').click();
    }

    setTestDate = (date) => {
        this.setState({testDate: date});
        var error = this.state.error;
        error.testDate = 'none';
        this.setState({error: error});
    }

    setStatus = (e) => {
        if(e.target.value.length < 51){
            this.setState({status: e.target.value});
            if(e.target.value !== ''){
                var error = this.state.error;
                error.status = 'none'
                this.setState({error: error});
            }
        }
    }

    fileHandler = (e) => {
        var file = e.target.files[0];
        var error = this.state.error;
        if(file){
            let fileType = file.type;
            let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
            if(validExtensions.includes(fileType)){ 
                let fileReader = new FileReader();
                fileReader.onload = ()=>{
                    let fileURL = fileReader.result;
                    this.setState({furl: fileURL});
                }
                fileReader.readAsDataURL(file);  
                error.file = 'none';
                this.setState({file: file, error: error});          
            } else {      
                error.file = 'block';   
                this.setState({
                    error: error,
                    file: false                 
                });
                $('#finput').val(null);
            }
        } else {
            this.setState({file: false, furl: ''});
            $('#finput').val(null);
        }
    }

  render() {
    var date = new Date(this.state.drugTest && this.state.testDate);
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yy = date.getFullYear();
    dd = dd < 10 ? '0'+ dd : dd;
    mm = mm < 10 ? '0'+ mm : mm;
    var date_received = mm + '/' + dd + '/' + yy;
    return (
            <div className="nur_text1" style={{marginTop: '48px'}}>
                <h4 style={{textAlign: 'left'}}>Drug Test</h4>
                <hr className="t2_sp_hr"/>
                <div className="row" style={{overflowX: 'auto', marginTop: '32px', display: this.state.drugTest && this.state.drugTest.status?"block":"none"}}>
                    <table style={{minWidth: '800px', marginBottom: '20px', textAlign: 'left'}}>
                        <thead>
                            <tr className="nurseHead">
                                <th className="t2_sp_licence_th" style={{paddingLeft: '50px'}}> Report </th>
                                <th className="t2_sp_licence_th" > Test Date </th>
                                <th className="t2_sp_licence_th"> Status </th>
                      {this.state.isAdmin ? '':      <th className="t2_sp_licence_th" style={{width:'130px'}}> Action </th>}
                            </tr>
                        </thead>
                        <tbody>
                        <tr style={{height: 20}}/>
                        <tr className="t2_sp_licence_row">
                            <td style={{paddingLeft: '50px'}}>
                                <a href={this.state.drugTest && this.state.report} download target="new"> 
                                    <img alt="img" width="80" height="48" src={this.state.drugTest && this.state.report}/>
                                </a>
                            </td>
                            <td className="t2_sp_licence_td"> {this.state.drugTest && moment(this.state.drugTest.testDate).format('MM/DD/YYYY')} </td>
                            <td className="t2_sp_licence_td"> {this.state.drugTest && this.state.drugTest.status} </td>
                            {this.state.isAdmin ? '':    <td> 
                                <span style={{ marginRight: '20px'}} onClick={()=>this.edit()}><img width="20px" height="20px" alt="img"src={edit} style={{cursor: 'pointer'}}/></span>
                                <span onClick={()=>this.confirmDelete()}><img width="20px" height="18px" alt="img"src={del} style={{cursor: 'pointer', display: 'inline'}}/></span> 
                            </td> }
                        </tr> 
                        </tbody>                         
                    </table>
                </div>
                {this.state.isAdmin ? '':    <div className="ssu2_addItem" onClick={this.addDrugTest}
                    style={{display: this.state.drugTest && this.state.drugTest.testDate?"none":"block"}}>
                    + Add Drug Test 
                </div>   } 
                <div className="w3-modal " style={{display: this.state.showEditModal}}>
                    <div className="w3-modal-content ssu2_modal1 ">
                        <div className="w3-container ">
                            <div className="ssu2_modal1_text1 ">
                                {this.state.title} Drug Test
                            </div>
                            <hr style={{margin: '30px 0px 0px'}}/>
                            <div className="ssu2_modal1_input" style={{marginTop: '30px'}}>
                                <div className="row t2_sp_editdrug_part1">
                                    <div className="col-md-6 col-sm-12">
                                        <img src={this.state.furl} style={{display: this.state.furl === '' ? 'none' : 'block'}} alt="drag report img" className="t2_sp_editdrug_img"/>
                                    </div>
                                    <button className="col-md-6 col-sm-12" style={{cursor: 'default', backgroundColor: 'white', borderWidth: '0px'}}>
                                        <div className='row'>
                                            <button id={"fbutton"} className="t2_sp_editdrug_btn" onClick={this.clickInput}><span><CloudUploadIcon style={{marginRight: '12px'}}/></span>UPLOAD NEW </button>
                                        </div>
                                        <input id={"finput"} type="file" hidden onChange={this.fileHandler} name="file"
                                            onKeyUp={(e)=>{if(e.key === 'Enter') this.handleSave()}} placeholder='upload jpeg,jpg or png file'/>
                                    </button>
                                    <ErrorState name="The PNG, JPEG, JPG file is required." show={this.state.error.file} />
                                    <div className="ssu2_modal1_text2">
                                    Please upload only png, jpg, or jpeg images
                                </div>
                                </div>
                                <div className="ssu2_modal1_input" style={{marginTop: '18px'}}>
                                    <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                        <div className="input_left_icon"  onClick={()=>$(".ssu2_modal3_date").focus()}>
                                            <img width="22px" height="17px" alt="img"src={calendar}/>
                                        </div>
                                        <DatePicker
                                            placeholderText={'Test Date'}
                                            className="ssu2_modal3_date"
                                            selected={this.state.testDate}
                                            onChange={(date) => this.setTestDate(date)}
                                            maxDate={new Date()}
                                        />
                                    </div>
                                    <ErrorState name="Test Date is required." show={this.state.error.testDate} />
                                </div>
                            </div>
                            <div className="ssu2_modal1_input">
                                <div className="ssu2_modal1_input">
                                    <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                        <div className="input_left_icon">
                                            <img width="22px" height="23px" alt="img"src={profile} style={{marginTop: '-3px'}} />
                                        </div>
                                        <input className="ssu2_modal3_select" placeholder="Status" type="text" value={this.state.status} onChange={this.setStatus}/>
                                    </div>
                                    <ErrorState show={this.state.error.status} name="Status is required." />
                                </div>
                            </div>
                            <hr style={{margin: '30px 0px 0px'}}/>
                            <div className="row ssu_bottom">
                                <button className="ssu2_modal1_button1" onClick={this.handleSave}> SAVE </button>
                                <button className="ssu2_modal1_button2" onClick={this.closeModal}> CANCEL </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Confirm title={'Delete "' + this.state.confirmTitle + '"'} display={this.state.showConfirm}
                    agreeFn={this.state.agreeFn} content={'Are you sure you want to delete "' + this.state.confirmTitle + '"'}
                    disagreeFn={()=>this.setState({showConfirm: 'none'})}/>                
            </div>                     
    );
  }
}

export default DrugTest;