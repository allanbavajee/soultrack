/* components/SendLinkPopup.js */
"use client";
import { useState } from "react";

export default function SendLinkPopup() {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setShow(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-xl shadow-md transition-all duration-200"
      >
        Voir / Copier liens responsables
      </button>

      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-lg flex flex-col gap-4 items-center relative">
            <button
              onClick={() => setShow(false)}
              className="absolute top-3 right-3 text-gray-800 font-bold text-lg"
            >
              ×
            </button>

            <h3 className="text-lg font-semibold text-center text-gray-800">
              Liens permanents responsables
            </h3>

            <div className="flex flex-col gap-2 w-full">
              <input
                type="text"
                readOnly
                value="https://soultrack-beta.vercel.app/index?userId=7021fc57-bf07-48cb-8050-99d0db8e8e7d"
                className="border rounded-xl px-4 py-2 w-full text-center"
              />
              <input
                type="text"
                readOnly
                value="https://soultrack-beta.vercel.app/index?userId=f9fc287b-a3fb-43d5-a1c4-ed4a316204b2"
                className="border rounded-xl px-4 py-2 w-full text-center"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
