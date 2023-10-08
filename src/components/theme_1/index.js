import React from "react";
import { Route, Switch } from "react-router-dom";
import StaffSignUp from "./staffSignUp/staffSignUp";
import StaffSignUp_2 from "./staffSignUp/staffSignUp_2";
import StaffSignUp_3 from "./staffSignUp/staffSignUp_3";
import StaffSignUp_4 from "./staffSignUp/staffSignUp_4";
import HospSignUp_1 from "./hospSignUp/hospSignUp_1";
import HospSignUp_2 from "./hospSignUp/hospSignUp_2";
import HospSignUp_3 from "./hospSignUp/hospSignUp_3";
import LogIn from "./logIn/logIn";
import ForgotPassword from "./logIn/forgotPassword";
import AboutUs from "./main/aboutUs";
import Hospital from "./main/hospital";
import Staff from "./main/staff";
import PaymentSuccess from "./main/PaymentSuccess";
import Landing from "./landing";
import HomeDetails from "./main/homeDetails";
import PrivateRoute from "../privteRoute/PriveteRoute";
import signUp from "./logIn/signUp";
import Nav from "./Nav";
import staffSignUp_1 from "./staffSignUp/staffSignUp_1";
import Notification from "./main/notification";
import { useEffect } from "react";
import Redirect from "../theme_2/redirect";
import LikedPostList from "./main/likedPostList";
import LikedCommentList from "./main/likedCommentList";

const App = () => {
  const isAuthenticated = localStorage.getItem("accessToken");

  return (
    <div>
      {/* <Header userName={""} history={""} /> */}
      <Nav />
      <p>heheheh</p>
      {/* <Switch> */}
      <Route path="/signUp" component={signUp} />
      <Route path="/staffSignUp" component={StaffSignUp} />
      <Route path="/staffSignUp_1" component={staffSignUp_1} />
      <Route path="/staffSignUp_2" component={StaffSignUp_2} />
      <Route path="/staffSignUp_3" component={StaffSignUp_3} />
      <Route path="/staffSignUp_4" component={StaffSignUp_4} />
      <Route path="/login" component={LogIn} />
      <Route path="/forgotPassword" component={ForgotPassword} />
      <Route path="/hospSignUp_1" component={HospSignUp_1} />
      <Route path="/hospSignUp_2" component={HospSignUp_2} />
      <Route path="/hospSignUp_3" component={HospSignUp_3} />
      <PrivateRoute
        path="/paymentsuccess"
        component={PaymentSuccess}
        isAuthenticated={isAuthenticated}
      />
      <PrivateRoute
        path="/homeDetails"
        component={HomeDetails}
        isAuthenticated={isAuthenticated}
      />

      <PrivateRoute
        path="/hospital"
        component={Hospital}
        isAuthenticated={isAuthenticated}
      />
      <PrivateRoute
        path="/staff"
        component={Staff}
        // isAuthenticated={isAuthenticated}
      />
      <PrivateRoute
        path="/aboutUs"
        component={AboutUs}
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
      <Route path="/" component={Landing} />
      {/* </Switch> */}
    </div>
  );
};

export default App;
