import React from "react";
import { connect } from "react-redux";
import Avatar from "./components/avatar";
import Contact from "./components/contact";
import Institution from "./components/institution";
import Address from "./components/address";
import Locations from "./components/locations";
import SubHeader from "./subHeader";
import Header from "../components/header";
import { Route, Switch } from "react-router-dom";
import ChangePassword from "./ChangePassword";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({});

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curPos: "",
    };
  }
  componentWillReceiveProps = (newProps) => {};

  componentWillMount = async () => {
    this.props.setCurPos("profile");
  };
  setCurPos = (pos) => {
    this.setState({ curPos: pos });
  };

  render() {
    return (
      <div className="theme2">
        <div>
          <Header page="Profile" className="theme2_container" />
          <div className="theme2_main_container">
            <div className="theme2_body">
              <SubHeader
                history={this.props.history}
                curPos={this.state.curPos}
              />
              <Avatar history={this.props.history} />
              <Contact />
              <Institution />
              <Address />
              <Locations />
              {/* <Switch >
            <Route path="/main/hospital/changePassword" render={(props) => <ChangePassword {...props} setCurPos={this.setCurPos}  updateDB={this.updateDB}/>}/>
            </Switch> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
