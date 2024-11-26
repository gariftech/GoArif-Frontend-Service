"use client"; // Required for Next.js client components

import React, { useEffect, useState } from "react";
import "./style.css";
import riwayat from "./widget/riwayat";
import {
  AudioLines,
  AudioWaveformIcon,
  File,
  FileWarning,
  MessageCircle,
  UserCheck,
  WholeWord,
} from "lucide-react";
import { SpeechFileToText, SpeechUrlDrive, SpeechUrlGeneral, SpeechYoutubeToText } from "../../../libs/api";
import Lottie from "react-lottie";
import * as animationData from "../../../assets/gifs/loadingAnim.json";

const itemsPrompt = [
  { name: "File ini membicarakan tentang apa", key: "PDF" },
  { name: "File ini membicarakan tentang apa", key: "CSV" },
  { name: "File ini membicarakan tentang apa", key: "Excel" },
  { name: "File ini membicarakan tentang apa", key: "DOCX" },
  { name: "File ini membicarakan tentang apa", key: "Audio" },
];

const itemsFile = [
  { name: "File Upload", key: "FileUpload", image: <File height={20} /> },
  { name: "Transcribe", key: "Transcribe", image: <WholeWord height={20} /> },
];

const App = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [activeElement, setActiveElement] = useState("FileUpload");
  const [selectedOption, setSelectedOption] = useState("Pilih Module"); // Initial value
  const [languangeOption, setLanguangeOption] = useState("Pilih Bahasa"); // Initial value
  const [result, setResult] = useState(""); // Initial value
  const [pragraph, setPragraph] = useState(""); // Initial value


  const [url, setUrl] = useState(""); // Initial value
  const [file, setFile] = useState(null); // Initial value
  const [optionPrompt, setOptionPrompt] = useState(""); // Initial value
  const [isLoading, setisLoading] = useState(false); // Initial value

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

      setFile(selectedFile);
      console.log("File selected:", selectedFile);
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
      output.push(`${timestampLine.replace(",","")}\n${paragraphText}\n\n`);
    });

    setPragraph(output);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("");
    setPragraph("");
    if(selectedOption == "file"){
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
      }
    }else if(selectedOption == "urlaudio"){
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
      }
    }else if(selectedOption == "urldrive"){
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
        console.log("Upload failed:", error);
      }
    }
  };

  useEffect(() => {
    console.log("File state updated:", file);
    console.log(file);
  }, [file]);

  const handleChatClick = () => {
    console.log("chatopened");
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="container">
      <div className="grid grid-cols-[50%,250%] gap-4 h-full">
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
              <div className="px-5 pb-3 text-xs">Upload Element</div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2 overflow-y-auto pb-10 px-4 max-h-60">
                {itemsFile.map((item, index) => (
                  <div
                    onClick={() => setActiveElement(item.key)}
                    key={index}
                    className={`justify-center p-3 cursor-pointer select-none md:rounded-1xl shadow-[rgba(59,63,81,0.12)_0px_4px_4px_0px] bg-white ${
                      item.key === activeElement
                        ? "border-2 border-indigo-600"
                        : "border border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-center w-full h-10">
                      {item.image}
                    </div>
                    <div className="text-xs text-center">{item.name}</div>
                  </div>
                ))}
              </div>

              <div className="items-center">
                <div className="px-5 py-2 text-xs">Prompt Rekomendasi</div>
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
                      className="text-xs py-4 px-2 cursor-pointer select-none mt-1 md:rounded-2xl shadow-[rgba(59,63,81,0.12)_0px_8px_8px_0px] bg-white hover:bg-gray-50 transition duration-200"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "tab2" && riwayat()}
        </div>

        {activeElement == "FileUpload" && (
          <div>
            <div className=" w-full p-10">
              <label htmlFor="cover-photo" className=" pb-3 text-xs">
                Upload a file
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <svg
                    className="mx-auto size-12 text-gray-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="mt-4 flex text-sm/6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".mp3,.wav,.ogg,.mp4,.avi"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs/5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
              <div className="pt-4 pb-2">
                <div className="py-1 text-xs">Prompt Optional</div>
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <textarea
                      name="message"
                      id="message"
                      rows="4"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    ></textarea>
                  </div>
                </div>
                <div className="my-5">
                  <button
                    type="submit"
                    className="text-neutral-50 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
            {result != "" && (
              <div className="px-10">
                <div className="py-2 text-xs">Hasil</div>
                <textarea
                  name="message"
                  id="message"
                  rows="10"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                ></textarea>
              </div>
            )}
          </div>
        )}

        {activeElement == "Transcribe" && (
          <form onSubmit={handleSubmit}>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 px-5">
              <div className="sm:col-span-3">
                <label htmlFor="country" className="text-xs">
                  Sumber Media
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="module"
                    name="module"
                    value={selectedOption}
                    onChange={handleSelectChange} // Handle value change
                    className="w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm"
                  >
                    <option value="">Pilih Media</option>
                    <option value="file">Video or Audio</option>
                    {/* <option value="urlyoutube">Youtube Url</option> */}
                    <option value="urlaudio">Audio Url</option>
                    <option value="urldrive">Google Drive Share Link</option>
                  </select>
                </div>
              </div>
              <div className="col-span-full">
                {selectedOption == "Pilih Module" && (
                  <div>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 mb-3">
                      <div className="text-center">
                        <FileWarning className="mx-auto size-12 text-gray-300" />
                        <div className="mt-4 flex text-sm/6 text-gray-600">
                          <p className="pl-1">Silahkan Pilih Media</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedOption == "file" && (
                  <div>
                    <label htmlFor="country" className=" pb-3 text-xs">
                      Upload a file
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <svg
                          className="mx-auto size-12 text-gray-300"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="mt-4 flex text-sm/6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept=".mp3,.wav,.ogg,.mp4,.avi"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs/5 text-gray-600">
                          Audio File up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {(selectedOption === "urlyoutube" ||
                  selectedOption === "urlaudio" ||
                  selectedOption === "urldrive") && (
                  <div>
                    <label htmlFor="url" className="pb-3 text-xs">
                      Masukkan Url
                    </label>
                    <input
                      id="url"
                      name="url"
                      type="text"
                      onChange={handleInputUrl}
                      placeholder="Link Url"
                      className="block w-full rounded-lg border border-dashed border-gray-900/25 py-4 px-3 mb-3 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    />
                  </div>
                )}
                <div className="sm:col-span-3">
                  <label htmlFor="country" className=" pb-3 text-xs">
                    Pilih Bahasa File
                  </label>
                  <div className="mt-2 w-full">
                    <select
                      id="module"
                      name="module"
                      value={languangeOption}
                      onChange={handleLanguangeChange}
                      className="w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm"
                    >
                      <option value="">Pilih Bahasa</option>
                      <option value="en">English</option>
                      <option value="id">Indonesia</option>
                    </select>
                  </div>
                </div>
                <div className="my-5">
                  {!isLoading && (
                    <button
                      type="submit"
                      className="text-neutral-50 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Submit
                    </button>
                  )}
                  {isLoading && (
                    <div className="px-3.5 py-2.5 text-center text-sm font-semibold text-black">
                      <Lottie
                        options={defaultOptions}
                        height={100}
                        width={100}
                      />
                      <div>Sedang Analisa File</div>
                    </div>
                  )}
                </div>
                {result != "" && (
                  <div>
                    <div className="py-2 text-xs">Hasil</div>
                    <textarea
                      name="message"
                      id="message"
                      rows="10"
                      value={result}
                      readOnly={true}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                    ></textarea>
                    <div className="py-2 text-xs">Time</div>
                    <textarea
                      name="message"
                      id="message"
                      rows="10"
                      value={pragraph}
                      readOnly={true}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                    ></textarea>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
      </div>

      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-neutral-50 p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
        onClick={() => handleChatClick()}
      >
        <MessageCircle className="stroke-primary-content" />
      </button>
    </div>
  );
};

export default App;
