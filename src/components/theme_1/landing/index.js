import React from "react";
import Part1 from "./part1";
import Part2 from "./part2";
import Part3 from "./part3";
import Part4 from "./part4";
import Part5 from "./part5";
import Part6 from "./part6";
import Part7 from "./part7";
import Part8 from "./part8";
import Part9 from "./part9";
import "./landing.css";
import Nav from "../Nav";
import SignUpHeader from "../LandingHeader";
import LandingHeader from "../LandingHeader";

const Landing = () => {
  const token = localStorage.getItem("accessToken");

  return (
    <div>
      {token ? <Nav /> : <LandingHeader />}
      <Part1 history={""} />
      <Part2 history={""} />
      <Part3 history={""} />
      <Part4 history={""} />
      <Part5 history={""} />
      <Part6 history={""} />
      <Part7 history={""} />
      <Part8 history={""} />
      <Part9 history={""} />
    </div>
  );
};

export default Landing;
