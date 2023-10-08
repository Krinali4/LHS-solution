import React from 'react';
import { connect } from 'react-redux';
import leftarrow from '../../../assets/images/leftarrow.svg';
import downarrow from '../../../assets/images/downarrow.svg';
import edit from '../../../assets/images/edit_note.svg';
import del from '../../../assets/images/delete.svg';
import calendar from '../../../assets/images/calendar.png';
import DatePicker from "react-datepicker";
import ErrorState from "../../../theme_1/staffSignUp/components/errorState";
import FileBrowser from '../../../theme_1/staffSignUp/components/fileBrowser';
import profile from '../../../assets/images/profile.svg';
import place from '../../../assets/images/place.svg';
import { SET_SP_PROFILE, SET_AUTH } from '../../../../constants/actionTypes';
import { stateOfUs } from '../../../../constants/otherConstans';
import Confirm from "../../../modals/confirm";
import $ from 'jquery';
import { callApi, setSession, removeSession } from '../../../../action';
import { Spinner } from 'react-bootstrap';
import moment from "moment";
const mapStateToProps = state => {
    return {
        // _id: state.staffProfile._id,
        // nursingLicence: state.staffProfile.nursingLicence
    }
};

const mapDispatchToProps = dispatch => ({
    setStaffProfile: (data) => dispatch({ type: SET_SP_PROFILE, data }),
    setAuth: (data) => dispatch({ type: SET_AUTH, data })
});

class NurseLicense extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showInput: false,
            licenseData: '',
            licenseId: '',
            stateVal: '',
            selectedStates: [],
            stateOfUs: [],
            downarrow: 'inline',
            leftarrow: 'none',
            currentIndex: "",
            licenses: {},
            stateName: '',
            //--- delete confirm modal
            selectedNum: '',
            showConfirm: 'none',
            confirmTitle: '',
            agreeFn: false,
            //--- add & update modal
            showEditModal: 'none',
            file: false,
            fileAdded: false,
            expDate: false,
            lname: '',
            lnum: '',
            imgUrl: '',
            fname: '',
            error: {
                lname: 'none',
                lnum: 'none',
                expDate: 'none',
                lfile: 'none'
            },
            delFile: false,
            editRow: false,
            title: 'Add',
            showLoader: false,
            isAdmin: false
        }
    }

    componentWillMount = () => {
        this.initState(this.props);
        this.props.setCurPos('nursing license');
        var temp = [];
        for (var i = 0; i < stateOfUs.length; i++) {
            var temp1 = {
                name: stateOfUs[i],
                num: i
            };
            temp.push(temp1);
        }
        this.setState({ stateOfUs: [...temp] })
    }
    componentDidMount = async () => {
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
        if (res.data) {
            this.setState({
                licenseData: res.data.nursingLicense
            })
        }
    }

    componentWillReceiveProps = (newProps) => {
        this.initState(newProps);
        this.componentDidMount();
    }

    initState = (props) => {
        // this.setState({
        //     licenses: {...props.item},
        //     stateName: props.item.state
        // });   
    }
    addState = (e) => {
        var state = e.target.value;
        this.setState({ stateVal: state })
        console.log(this.state.stateVal);
        this.addLicense();

        // var num;
        // var states = this.state.stateOfUs;
        // for( var i = 0; i < states.length; i++){
        //     if(states[i].name === state){
        //         num = i;
        //     }
        // }

        // this.setState({stateVal: '', showInput: false});
        // var arr = this.state.selectedStates;
        // arr.push(num);
        // this.setState({selectedStates: arr});

        // var nursingLicence = this.state.licenseData.nursingLicense;
        // nursingLicence.push({
        //   image: '',
        //   expirationDate: new Date(),
        //   state: state,
        //   name: '',
        //   number: '',
        //   num: nursingLicence.length
        // }); 
        // console.log(nursingLicence);
        // this.updateDB(nursingLicence);
    }


    toggleAccordion = (num) => {
        if(this.state.currentIndex === num) {
            this.setState({ currentIndex: "" });
        }
        else{
            this.setState({ currentIndex: num });
        }
    }

    //---- delete state confirm alert

    confirmDeleteState = () => {
        this.setState({
            showConfirm: 'block',
            confirmTitle: this.state.stateName,
            agreeFn: this.deleteState
        });
    }

    deleteState = () => {
        var num = this.props.num;
        this.setState({ showConfirm: 'none' });
        var nursingLicence = this.props.nursingLicence;
        nursingLicence.splice(num, 1);
        this.updateDB(nursingLicence);
    }

    //---- delete license confirm alert

    confirmDeleteLicence = (num) => {
        // console.log(this.state.nursingData.name);
        this.setState({
            showConfirm: 'block',
            confirmTitle: this.state.licenseData[num].name,
            licenseId: this.state.licenseData[num]._id,
            agreeFn: this.deleteOneRow
        });
    }

    deleteOneRow = async () => {
        // var num = this.props.num;
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var _id = window.localStorage.getItem('_id')
        var res = await callApi("DELETE", `v1/LHS/staff/delete/nursingLicense/${this.state.licenseId}?userId=${_id}`, Authorization);
        console.log(res);
        this.setState({ showConfirm: 'none' });
        this.componentDidMount();
        this.modalClose();
        // var nursingLicence = this.props.nursingLicence;
        // nursingLicence[this.props.num] = { state: this.state.licenses.state };
        // this.updateDB(nursingLicence);
    }

    editOneRow = (index) => {
        // $('#' + this.props.num + 'input').val(null);
        // moment(this.state.testDate).add(1,'d')
        console.log(index);
        var passDate = moment(this.state.licenseData[index].expirationDate)
        this.setState({ showEditModal: 'block', editRow: true, title: 'Edit' });
        this.setState({
            selectedNum: index,
            lname: this.state.licenseData[index].name,
            lnum: this.state.licenseData[index].number,
            expDate: new Date(passDate),
            file: this.state.licenseData[index].image,
            imgUrl : this.state.licenseData[index].image,
            licenseId: this.state.licenseData[index]._id,
            stateVal: this.state.licenseData[index].state,
            fname: this.state.licenseData[index].fname

        })
        console.log(this.state.licenseData[index]._id,'in edit license row');
        // var licence = this.state.licenses;
        // var name = licence.image.split('/')[3];
        this.setState({
        //     expDate: new Date(licence.expirationDate), 
        //     lname: licence.name, 
        //     lnum: licence.number, 
        //     file: false,
        //     fname: name,
        //     imgUrl: '',
            error: {
                lname: 'none',
                lnum: 'none',
                expDate: 'none',
                lfile: 'none'
            }
        //     delFile: false,
        //     title: 'Edit'
        });
    }

    addLicense = () => {
        $('#' + this.props.num + 'input').val(null);
        console.log(this.state.stateVal, 'in line 277 for add license');
        this.setState({ showEditModal: 'block', editRow: false });
        this.setState({
            expDate: false,
            lname: "",
            lnum: "",
            file: false,
            fname: "",
            imgUrl: '',
            error: {
                lname: 'none',
                lnum: 'none',
                expDate: 'none',
                lfile: 'none'
            },
            delFile: false,
            title: 'Add'
        });
    }

    //------ add & edit nursing licenses
    updateDB = async (nursingLicence) => {
        var data = { nursingLicence: nursingLicence };
        if (this.props.admin)
            var token = "Bearer " + localStorage.getItem('token');
        else
            token = "Bearer " + localStorage.getItem('token');
        var type = localStorage.getItem('type');
        var _id = this.props._id;
        var res = await callApi("POST", "v1/LHS/staff/update/" + _id, token, data);
        setSession(res.token, res.data._id, type);
          //t (res.data);
        data = {
            name: res.data.name,
            type: 'staff',
            avatar: res.data.avatar,
            badge: res.data.badge
        }
        this.props.setAuth(data);
    }

    handleSave = async (file) => {
        var state = this.state;

        var lname = state.lname === "" ? "block" : "none";
        var lnum = state.lnum === "" ? "block" : "none";
        var expDate = state.expDate === false ? "block" : "none";
        var lfile = state.file === false && !this.state.fname ? "block" : "none";
        var temp = {
            lname: lname,
            lnum: lnum,
            expDate: expDate,
            lfile: lfile,
        }
        this.setState({ error: { ...temp } });
        this.setState({ delFile: false });

        if (this.state.title === 'Edit') {
            console.log(this.state.licenseId, 'for edit in NLC');
            var state = this.state;

            var lname = state.lname === "" ? "block" : "none";
            var lnum = state.lnum === "" ? "block" : "none";
            var expDate = state.expDate === null ? "block" : "none";
            var lfile = state.file === false && !this.state.fname ? "block" : "none";
            var temp = {
                lname: lname,
                lnum: lnum,
                expDate: expDate,
                lfile: lfile,
            }
            this.setState({ error: { ...temp } });
            this.setState({ delFile: false });
            if(lname === 'none' && lnum === 'none' && expDate === 'none' && lfile === 'none'){
                var passDate =moment(this.state.expDate).utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0 })
            var data = {
                image: this.state.file,
                name: this.state.lname,
                state: this.state.stateVal,
                number: this.state.lnum,
                expirationDate: passDate
            }
            console.log(data, 'in edit license');
            var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
            var _id = window.localStorage.getItem('_id');
           if(this.props.admin) {
            var res = await callApi("PUT", `v1/LHS/staff/update/nursingLicense/${this.state.licenseId}?userId=${_id}`, Authorization, data);
           }
           else {
            var res = await callApi("PUT", `v1/LHS/staff/update/nursingLicense/${this.state.licenseId}`, Authorization, data);
           }
            console.log(this.state.file, 'file after save');
            if (res.data) {
                this.modalClose();
                this.componentDidMount();
            }
        }
        }

        if (this.state.title === 'Add') {
            console.log(this.state.stateVal, 'in handle save for add license');
            console.log(this.state.file, 'in handle save for add license');
            if(lname === 'none' && lnum === 'none' && expDate ==='none' && lfile === 'none'){
                var passDate =moment(this.state.expDate).utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0 }).add(1,'d')
            var data = {
                image: this.state.file,
                name: this.state.lname,
                state: this.state.stateVal,
                number: this.state.lnum,
                expirationDate: passDate
            }
            console.log(passDate, ' expdate in handle save for add');
            var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
            var _id = window.localStorage.getItem('_id')
            var res = await callApi("POST", `v1/LHS/staff/add/nursingLicense?userId=${_id}`, Authorization, data);
            if (res.Message === 'License inserted successfully..') {
                this.componentDidMount();
                this.modalClose();
            }

            }

        }

      
    };

    setFile = (file) => {
        this.uploadFileFunc(file);
        this.setState({
            fileAdded: file
        })
    }

    uploadFileFunc = async (file) => {
        this.setState({
            showLoader: true
        })
        const data = {
            file: file,
            name: "license"
        }
        var res1 = await callApi("POST", "v1/LHS/file/upload", null, data, true);
        alert(res1.Message);
        this.setState({ file: res1.upload.upload.link, showLoader: false });
    }

    showFileErr = () => {
        var err = this.state.error;
        err.lfile = "block";
        this.setState({ error: err });
    }
    hideFileErr = () => {
        var err = this.state.error;
        err.lfile = "none";
        this.setState({ error: err });
    }

    setImgUrl = async (url) => {
        this.setState({ imgUrl: url })
    }

    modalClose = () => {
        var state = {
            showEditModal: 'none',
            stateVal: '',
            file: false,
            fname: '',
            fileAdded: ''
        }
        this.setState(state);
    }

    setDelFile = (del) => {
        this.setState({ delFile: del, file: false, });
        if (del && this.state.error.lfile === 'block')
            this.hideFileErr();
    }

    setLicenceName = (e) => {
        if (e.target.value.length < 51) {
            this.setState({ lname: e.target.value });
            if (e.target.value !== '') {
                var error = this.state.error;
                error.lname = 'none';
                this.setState({ error: error });
            }
        }
    }

    setLicenceNum = (e) => {
        if (e.target.value.length < 51) {
            this.setState({ lnum: e.target.value });
            if (e.target.value !== '') {
                var error = this.state.error;
                error.lnum = 'none';
                this.setState({ error: error });
            }
        }
    }

    setExpDate = (date) => {
        this.setState({ expDate: date });
        if (date !== '') {
            var error = this.state.error;
            error.expDate = 'none';
            this.setState({ error: error });
        }
    }

    render() {
        var date = new Date(this.state.licenses.expirationDate);
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yy = date.getFullYear();
        dd = dd < 10 ? '0' + dd : dd;
        mm = mm < 10 ? '0' + mm : mm;
        var date_received = mm + '/' + dd + '/' + yy;
        var propsLicense = this.props.staff
        { console.log(propsLicense, 'in line 305 in nursing component') }
        return (
            <>
                {/* <div className="nur_text1" style={{ display: 'flex', gap: '250px' }}> */}
                <h4
                    className="t2_sp_title1"
                >Nursing License</h4>


                {/* </div> */}
                <div className="ssu2_modal1_input" style={{
                    maxWidth: 'none', width: '100%',
                    //   display: this.state.showInput?'block':'none'
                }}>
               {this.state.isAdmin ? '' :       <div className="ssu2_modal1_input ssu2_modal3_selectBox"
                        style={{ maxWidth: '100%' }}
                    >
                        <div className="input_left_icon">
                            <img alt="img" src={place} width="16px" height="20px" style={{ marginTop: '-3px' }} />
                        </div>
                       <select className="ssu2_modal3_select" name="option"
                            onChange={this.addState}
                            value={this.state.stateVal}>
                            <option value="" disabled selected hidden> Select a state to add new licence</option>

                            {
                                this.state.stateOfUs.map((state) => {
                                    return <option key={state._id} disabled={this.state.selectedStates.indexOf(state.num) !== -1 ? true : false} value={state._id}> {state.name} </option>
                                })
                            }
                            {console.log(this.state.stateVal, 'in line 394 NLC')}
                        </select>
                    </div>}
                </div>
                <div className="t2_sp_nl_item">
                    {this.state.licenseData && this.state.licenseData.map((data, index) => {
                        return (<div key={index}>
                            <div className="col-12 t2_sp_licence_accBtn d-flex align-items-center" style={{ fontSize: 18 }} onClick={() => this.toggleAccordion(index)}>
                                <span>
                                    <img alt="img" src={leftarrow} width="10px" style={{ display: index === this.state.currentIndex ? 'inline' : 'none', marginRight: '34px' }} />
                                    <img alt="img" src={downarrow} width="18px" style={{ display: index !== this.state.currentIndex ? 'inline' : 'none', marginRight: '22px' }} />
                                </span>
                                {data.state}
                                {/* <span className="nur_state_del" title="remove state" onClick={(e)=>{e.stopPropagation(); this.confirmDeleteState()}}><img alt="img"src={del} width="15px" heigth="18px" style={{cursor: 'pointer', display: this.props.admin ? 'none' : 'inline'}}/></span> */}
                            </div>
                            <div className="col-12 nur_accBody" style={{ display: index === this.state.currentIndex ? 'block' : 'none' }} key={index}>
                                <hr className="t2_sp_hr" />
                                <div className="nur_text1">
                                    <div className="row" style={{ overflowX: 'auto', marginTop: '24px', display: this.state.licenseData ? "block" : "none" }}>

                                        <table style={{ minWidth: '800px', marginBottom: '15px', textAlign: 'left' }}>
                                            <thead>
                                                <tr className="nurseHead">
                                                    <th className="t2_sp_licence_th" style={{ paddingLeft: '50px' }}> Image </th>
                                                    <th className="t2_sp_licence_th"> Name </th>
                                                    <th className="t2_sp_licence_th"> Number </th>
                                                    <th className="t2_sp_licence_th"> Expiration Date</th>
                                           {this.state.isAdmin ? '' :          <th className="t2_sp_licence_th" style={{ width: this.props.admin ? '80px' : '130px' }}> Action </th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr style={{ height: 20 }} />
                                                <tr className="t2_sp_licence_row">
                                                    <td style={{ paddingLeft: '50px' }}><a href={data.image && data.image} download target="new"> <img alt="img" width="60" height="36" src={data.image && data.image} /></a></td>
                                                    <td className="t2_sp_licence_td"> {data.name && data.name} </td>
                                                    <td className="t2_sp_licence_td"> {data.number && data.number} </td>
                                                    <td className="t2_sp_licence_td"> {data.expirationDate && `${data.expirationDate.slice(5, 7)}/${data.expirationDate.slice(8, 10)}/${data.expirationDate.slice(0, 4)} `} </td>
                                                    {this.state.isAdmin ? '' :     <td>
                                                        <span style={{ marginRight: '20px' }} onClick={() => this.editOneRow(index)}><img width="20px" height="20px" alt="img" src={edit} style={{ cursor: 'pointer' }} /></span>
                                                        <span onClick={() => this.confirmDeleteLicence(index)}><img width="20px" height="18px" alt="img" src={del} style={{ cursor: 'pointer' }} /></span>
                                                    </td> }
                                                </tr>
                                            </tbody>
                                        </table>


                                    </div>
                                </div>


                                {/* <div className="ssu2_addItem" onClick={this.addLicense}
                     style={{display: this.state.licenses.name?"none":"block"}}>
                        + Add License 
                    </div>                     */}
                            </div>
                        </div>)
                    })}
                    <div className="w3-modal" style={{ display: this.state.showEditModal }} >
                        <div className="w3-modal-content ssu2_modal1" style={{ overflowY: 'auto', maxHeight: 600 }}>
                            <div className="w3-container">
                                <div className="ssu2_modal1_text1">
                                    {this.state.title} License
                                </div>
                                <hr style={{ margin: '30px 0px 0px' }} />
                                <div className="ssu2_modal1_input">
                                    <div className="ssu2_modal1_input ssu2_modal3_selectBox" style={{ marginTop: '30px' }}>
                                        <div className="input_left_icon">
                                            <img height="17px" width="22px" alt="img" src={profile} />
                                        </div>
                                        <input className="ssu2_modal3_select" type="text" placeholder="License Name" value={this.state.lname} onChange={this.setLicenceName}
                                            onKeyUp={(e) => { if (e.key === 'Enter') this.handleSave() }} />
                                    </div>
                                    <ErrorState show={this.state.error.lname} name="License Name is required." />
                                </div>
                                <div className="ssu2_modal1_input">
                                    <div className="ssu2_modal1_input ssu2_modal3_selectBox" style={{ marginTop: '18px' }}>
                                        <div className="input_left_icon">
                                            <img width="22px" height="17px" alt="img" src={profile} />
                                        </div>
                                        <input className="ssu2_modal3_select" placeholder="License Number" type="text" value={this.state.lnum}
                                            onChange={this.setLicenceNum}
                                            onKeyUp={(e) => { if (e.key === 'Enter') this.handleSave() }} />
                                    </div>
                                    <ErrorState name="License Number is requried." show={this.state.error.lnum} />
                                </div>
                                <div className="ssu2_modal1_input" style={{ marginTop: '18px' }}>
                                    <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                        <div className="input_left_icon" onClick={() => $(".ssu2_modal3_date").focus()}>
                                            <img width="22px" height="17px" alt="img" src={calendar} />
                                        </div>
                                        <DatePicker
                                            placeholderText={'Expiration Date'}
                                            className="ssu2_modal3_date"
                                            selected={this.state.expDate}
                                            onChange={(date) => this.setExpDate(date)}
                                        />
                                    </div>
                                    <ErrorState name="Expiration Date is required." show={this.state.error.expDate} />
                                </div>
                                <div className="ssu2_modal1_text2">
                                    Please upload your license
                                </div>
                                <FileBrowser prefix={this.props.num} validateImage={true} fname={this.state.fname} setFile={this.setFile} showFileErr={this.showFileErr} title="LICENSE"
                                    hideFileErr={this.hideFileErr} setImgUrl={this.setImgUrl} file={this.state.fileAdded} setDelFile={this.setDelFile} accept="image/png, image/jpg, image/jpeg" />
                                <ErrorState show={this.state.error.lfile} name="The PNG, JPEG, JPG file is required." />
                                <div className="ssu2_modal1_text2">
                                    Please upload only png, jpg, or jpeg images
                                </div>
                                <hr style={{ margin: '60px 0px 0px' }} />
                                <div className="row ssu_bottom">
                                    <button onClick={this.handleSave} className="ssu2_modal1_button1">
                                {this.state.showLoader ? <Spinner animation="border" /> : 'SAVE'} 
                                         </button>
                                    <button onClick={this.modalClose} className="ssu2_modal1_button2"> CANCEL </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Confirm display={this.state.showConfirm} title={'Delete "' + this.state.confirmTitle + '"'}
                        content={'Are you sure you want to delete "' + this.state.confirmTitle + '"'} agreeFn={this.state.agreeFn}
                        disagreeFn={() => this.setState({ showConfirm: 'none' })} />
                </div>
                {/* <div 
         className="ssu2_addItem" 
         onClick={this.addLicense} style={{display: this.state.showInput?'none':'block'}}
          // onClick={()=>this.setState({showInput: true})}
          >
              + Add {propsLicense && propsLicense.length ? "Another" : ""} Licence 
          </div>  */}
            </>
        );
    }
}

export default NurseLicense;
