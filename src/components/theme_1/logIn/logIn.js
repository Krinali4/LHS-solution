import React, { useState } from "react";
import { connect } from "react-redux";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import key from "../../assets/images/key.svg";
import emailImg from "../../assets/images/email.svg";
import ErrorState from "../staffSignUp/components/errorState";
import logo from "../../assets/images/loginLogo.png";
import "./logIn.css";
import { useHistory } from "react-router-dom";
import { axiosInstance } from "../../../config/axiosConfig";
import { showSuccessToast } from "../../common/toastMeassage/ToastMeassage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../modals/Loader";

const LogIn = () => {
  const history = useHistory();
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loginFunc = async (role) => {
    console.log(role, "rolerolerole");
    await axiosInstance
      .post(`v1/LHS/${role}/login`, {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response?.data?.type == "OK") {
          setIsLoading(false);
          localStorage.setItem("accessToken", response?.data?.token);
          localStorage.setItem("type", response.data?.data?.role);
          showSuccessToast("Login Successfully");
          window.location.href = `${
            role == "admin" ? "/main/admin" : `/${role}`
          }`;
          // history.push(`${role == "admin" ? "/main/admin" : `/${role}`}`);
        } else {
          console.log("Login failed.");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error.response:", error);
        if (error.response.status == 406) {
          toast.error(
            "Wrong password. Please try again or use Forgot Password."
          );
        }
      });
  };
  const handleLogin = async () => {
    emailRepeatCheck(email);
    setIsLoading(true);
  };

  const [disablebtn, setdisablebtn] = useState(false);

  const emailRepeatCheck = async (email) => {
    var data = {
      email: email,
    };
    var res1 = await axiosInstance.post("v1/LHS/hospital/emailCheck", data);
    var res2 = await axiosInstance.post("v1/LHS/staff/emailCheck", data);
    var res3 = await axiosInstance.post("v1/LHS/admin/emailCheck", data);
    if (
      (res1?.data?.result == "OK" &&
        res2.data?.result == "REPEAT" &&
        res3.data?.result == "OK") ||
      (res1?.data?.result == "REPEAT" &&
        res2.data?.result == "REPEAT" &&
        res3.data?.result == "OK")
    ) {
      loginFunc("staff");
    }
    if (
      res1?.data?.result == "OK" &&
      res2.data?.result == "OK" &&
      res3.data?.result == "REPEAT"
    ) {
      loginFunc("admin");
    }
    if (
      res1?.data?.result == "REPEAT" &&
      res2.data?.result == "OK" &&
      res3.data?.result == "OK"
    ) {
      loginFunc("hospital");
    }
    if (
      res1?.data?.result == "OK" &&
      res2.data?.result == "OK" &&
      res3.data?.result == "OK"
    ) {
      setdisablebtn(true);
    }
  };
  // useEffect(() => {
  //   if (email) {
  //     emailRepeatCheck(email);
  //   }
  // }, []);
  const handleChange = (e) => {
    setUsername(e.target.value);
    // emailRepeatCheck(e.target.value);
  };

  const handleSignUpClick = () => {
    history.push("/signUp");
  };

  return (
    <>
      <ToastContainer />
      <div className="outer_container" style={{ backgroundColor: "#009CDE" }}>
        <div
          className="main_container"
          style={{ padding: "40px 0px 120px", maxWidth: 720 }}
        >
          <div className="ssu_container" style={{ paddingBottom: "60px" }}>
            <p className="mt-[70px] flex items-center justify-center">
              <img alt="img" src={logo} className="logInLogo" />
            </p>

            <div className="logIn_txt1"> Log in </div>
            <div className="logIn_txt2"> Welcome to LinkHealthStaff </div>
            <div className="logIn_body">
              {/* Email Input */}
              <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                <div className="input_left_email_icon">
                  <img width="18px" height="15px" alt="img" src={emailImg} />
                </div>

                <input
                  className="ssu2_modal3_select"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={handleChange}
                />
              </div>
              {disablebtn && <p className="error-code">Email does not exist</p>}
              {/* Password Input */}
              <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                <div className="input_left_icon">
                  <img width="18px" height="15px" alt="img" src={key} />
                </div>

                <input
                  id="psw"
                  className="ssu3_password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="ssu3_eye">
                  <VisibilityOffIcon
                    id="c_psw"
                    style={{ display: showPassword ? "none" : "block" }}
                    onClick={() => setShowPassword(true)}
                  />
                  <VisibilityIcon
                    id="o_psw"
                    style={{ display: showPassword ? "block" : "none" }}
                    onClick={() => setShowPassword(false)}
                  />
                </div>
              </div>
              <ErrorState show={""} />

              <p
                className="login_letterBtn"
                onClick={() => history.push("/forgotPassword")}
              >
                Forgot your password?
              </p>

              <button
                className="logIn_button"
                disabled={disablebtn}
                style={{
                  backgroundColor: disablebtn ? "gray" : " #009CDE",
                }}
                onClick={() => handleLogin()}
              >
                {isLoading ? <Loader /> : "LOGIN"}
              </button>

              <p className="login_txt3"> Don't have an account? </p>
              <div
                className="logIn_button signUp_button"
                onClick={handleSignUpClick}
              >
                SIGN UP
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
