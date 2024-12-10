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
import Tabular from "./main/tabular"
import Sentimen from "./main/sentimen"


import Toolbar from "./sidebar/toolBar";

import ChatPopup from "./chat/chatPopup";

const App = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [activeElement, setActiveElement] = useState("Tabular");
  const [selectedOption, setSelectedOption] = useState("Pilih Module"); // Initial value
  const [languangeOption, setLanguangeOption] = useState("Pilih Bahasa"); // Initial value
  const [result, setResult] = useState(""); // Initial value
  const [pragraph, setPragraph] = useState(""); // Initial value
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [url, setUrl] = useState(""); // Initial value
  const [file, setFile] = useState(null); // Initial value
  const [isLoading, setisLoading] = useState(false); // Initial value
  const [title, setTitle] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value); // Update state with selected value
  };

  const handleLanguangeChange = (e) => {
    setLanguangeOption(e.target.value); // Update state with selected value
  };

  const handleInputUrl = (e) => {
    setUrl(e.target.value); // Update state with selected value
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Optional: Check for valid file types and size
      if (selectedFile.size > 100 * 1024 * 1024) {
        // 10MB limit
        alert("File size exceeds 10MB!");
        return;
      }

      if (selectedFile) {
        // Only proceed if the file is not null or undefined
        setFileName(selectedFile.name); // Set the file name
        if (selectedFile.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result); // Set the image preview
          };
          reader.readAsDataURL(selectedFile); // Read the file as a data URL
        } else {
          setPreview(null); // Clear the image preview if the file is not an image
        }
      } else {
        // Handle the case where no file is selected
        setPreview(null); // Clear preview
        setFileName(""); // Clear file name
      }

      setFile(selectedFile);
    } else {
      alert("No file selected.");
    }
  };

  function formatTimestamp(seconds) {
    const hours = Math.floor(seconds / 3600); // Get hours
    const minutes = Math.floor((seconds % 3600) / 60); // Get minutes
    const secs = Math.floor(seconds % 60); // Get seconds

    // Return the formatted time string
    return `${hours > 0 ? String(hours).padStart(2, "0") + ":" : ""}${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function getTimestampLine(paragraph) {
    const startFormatted = formatTimestamp(paragraph.start);
    const endFormatted = formatTimestamp(paragraph.end);

    return `${startFormatted} - ${endFormatted}`;
  }

  const getPragraph = async (data) => {
    const output = [];
    // Loop through each paragraph
    data.forEach((paragraph) => {
      // Create the timestamp line with start and end
      const paragraphs = { start: paragraph.start, end: paragraph.end };
      const timestampLine = getTimestampLine(paragraphs);

      // Combine all sentences of the paragraph into one text
      const paragraphText = paragraph.sentences
        .map((sentence) => sentence.text)
        .join(" ");

      // Add the timestamp and paragraph text to the output
      output.push(`${timestampLine.replace(",", "")}\n${paragraphText}\n\n`);
    });

    setPragraph(output);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("");
    setPragraph("");
    if (selectedOption == "file") {
      if (!file) {
        alert("Please select a file first!");
        return;
      }
      try {
        setisLoading(true);
        const response = await SpeechFileToText({
          language: languangeOption,
          file,
        });
        setResult(response.data.result.transcript);
        getPragraph(response.data.result.paragraphs);
        setisLoading(false);
      } catch (error) {
        console.log("Upload failed:", error);
        setisLoading(false);
      }
    } else if (selectedOption == "urlaudio") {
      const body = {
        url: url,
        language: languangeOption,
      };
      try {
        setisLoading(true);
        const response = await SpeechUrlGeneral(body);
        setResult(response.data.result.transcript);
        getPragraph(response.data.result.paragraphs);
        setisLoading(false);
      } catch (error) {
        console.log("Upload failed:", error);
        setisLoading(false);
      }
    } else if (selectedOption == "urldrive") {
      const body = {
        url: url,
        language: languangeOption,
      };
      try {
        setisLoading(true);
        const response = await SpeechUrlDrive(body);
        setResult(response.data.result.transcript);
        getPragraph(response.data.result.paragraphs);
        setisLoading(false);
      } catch (error) {
        setisLoading(false);
      }
    }
  };

  const handleSubmitGeneral = async (e) => {
    e.preventDefault();
    setResult("");
    setPragraph("");
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", "AIzaSyD3drCF1KnfAfTNYGNIBJNS_nAry7kzlxg");
    if (url == "") {
      formData.append("question", "what is this file about?");
    } else {
      formData.append("question", url);
    }

    try {
      setisLoading(true);
      // Send the form data to the server
      const response = await fetch("https://app.goarif.co/py/v1/ask", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setResult(result.result);

      const responseAttch = await AttachmentFile({
        file,
      });

      const body = {
        title: file.name,
        type: "File Upload",
        file: [responseAttch.data.file[0]],
        prompt: result.question,
        result: result.result,
      };
      const setRiwayat = await apiListRiwayatPost(body);
      setisLoading(false);
    } catch (error) {
      console.log("Error uploading file:", error);
      setisLoading(false);
    }
  };

  const handleUrlChange = (e) => setUrl(e.target.value);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full">
      <div className="mt-6 space-y-12 lg:flex lg:space-x-6">
        <div className="lg:w-1/6 flex-col items-center bg-contrast-high h-full rounded-3xl md:rounded-3xl shadow-[rgba(59,63,81,0.12)_0px_8px_16px_0px]">
          <div className="flex w-full p-5">
            {/* <button
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
            </button> */}
            {/* <button
              className={`text-xs flex-1 py-2 text-center ${
                activeTab === "tab2"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => {
                setActiveTab("tab2");
              }}
            >
              Riwayat
            </button> */}
          </div>

          {activeTab === "tab1" && (
            <Toolbar
              setResult={setResult}
              setUrl={setUrl}
              setPragraph={setPragraph}
              setFile={setFile}
              setPreview={setPreview}
              setFileName={setFileName}
              setActiveElement={setActiveElement}
              activeElement={activeElement}
            />
          )}
          {/* {activeTab === "tab2" && (
            <Riwayat
              setResult={setResult}
              setUrl={setUrl}
              setTitle={setTitle}
              setTimestamp={setTimestamp}
            />
          )} */}
        </div>

        <div className="lg:w-5/6">
          {/* {activeTab === "tab2" && (
            <div className="flex-1 justify-center items-center w-full">
              <RiwayatContent
                activeTab={activeTab}
                url={url}
                setTitle={setTitle}
                title={title}
                handleUrlChange={handleUrlChange}
                result={result}
                setResult={setResult}
                timestamp={timestamp}
                setTimestamp={setTimestamp}
              />
            </div>
          )} */}

          {activeElement == "Tabular" && activeTab === "tab1" && (
            <div className="flex-1 justify-center items-center w-full">
              <Tabular/>
            </div>
          )}

          {activeElement == "Sentimen" && activeTab === "tab1" && (
            <div className="flex-1 justify-center items-center w-full">
              <Sentimen/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
