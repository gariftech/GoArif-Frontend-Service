"use client"; // Required for Next.js client components

import React, { useEffect, useState } from "react";
import "./style.css";
import { createSwapy } from "swapy";
import SvgTwillinkLogo from "../../../assets/svgComponents/SvgMail";
import widget from "./widget/widget";
import toolBar from "./widget/toolBar";
import riwayat from "./widget/riwayat";

const DEFAULT = {
  1: "a",
  2: null,
  3: "c",
  4: "d",
};

const A = () => widget("a");

const C = () => widget("c");

const D = () => widget("d");

const getItemById = (itemId) => {
  switch (itemId) {
    case "a":
      return <A />;
    case "c":
      return <C />;
    case "d":
      return <D />;
    default:
      return null;
  }
};

const itemsPrompt = [
  { name: "File ini membicarakan tentang apa", key: "PDF" },
  { name: "File ini membicarakan tentang apa", key: "CSV" },
  { name: "File ini membicarakan tentang apa", key: "Excel" },
  { name: "File ini membicarakan tentang apa", key: "DOCX" },
  { name: "File ini membicarakan tentang apa", key: "Audio" }

  // Add more items as needed
];

const App = () => {
  const [slotItems, setSlotItems] = useState(DEFAULT);
  const [activeTab, setActiveTab] = useState("tab1");

  useEffect(() => {
    // Check if window or localStorage is available
    if (typeof window !== "undefined") {
      const slot = localStorage.getItem("slot");
      setSlotItems(slot ? JSON.parse(slot) : DEFAULT);
    }
  }, []);

  useEffect(() => {
    const container = document.querySelector(".container");
    const swapy = createSwapy(container, {
      swapMode: "hover",
    });

    swapy.onSwap(({ data }) => {
      console.log("swap", data);
      localStorage.setItem("slot", JSON.stringify(data.object));
    });

    swapy.onSwapEnd(({ data, hasChanged }) => {
      console.log(hasChanged);
      console.log("end", data);
    });

    swapy.onSwapStart(() => {
      console.log("start");
    });

    return () => {
      swapy.destroy();
    };
  }, []);

  const handleChatClick = () => {
    console.log("chatopened");
  };

  return (
    <div className="container">
      <div className="grid grid-cols-[50%,50%] gap-4 h-full">
        <div className="flex flex-col items-center bg-contrast-high h-full rounded-r-3xl md:rounded-3xl shadow-[rgba(59,63,81,0.12)_0px_8px_16px_0px]">
          <div className="flex w-full p-5">
            <button
              className={`text-xs flex-1 py-2 text-center ${
                activeTab === "tab1"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("tab1")}
            >
              Tools
            </button>
            <button
              className={`text-xs flex-1 py-2 text-center ${
                activeTab === "tab2"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("tab2")}
            >
              Riwayat
            </button>
          </div>

          {activeTab === "tab1" && (
            <div className="flex-1 flex flex-col h-full">
              <div className="justify-center mx-5">{toolBar()}</div>
              <div className="items-center">
                <div className="px-5 py-2 font-medium">Prompt Rekomendasi</div>
                <div className="px-5 pb-2">
                  <input
                    id="search"
                    name="search"
                    type="text"
                    placeholder="Cari Kategori File"
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
                <div
                  className="px-5 overflow-y-auto p-2"
                  style={{ maxHeight: "calc(70vh - 300px)" }}
                >
                  {itemsPrompt.map((item, index) => (
                    <div
                      key={index}
                      className="size-text-5 py-4 px-2 cursor-pointer select-none mt-1 md:rounded-2xl shadow-[rgba(59,63,81,0.12)_0px_8px_8px_0px] bg-white hover:bg-gray-50 transition duration-200"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "tab2" &&  riwayat()}
        </div>

        <div className="flex flex-col w-full h-full">
          <div className="second-row">
            <div
              className="cursor-pointer select-none relative mt-1 w-40 h-40 rounded-r-3xl md:rounded-3xl shadow-[rgba(59,63,81,0.12)_0px_8px_16px_0px] flex items-center justify-center"
              data-swapy-slot="1"
            >
              {getItemById(slotItems["1"])}
            </div>
            <div
              className="cursor-pointer select-none relative mt-1 w-40 h-40 rounded-r-3xl md:rounded-3xl shadow-[rgba(59,63,81,0.12)_0px_8px_16px_0px] flex items-center justify-center"
              data-swapy-slot="2"
            >
              {getItemById(slotItems["2"])}
            </div>
            <div
              className="cursor-pointer select-none relative mt-1 w-40 h-40 rounded-r-3xl md:rounded-3xl shadow-[rgba(59,63,81,0.12)_0px_8px_16px_0px] flex items-center justify-center"
              data-swapy-slot="3"
            >
              {getItemById(slotItems["3"])}
            </div>
            <div
              className="cursor-pointer select-none relative mt-1 w-40 h-40 rounded-r-3xl md:rounded-3xl shadow-[rgba(59,63,81,0.12)_0px_8px_16px_0px] flex items-center justify-center"
              data-swapy-slot="4"
            >
              {getItemById(slotItems["4"])}
            </div>
          </div>
        </div>
      </div>

      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
        onClick={() => handleChatClick()}
      >
        <SvgTwillinkLogo className="stroke-primary-content" />
      </button>
    </div>
  );
};

export default App;
