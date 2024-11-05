import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <>
      <div className="  text-center mx-auto my-16 px-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
          Stay Connected, Engage, and Grow
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between mx-auto my-24  px-10 gap-8 lg:gap-16">
        <div className="  lg:flex-1 w-full lg:w-auto mb-8 lg:mb-0">
          <img src={assets.graduate} alt="" className=" rounded-lg" />
        </div>
        <div className="  lg:flex-1 w-full lg:w-auto">
          <h1 className="text-3xl lg:text-4xl font-bold mb-10">
            Stay Connected With Alumni Network
          </h1>
          <p className="text-gray-600">
            Even though our platform doesn't offer live chat, staying connected
            has never been easier. Through the alumni list, you can access the
            contact information of fellow graduates, including their emails,
            making it simple to reach out and reconnect. Whether you’re
            searching for old classmates or networking for career opportunities,
            you’ll have the resources to maintain and grow your alumni
            relationships. Our system keeps you engaged with your alma mater
            while offering a space to share experiences and support each other
            professionally and personally.
          </p>
        </div>
      </div>
    </>
  );
};

export default Hero;
