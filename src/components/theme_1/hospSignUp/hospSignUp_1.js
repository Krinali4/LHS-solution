import React, { Component } from "react";
import { connect } from "react-redux";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import user from "../../assets/images/user.svg";
import phoneIcon from "../../assets/images/phone.svg";
import emailIcon from "../../assets/images/email.svg";

import key from "../../assets/images/key.svg";
import role from "../../assets/images/role.svg";
import SubHeader from "../staffSignUp/components/subHeader";
import img from "../../assets/images/1-3.png";
import "./hospSignUp.css";
import {
  SET_HOSP_CONTACTS,
  SET_PAGE_VISITED,
  SET_CUR_POS,
} from "../../../constants/actionTypes";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../../config/axiosConfig";
import {
  showErrorToast,
  showSuccessToast,
} from "../../common/toastMeassage/ToastMeassage";
import ErrorState from "../staffSignUp/components/errorState";
import { callApi } from "../../../action";
const mapStateToProps = (state) => {
  return {
    redo: state.hospSignUp.pageVisited,
    hospContacts: state.hospSignUp.healthcare_contacts,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setPageVisited: (data) => dispatch({ type: SET_PAGE_VISITED, data }),
  setHealthcareContacts: (data) => dispatch({ type: SET_HOSP_CONTACTS, data }),
  setCurPos: (data) => dispatch({ type: SET_CUR_POS, data }),
});
class HospSignUp extends Component {
  // const [showPassword, setShowPassword] = useState(false);
  // const [confirmPassword, setConfirmPassword] = useState(false);
  // const history = useHistory();
  // const dispatch = useDispatch();
  // const redo = useSelector(state => state.hospSignUp.pageVisited);
  // const hospContacts = useSelector(state => state.hospSignUp.healthcare_contacts);

  // const [state, setState] = useState({
  //   fname: '',
  //   lname: '',
  //   email: '',
  //   phone: '',
  //   role: '',
  //   ein: '',
  //   psw: '',
  //   repsw: '',
  //   einMsgError: 'The EIN number is required',
  //   error: {
  //     fname: 'none',
  //     lname: 'none',
  //     email: 'none',
  //     phone: 'none',
  //     psw: 'none',
  //     repsw: 'none',
  //     role: 'none',
  //     ein: 'none',
  //   },
  //   pswErr: 'Password is required',
  //   emailErr: 'Valid email address is required.',
  // });

  // useEffect(() => {
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  //   setState({
  //     fname: hospContacts.first_name,
  //     lname: hospContacts.last_name,
  //     email: hospContacts.company_email_address,
  //     phone: hospContacts.phone_number,
  //     psw: hospContacts.password,
  //     repsw: hospContacts.repassword,
  //     role: hospContacts.role_id,
  //     ein: hospContacts.ein ? hospContacts.ein : ''
  //   });
  //   dispatch({ type: SET_CUR_POS, data: 'signUp' });
  // }, [dispatch, hospContacts]);

  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      isPasswordVisible: false,
      isConfirmPasswordVisible: false,
      psw: "",
      repsw: "",
      phone: "",
      role: "",
      ein: "",
      showLoader: false,
      error: {
        fname: "none",
        lname: "none",
        email: "none",
        psw: "none",
        repsw: "none",
        phone: "none",
        role: "none",
        ein: "none",
      },
    };
  }

  togglePassword = (id) => {
    let input = $("#" + id);
    if (input.attr("type") === "password") {
      input.attr("type", "text");
      $("#c_" + id).hide();
      $("#o_" + id).show();
    } else {
      input.attr("type", "password");
      $("#o_" + id).hide();
      $("#c_" + id).show();
    }
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      isPasswordVisible: !prevState.isPasswordVisible,
    }));
  };
  toggleConfirmPasswordVisibility = () => {
    this.setState((prevState) => ({
      isConfirmPasswordVisible: !prevState.isConfirmPasswordVisible,
    }));
  };

  setVal = (e) => {
    if (e.target.value.length < 250) {
      this.setState({ [e.target.name]: e.target.value });
      if (e.target.value !== "") {
        var error = this.state.error;
        error[e.target.name] = "none";
        this.setState({ error: error });
      }
    }
  };

  // preventNumberInput = (e) => {
  //     var keyCode = (e.keyCode ? e.keyCode : e.which);
  //     if (((keyCode > 47 && keyCode) < 58 || (keyCode > 95 && keyCode < 107)) && keyCode !== 8 && keyCode !== 9) {
  //         e.preventDefault();
  //     }
  // }

  setRole = (e) => {
    if (e.target.value.length < 100) {
      this.setState({ role: e.target.value });
      if (e.target.value !== "") {
        var error = this.state.error;
        error.role = "none";
        this.setState({ error: error });
      }
    }
  };

  setEmail = (e) => {
    this.setState({
      email: e.target.value,
      emailErr: "Valid email address is required.",
    });
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var valid = re.test(String(e.target.value).toLowerCase());
    var error = this.state.error;
    if (e.target.value !== "" && valid) {
      error.email = "none";
      this.setState({ error: error });
    } else {
      error.email = "block";
      this.setState({ error: error });
    }
  };

  setPhone = (e) => {
    if (e.target.value.length < 11) {
      this.setState({ phone: e.target.value });
      var validate;
      if (e.target.value.match(/\d/g))
        if (e.target.value.match(/\d/g).length === 10) validate = true;
        else validate = false;
      else validate = false;

      var error = this.state.error;
      if (e.target.value !== "" && validate) {
        error.phone = "none";
        this.setState({ error: error });
      } else {
        error.phone = "block";
        this.setState({ error: error });
      }
    }
  };

  // formatInput = (e) => {
  //     // Prevent characters that are not numbers ("e", ".", "+" & "-") âœ¨
  //     let checkIfNum;
  //     if (e.key !== undefined) {
  //         // Check if it's a "e", ".", "+" or "-"
  //         checkIfNum = e.key === "e" || e.key === "." || e.key === "+" || e.key === "-";
  //     }
  //     else if (e.keyCode !== undefined) {
  //         // Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
  //         checkIfNum = e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189;
  //     }
  //     return checkIfNum && e.preventDefault();
  // }

  setPsw = (e) => {
    this.setState({ psw: e.target.value });
    var password = e.target.value;
    var error = this.state.error;
    // Do not show anything when the length of password is zero.
    if (password.length === 0) {
      this.setState({ pswErr: "Password is required." });
      error.psw = "block";
      this.setState({ error: error });
      return;
    } else {
      if (password.length < 6) {
        this.setState({
          pswErr:
            "Password should have minimum 6 characters, 1 upper case,  1 lower case, 1 special character and 1 number.",
        });
        error.psw = "block";
        this.setState({ error: error });
      } else {
        // Create an array and push all possible values that you want in password
        var matchedCase = [];
        matchedCase.push("[$@$!%*#?&]"); // Special Charector
        matchedCase.push("[A-Z]"); // Uppercase Alpabates
        matchedCase.push("[0-9]"); // Numbers
        matchedCase.push("[a-z]"); // Lowercase Alphabates

        // Check the conditions
        var ctr = 0;
        for (var i = 0; i < matchedCase.length; i++) {
          if (new RegExp(matchedCase[i]).test(password)) {
            ctr++;
          }
        }
        // Display it
        switch (ctr) {
          case 0:
          case 1:
          case 2:
          case 3:
            this.setState({
              pswErr:
                "Password should have minimum 6 characters, 1 upper case,  1 lower case, 1 special character and 1 number.",
            });
            error.psw = "block";
            this.setState({ error: error });
            break;
          case 4:
            error.psw = "none";
            this.setState({ error: error });
            break;
          default:
            return;
        }
        if (this.state.repsw !== "") {
          var validate = this.state.repsw === e.target.value;
          error = this.state.error;
          if (validate) {
            error.repsw = "none";
            this.setState({ error: error });
          } else {
            error.repsw = "block";
            this.setState({ error: error });
          }
        }
      }
    }
  };

  setRepsw = (e) => {
    var validate = this.state.psw === e.target.value;
    this.setState({ repsw: e.target.value });
    var error = this.state.error;
    if (e.target.value !== "" && validate) {
      error.repsw = "none";
      this.setState({ error: error });
    } else if (e.target.value === "" && this.state.psw === "") {
      error.repsw = "none";
      this.setState({ error: error });
    } else {
      error.repsw = "block";
      this.setState({ error: error });
    }
  };

  setEin = async (e) => {
    this.setState({ ein: e.target.value });
    if (e.target.value !== "") {
      var error = this.state.error;
      error.ein = "none";
      this.setState({ error: error });
    }

    var res = await callApi(
      "GET",
      `v1/LHS/hospital/ein/${e.target.value}`,
      null
    );
    if (res.status === 500) {
      var error = this.state.error;
      error.ein = "block";
      this.setState({
        error: error,
        einMsgError: "EIN Number already present",
      });
    } else {
      var error = this.state.error;
      error.ein = "none";
      this.setState({
        error: error,
        einMsgError: "The EIN number is required",
      });
    }
  };

  goToNext = () => {
    // this.props.setHealthcareContacts({
    //   first_name: this.state.fname,
    //   last_name: this.state.lname,
    //   company_email_address: this.state.email,
    //   phone_number: this.state.phone,
    //   password: this.state.psw,
    //   repassword: this.state.repsw,
    //   role_id: this.state.role,
    //   ein: this.state.ein,
    // });
    // console.log(this.state);
    // var redo = this.props.redo;
    // redo[0] = true;
    // this.props.setPageVisited(redo);

    this.props.history.push("/hospSignUp_2");
  };

  emailRepeatCheck = async () => {
    if (this.state.email !== "") {
      var data = {
        email: this.state.email,
      };
      var res1 = await callApi(
        "POST",
        "v1/LHS/hospital/emailCheck",
        null,
        data
      );
      var res2 = await callApi("POST", "v1/LHS/staff/emailCheck", null, data);
      var res3 = await callApi("POST", "v1/LHS/admin/emailCheck", null, data);
      if (
        res1.result === "OK" &&
        res2.result === "OK" &&
        res3.result === "OK"
      ) {
        this.goToNext();
      } else {
        this.setState({ emailErr: "This Email address is already in use." });
        var err = this.state.error;
        err.email = "block";
        this.setState({ error: err });
      }
    } else {
      var error = this.state.error;
      error.email = "block";
      this.setState({
        error: error,
        emailErr: "Valid Email address is required.",
      });
    }
  };

  continueToNext = () => {
    const { history } = this.props;
    var state = this.state;
    var fname =
      state.error.fname === "block" || state.fname === "" ? "block" : "none";
    var lname =
      state.error.lname === "block" || state.lname === "" ? "block" : "none";
    var email =
      state.error.email === "block" || state.email === "" ? "block" : "none";
    var phone =
      state.error.phone === "block" || state.phone === "" ? "block" : "none";
    var psw =
      state.error.psw === "block" || state.psw === "" ? "block" : "none";
    var repsw =
      state.error.repsw === "block" || state.repsw === "" ? "block" : "none";
    var role =
      state.error.role === "block" || state.role === "" ? "block" : "none";
    var ein =
      state.error.ein === "block" || state.ein === "" ? "block" : "none";

    if (psw === "") {
      this.setState({ pswErr: "Password is required" });
    }

    var error = {
      fname: fname,
      lname: lname,
      email: email,
      phone: phone,
      psw: psw,
      repsw: repsw,
      role: role,
      ein: ein,
    };
    this.setState({ error: { ...error } });

    if (
      fname === "none" &&
      lname === "none" &&
      email === "none" &&
      phone === "none" &&
      psw === "none" &&
      repsw === "none" &&
      role === "none" &&
      ein === "none"
    ) {
      this.emailRepeatCheck();
      window.localStorage.setItem("first_name", this.state.fname);
      window.localStorage.setItem("last_name", this.state.lname);
      window.localStorage.setItem("company_email_address", this.state.email);
      window.localStorage.setItem("phone_number", this.state.phone);
      window.localStorage.setItem("password", this.state.psw);
      window.localStorage.setItem("repassword", this.state.repsw);
      window.localStorage.setItem("role_id", this.state.role);
      window.localStorage.setItem("ein", this.state.ein);
      // this.props.setHealthcareContacts({
      //   first_name: this.state.fname,
      //   last_name: this.state.lname,
      //   company_email_address: this.state.email,
      //   phone_number: this.state.phone,
      //   password: this.state.psw,
      //   repassword: this.state.repsw,
      //   role_id: this.state.role,
      //   ein: this.state.ein,
      // });

      history.push("/hospSignUp_2");
    }
  };

  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPsw, setConfirmPsw] = useState("");
  // const [phone, setPhoneNumber] = useState("");
  // const [showLoader, setShowLoader] = useState(false);

  // const [error, setError] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  //   confirmPsw: "",
  //   phone: "",
  // });

  // useEffect(() => {
  //   setCurPos("logIn");
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }, [setCurPos]);

  // const signUp = async () => {
  //   history.push("/hospSignUp_2");
  // let errorObj = {};
  // if (!name) {
  //   errorObj.name = "First Name is required.";
  // }
  // if (!email) {
  //   errorObj.email = "Email is required.";
  // }
  // if (!password) {
  //   errorObj.password = "Password is required.";
  // }
  // if (!phone) {
  //   errorObj.phone = "Phone Number is required.";
  // }
  // setError(errorObj);
  // try {
  //   let url = "v1/LHS/staff/signup";
  //   const response = await axiosInstance.post(url, {
  //     name: name,
  //     email: email,
  //     password: password,
  //     phone: phone,
  //   });

  //   // Check if the signup was successful
  //   if (response.status === 200) {
  //     localStorage.setItem("login-token", response.data?.token);
  //     setTimeout(() => {
  //       history.push("/logIn");
  //     }, 5000);
  //     showSuccessToast("Account Successfully created");
  //   }
  // } catch (err) {
  //   if (err.response && err.response.status === 403) {
  //     showErrorToast("Email is already in use");
  //   } else {
  //     showErrorToast("Field is required");
  //   }
  // } finally {
  //   setShowLoader(false);
  // }

  render() {
    const { isConfirmPasswordVisible, isPasswordVisible } = this.state;
    return (
      <>
        <ToastContainer />
        <div className="outer_container" style={{ backgroundColor: "#009CDE" }}>
          <div className="main_container" style={{ padding: "30px 0px 120px" }}>
            <div className="ssu_container">
              <SubHeader
                num="1"
                title="Contact Information"
                next="/hospSignUp_2"
                prev={false}
                // redo={this.props.redo[1]}
                history={this.props.history}
                img={img}
              />
              <div
                className="ssu3_body"
                style={{ maxWidth: 800, marginTop: 80 }}
              >
                <div className="hsu1_txt1">Create Your Account</div>
                <div className="hsu1_txt2">
                  Get qualified staff on-demand for your Healthcare Institution
                </div>
                <div
                  className="row ssu2_modal1_input"
                  style={{ marginTop: 60 }}
                >
                  <div className="col-md-6" style={{ padding: 0 }}>
                    <div className="ssu2_modal1_input ssu2_modal3_selectBox hsu1_input1">
                      <div className="input_left_icon">
                        <img width="18px" height="15px" alt="img" src={user} />
                      </div>
                      <input
                        className="ssu2_modal3_select"
                        placeholder="First Name"
                        type="text"
                        // value={name}
                        // onChange={(e) => setName(e.target.value)}
                        value={this.state.fname}
                        name="fname"
                        onChange={this.setVal}
                        onKeyUp={(e) => {
                          if (e.key === "Enter") this.continueToNext();
                        }}
                      />
                    </div>
                    {/* {error.name && (
                      <div className="error_message">{error.name}</div>
                    )} */}

                    <ErrorState
                      show={this.state.error.fname}
                      name="First Name is required."
                    />
                  </div>
                  <div className="col-md-6" style={{ padding: 0 }}>
                    <div className="ssu2_modal1_input ssu2_modal3_selectBox hsu1_input2">
                      <div className="input_left_icon ">
                        <img width="18px" height="15px" alt="img" src={user} />
                      </div>
                      <input
                        className="ssu2_modal3_select"
                        placeholder="Last Name"
                        type="text"
                        value={this.state.lname}
                        name="lname"
                        onChange={this.setVal}
                        onKeyUp={(e) => {
                          if (e.key === "Enter") this.continueToNext();
                        }}
                      />
                    </div>
                    <ErrorState
                      show={this.state.error.lname}
                      name="Last Name is required."
                    />
                  </div>
                </div>
                <div className="ssu2_modal1_input">
                  <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                    <div className="input_left_email_icon">
                      <img
                        width="18px"
                        height="15px"
                        alt="img"
                        src={emailIcon}
                      />
                    </div>
                    {/* <input className="ssu2_modal3_select" placeholder="Company Email Address" type="text" 
                                        /> */}
                    <input
                      className="ssu2_modal3_select"
                      placeholder="Company Email Address"
                      type="text"
                      // value={email}
                      // onChange={(e) => setEmail(e.target.value)}
                      value={this.state.email}
                      name="email"
                      onChange={this.setEmail}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") this.continueToNext();
                      }}
                    />
                  </div>
                  {/* {error.email && (
                    <div className="error_message">{error.email}</div>
                  )} */}

                  <ErrorState
                    show={this.state.error.email}
                    name="Valid Email address is required."
                  />
                </div>
                <div className="ssu2_modal1_input">
                  <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                    <div className="input_left_icon">
                      <img
                        width="18px"
                        height="15px"
                        alt="img"
                        src={phoneIcon}
                      />
                    </div>
                    {/* <input className="ssu2_modal3_select" placeholder="Phone Number" type="number" min="1" max="9999999999" 
                                         /> */}

                    <input
                      className="ssu2_modal3_select"
                      placeholder="Phone Number"
                      type="number"
                      // value={phone}
                      // onChange={(e) => setPhoneNumber(e.target.value)}
                      value={this.state.phone}
                      name="phone"
                      onChange={this.setPhone}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") this.continueToNext();
                      }}
                    />
                  </div>
                  {/* {error.phone && (
                    <div className="error_message">{error.phone}</div>
                  )} */}

                  <ErrorState
                    show={this.state.error.phone}
                    name="10 digits phone number is required."
                  />
                </div>
                <div className="ssu2_modal1_input">
                  <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                    <div className="input_left_icon">
                      <img alt="img" width="18px" height="15px" src={role} />
                    </div>
                    <input
                      className="ssu2_modal3_select"
                      placeholder="Your role in hiring process."
                      type="text"
                      value={this.state.role}
                      name="role"
                      onChange={this.setRole}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") this.continueToNext();
                      }}
                    />
                  </div>
                  <ErrorState
                    show={this.state.error.role}
                    name="The role in hiring process is required. "
                  />
                </div>
                <div className="ssu2_modal1_input">
                  <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                    <div className="input_left_icon">
                      <img width="18px" height="15px" alt="img" src={key} />
                    </div>
                    {/* <input id="psw" className="ssu3_password" placeholder="Password" type="password" 
                                         /> */}
                    <input
                      id="psw"
                      className="ssu3_password"
                      placeholder="Password"
                      type={isPasswordVisible ? "text" : "password"}
                      // value={password}
                      // onChange={(e) => setPassword(e.target.value)}
                      value={this.state.psw}
                      name="psw"
                      onChange={this.setPsw}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") this.continueToNext();
                      }}
                    />
               
                    <div
                      className="ssu3_eye"
                      onClick={this.togglePasswordVisibility}
                    >
                      {isPasswordVisible ? (
                        <VisibilityIcon
                          id="o_psw"
                          style={{ display: "block" }}
                        />
                      ) : (
                        <VisibilityOffIcon
                          id="c_psw"
                          style={{ display: "block" }}
                        />
                      )}
                    </div>
                  </div>
                  {/* {error.password && (
                    <div className="error_message">{error.password}</div>
                  )} */}

                  <ErrorState
                    show={this.state.error.psw}
                    name="Password is required."
                  />
                </div>
                <div className="ssu2_modal1_input">
                  <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                    <div className="input_left_icon">
                      <img width="18px" height="15px" alt="img" src={key} />
                    </div>

                    <input
                      id="repsw"
                      className="ssu3_password"
                      placeholder="Confirm Password"
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      // value={confirmPsw}
                      // onChange={(e) => setConfirmPsw(e.target.value)}
                      value={this.state.repsw}
                      name="repsw"
                      onChange={this.setRepsw}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") this.continueToNext();
                      }}
                    />
                    <div
                      className="ssu3_eye"
                      onClick={this.toggleConfirmPasswordVisibility}
                    >
                      {isConfirmPasswordVisible ? (
                        <VisibilityIcon
                          id="o_psw"
                          style={{ display: "block" }}
                        />
                      ) : (
                        <VisibilityOffIcon
                          id="c_psw"
                          style={{ display: "block" }}
                        />
                      )}
                    </div>
                  </div>
                  <ErrorState
                    show={this.state.error.repsw}
                    name="Doesn't match with the password."
                  />
                </div>
                <div className="ssu2_modal1_input">
                  <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                    <div className="input_left_icon">
                      <img alt="img" width="18px" height="15px" src={role} />
                    </div>
                    <input
                      className="ssu2_modal3_select"
                      placeholder="EIN Number"
                      type="password"
                      value={this.state.ein}
                      name="ein"
                      onChange={this.setEin}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") this.continueToNext();
                      }}
                    />
                  </div>
                  <ErrorState
                    show={this.state.error.ein}
                    name="The EIN number is required."
                  />
                </div>
              </div>

              <hr style={{ margin: "72px 0px 0px" }} />
              <div className="ssu_bottom">
                <div className="ssu_button" onClick={this.continueToNext}>
                  CONTINUE
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default HospSignUp;
