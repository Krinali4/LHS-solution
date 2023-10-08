import React, { useEffect, useState } from "react";
import "./dashboard.css";
import Header from "../components/header";
import DateHeader from "./DateHeader";
import axios from "axios";

const Dashboard = () => {
  const AuthStr = "Bearer ".concat(window.localStorage.getItem("login-token"));
  const [dashboardData, setDashboardData] = useState("");
  const [viewStaffData, setViewStaffData] = useState("");

  let newDate = new Date();
  let options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}v1/LHS/hospital/dashboard`,
        { headers: { Authorization: AuthStr } }
      );
      const data = res.data.data;
      console.log(data);
      setDashboardData(data);
      console.log();
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}v1/LHS/staff/getById/61d3d9ca092ee55ae4290558`, { headers: { Authorization: AuthStr } })
      // console.log(response.data.data);
      // setViewStaffData(response.data.data)
      // console.log(setViewStaffData + ' staff by id data ');
    };
    fetchData();
  }, []);

  return (
    <div>
      <Header page="Dashboard" />
      <div className="theme2_main_container">
        <div className="date_header">
          {Intl.DateTimeFormat("en-US", options).format(newDate)}
        </div>
        <div className="dashboard_main">
          <div className="staff_contract">
            <h3> Staff Contract Overview </h3>
            <div className="row first_row">
              <div className="col-sm-6 col-md-6">
                <div className="card" style={{ marginLeft: "10px" }}>
                  <div className="card_body_1">
                    <div className="container">
                      <div className="row row_first">
                        <div className="col-6 p-0" style={{ float: "left" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="80"
                            height="80"
                            viewBox="0 0 80 80"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0 40C0 62.0914 17.9086 80 40 80V40H0Z"
                              fill="#F2994A"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M80 40C80 62.0914 62.0914 80 40 80V40H80Z"
                              fill="#EBEBEB"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0 40C0 17.9086 17.9086 0 40 0V40H0Z"
                              fill="#F2994A"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M80 40C80 17.9086 62.0914 0 40 0V40H80Z"
                              fill="#F2994A"
                            />
                          </svg>
                        </div>
                        <div
                          className="col-6 p-0"
                          style={{ float: "right", textAlign: "center" }}
                        >
                          <p>{dashboardData.activeContracts}</p>
                          <p>Contracts in Progress</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="card" style={{ marginRight: "10px" }}>
                  <div className="card_body_2">
                    <div className="container">
                      <div className="row">
                        <div className="col-6 p-0" style={{ float: "left" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="80"
                            height="80"
                            viewBox="0 0 80 80"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0 40C0 62.0914 17.9086 80 40 80V40H0Z"
                              fill="#6FCF97"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M80 40C80 62.0914 62.0914 80 40 80V40H80Z"
                              fill="#6FCF97"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0 40C0 17.9086 17.9086 0 40 0V40H0Z"
                              fill="#6FCF97"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M80 40C80 17.9086 62.0914 0 40 0V40H80Z"
                              fill="#6FCF97"
                            />
                            <circle
                              cx="40.02"
                              cy="40.02"
                              r="31.02"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <div
                          className="col-6 p-0"
                          style={{ float: "right", textAlign: "center" }}
                        >
                          <p>{dashboardData.contractsCompleted}</p>
                          <p> Contracts completed </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bottom_card" style={{ marginTop: "40px" }}>
              <div className="card_body_3">
                <div className="container">
                  <div className="row">
                    <div className=" col col_logo">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="62"
                        height="55"
                        viewBox="0 0 62 55"
                        fill="none"
                      >
                        <path
                          d="M56.7144 7.13376H61.0001V24.2766H56.7144V7.13376Z"
                          fill="#6FCF97"
                          stroke="white"
                        />
                        <path
                          d="M46 0.70517H50.2857V24.2766H46V0.70517Z"
                          fill="#6FCF97"
                          stroke="white"
                        />
                        <path
                          d="M35.2856 11.4194H39.5714V24.2766H35.2856V11.4194Z"
                          fill="#6FCF97"
                          stroke="white"
                        />
                        <path
                          d="M31 54.2766H26.7143V41.4195C26.7126 39.715 26.0347 38.0809 24.8295 36.8756C23.6243 35.6704 21.9902 34.9926 20.2857 34.9909H11.7143C10.0098 34.9926 8.3757 35.6704 7.17048 36.8756C5.96526 38.0809 5.28742 39.715 5.28571 41.4195V54.2766H1V41.4195C1.0034 38.5789 2.13332 35.8556 4.1419 33.8471C6.15048 31.8385 8.87372 30.7086 11.7143 30.7052H20.2857C23.1263 30.7086 25.8495 31.8385 27.8581 33.8471C29.8667 35.8556 30.9966 38.5789 31 41.4195V54.2766Z"
                          fill="#6FCF97"
                          stroke="white"
                        />
                        <path
                          d="M15.9999 9.2766C17.2714 9.2766 18.5143 9.65363 19.5715 10.36C20.6286 11.0664 21.4526 12.0704 21.9392 13.2451C22.4257 14.4197 22.553 15.7123 22.305 16.9593C22.0569 18.2063 21.4447 19.3518 20.5456 20.2509C19.6466 21.1499 18.5011 21.7622 17.2541 22.0102C16.0071 22.2583 14.7145 22.131 13.5398 21.6444C12.3652 21.1578 11.3612 20.3339 10.6548 19.2767C9.94839 18.2195 9.57136 16.9766 9.57136 15.7052C9.57136 14.0002 10.2487 12.3651 11.4542 11.1595C12.6598 9.9539 14.295 9.2766 15.9999 9.2766ZM15.9999 4.99089C13.8809 4.99089 11.8094 5.61927 10.0474 6.79657C8.28544 7.97387 6.91216 9.64722 6.10123 11.605C5.29029 13.5628 5.07811 15.7171 5.49152 17.7954C5.90493 19.8738 6.92537 21.7829 8.42379 23.2813C9.92221 24.7797 11.8313 25.8002 13.9097 26.2136C15.9881 26.627 18.1423 26.4148 20.1001 25.6039C22.0579 24.7929 23.7312 23.4197 24.9085 21.6577C26.0858 19.8958 26.7142 17.8243 26.7142 15.7052C26.7142 14.2982 26.4371 12.9049 25.8986 11.605C25.3602 10.3051 24.571 9.12395 23.5761 8.12903C22.5812 7.13412 21.4 6.34491 20.1001 5.80647C18.8002 5.26802 17.407 4.99089 15.9999 4.99089Z"
                          fill="#6FCF97"
                          stroke="white"
                        />
                      </svg>
                    </div>
                    <div className="col">
                      {" "}
                      <hr />{" "}
                    </div>
                    <div
                      className="col"
                      style={{ float: "right", textAlign: "center" }}
                    >
                      <p>{dashboardData.totalContracts}</p>
                      <p> Total </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="staff_hiring">
            <h3> Staff Hiring Overview </h3>
            <div className="card bottom_card">
              <div className="card_body_3">
                <div className="container">
                  <div className="row">
                    <div className="col col_logo">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="52"
                        height="52"
                        viewBox="0 0 52 52"
                        fill="none"
                      >
                        <path
                          d="M51 51H47.4286V42.0714C47.4257 39.7043 46.4841 37.4349 44.8103 35.7611C43.1365 34.0873 40.8671 33.1457 38.5 33.1429V29.5714C41.814 29.5752 44.9913 30.8934 47.3347 33.2368C49.678 35.5802 50.9962 38.7574 51 42.0714V51Z"
                          fill="#009CDE"
                          stroke="white"
                        />
                        <path
                          d="M36.7143 51H33.1429V42.0714C33.14 39.7043 32.1984 37.4349 30.5246 35.7611C28.8508 34.0873 26.5814 33.1457 24.2143 33.1429H13.5C11.1329 33.1457 8.8635 34.0873 7.18968 35.7611C5.51586 37.4349 4.57426 39.7043 4.57143 42.0714V51H1V42.0714C1.00378 38.7574 2.32196 35.5802 4.66534 33.2368C7.00873 30.8934 10.186 29.5752 13.5 29.5714H24.2143C27.5283 29.5752 30.7056 30.8934 33.0489 33.2368C35.3923 35.5802 36.7105 38.7574 36.7143 42.0714V51Z"
                          fill="#009CDE"
                          stroke="white"
                        />
                        <path
                          d="M33.1428 1V4.57143C35.5108 4.57143 37.7818 5.51211 39.4563 7.18655C41.1307 8.86098 42.0714 11.132 42.0714 13.5C42.0714 15.868 41.1307 18.139 39.4563 19.8135C37.7818 21.4879 35.5108 22.4286 33.1428 22.4286V26C36.458 26 39.6375 24.683 41.9817 22.3388C44.3259 19.9946 45.6428 16.8152 45.6428 13.5C45.6428 10.1848 44.3259 7.00537 41.9817 4.66116C39.6375 2.31696 36.458 1 33.1428 1Z"
                          fill="#009CDE"
                          stroke="white"
                        />
                        <path
                          d="M18.8572 4.57143C20.6231 4.57143 22.3493 5.09508 23.8176 6.07616C25.2859 7.05725 26.4303 8.4517 27.1061 10.0832C27.7819 11.7147 27.9587 13.5099 27.6142 15.2419C27.2697 16.9738 26.4193 18.5648 25.1706 19.8135C23.922 21.0621 22.331 21.9125 20.5991 22.257C18.8671 22.6015 17.0718 22.4247 15.4404 21.7489C13.8089 21.0731 12.4144 19.9287 11.4333 18.4604C10.4523 16.9922 9.92861 15.2659 9.92861 13.5C9.92861 11.132 10.8693 8.86098 12.5437 7.18655C14.2182 5.51211 16.4892 4.57143 18.8572 4.57143ZM18.8572 1C16.3849 1 13.9682 1.73311 11.9126 3.10663C9.85694 4.48015 8.25478 6.43238 7.30869 8.71646C6.36259 11.0005 6.11505 13.5139 6.59737 15.9386C7.07968 18.3634 8.27019 20.5907 10.0183 22.3388C11.7665 24.087 13.9938 25.2775 16.4186 25.7598C18.8433 26.2421 21.3566 25.9946 23.6407 25.0485C25.9248 24.1024 27.877 22.5002 29.2506 20.4446C30.6241 18.389 31.3572 15.9723 31.3572 13.5C31.3572 10.1848 30.0402 7.00537 27.696 4.66116C25.3518 2.31696 22.1724 1 18.8572 1Z"
                          fill="#009CDE"
                          stroke="white"
                        />
                      </svg>
                    </div>
                    <div className="col">
                      {" "}
                      <hr />{" "}
                    </div>
                    <div
                      className="col"
                      style={{ float: "right", textAlign: "center" }}
                    >
                      <p>{dashboardData.openPositions}</p>
                      <p> Open Positions </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bottom_card">
              <div className="card_body_3">
                <div className="container">
                  <div className="row">
                    <div className="col col_logo">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="52"
                        height="49"
                        viewBox="0 0 52 49"
                        fill="none"
                      >
                        <path
                          d="M17.6667 4.33333C19.3148 4.33333 20.926 4.82207 22.2964 5.73775C23.6668 6.65343 24.7349 7.95492 25.3657 9.47764C25.9964 11.0004 26.1614 12.6759 25.8399 14.2924C25.5183 15.9089 24.7247 17.3938 23.5592 18.5592C22.3938 19.7247 20.9089 20.5183 19.2924 20.8399C17.6759 21.1614 16.0004 20.9964 14.4776 20.3657C12.9549 19.7349 11.6534 18.6668 10.7378 17.2964C9.82208 15.926 9.33334 14.3148 9.33334 12.6667C9.33334 10.4565 10.2113 8.33691 11.7741 6.77411C13.3369 5.21131 15.4565 4.33333 17.6667 4.33333ZM17.6667 1C15.3592 1 13.1036 1.68424 11.185 2.96619C9.26645 4.24814 7.7711 6.07022 6.88808 8.20203C6.00505 10.3338 5.77402 12.6796 6.22418 14.9427C6.67434 17.2058 7.78548 19.2846 9.41709 20.9162C11.0487 22.5479 13.1275 23.659 15.3906 24.1092C17.6537 24.5593 19.9995 24.3283 22.1313 23.4453C24.2631 22.5622 26.0852 21.0669 27.3671 19.1483C28.6491 17.2297 29.3333 14.9741 29.3333 12.6667C29.3333 9.57247 28.1042 6.60501 25.9162 4.41709C23.7283 2.22916 20.7609 1 17.6667 1Z"
                          fill="#FFD926"
                          stroke="white"
                        />
                        <path
                          d="M34.3333 47.6667H31V39.3333C31 37.1232 30.122 35.0036 28.5592 33.4408C26.9964 31.878 24.8768 31 22.6667 31H12.6667C10.4565 31 8.33691 31.878 6.77411 33.4408C5.21131 35.0036 4.33333 37.1232 4.33333 39.3333V47.6667H1V39.3333C1 36.2391 2.22916 33.2717 4.41709 31.0838C6.60501 28.8958 9.57247 27.6667 12.6667 27.6667H22.6667C25.7609 27.6667 28.7283 28.8958 30.9162 31.0838C33.1042 33.2717 34.3333 36.2391 34.3333 39.3333V47.6667Z"
                          fill="#FFD926"
                          stroke="white"
                        />
                        <path
                          d="M34.3333 4.33333H50.9999V7.66666H34.3333V4.33333Z"
                          fill="#FFD926"
                          stroke="white"
                        />
                        <path
                          d="M34.3333 12.6667H50.9999V16H34.3333V12.6667Z"
                          fill="#FFD926"
                          stroke="white"
                        />
                        <path
                          d="M34.3333 21H45.9999V24.3333H34.3333V21Z"
                          fill="#FFD926"
                          stroke="white"
                        />
                      </svg>
                    </div>
                    <div className="col">
                      {" "}
                      <hr />{" "}
                    </div>
                    <div
                      className="col"
                      style={{ float: "right", textAlign: "center" }}
                    >
                      <p>{dashboardData.jobOffered}</p>
                      <p> Job Offer </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
