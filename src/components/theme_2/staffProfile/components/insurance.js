import React from 'react';
import { connect } from 'react-redux';
import edit from '../../../assets/images/edit_note.svg';
import del from '../../../assets/images/delete.svg';
import keyhole from '../../../assets/images/keyhole.svg';
import ErrorState from "../../../theme_1/staffSignUp/components/errorState";
import Confirm from "../../../modals/confirm";
import { setSession, callApi } from '../../../../action';
import { SET_SP_PROFILE, SET_AUTH } from '../../../../constants/actionTypes';
const mapStateToProps = state => {
    return {
        _id: state.staffProfile._id,
        // liablityInsurance: state.staffProfile.liablityInsurance
    }
};

const mapDispatchToProps = dispatch => ({
    setStaffProfile: (data) => dispatch({type: SET_SP_PROFILE, data}),
    setAuth: (data) => dispatch({type: SET_AUTH, data})
});

class Insurance extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            insurance: {},
            //--- add & edit modal
            provider: '',
            tprovider: '',
            number: '',
            tnumber: '',
            showEditModal: 'none',
            error: {
                provider: 'none',
                number: 'none',
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
        this.setState({insurance: {...this.props.liablityInsurance}});
        // this.initState(this.props);
        this.props.setCurPos('insurance');
    }
    componentDidMount = async() => {
        // window.scrollTo({top: 0, behavior: 'smooth'});
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
        this.setState({ tprovider : res.data.liabilityInsurance.insuranceProvider,
        tnumber : res.data.liabilityInsurance.policyNumber
        })}
        // console.log(this.state.insurance)
  
      }

    componentWillReceiveProps = (newProps) => { 
        this.setState({insurance: {...newProps.liablityInsurance}});
        this.componentDidMount();
    }

    updateDB = async (insurance) => {
        var data = {liablityInsurance: insurance};
        if(this.props.admin)
            var token =  "Bearer " + localStorage.getItem('token');
        else
            token =  "Bearer " + localStorage.getItem('token');
        var type = localStorage.getItem('type');
        var _id = this.props._id;
        var res = await callApi("POST", "v1/LHS/staff/update/" + _id, token, data);
        setSession( res.token, res.data._id, type);
          //t (res.data);
        data = {            
            name: res.data.name, 
            type: 'staff', 
            avatar: res.data.avatar,
            badge: res.data.badge
        }
        this.props.setAuth(data);
    }

    //---- delete confirm alert

    confirmDelete = () => {
        this.setState({
            showConfirm: 'block', 
            confirmTitle: this.state.tprovider,
            agreeFn: this.deleteOneRow
        });
    }

    deleteOneRow = async() => {
        // this.setState({showConfirm: 'none', insurance: {}});
        var data = { 
            liabilityInsurance : {
            insuranceProvider: '',
            policyNumber : ''
        }}
        console.log(data);
        var token =  "Bearer " + localStorage.getItem('token')
        var id = window.localStorage.getItem('_id')
        var res = await callApi("PUT", `v1/LHS/staff/update/${id}`, token, data);
     
         console.log(res.data.liabilityInsurance.insuranceProvider);
         if(res.data){
         this.setState({
             tprovider :'',
             tnumber :'',
             showConfirm: 'none'
         })}
        // this.updateDB({});

    }

    //---- add & edit modal show and hide

    editOneRow = () => {
        this.setState({
            provider: this.state.tprovider,
            number: this.state.tnumber,
            title: 'Edit',
            showEditModal: 'block'
        });
        console.log(this.state.provider);
    }

    showAddModal = () => {
        this.setState({
            showEditModal: 'block', 
            provider: '',
            number: '',
            title: 'Add',
        });
    }

    closeModal = () => {
        this.setState({showEditModal: 'none'});
    }

    //--- add & edit modal fuctions

    setProvider = (e) => {
        if(e.target.value.length < 51){
            this.setState({provider: e.target.value});
            if (e.target.value !== ''){
                var err = this.state.error;
                err.provider = 'none';
                this.setState({error: err});
            }
        }
    }

    setNumber = (e) => {
        if(e.target.value.length < 51){
            this.setState({number: e.target.value});
            if(e.target.value !== ''){
                var err = this.state.error;
                err.number = 'none';
                this.setState({error: err});
            }
        }
    }

    setInsurance = async() => {
        // console.log(params);
        var provider = this.state.provider === '' ? 'block' : 'none';
        var number = this.state.number === '' ? 'block' : 'none';
        this.setState({error: {provider: provider, number: number}});

 if (this.state.title === 'Edit') {
    //  this.state.provider = this.state.tprovider
    //  this.state.number = this.state.tnumber
     console.log(this.state.provider, 'for edit');
     if(provider === 'none' && number === 'none') {
        var data = { 
            liabilityInsurance : {
            insuranceProvider: this.state.provider,
            policyNumber : this.state.number
        }}
        console.log(data);
        var token =  "Bearer " + localStorage.getItem('token')
        var id = window.localStorage.getItem('_id')
        var res = await callApi("PUT", `v1/LHS/staff/update/${id}`, token, data);
     
         console.log(res.data.liabilityInsurance.insuranceProvider);
         if(res.data){
         this.setState({
             tprovider :res.data.liabilityInsurance.insuranceProvider,
             tnumber :res.data.liabilityInsurance.policyNumber,

         })}
         console.log(this.state.tprovider);
        this.closeModal();
    }}
    if (this.state.title === 'Add') {
        //  this.state.provider = this.state.tprovider
        //  this.state.number = this.state.tnumber
         console.log(this.state.provider, 'for edit');
         if(provider === 'none' && number === 'none') {
            var data = { 
                liabilityInsurance : {
                insuranceProvider: this.state.provider,
                policyNumber : this.state.number
            }}
            console.log(data);
            var token =  "Bearer " + localStorage.getItem('token')
            var id = window.localStorage.getItem('_id')
            var res = await callApi("PUT", `v1/LHS/staff/update/${id}`, token, data);
         
             console.log(res.data.liabilityInsurance.insuranceProvider);
             if(res.data){
             this.setState({
                 tprovider :res.data.liabilityInsurance.insuranceProvider,
                 tnumber :res.data.liabilityInsurance.policyNumber,
    
             })}
             console.log(this.state.tprovider);
            this.closeModal();
            this.componentDidMount();
        }}
        

        // if(provider === 'none' && number === 'none'){
        //     var newInsurance = {
        //         insuranceProvider: this.state.provider,
        //         policyNumber: this.state.number
        //     }
        //     this.setState({showEditModal: 'none', insurance: newInsurance});
        //     this.updateDB(newInsurance);
        // }
    }

  render() {
    //   var propsInsurance = this.props.staff
    //   {console.log(propsInsurance)}
    return (
        <div>
            <div className="nur_text1" style={{marginTop: '60px'}}>
                <h4 style={{textAlign: 'left'}}>Liability Insurance</h4>
                <hr className="t2_sp_hr"/>
                {this.state.tprovider ?          <div className="row" style={{overflowX: 'auto', marginTop: '32px', 
                // display: this.state.insurance.insuranceProvider?"block":"none"
            }}>
              <table style={{minWidth: '800px', marginBottom: '20px', textAlign: 'left'}}>
                        <thead>
                            <tr className="nurseHead">
                                <th style={{paddingLeft: '50px'}} className="t2_sp_licence_th"> Insurance provider </th>
                                <th className="t2_sp_licence_th" > Policy number </th>
                         {this.state.isAdmin ? '' :       <th style={{width: this.props.admin ? '80px' : '130px'}} className="t2_sp_licence_th"> Action </th> }
                            </tr>
                        </thead>
                        <tbody>
                        <tr style={{height: 20}}/>
                        <tr className="t2_sp_licence_row">
                            <td style={{paddingLeft: '50px'}} className="t2_sp_licence_td" value={this.state.tprovider}> {this.state.tprovider} </td>
                            <td className="t2_sp_licence_td" value={this.state.tnumber}> {this.state.tnumber} </td>
                            {this.state.isAdmin ? '' :  <td> 
                                <span style={{ marginRight: '20px'}} onClick={() => this.editOneRow()}>
                                    <img width="20px" height="20px" alt="img"src={edit} style={{cursor: 'pointer'}}/>
                                </span>
                                <span onClick={ this.confirmDelete}><img width="20px" height="18px" alt="img"src={del}  style={{cursor: 'pointer', display: 'inline'}}/></span> 
                            </td>}
                        </tr> 
                        </tbody>                         
                    </table> 
                </div>: '' }
            {(this.state.tprovider || this.state.isAdmin) ? '' :     <div className="ssu2_addItem" onClick={ this.showAddModal}
                    // style={{display: !propsInsurance.insuranceProvider?"none":"block"}}
                    >
                    + Add {this.state.tprovider && this.state.tprovider ? 'Another' : ''} Insurance 
                </div>    }                             
            </div> 
            <div className="w3-modal " style={{display: this.state.showEditModal}}>
                <div className="w3-modal-content ssu2_modal1 ">
                    <div className="w3-container ">
                        <div className="ssu2_modal1_text1 ">
                            {this.state.title} Liability Insurance
                        </div>
                        <hr style={{margin: '30px 0px 0px'}}/>
                        <div className="ssu2_modal1_input" style={{marginTop: '30px'}}>
                            <div className="ssu2_modal1_input">
                                <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                    <div className="input_left_icon">
                                        <img width="22px" height="23px" alt="img"src={keyhole} style={{marginTop: '-3px'}} />
                                    </div>
                                    <input className="ssu2_modal3_select" placeholder="Insurance provider" type="text" value={this.state.provider} onChange={this.setProvider}
                                        onKeyUp={(e)=>{if(e.key === 'Enter') this.setInsurance()}}/>
                                </div>
                                <ErrorState show={this.state.error.provider} name="Insurance provider is required." />
                            </div>
                        </div>
                        <div className="ssu2_modal1_input">
                            <div className="ssu2_modal1_input">
                                <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                    <div className="input_left_icon">
                                        <img width="22px" height="23px" alt="img"src={keyhole} style={{marginTop: '-3px'}} />
                                    </div>
                                    <input className="ssu2_modal3_select" placeholder="Policy number" type="text" value={this.state.number} onChange={this.setNumber}
                                        onKeyUp={(e)=>{if(e.key === 'Enter') this.setInsurance()}}/>
                                </div>
                                <ErrorState show={this.state.error.number} name="Policy number is required." />
                            </div>
                        </div>
                        <hr style={{margin: '30px 0px 0px'}}/>
                        <div className="row ssu_bottom">
                            <button className="ssu2_modal1_button1" onClick={ () => this.setInsurance()}> SAVE </button>
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

export default  Insurance;
