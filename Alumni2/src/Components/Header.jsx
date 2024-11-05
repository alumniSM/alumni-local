import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row bg-teal-500 flex-wrap rounded-lg px-6 md:px-10 lg:px-20 ">
      {/* left side */}
      <div className=" md:w-1/2 flex flex-col items-start gap-4 justify-center py-10 m-auto md:py-[10vw] md:mb-[-30px] ">
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight">
          Welcome <br />
          To DBU ALUMNI
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3  text-white text-sm font-light ">
          <p>
            A unified platform for DBU alumni and students to engage,
            collaborate, and stay
            <br className="hidden sm:block" />
            informed about the latest events, job postings, and community
            initiatives.
          </p>
        </div>
      </div>

      {/* right side */}
      <div className=" md:w-1/2 relative ">
        <img
          className="w-full  md:absolute bottom-0 h-auto rounded-lg"
          src={assets.alumni}
          alt=""
        />
      </div>
    </div>
  );
};

export default Header;
