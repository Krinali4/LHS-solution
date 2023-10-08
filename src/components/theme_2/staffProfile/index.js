import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import SubHeader from './subHeader';
import Profile from './profile';
import ContactDetails from './contactDetails';
import AccountDetails from './accountDetails';
import ResumeDetail from './resumeDetail';
import ChangePassword from './changePassword';
import { SET_SP_PROFILE, SET_AUTH    } from '../../../constants/actionTypes';
import { callApi, setSession } from '../../../action';
import Header from '../components/header';
import Navigation from '../components/navigation';
import "./dashboard.css"
import NewNavigation from '../components/newNavigation';

const mapStateToProps = state => {
  return { 
    staffProfile: state.staffProfile
  }};

const mapDispatchToProps = dispatch => ({
    setStaffProfile: (data) => dispatch({type: SET_SP_PROFILE, data}),
    setAuth: (data) => dispatch({type: SET_AUTH, data})
});

class StaffProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            curPos: 'profile'
        }
    }

    componentWillMount = async () => {        
        var token = localStorage.getItem('token');
        const _id = localStorage.getItem('_id');
        token = "Bearer " + token;
        var res = await callApi("GET", "v1/LHS/staff/getById/" + _id, token);
        console.log(res.data);
          //t (res.data);
        var data = {            
            name: res.data.name, 
            type: 'staff', 
            avatar: res.data.avatar,
            badge: res.data.badge
        }
        this.props.setAuth(data);
        console.log( ' after setAuth in index staff');
    }
    

    setCurPos = (pos) => {
        this.setState({curPos: pos});
    }
    

    updateDB = async (data) => {
        var token = "Bearer " + localStorage.getItem('token');
        var res = await callApi("POST", "v1/LHS/staff/update/" + this.props.staffProfile._id, token, data);
        setSession( res.token, res.data._id, 'staff');
          //t (res.data);
        return res.Message;
    }
   
   render() {
    return (
        <div className="theme2">
            <NewNavigation />
            <div className="theme2_container">
                <Header page='Profile'/>

                <div className="theme2_main_container">
                {/* <Dashboard /> */}
                {/* <FindJobs /> */}

                    <div className="theme2_body">

                        <SubHeader history={this.props.history} curPos={this.state.curPos}/>                  
                        <Switch>
                            <Route path="/main/staff/profile/changePassword" render={(props) => <ChangePassword {...props} setCurPos={this.setCurPos}  updateDB={this.updateDB}/>}/>
                            <Route path="/main/staff/profile/accountDetails" render={(props) => <AccountDetails {...props} setCurPos={this.setCurPos} />}/>
                            <Route path="/main/staff/profile/resumeDetail" render={(props) => <ResumeDetail {...props} setCurPos={this.setCurPos} />}/>
                            <Route path="/main/staff/profile/contactDetails" render={(props) => <ContactDetails {...props} setCurPos={this.setCurPos} />}/>
                            <Route path="/main/staff/profile"  render={(props) => <Profile {...props} setCurPos={this.setCurPos} />} /> 
                            {/* <Route path="/main/staff/profile"  component={ Profile } exact />  */}
                        </Switch>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default  StaffProfile;
