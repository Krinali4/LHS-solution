import React from "react";
import { connect } from "react-redux";
import ErrorState from "../staffSignUp/components/errorState";
import logo from "../../assets/images/loginLogo.png";
import email from "../../assets/images/email.svg";
import "./logIn.css";
import ChangePassword from "./ChangePassword";
import { callApi } from "../../../../src/action";
import Loader from "../../modals/Loader";
import Pending from "../../modals/pending";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({});

class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      error: "none",
      showpassword: true,
      userId: "",
      role: "",
      errorMsg: "Valid Email Address is required",
      showLoader: false,
    };
  }

  componentDidMount = () => {
    this.setState({ showpassword: true });
  };

  setEmail = (e) => {
    this.setState({
      email: e.target.value,
      emailErr: "Valid email address is required.",
    });

    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var valid = re.test(String(e.target.value).toLowerCase());
    if (e.target.value !== "" && valid) {
      this.setState({ error: "none" });
    } else if (e.target.value === "") {
      this.setState({ error: "none" });
    } else {
      this.setState({ error: "block" });
    }
  };

  continueToNext = async () => {
    this.setState({ showLoader: true });
    if (this.state.email === "") {
      this.setState({
        error: "block",
        errorMsg: "Valid email address is required",
        showLoader: false,
      });
    } else if (this.state.error !== "block") {
      var data = {
        email: this.state.email,
      };
      var res = await callApi(
        "POST",
        "v1/LHS/general/forgetPassword",
        null,
        data
      );
      if (res.status === 200 || res.Message === "OTP Sent Successfully....") {
        alert("Otp sent to : " + this.state.email + ".");
        console.log(res.userId, "userId");
        console.log(res.role, "role");
        this.setState({
          showpassword: false,
          userId: res.userId,
          role: res.role,
          showLoader: false,
        });
      } else if (res.status === 404 || res.Message === "Email Not Found ...") {
        this.setState({
          showLoader: false,
          error: "block",
          errorMsg: "Email address not found",
        });
      }
    }
  };

  render() {
    return (
      <div className="outer_container" style={{ backgroundColor: "#009CDE" }}>
        <div
          className="main_container"
          style={{ padding: "40px 0px 120px", maxWidth: 720 }}
        >
          <div className="ssu_container" style={{ paddingBottom: "60px" }}>
            <p className="mt-[70px] flex items-center justify-center">
              <img src={logo} alt="img" className="logInLogo" />
            </p>

            <div className="logIn_txt1"> Forgot Password? </div>
            {this.state.showpassword ? (
              <div className="logIn_txt2 forgotPassword_txt2">
                Enter the email address associated with your account, and we’ll
                email you otp to reset your password.
              </div>
            ) : (
              ""
            )}
            <>
              {" "}
              {this.state.showpassword ? (
                <div className="logIn_body">
                  <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                    <div className="input_left_email_icon">
                      <img width="18px" height="15px" alt="img" src={email} />
                    </div>
                    <input
                      className="ssu2_modal3_select"
                      placeholder="Email Address"
                      type="text"
                      value={this.state.email}
                      onChange={this.setEmail}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") this.continueToNext();
                      }}
                    />
                  </div>
                  <ErrorState
                    show={this.state.error}
                    name={this.state.errorMsg}
                  />
                  {/* <div className="logIn_button" onClick={this.continueToNext}>
                    {" "}
                    {this.state.showLoader ? <Loader /> : "SEND OTP"}
                  </div> */}
                  <div
                    className="logIn_button signUp_button mt-5"
                    onClick={() => this.props.history.push("/login")}
                  >
                    LOGIN
                  </div>
                </div>
              ) : (
                <div className="logIn_body">
                  <ChangePassword
                    userId={this.state.userId}
                    role={this.state.role}
                    history={this.props.history}
                  />
                </div>
              )}{" "}
            </>
          </div>
        </div>
      </div>
    );
  }
}

export default LogIn;
