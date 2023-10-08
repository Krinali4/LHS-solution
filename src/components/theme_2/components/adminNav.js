import React from "react";
import { connect } from "react-redux";
import { history } from "../../../store";
import mini_logo from "../../assets/images/mini-logo.svg";
import letter_logo from "../../assets/images/letter-logo.svg";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    type: state.auth.type,
  };
};

const mapDispatchToProps = (dispatch) => ({});

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: [true, false, false, false, false, false, false],
      adminDetails: {},
    };
  }

  componentWillMount = () => {
    let adminDetails = JSON.parse(localStorage.getItem("accessToken"));
    this.setState({
      adminDetails: adminDetails,
    });
    this.initState(this.props);
  };

  componentWillReceiveProps = (props) => {
    this.initState(props);
  };

  initState = (props) => {
    switch (props.curPos) {
      case "":
        this.setState({
          color: [true, false, false, false, false, false, false],
        });
        break;
      case "manageAdmin":
        this.setState({
          color: [false, true, false, false, false, false, false],
        });
        break;
      case "manageStaff":
        this.setState({
          color: [false, false, true, false, false, false, false],
        });
        break;
      case "manageHospital":
        this.setState({
          color: [false, false, false, true, false, false, false],
        });
        break;
      case "manageAttendance":
        this.setState({
          color: [false, false, false, false, true, false, false],
        });
        break;
      case "managePayment":
        this.setState({
          color: [false, false, false, false, false, true, false],
        });
        break;
    }
  };

  navTo = (num) => {
    var color = this.state.color;
    for (var i = 0; i < color.length; i++) color[i] = false;
    color[num] = true;
    console.log(color);
    this.setState({ color: color });
    const links = [
      "",
      "/manageAdmin",
      "/manageStaff",
      "/manageHospital",
      "/manageAttendance",
      "/managePayment",
      "",
    ];
    console.log("/main/admin" + links[num]);
    history.push("/main/admin" + links[num]);
  };

  render() {
    return (
      <div className="theme2_side_nav">
        <div className="theme2_logo_container">
          <img src={mini_logo} alt="mini-logo.png" width="40px" />
          <img
            src={letter_logo}
            alt="letter-logo.png"
            className="theme2_letter_logo"
          />
        </div>
        <div className="theme2_nav_item">
          <Link
            to={"/main/admin"}
            onClick={() => this.navTo(0)}
            style={{
              color: this.state.color[0] ? "#009CDE" : "#333333",
              textDecoration: "none",
            }}
          >
            {" "}
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill={this.state.color[0] ? "#009CDE" : "#333333"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="white"
                strokeWidth="0.8"
                d="M27.6667 1H4.33333C2.5 1 1 2.5 1 4.33333V27.6667C1 29.5 2.5 31 4.33333 31H27.6667C29.5 31 31 29.5 31 27.6667V4.33333C31 2.5 29.5 1 27.6667 1ZM4.33333 27.6667V4.33333H14.3333V27.6667H4.33333ZM27.6667 27.6667H17.6667V16H27.6667V27.6667ZM27.6667 12.6667H17.6667V4.33333H27.6667V12.6667Z"
              />
            </svg>
            <b className="theme2_nav_text"> Dashboard </b>
          </Link>{" "}
        </div>

        {this.state.adminDetails &&
        this.state.adminDetails.permissions[0] === "*" ? (
          <div className="theme2_nav_item">
            <Link
              to={"/main/admin/manageAdmin"}
              onClick={() => this.navTo(1)}
              style={{
                color: this.state.color[1] ? "#009CDE" : "#333333",
                textDecoration: "none",
              }}
            >
              <svg
                width="22"
                height="30"
                viewBox="0 0 22 30"
                fill={this.state.color[1] ? "#009CDE" : "#333333"}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 29H19V24C18.9984 22.6744 18.4711 21.4036 17.5338 20.4662C16.5964 19.5289 15.3256 19.0016 14 19H8C6.6744 19.0016 5.40356 19.5289 4.46622 20.4662C3.52888 21.4036 3.00159 22.6744 3 24V29H1V24C1.00212 22.1441 1.7403 20.3649 3.05259 19.0526C4.36489 17.7403 6.14413 17.0021 8 17H14C15.8559 17.0021 17.6351 17.7403 18.9474 19.0526C20.2597 20.3649 20.9979 22.1441 21 24V29Z"
                  strokeWidth="0.4"
                />
                <path
                  d="M11 3C11.9889 3 12.9556 3.29324 13.7779 3.84265C14.6001 4.39206 15.241 5.17295 15.6194 6.08658C15.9978 7.00021 16.0969 8.00555 15.9039 8.97545C15.711 9.94536 15.2348 10.8363 14.5355 11.5355C13.8363 12.2348 12.9454 12.711 11.9755 12.9039C11.0055 13.0969 10.0002 12.9978 9.08659 12.6194C8.17296 12.241 7.39206 11.6001 6.84266 10.7779C6.29325 9.95561 6 8.98891 6 8C6 6.67392 6.52679 5.40215 7.46447 4.46447C8.40215 3.52678 9.67392 3 11 3V3ZM11 1C9.61553 1 8.26216 1.41054 7.11101 2.17971C5.95987 2.94888 5.06266 4.04213 4.53285 5.32122C4.00303 6.6003 3.86441 8.00777 4.13451 9.36563C4.4046 10.7235 5.07129 11.9708 6.05026 12.9497C7.02922 13.9287 8.2765 14.5954 9.63437 14.8655C10.9922 15.1356 12.3997 14.997 13.6788 14.4672C14.9579 13.9373 16.0511 13.0401 16.8203 11.889C17.5895 10.7378 18 9.38447 18 8C18 6.14348 17.2625 4.36301 15.9497 3.05025C14.637 1.7375 12.8565 1 11 1V1Z"
                  stroke="white"
                  strokeWidth="0.4"
                />
              </svg>
              <b className="theme2_nav_text"> Manage Administrator </b>
            </Link>{" "}
          </div>
        ) : null}

        {this.state.adminDetails &&
        (this.state.adminDetails.permissions.includes("*") ||
          this.state.adminDetails.permissions.includes("Manage Staff")) ? (
          <div className="theme2_nav_item">
            <Link
              to={"/main/admin/manageStaff"}
              onClick={() => this.navTo(2)}
              style={{
                color: this.state.color[2] ? "#009CDE" : "#333333",
                textDecoration: "none",
              }}
            >
              {" "}
              <svg
                width="24"
                height="29"
                viewBox="0 0 32 38"
                fill={this.state.color[2] ? "#009CDE" : "#333333"}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke="white"
                  strokeWidth="0.8"
                  d="M7.234 1.28571L7 2.50521L5.5 10.9427V16.2857H5.641C5.84873 17.7356 6.35614 19.1263 7.1309 20.3692C7.90566 21.6122 8.93079 22.6802 10.141 23.5052C4.7905 25.8002 1 31.1102 1 37.2857H4C3.99757 35.4854 4.40088 33.7076 5.17994 32.0846C5.959 30.4615 7.0938 29.0349 8.5 27.9107V28.8947L8.9215 29.3642L14.9215 35.3642L16 36.3947L17.0785 35.3642L23.0785 29.3642L23.5 28.8947V27.9107C24.9062 29.0349 26.041 30.4615 26.8201 32.0846C27.5991 33.7076 28.0024 35.4854 28 37.2857H31C31 31.1102 27.2095 25.8017 21.859 23.5037C23.069 22.6789 24.0941 21.6111 24.8688 20.3684C25.6436 19.1257 26.1511 17.7353 26.359 16.2857H26.5V10.9412L25 2.50521L24.766 1.28571H7.234ZM9.766 4.28571H22.234L23.5 11.4572V13.2857H8.5V11.4572L9.766 4.28571ZM14.5 5.78571V7.28571H13V10.2857H14.5V11.7857H17.5V10.2857H19V7.28571H17.5V5.78571H14.5ZM8.641 16.2857H23.359C23.0126 17.9811 22.0908 19.5047 20.7496 20.5982C19.4084 21.6917 17.7304 22.2879 16 22.2857C14.2696 22.2879 12.5916 21.6917 11.2504 20.5982C9.90924 19.5047 8.98737 17.9811 8.641 16.2857ZM16 25.2857C17.5401 25.2776 19.0676 25.5643 20.5 26.1302V27.6302L16 32.1302L11.5 27.6302V26.1302C12.9324 25.5643 14.4599 25.2776 16 25.2857Z"
                />
              </svg>
              <b className="theme2_nav_text"> Manage Staff </b>
            </Link>{" "}
          </div>
        ) : null}

        {this.state.adminDetails &&
        (this.state.adminDetails.permissions.includes("*") ||
          this.state.adminDetails.permissions.includes("Manage Hospital")) ? (
          <div className="theme2_nav_item">
            <Link
              to={"/main/admin/manageHospital"}
              onClick={() => this.navTo(3)}
              style={{
                color: this.state.color[3] ? "#009CDE" : "#333333",
                textDecoration: "none",
              }}
            >
              <svg
                width="24"
                height="28"
                viewBox="0 0 32 36"
                fill={this.state.color[3] ? "#009CDE" : "#333333"}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke="white"
                  strokeWidth="0.8"
                  d="M9.57143 17.3393V14.6607C9.57143 14.2169 9.93123 13.8571 10.375 13.8571H13.0536C13.4973 13.8571 13.8571 14.2169 13.8571 14.6607V17.3393C13.8571 17.7831 13.4973 18.1429 13.0536 18.1429H10.375C9.93123 18.1429 9.57143 17.7831 9.57143 17.3393ZM18.9464 18.1429H21.625C22.0688 18.1429 22.4286 17.7831 22.4286 17.3393V14.6607C22.4286 14.2169 22.0688 13.8571 21.625 13.8571H18.9464C18.5027 13.8571 18.1429 14.2169 18.1429 14.6607V17.3393C18.1429 17.7831 18.5027 18.1429 18.9464 18.1429ZM13.8571 23.7679V21.0893C13.8571 20.6455 13.4973 20.2857 13.0536 20.2857H10.375C9.93123 20.2857 9.57143 20.6455 9.57143 21.0893V23.7679C9.57143 24.2116 9.93123 24.5714 10.375 24.5714H13.0536C13.4973 24.5714 13.8571 24.2116 13.8571 23.7679ZM18.9464 24.5714H21.625C22.0688 24.5714 22.4286 24.2116 22.4286 23.7679V21.0893C22.4286 20.6455 22.0688 20.2857 21.625 20.2857H18.9464C18.5027 20.2857 18.1429 20.6455 18.1429 21.0893V23.7679C18.1429 24.2116 18.5027 24.5714 18.9464 24.5714ZM31 32.875V35.2857H1V32.875C1 32.4312 1.3598 32.0714 1.80357 32.0714H3.10938V6.69431C3.10938 5.91638 3.82891 5.28571 4.71652 5.28571H10.6429V2.60714C10.6429 1.71953 11.3624 1 12.25 1H19.75C20.6376 1 21.3571 1.71953 21.3571 2.60714V5.28571H27.2835C28.1711 5.28571 28.8906 5.91638 28.8906 6.69431V32.0714H30.1964C30.6402 32.0714 31 32.4312 31 32.875ZM6.32366 32.0045H13.8571V27.5179C13.8571 27.0741 14.2169 26.7143 14.6607 26.7143H17.3393C17.7831 26.7143 18.1429 27.0741 18.1429 27.5179V32.0045H25.6763V8.5H21.3571V10.1071C21.3571 10.9948 20.6376 11.7143 19.75 11.7143H12.25C11.3624 11.7143 10.6429 10.9948 10.6429 10.1071V8.5H6.32366V32.0045ZM18.8125 5.28571H17.0714V3.54464C17.0714 3.43808 17.0291 3.33589 16.9537 3.26054C16.8784 3.18519 16.7762 3.14286 16.6696 3.14286H15.3304C15.2238 3.14286 15.1216 3.18519 15.0463 3.26054C14.9709 3.33589 14.9286 3.43808 14.9286 3.54464V5.28571H13.1875C13.0809 5.28571 12.9787 5.32805 12.9034 5.4034C12.828 5.47874 12.7857 5.58094 12.7857 5.6875V7.02679C12.7857 7.13335 12.828 7.23554 12.9034 7.31089C12.9787 7.38624 13.0809 7.42857 13.1875 7.42857H14.9286V9.16964C14.9286 9.2762 14.9709 9.3784 15.0463 9.45375C15.1216 9.5291 15.2238 9.57143 15.3304 9.57143H16.6696C16.7762 9.57143 16.8784 9.5291 16.9537 9.45375C17.0291 9.3784 17.0714 9.2762 17.0714 9.16964V7.42857H18.8125C18.9191 7.42857 19.0213 7.38624 19.0966 7.31089C19.172 7.23554 19.2143 7.13335 19.2143 7.02679V5.6875C19.2143 5.58094 19.172 5.47874 19.0966 5.4034C19.0213 5.32805 18.9191 5.28571 18.8125 5.28571Z"
                />
              </svg>
              <b className="theme2_nav_text"> Manage Hospital </b>
            </Link>{" "}
          </div>
        ) : null}

        {this.state.adminDetails.role === "superAdmin" && (
          <div className="theme2_nav_item">
            <Link
              to={"/main/admin/manageAttendance"}
              onClick={() => this.navTo(4)}
              style={{
                color: this.state.color[4] ? "#009CDE" : "#333333",
                textDecoration: "none",
              }}
            >
              <svg
                width="24"
                height="28"
                viewBox="0 0 20 18"
                fill={this.state.color[4] ? "#009CDE" : "#333333"}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.5 3H14V2C13.9992 1.46981 13.7882 0.961564 13.4133 0.586663C13.0384 0.211762 12.5302 0.0007935 12 0H8C7.46981 0.0007935 6.96156 0.211762 6.58666 0.586663C6.21176 0.961564 6.00079 1.46981 6 2V3H2.5C1.83712 3.00053 1.20154 3.26409 0.732818 3.73282C0.264092 4.20154 0.000529668 4.83712 0 5.5V15.5C0.000529668 16.1629 0.264092 16.7985 0.732818 17.2672C1.20154 17.7359 1.83712 17.9995 2.5 18H17.5C18.1629 17.9995 18.7985 17.7359 19.2672 17.2672C19.7359 16.7985 19.9995 16.1629 20 15.5V5.5C19.9995 4.83712 19.7359 4.20154 19.2672 3.73282C18.7985 3.26409 18.1629 3.00053 17.5 3ZM7 2C7 1.73478 7.10536 1.48043 7.29289 1.29289C7.48043 1.10536 7.73478 1 8 1H12C12.2652 1 12.5196 1.10536 12.7071 1.29289C12.8946 1.48043 13 1.73478 13 2V3H7V2ZM19 15.5C19 15.8978 18.842 16.2794 18.5607 16.5607C18.2794 16.842 17.8978 17 17.5 17H2.5C2.10218 17 1.72064 16.842 1.43934 16.5607C1.15804 16.2794 1 15.8978 1 15.5V9.027L6.842 10.975C6.89302 10.9916 6.94635 11 7 11H13C13.0537 11 13.107 10.9916 13.158 10.975L19 9.027V15.5ZM19 8.006C18.9466 8.00401 18.8932 8.01076 18.842 8.026L12.919 10H7.081L1.158 8.025C1.10678 8.00976 1.0534 8.00301 1 8.005V5.5C1 5.10218 1.15804 4.72064 1.43934 4.43934C1.72064 4.15804 2.10218 4 2.5 4H17.5C17.8978 4 18.2794 4.15804 18.5607 4.43934C18.842 4.72064 19 5.10218 19 5.5V8.006Z" />
              </svg>
              <b className="theme2_nav_text"> Manage Attendance </b>
            </Link>{" "}
          </div>
        )}
        {this.state.adminDetails.role === "superAdmin" && (
          <div className="theme2_nav_item">
            <Link
              to={"/main/admin/managePayment"}
              onClick={() => this.navTo(5)}
              style={{
                color: this.state.color[5] ? "#009CDE" : "#333333",
                textDecoration: "none",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={this.state.color[5] ? "#009CDE" : "#333333"}
                width="20"
                height="23"
                viewBox="0 0 20 23"
              >
                <path d="M0 0.857422V20.8574H12.3077V19.319H1.53846V2.39588H9.23077V7.01127H13.8462V8.54973H15.3846V5.93435L15.1538 5.70358L10.5385 1.08819L10.3077 0.857422H0ZM10.7692 3.47281L12.7692 5.47281H10.7692V3.47281ZM3.07692 8.54973V10.0882H12.3077V8.54973H3.07692ZM16.1538 10.0882V11.6267C14.8462 11.8574 13.8462 12.9343 13.8462 14.319C13.8462 15.8574 15 17.0113 16.5385 17.0113H17.3077C17.9231 17.0113 18.4615 17.5497 18.4615 18.1651C18.4615 18.7805 17.9231 19.319 17.3077 19.319H14.6154V20.8574H16.1538V22.3959H17.6923V20.8574C19 20.6267 20 19.5497 20 18.1651C20 16.6267 18.8462 15.4728 17.3077 15.4728H16.5385C15.9231 15.4728 15.3846 14.9343 15.3846 14.319C15.3846 13.7036 15.9231 13.1651 16.5385 13.1651H19.2308V11.6267H17.6923V10.0882H16.1538ZM3.07692 12.3959V13.9343H8.46154V12.3959H3.07692ZM10 12.3959V13.9343H12.3077V12.3959H10ZM3.07692 15.4728V17.0113H8.46154V15.4728H3.07692ZM10 15.4728V17.0113H12.3077V15.4728H10Z" />
              </svg>
              <b className="theme2_nav_text"> Payments </b>
            </Link>{" "}
          </div>
        )}
        {/* <div className="theme2_nav_item" onClick={() => this.navTo(6)} style={{color: this.state.color[6]?"#009CDE":"#333333"}}>
              <svg width="24" height="24" viewBox="0 0 32 32" fill={this.state.color[6]?"#009CDE":"#333333"} xmlns="http://www.w3.org/2000/svg">
                  <path stroke="white" strokeWidth="0.8" d="M27.6667 1H4.33333C2.5 1 1 2.5 1 4.33333V27.6667C1 29.5 2.5 31 4.33333 31H27.6667C29.5 31 31 29.5 31 27.6667V4.33333C31 2.5 29.5 1 27.6667 1ZM4.33333 27.6667V4.33333H14.3333V27.6667H4.33333ZM27.6667 27.6667H17.6667V16H27.6667V27.6667ZM27.6667 12.6667H17.6667V4.33333H27.6667V12.6667Z"/>
              </svg>
              <b className="theme2_nav_text" > CMS </b>
            </div> */}
      </div>
    );
  }
}

export default Navigation;
