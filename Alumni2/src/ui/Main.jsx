import React from "react";

const Main = ({ children }) => {
  return (
    <div className=" min-h-screen p-4 pt-14 sm:ml-64 flex gap-2 flex-col lg:flex-row translate-all duration-300 mt-16 overflow-auto">
      {children}
    </div>
  );
};

export default Main;
