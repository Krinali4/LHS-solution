import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import React from "react";
import { store, history, persistor } from "./store";

import { Route, Redirect, Switch, BrowserRouter } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";

import { PersistGate} from "redux-persist/integration/react";

import "bootstrap/dist/css/bootstrap.min.css";
import Theme_2 from "./components/theme_2";
import Theme_1 from "./components/theme_1";
import { CometChat } from "@cometchat-pro/chat";
import PrivateRoute from "./components/privteRoute/PriveteRoute";
import Staff from "./components/theme_1/main/staff";
import signUp from "./components/theme_1/logIn/signUp";
import staffSignUp from "./components/theme_1/staffSignUp/staffSignUp";
import staffSignUp_1 from "./components/theme_1/staffSignUp/staffSignUp_1";
import staffSignUp_2 from "./components/theme_1/staffSignUp/staffSignUp_2";
import staffSignUp_3 from "./components/theme_1/staffSignUp/staffSignUp_3";
import staffSignUp_4 from "./components/theme_1/staffSignUp/staffSignUp_4";
import logIn from "./components/theme_1/logIn/logIn";
import forgotPassword from "./components/theme_1/logIn/forgotPassword";
import hospSignUp_1 from "./components/theme_1/hospSignUp/hospSignUp_1";
import hospSignUp_2 from "./components/theme_1/hospSignUp/hospSignUp_2";
import hospSignUp_3 from "./components/theme_1/hospSignUp/hospSignUp_3";
import PaymentSuccess from "./components/theme_1/main/PaymentSuccess";
import homeDetails from "./components/theme_1/main/homeDetails";
import hospital from "./components/theme_1/main/hospital";
import aboutUs from "./components/theme_1/main/aboutUs";
import Notification from "./components/theme_1/main/notification";
import landing from "./components/theme_1/landing";
import HospitalDashboard from "./components/theme_2/HospitalDashboard";
import Admin from "./components/theme_2/admin";
import Dashboard from "./components/theme_2/staffProfile/Dashboard";
import staffProfile from "./components/theme_2/staffProfile";
import hospitalProfile from "./components/theme_2/hospitalProfile";
import FindJobs from "./containers/staff/findJobs/FindJobs";
import MyJob from "./containers/staff/myJobs/myJob";
import JobDetails from "./containers/staff/jobDetails/JobDetails";
import Chat from "./containers/staff/chats/chat";
import Attendance from "./containers/staff/Attendance/Attendance";
import AttendanceDetail from "./containers/staff/Attendance/AttendanceDetail";
import JobOfferDetails from "./containers/staff/jobDetails/JobOfferDetails";
import manageHospitalProfile from "./components/theme_2/admin/components/manageHospitalProfile";
import profile from "./components/theme_2/staffProfile/profile";
import ManageHospitalEdit from "./components/theme_2/admin/components/manageHospitalEdit";
import ManageAttendance from "./components/theme_2/admin/manageAttendance";
import StaffAttendance from "./components/theme_2/admin/staffAttendance";
import ManageHospital from "./components/theme_2/admin/manageHospital";
import ManageStaffEdit from "./components/theme_2/admin/components/manageStaffEdit";
import ManageStaff from "./components/theme_2/admin/manageStaff";
import ManageAdmin from "./components/theme_2/admin/manageAdmin";
import ManageAdminAddEdit from "./components/theme_2/admin/manageAdminAddEdit";
import ChangePassword from "./components/theme_2/staffProfile/changePassword";
import HospitalJobs from "./components/theme_2/admin/hospitalJobs";
import StaffList from "./components/theme_2/admin/staffList";
import SuperAdmin from "./components/theme_1/main/superAdmin";
import LikedPostList from "./components/theme_1/main/likedPostList";
import StaffMyProfile from "./components/theme_2/staffProfile/components/StaffMyProfile";
import StaffMyJob from "./components/theme_2/staffProfile/components/StaffMyJob";
import StaffContactInformation from "./components/theme_2/staffProfile/components/StaffContactInformation";
import StaffResume from "./components/theme_2/staffProfile/components/StaffResume";
import StaffAccountInformation from "./components/theme_2/staffProfile/components/StaffAccountInformation";
import StaffChangePassword from "./components/theme_2/staffProfile/components/StaffChangePassword";
import LikedCommentList from "./components/theme_1/main/likedCommentList";

const appID = "206961e2dbe5aa43";
const region = "us";
const appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(region)
  .build();
CometChat.init(appID, appSetting).then(
  () => {
    console.log("Initialization completed successfully");
  },
  (error) => {
    console.log("Initialization failed with error:", error);
  }
);

const AuthenticatedRoute = (props) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    return <Route {...props} component={props.component} />;
  }
  // initComet();
  return <Redirect to={{ pathname: "/login" }} />;
};

const UnAuthenticatedRoute = (props) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Route {...props} component={props.component} />;
  }
  const type = localStorage.getItem("type");
  return <Redirect to={{ pathname: type }} />;
  // return <Redirect to={{ pathname: '/main/' + type }} />
};
const isAuthenticated = localStorage.getItem("accessToken");

ReactDOM.render(
  // <Provider store={store}>
  //   <PersistGate loading={null} persistor={persistor}>
  //     <ConnectedRouter history={history}>
  <BrowserRouter>
    <Switch>
      <Route path="/" component={landing} exact />
      <PrivateRoute
        path="/staff"
        component={Staff}
        isAuthenticated={isAuthenticated}
      />
      <Route path="/signUp" component={signUp} />
      <Route path="/staffSignUp" component={staffSignUp} />
      <Route path="/staffSignUp_1" component={staffSignUp_1} />
      <Route path="/staffSignUp_2" component={staffSignUp_2} />
      <Route path="/staffSignUp_3" component={staffSignUp_3} />
      <Route path="/staffSignUp_4" component={staffSignUp_4} />
      <Route path="/login" component={logIn} />
      <Route path="/forgotPassword" component={forgotPassword} />
      <Route path="/hospSignUp_1" component={hospSignUp_1} />
      <Route path="/hospSignUp_2" component={hospSignUp_2} />
      <Route path="/hospSignUp_3" component={hospSignUp_3} />
      <PrivateRoute
        path="/paymentsuccess"
        component={PaymentSuccess}
        isAuthenticated={isAuthenticated}
      />
      <PrivateRoute
        path="/homeDetails"
        component={homeDetails}
        isAuthenticated={isAuthenticated}
      />

      <PrivateRoute
        path="/hospital"
        component={hospital}
        isAuthenticated={isAuthenticated}
      />

      <PrivateRoute
        path="/aboutUs"
        component={aboutUs}
        isAuthenticated={isAuthenticated}
      />
      <PrivateRoute
        path="/notification"
        component={Notification}
        isAuthenticated={isAuthenticated}
      />
      <PrivateRoute
        path="/likedPostList"
        component={LikedPostList}
        isAuthenticated={isAuthenticated}
      />
      <PrivateRoute
        path="/likedCommentList"
        component={LikedCommentList}
        isAuthenticated={isAuthenticated}
      />
      {!isAuthenticated && <Redirect to="/logIn" />}

      {/* admin data */}
      <Route path="/main/staff/others" component={HospitalDashboard} />
      {/* <Route path="/main/admin/" component={Admin} /> */}
      <Route path="/main/staff" component={Dashboard} exact />
      <Route path="/main/staff/profile" component={staffProfile} />
      <Route path="/myprofile" component={StaffMyProfile} />
      <Route path="/myJob" component={StaffMyJob} />
      <Route path="/staff-ContactInfo" component={StaffContactInformation} />
      <Route path="/staff-Resume" component={StaffResume} />
      <Route path="/change-password" component={StaffChangePassword} />
      <Route
        path="/staffAccount-Information"
        component={StaffAccountInformation}
      />
      <Route path="/main/hospital/profile" component={hospitalProfile} />
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
      <Route path="/main/staff/job-offer-details" component={JobOfferDetails} />
      <Route path="/main/hospital" component={manageHospitalProfile} />
      <Route path="/main/staff/profile" component={profile} exact />
      <Route path="/main/admin" component={SuperAdmin} exact />
      <Route
        path="/main/admin/manageHospitalEdit"
        render={(props) => <ManageHospitalEdit />}
      />
      <Route
        path="/main/admin/manageAttendance"
        render={(props) => <ManageAttendance />}
      />
      <Route
        path="/main/admin/managePayment"
        render={(props) => <ManangePayment />}
      />
      <Route
        path="/main/admin/hospitalJob"
        render={(props) => <HospitalJobs />}
      />
      <Route
        path="/main/admin/hospital-staffList"
        render={(props) => <StaffList />}
      />
      <Route
        path="/main/admin/hospital-staffAttendance"
        render={(props) => <StaffAttendance />}
      />
      <Route
        path="/main/admin/manageHospital"
        render={(props) => <ManageHospital />}
      />
      <Route
        path="/main/admin/manageStaffEdit"
        render={(props) => <ManageStaffEdit />}
      />
      <Route
        path="/main/admin/manageStaff"
        render={(props) => <ManageStaff />}
      />
      <Route
        path="/main/admin/manageAdmin"
        render={(props) => <ManageAdmin />}
      />
      <Route
        path="/main/admin/admin/add"
        render={(props) => <ManageAdminAddEdit />}
      />
      <Route
        path="/main/admin/change-password"
        render={(props) => <ChangePassword />}
      />
      <Route path="/main/admin" render={(props) => <Dashboard />} />
      {/* <AuthenticatedRoute path="/main" component={Theme_2} /> */}
      {/* <UnAuthenticatedRoute path="/" component={Theme_1} /> */}
    </Switch>
  </BrowserRouter>,
  //     </ConnectedRouter>
  //   </PersistGate>
  // </Provider>,

  document.getElementById("root")
);
