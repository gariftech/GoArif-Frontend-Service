"use client"; // Required for Next.js client components

import React, { useEffect, useState } from "react";
import "./style.css";
import { File, FileWarning, MessageCircle, WholeWord } from "lucide-react";
import {
  apiListPromptFilesum,
  apiListRiwayatPost,
  AttachmentFile,
  SpeechFileToText,
  SpeechUrlDrive,
  SpeechUrlGeneral,
  SpeechYoutubeToText,
} from "../../../libs/api";
import Lottie from "react-lottie";
import * as animationData from "../../../assets/gifs/loadingAnim.json";
import Riwayat from "./sidebar/riwayat";
import RiwayatContent from "./sidebar/riwayatContent";
import Tabular from "./main/tabular";
import Sentimen from "./main/sentimen";

import Toolbar from "./sidebar/toolBar";
import ChatApp from "./chat/chatPopup";

const App = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [activeElement, setActiveElement] = useState("Tabular");
  const [result, setResult] = useState(null); // Initial value
  const [customQuestions, setCustomQuestions] = useState(""); // Initial value
  const [ischat, setIschat] = useState(false); // Initial value

  return (
    <div className="w-full">
      <div className="mt-6 space-y-12 lg:flex lg:space-x-6">
        <div className="lg:w-1/6 flex-col items-center bg-contrast-high h-full rounded-3xl md:rounded-3xl shadow-[rgba(59,63,81,0.12)_0px_8px_16px_0px]">
          <div className="flex w-full p-5">
            <button
              className={`text-xs flex-1 py-2 text-center ${
                activeTab === "tab1"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => {
                setActiveTab("tab1");
              }}
            >
              Tools
            </button>
            <button
              className={`text-xs flex-1 py-2 text-center ${
                activeTab === "tab2"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => {
                setActiveTab("tab2");
              }}
            >
              History
            </button>
          </div>

          {activeTab === "tab1" && (
            <Toolbar
              setResult={setResult}
              setUrl={setCustomQuestions}
              setIsChat={setIschat}
              setActiveElement={setActiveElement}
              activeElement={activeElement}
            />
          )}
          {activeTab === "tab2" && (
            <Riwayat
              setResult={setResult}
            />
          )}
        </div>

        <div className={ischat ? "lg:w-3/6" : "lg:w-5/6"}>
          {activeTab === "tab2" && (
            <div className="flex-1 justify-center items-center w-full">
              <RiwayatContent
                activeTab={activeTab}
                result={result}
                setResult={setResult}
              />
            </div>
          )}

          {activeElement == "Tabular" && activeTab === "tab1" && (
            <div className="flex-1 justify-center items-center w-full overflow-auto h-screen">
              <Tabular
                customQuestions={customQuestions}
                setCustomQuestions={setCustomQuestions}
                result={result}
                setResult={setResult}
                Isschat={ischat}
                setIsChat={setIschat}
              />
            </div>
          )}

          {activeElement == "Sentimen" && activeTab === "tab1" && (
            <div className="flex-1 justify-center items-center w-full overflow-auto h-screen">
              <Sentimen
                customQuestions={customQuestions}
                setCustomQuestions={setCustomQuestions}
                result={result}
                setResult={setResult}
                Isschat={ischat}
                setIsChat={setIschat}
              />
            </div>
          )}
        </div>

        {result !== null && (
          <div className="lg:w-2/6 flex-col items-center bg-contrast-high h-full rounded-3xl md:rounded-3xl shadow-[rgba(59,63,81,0.12)_0px_8px_16px_0px]">
            <div className="flex w-full p-5 h-full">
              {ischat && (
                <ChatApp result={JSON.stringify(result)} />
              )}
              {result !== null && !ischat && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    result !== null ? setIschat(true) : setIschat(false);
                    localStorage.removeItem("chat");
                  }}
                >
                  Open Chat With Your File
                </div>
              )}
            </div>
          </div>
        )}  
      </div>
    </div>
  );
};

export default App;
