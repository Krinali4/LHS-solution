import React from 'react';
import { connect } from 'react-redux';
import criminal from '../../../assets/images/criminal.svg';
import greenSuccess from '../../../assets/images/greenSuccess.png';
import edit from '../../../assets/images/edit_note.svg';
import keyhole from '../../../assets/images/keyhole.svg';
import del from '../../../assets/images/delete.svg';
import ErrorState from '../../../theme_1/staffSignUp/components/errorState';
import { setSession, callApi } from '../../../../action';
import { SET_SP_PROFILE, SET_AUTH } from '../../../../constants/actionTypes';
import Confirm from "../../../modals/confirm";
const mapStateToProps = state => {
    return {
        _id: state.staffProfile._id,
        socialSecurityNumber: state.staffProfile.socialSecurityNumber
    }
};

const mapDispatchToProps = dispatch => ({
    setStaffProfile: (data) => dispatch({type: SET_SP_PROFILE, data}),
    setAuth: (data) => dispatch({type: SET_AUTH, data})
});

class CriminalRecord extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            oldCriminal: '',
            editCriminal : '',
            criminal: '',
            criminalErr: 'none',
            editCriminalErr: 'SSN is Required',
            showSuccess: 'none',
            showEditModal: 'none',
            title: 'Edit',
            error: {
                criminal: 'none',
                editCriminal : 'none'
            },
            showConfirm: 'none',
            confirmTitle: '',
            agreeFn: false,
        }
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
      if(res.data){  this.setState({ oldCriminal : res.data.socialSecurityNumber })}
        // this.setState({criminal: this.props.socialSecurityNumber, oldCriminal: this.props.socialSecurityNumber });
    }

    componentWillReceiveProps = (props) => {
        // this.setState({criminal: props.socialSecurityNumber, oldCriminal: props.socialSecurityNumber });
    }

    setEditCriminalRecord = async(e) => {
    //    if(this.state.title === 'Edit') {
        console.log(e.target.value, 'ssssssss');
        // if(e.target.value.length < 10){
        //     this.setState({editCriminal : e.target.value});
        //     // if(e.target.value.length){
        //     //     this.setState({editCriminalErr : 'none'});
        //     // }
        // }  
        var error = this.state.error;
        this.setState({ editCriminal: e.target.value });
        console.log(this.state.editCriminal, 'ssnnnnnnnnnn');
        if (e.target.value !== '') {
            error.editCriminal = 'none';
            this.setState({ error: error, editCriminalErr : '' });
        } else {
            error.editCriminal = 'block';
            this.setState({ error: error });
        }
        var res = await callApi("GET", `v1/LHS/staff/ssn/${e.target.value}`, null);
        if(res.status === 500){
            var error = this.state.error;
            error.editCriminal = 'block';
            this.setState({ error: error, editCriminalErr : "SSN Number already present" });
        }
        else{
            var error = this.state.error;
            error.editCriminal = 'none';
            this.setState({ error: error, editCriminalErr : "The SSN number is required" });
        }
    //    }
        // if(e.target.value.length < 10){
        //     this.setState({criminal: e.target.value});
        //     if(e.target.value.length)
        //         this.setState({criminalErr: 'none'});
        // }
    }
    setCriminalRecord = async(e) => {
        //    if(this.state.title === 'Edit') {
            console.log(e.target.value, 'ssssssss');
            // if(e.target.value.length < 10){
            //     this.setState({editCriminal : e.target.value});
            //     // if(e.target.value.length){
            //     //     this.setState({editCriminalErr : 'none'});
            //     // }
            // }  
            var error = this.state.error;
            this.setState({ criminal: e.target.value });
            console.log(this.state.criminal, 'ssnnnnnnnnnn');
            if (e.target.value !== '') {
                error.criminal = 'none';
                this.setState({ error: error, criminalErr : '' });
            } else {
                error.criminal = 'block';
                this.setState({ error: error, criminalErr : 'SSN is required' });
            }
            var res = await callApi("GET", `v1/LHS/staff/ssn/${e.target.value}`, null);
            if(res.status === 500){
                var error = this.state.error;
                error.criminal = 'block';
                this.setState({ error: error, criminalErr : "SSN Number already present" });
            }
            else{
                var error = this.state.error;
                error.criminal = 'none';
                this.setState({ error: error, criminalErr : "The SSN number is required" });
            }
        //    }
            // if(e.target.value.length < 10){
            //     this.setState({criminal: e.target.value});
            //     if(e.target.value.length)
            //         this.setState({criminalErr: 'none'});
            // }
        }
    editOneRow = () => {
        this.setState({
            // number: this.state.tnumber,
            title: 'Edit',
            showEditModal: 'block',
            editCriminal : this.state.oldCriminal
        });
        
    }
    
    confirmDelete = () => {
        this.setState({
            showConfirm: 'block', 
            confirmTitle: 'Social Security Number',
            agreeFn: this.deleteOneRow
        });
    }

    deleteOneRow = async() => {
        var data = {socialSecurityNumber: ''};
        var token =  "Bearer " + localStorage.getItem('token');
        var id = localStorage.getItem('_id');
        var res = await callApi("PUT", "v1/LHS/staff/update/" + id, token, data);
       if(res.data) { 
        this.setState({showConfirm: 'none',
        oldCriminal : '',
        criminal : ''
        // insurance: {}
    });
}
    }

    closeModal = () => {
        var error = this.state.error;
            error.editCriminal = 'none';
        this.setState({showEditModal: 'none', editCriminalErr : '', error : error});
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

    handleEditSubmit = async () => {
        if(this.state.title === 'Edit') {
            if(this.state.editCriminal === '') {
                var error = this.state.error
                error.editCriminal = 'block'
                this.setState({  error: error })
            }
            if(this.state.editCriminal !== '' && this.state.error.editCriminal === 'none') {
            var data = {socialSecurityNumber: this.state.editCriminal};

            var token =  "Bearer " + localStorage.getItem('token');
            var id = localStorage.getItem('_id');
            var res = await callApi("PUT", "v1/LHS/staff/update/" + id, token, data);
            if(res.data) {
                this.componentDidMount();
                this.closeModal();
            }
        } }

    }
    handleSubmit = async () => {
        if(this.state.criminal === ''){
            // this.setState({criminalErr: 'SSN is required'});
            var error = this.state.error
            error.criminal = 'block'
            this.setState({  error: error })
        }
      
       
        // else if (this.state.criminal !== this.state.oldCriminal) {   
            if(this.state.criminal !== '') {             
            var data = {socialSecurityNumber: this.state.criminal};
            // if(this.props.admin)
            // var token =  "Bearer " + localStorage.getItem('token');
            // else
            //     token =  "Bearer " + localStorage.getItem('token');
            // var type = localStorage.getItem('type');
            var token =  "Bearer " + localStorage.getItem('token');
            var id = localStorage.getItem('_id');
            var res = await callApi("PUT", "v1/LHS/staff/update/" + id, token, data);
            // setSession( res.token, res.data._id, type);
            //   //t (res.data);
            if(res.data) {
            this.setState({showSuccess: 'block'});
            var timer = setTimeout(() => {this.setState({showSuccess: 'none'}); clearTimeout(timer); }, 3000);
            this.componentDidMount();
        }
    }
            // data = {            
            //     name: res.data.name, 
            //     type: 'staff', 
            //     avatar: res.data.avatar,
            //     badge: res.data.badge
            // }
            // this.props.setAuth(data);
        // }
    }
    

  render() {
    return (
            <div className="nur_text1" style={{marginTop: '48px'}}>
                <h4 style={{textAlign: 'left'}}>Criminal Record</h4>
                <div className="row t2_sp_avatar_container">

        {this.state.oldCriminal ?         <div className="row" style={{overflowX: 'auto', marginTop: '32px', 
                // display: this.state.insurance.insuranceProvider?"block":"none"
            }}>
                <table style={{minWidth: '800px', marginBottom: '20px', textAlign: 'left'}}>
                        <thead>
                            <tr className="nurseHead">
                                <th style={{paddingLeft: '50px'}} className="t2_sp_licence_th"> Security Number </th>
                                <th style={{width: this.props.admin ? '80px' : '130px'}} className="t2_sp_licence_th"> Action </th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr style={{height: 20}}/>
                        <tr className="t2_sp_licence_row">
                            <td style={{paddingLeft: '50px', }} className="t2_sp_licence_td" >
                                <input className="t2_sp_licence_td" style={{ border : 'none' }} type='password' value={this.state.oldCriminal}/> </td>
                            <td> 
                                <span style={{ marginRight: '20px'}} 
                                onClick={() => this.editOneRow()}>
                                    <img width="20px" height="20px" alt="img"src={edit} style={{cursor: 'pointer'}}/>
                                </span>
                                <span onClick={ this.confirmDelete}><img width="20px" height="18px" alt="img"src={del}  style={{cursor: 'pointer', display: this.props.admin ? 'none' : 'inline'}}/></span> 
                            </td>
                        </tr> 
                        </tbody>                         
                    </table>
                </div> :  "" }
                 {this.state.oldCriminal  ? "" :  
                     <div>      
                    <p style={{textAlign: 'left'}}>Please provide your Social Security Number to allow us run a criminal record background check</p>
                    <div className="row" style={{marginTop: '15px'}}>
                        <div className="col-md-5 col-sl-12">
                            <div className="ssu2_modal1_input ssu2_modal3_selectBox" style={{marginTop: '8px'}}>
                                <div className="input_left_icon">
                                    <img width="22px" height="17px" alt="img"src={criminal}/>
                                </div>
                                <input className="ssu2_modal3_select" placeholder="Social Security Number"  type="number" value={this.state.criminal}
                                onKeyDown={ this.formatInput } onChange={this.setCriminalRecord}  
                                onKeyUp={(e)=>{if(e.key === 'Enter') this.handleSubmit()}}/>
                            </div>
                            <ErrorState show={this.state.error.criminal} name={this.state.criminalErr} />
                        </div>
                        <div className="col-md-3 col-sl-12">
                            <button className="t2_sp_crimianlBtn" style={{marginTop: '8px'}} onClick={this.handleSubmit}>SAVE</button>
                        </div>
                    </div>  </div> 
                     } 
                    <div className="t2_green_success" style={{display: this.state.showSuccess, textAlign: 'left'}}>
                        <img src={greenSuccess} style={{float: 'left', marginRight: 20, width: 32 }} alt="greenSuccess.png" />
                        Social Security #{this.state.criminal} has been added successfully
                    </div>
                </div>  
                <div className="w3-modal " style={{display: this.state.showEditModal}}>
                <div className="w3-modal-content ssu2_modal1 ">
                    <div className="w3-container ">
                        <div className="ssu2_modal1_text1 ">
                            {this.state.title} Security Number
                        </div>
                        <hr style={{margin: '30px 0px 0px'}}/>
                        <div className="ssu2_modal1_input" style={{marginTop: '30px'}}>
                            <div className="ssu2_modal1_input">
                                <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                    <div className="input_left_icon">
                                        <img width="22px" height="23px" alt="img"src={keyhole} style={{marginTop: '-3px'}} />
                                    </div>
                                    <input className="ssu2_modal3_select" placeholder="Social Number" type="password" value={this.state.editCriminal} onChange={this.setEditCriminalRecord}
                                      onKeyDown={ this.formatInput }
                                      onKeyUp={(e)=>{if(e.key === 'Enter') this.handleSubmit()}}/>
                                </div>
                                <ErrorState show={this.state.error.editCriminal} name={this.state.editCriminalErr} />
                            </div>
                        </div>
                        <hr style={{margin: '30px 0px 0px'}}/>
                        <div className="row ssu_bottom">
                            <button className="ssu2_modal1_button1" onClick={  this.handleEditSubmit}> SAVE </button>
                            <button className="ssu2_modal1_button2" onClick={  this.closeModal}> CANCEL </button>
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

export default  CriminalRecord;
