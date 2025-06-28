import React from "react";

function EmptyData({ message }) {
  return (
    <div className="flex flex-col  justify-center items-center p-16 opacity-60">
      <img src="/no-data.svg" width="150" />
      <span className="text-2xl font-medium mt-10"> {message} </span>
    </div>
  );
}

export default EmptyData;
