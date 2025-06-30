import React from "react";

function EmptyData({ message }) {
  return (
    <div className="flex flex-col  justify-center items-center p-12 opacity-60">
      <img src="/no-data.svg" width="120" />
      <span className="text-xl font-medium mt-10"> {message} </span>
    </div>
  );
}

export default EmptyData;
