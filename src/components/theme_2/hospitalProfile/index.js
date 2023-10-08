import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { SET_AUTH, SET_HP_PROFILE } from '../../../constants/actionTypes';
import { callApi, setSession } from '../../../action';
import Dashboard from './Dashboard';
import MyHiring from './MyHiring';
import StaffHiring from './StaffHiring';
import Call from './Call';
import NewNavigation from '../components/newNavigation';
import Profile from './profile';
import ChangePassword from './ChangePassword'
import Attendance from './Attendance';
import AttendanceStaff from './AttendanceStaff';
import AttendanceStaffList from './AttendanceStaffList';


const mapStateToProps = state => {
  return {
      hospitalProfile: state.hospitalProfile
  }};

const mapDispatchToProps = dispatch => ({
    setHospitalProfile: (data) => dispatch({type: SET_HP_PROFILE, data}),
    setAuth: (data) => dispatch({type: SET_AUTH, data})
});
console.log("in index profile");


class HospitalProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            curPos: 'profile'
        }
    }

    componentDidMount = async () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        var token = localStorage.getItem('token');
        const _id = localStorage.getItem('_id');
        token = "Bearer " + token;
        var res = await callApi("GET", "v1/LHS/hospital/getById/" + _id, token);
        console.log(res.data.ein,'after log in ');
        this.props.setHospitalProfile(res.data);
        var data = {            
            name: res.data.name, 
            type: 'hospital', 
            avatar: res.data.avatar,
            badge: res.data.badge,
            hospitalName: res.data.healthCareInstitution.name,
            city: res.data.corporateAddress[0].city,
            state: res.data.corporateAddress[0].state,
            ein: res.data.ein
        }
        console.log(data, 'after hospital login');
        this.props.setAuth(data);
    }

    setCurPos = (pos) => {
        this.setState({curPos: pos});
    }

    updateDB = async (data) => {
        var token = "Bearer " + localStorage.getItem('token');
        var res = await callApi("POST", "v1/LHS/hospital/update/" + this.props.hospitalProfile._id, token, data);
        setSession( res.token, res.data._id, 'hospital');
        this.props.setHospitalProfile(res.data);
        return res.Message;
    }
   
   render() {
    return (        
        <div className="theme2">
            <NewNavigation />
            <div className="theme2_container">
                <Switch>
                    <Route path="/main/hospital/dashboard" component={Dashboard} exact/>
                    <Route path="/main/hospital/staffhiring" component={StaffHiring} />
                    <Route path="/main/hospital/myhiring" component={MyHiring} />
                    <Route path="/main/hospital/chats" component={Call} />
                    <Route path="/main/hospital/attendance" component={Attendance} />
                    <Route path="/main/hospital/attendance-staff" component={AttendanceStaff} />
                    <Route path="/main/hospital/attendance-staff-list" component={AttendanceStaffList} />
                    <Route path="/main/hospital" component={Dashboard} exact/>
                    <Route path='/main/hospital/profile' component={Profile} exact/>
                    <Route path='/main/hospital/profile/changePassword' component={ChangePassword} exact/>
                    {/* <Route path="/main/hospital/profile"  render={(props) => <Profile {...props} setCurPos={this.setCurPos} />} />  */}
                    {/* <Route path="/main/hospital/profile/changePassword"  render={(props) => <ChangePassword {...props} setCurPos={this.setCurPos}  updateDB={this.updateDB}/>} />  */}
                </Switch>
            </div>
        </div>
    );
  }
}

export default HospitalProfile;
