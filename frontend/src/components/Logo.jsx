import React from "react";
import logoImage from "../assets/logo.png";

function Logo() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center my-7 ">
      <img src={logoImage} className={`max-w-2/5  invert dark:invert-0`} />
      <h2 className="text-3xl pr-2 pt-4 font-nastalig">نا‌ مدار</h2>
    </div>
  );
}

export default Logo;
