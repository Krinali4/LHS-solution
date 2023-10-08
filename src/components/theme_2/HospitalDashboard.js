import React from 'react';
import { connect } from 'react-redux';
import { SET_AUTH, SET_HP_PROFILE } from '../../constants/actionTypes';

import Header from "./components/header";
import Navigation from './components/navigation';
import Dashboard from './hospitalProfile/Dashboard';


const mapStateToProps = state => {
  return {
      hospitalProfile: state.hospitalProfile
  }};

const mapDispatchToProps = dispatch => ({
    setHospitalProfile: (data) => dispatch({type: SET_HP_PROFILE, data}),
    setAuth: (data) => dispatch({type: SET_AUTH, data})
});

class HospitalDashboard extends React.Component {

  
  render() {
    return (
        <div className="theme2">
            <Navigation />
            <div className="theme2_container">
                <Header />
                {/* <DateHeader /> */}

                <div className="theme2_main_container">
                    {/* <DateHeader /> */}
                    <Dashboard />
                     {/* <div className="theme2_body">
                        <SubHeader history={this.props.history} curPos={this.state.curPos}/>                  
                        <Switch>
                            <Route path="/main/hospital/changePassword" render={(props) => <ChangePassword {...props} setCurPos={this.setCurPos} updateDB={this.updateDB} />}/>
                            <Route path="/main/hospital" render={(props) => <Profile {...props} setCurPos={this.setCurPos} />} />
                        </Switch>
                    </div> */}
                </div>
            </div>
        </div>
    );
  }
}

export default HospitalDashboard;

