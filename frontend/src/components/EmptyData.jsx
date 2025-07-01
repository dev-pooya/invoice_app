import React from "react";
import noDataImage from "../assets/no-data.png";

function EmptyData({ message }) {
  return (
    <div className="flex flex-col  justify-center items-center p-12 opacity-60">
      <img src={noDataImage} width="120" />
      <span className="text-xl font-medium mt-10"> {message} </span>
    </div>
  );
}

export default EmptyData;
