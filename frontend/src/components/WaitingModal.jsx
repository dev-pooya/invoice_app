import React from "react";
import loading from "../assets/loading.gif";

function WaitingModal({ message }) {
  return (
    <div className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0  fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-background p-8 rounded-lg shadow-lg text-center">
        <p className="text-lg font-medium py-3">{message}</p>
        <img src={loading} className="mt-3 w-16 mx-auto" />
      </div>
    </div>
  );
}

export default WaitingModal;
