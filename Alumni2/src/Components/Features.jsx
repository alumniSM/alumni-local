import React from "react";
import { assets } from "../assets/assets";

const Features = () => {
  return (
    <div>
      <section className="mt-6 py-12">
        <div className="container mx-auto px-6">
          <div className="  text-center mx-auto my-16 px-10">
            <p className="text-indigo-800 text-2xl font-semibold uppercase tracking-wide">
              Alumni Features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4  gap-6">
            <div className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-110 transition duration-300 ease-in-out">
              <img
                src={assets.jobpic}
                alt="Post Job Opportunities"
                className="w-full h-48  object-cover rounded-t-lg"
              />
              <div className="py-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-400">
                  Post Job Opportunities
                </h3>
                <p className="text-gray-600  text-sm ">
                  Alumni can post job openings to help fellow graduates find
                  employment opportunities within the DBU network.
                </p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-110 transition duration-300 ease-in-out">
              <img
                src={assets.event}
                alt="Create Events"
                className="w-full  h-48 object-cover rounded-t-lg"
              />
              <div className="py-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-400">
                  Create Events
                </h3>
                <p className="text-gray-600 mb-4  text-sm ">
                  Organize and promote events to stay connected with the DBU
                  community. Share your events and invite fellow alumni.
                </p>
              </div>
            </div>

            {/* New Survey Method Feature */}
            <div className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-110 transition duration-300 ease-in-out">
              <img
                src={assets.survey}
                alt="Conduct Surveys"
                className="w-full  h-48 object-cover rounded-t-lg"
              />
              <div className="py-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-400">
                  Conduct Surveys
                </h3>
                <p className="text-gray-600 text-sm  ">
                  Create and distribute surveys to gather valuable feedback from
                  alumni. Use the insights to improve programs and foster a
                  stronger community.
                </p>
              </div>
            </div>

            {/* New Graduation Support Feature */}
            <div className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-110 transition duration-300 ease-in-out">
              <img
                src={assets.graduation} // Make sure to import this image
                alt="Graduation Support"
                className="w-full  h-48 object-cover rounded-t-lg"
              />
              <div className="py-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-400">
                  Reconnect With Friends
                </h3>
                <p className="text-gray-600 mb-4 text-sm  ">
                  Use our alumni directory to find and connect with former
                  classmates. Whether you're looking to network professionally
                  or catch up personally, our platform makes it easy to reach
                  out and reconnect with your fellow alumni.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
