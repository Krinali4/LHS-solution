import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
import { history } from "../../store";
import StaffProfile from "./staffProfile";
import HospitalProfile from "./hospitalProfile";
import AdminDashboard from "./admin";
import HospitalDashboard from "./HospitalDashboard";
import Redirect from "./redirect";
import "../assets/w3.css";
import "./theme2.css";
import "../../containers/staff/staff.css";
import FindJobs from "../../containers/staff/findJobs/FindJobs";
import JobDetails from "../../containers/staff/jobDetails/JobDetails";
import MyJob from "../../containers/staff/myJobs/myJob";
import JobOfferDetails from "../../containers/staff/jobDetails/JobOfferDetails";
import Dashboard from "./staffProfile/Dashboard";
import Chat from "./../../containers/staff/chats/chat";
import Attendance from "../../containers/staff/Attendance/Attendance";
import AttendanceDetail from "../../containers/staff/Attendance/AttendanceDetail";
import profile from "./staffProfile/profile";
class Main extends React.Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <BrowserRouter>
          <Switch>
            <Route path="/main/staff/others" component={HospitalDashboard} />
            <Route path="/main/admin/" component={AdminDashboard} />
            <Route path="/main/staff" component={Dashboard} exact />
            <Route path="/main/staff/profile" component={StaffProfile} />
            <Route path="/main/hospital/profile" component={HospitalProfile} />
            <Route path="/main/staff/find-jobs" component={FindJobs} exact />
            <Route path="/main/staff/my-jobs" component={MyJob} exact />
            <Route path="/main/staff/jobDetails" component={JobDetails} exact />
            <Route path="/main/staff/chats" component={Chat} exact />
            <Route path="/main/staff/attendance" component={Attendance} exact />
            <Route
              path="/main/staff/attendance-detail"
              component={AttendanceDetail}
              exact
            />
            <Route
              path="/main/staff/job-offer-details"
              component={JobOfferDetails}
            />
            <Route path="/main/hospital" component={HospitalProfile} />
            <Route path="/main/staff/profile" component={profile} exact />
            <Route path="/main/" component={Redirect} />
          </Switch>
        </BrowserRouter>
      </ConnectedRouter>
    );
  }
}

export default Main;
