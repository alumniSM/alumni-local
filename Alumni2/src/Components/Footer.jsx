import React from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";

const Footer = () => {
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="md:mx-10 mt-40">
      <hr className="my-5 border border-spacing-3.5" />
      <div className="flex flex-col sm:grid sm:grid-cols-[3fr_1fr_1fr] gap-14 mb-10  text-sm">
        {/* left -section */}
        <div>
          <img className="mb-5 w-40" src={assets.dbulogo} alt="" />
          <p className="w-full md:w-2/3 text-gray-500 leading-6">
            This platform serves as a vital resource for fostering connections
            among alumni and students, facilitating engagement in community
            events, career opportunities, and initiatives that promote the
            growth and success of the DBU community. We invite you to explore
            the various features available and to contribute to our ongoing
            efforts to strengthen alumni relations
          </p>
        </div>
        {/* Center section */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600 ">
            <NavLink to="/">
              <li
                className=" uppercase"
                onClick={() => {
                  scrollToTop();
                }}
              >
                Home
              </li>
            </NavLink>
            <NavLink to="/event">
              <li className="uppercase">Event</li>
            </NavLink>
            <NavLink to="/alumni">
              <li className=" uppercase">Alumni</li>
            </NavLink>
            <NavLink to="/job">
              <li className=" uppercase">Job</li>
            </NavLink>
            <NavLink to="/survey">
              <li className="uppercase">Survey</li>
            </NavLink>
          </ul>
        </div>
        {/* Right section */}
        <div>
          <p className="text-xl font-medium mb-5">Get in touch</p>
          <ul className="flex flex-col gap-2 text-gray-600 ">
            <li>+251912345678</li>
            <li>Dbualumni@gmail.com</li>
          </ul>
        </div>
      </div>
      {/* Copyright text */}
      <div>
        <hr className="" />
        <p className="py-5 text-sm text-center ">
          Copyright 2024@ DbuAlumni All right Reserved{" "}
        </p>
      </div>
    </div>
  );
};

export default Footer;
