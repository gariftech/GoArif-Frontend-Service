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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ChatApp from "./chat/chatPopup";

import Toolbar from "./sidebar/toolBar";

const App = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [activeElement, setActiveElement] = useState("FileUpload");
  const [selectedOption, setSelectedOption] = useState("Pilih Module"); // Initial value
  const [languangeOption, setLanguangeOption] = useState("Pilih Bahasa"); // Initial value
  const [result, setResult] = useState(""); // Initial value
  const [pragraph, setPragraph] = useState([]); // Initial value
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [url, setUrl] = useState(""); // Initial value
  const [file, setFile] = useState(null); // Initial value
  const [isLoading, setisLoading] = useState(false); // Initial value
  const [title, setTitle] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [Ischat, setIsChat] = useState(false);

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
      const speaker = paragraph.speaker;

      const timestampLine = getTimestampLine(paragraphs);

      // Combine all sentences of the paragraph into one text
      const paragraphText = paragraph.sentences
        .map((sentence) => sentence.text)
        .join(" ");

      const result = {
        Speaker: speaker,
        Start: formatTimestamp(paragraph.start),
        End: formatTimestamp(paragraph.end),
        Text: paragraphText,
      };

      // Add the timestamp and paragraph text to the output
      output.push(result);
    });
    console.log(output);
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
    formData.append("api_key", "AIzaSyBqYpSLeY5lIzo11DQAL20QLG1Slr4MjIU");
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

  const handleNew = ()=>{
    JSON.parse(localStorage.getItem("chatHistory")) || [
      {
        sender: "result",
        text: "Hello! How can I assist you today?",
      },
    ];
  }

  const exportToExcel = () => {
    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(pragraph);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate a buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save the file
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "exported_data.xlsx");
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
    <div className="w-full">
      <div className="mt-6 space-y-12 lg:flex lg:space-x-6">
        <div className="lg:w-1/6 flex-col items-center bg-contrast-high h-full rounded-r-3xl md:rounded-3xl shadow-[rgba(59,63,81,0.12)_0px_8px_16px_0px]">
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
              Riwayat
            </button>
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
              setIsChat={setIsChat}
              activeElement={activeElement}
            />
          )}
          {activeTab === "tab2" && (
            <Riwayat
              setResult={setResult}
              setUrl={setUrl}
              setTitle={setTitle}
              setTimestamp={setTimestamp}
            />
          )}
        </div>

        <div className="lg:w-5/6">
          {activeTab === "tab2" && (
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
          )}

          {activeElement == "FileUpload" && activeTab === "tab1" && (
            <div className="flex-1 justify-center items-center w-full">
              {/* file upload sections */}
              <form onSubmit={handleSubmitGeneral}>
                <div className=" w-full px-5">
                  <label htmlFor="cover-photo" className=" pb-3 text-xs">
                    Upload a file
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
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
                            accept=".pdf, .mp3, .docx, .pptx, .csx, .xlsx"
                          />
                          {preview ? (
                            <div>
                              <h3>Image Preview:</h3>
                              <img
                                src={preview}
                                alt="Preview"
                                style={{
                                  maxWidth: "200px",
                                  maxHeight: "200px",
                                }}
                              />
                            </div>
                          ) : (
                            <div>
                              <h3>File Selected: {fileName}</h3>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 pb-2">
                    <div className="py-1 text-xs">Prompt (Optional)</div>
                    <div className="sm:col-span-2">
                      <div className="mt-2.5">
                        <textarea
                          name="message"
                          id="message"
                          rows="4"
                          value={url}
                          onChange={handleInputUrl}
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        ></textarea>
                      </div>
                    </div>
                    {!isLoading && result == "" && (
                      <button
                        type="submit"
                        className="text-neutral-50 block mt-5 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                </div>
                {result != "" && (
                  <div className="px-5">
                    <div className="py-2 text-xs">Advance Result</div>
                    <textarea
                      name="message"
                      id="result"
                      rows="10"
                      value={result}
                      readOnly={true}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    ></textarea>
                  </div>
                )}
                {!Ischat && result !== "" && (
                  <div className="flex flex-col items-center justify-center text-center py-20">
                    <p>Want Advance Result?</p>
                    <div
                      onClick={() => {setIsChat(true);handleNew()}}
                      className="cursor-pointer mt-4 text-neutral-50 block rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-lime-500"
                    >
                      Open Chat With Data
                    </div>
                  </div>
                )}
                {Ischat && (
                  <div className="px-5">
                    <div className="py-2 pt-5 text-xs">Advance Result</div>
                    <ChatApp result={result} />
                  </div>
                )}
              </form>
            </div>
          )}

          {activeElement == "Transcribe" && activeTab === "tab1" && (
            <div className="flex-1 justify-center items-center w-full">
              {/* Transcribe Sections */}
              <form onSubmit={handleSubmit}>
                <div className=" w-full px-5">
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
                        {/* <option value="urldrive">
                          Google Drive Share Link
                        </option> */}
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
                                {preview ? (
                                  <div>
                                    <h3>Image Preview:</h3>
                                    <img
                                      src={preview}
                                      alt="Preview"
                                      style={{
                                        maxWidth: "200px",
                                        maxHeight: "200px",
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <h3>File Selected: {fileName}</h3>
                                    {/* Optionally, you can display an icon or text for non-image files */}
                                    <p>
                                      Preview not available for this file type.
                                    </p>
                                  </div>
                                )}
                              </label>
                            </div>
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
                        <div className="py-2 text-xs pt-5">Advance Result</div>
                        {pragraph.map((element, index) => (
                          <div
                            key={index}
                            className="bg-slate-200 shadow-sm border-0 rounded-md mb-2 p-2"
                          >
                            <div className="flex justify-between w-full pb-2">
                              <div>Speaker {element.Speaker}</div>
                              <div>
                                {element.Start} - {element.End}
                              </div>
                            </div>
                            <div>{element.Text}</div>
                            <br />
                          </div>
                        ))}
                        <div className="flex justify-between w-full pb-2">
                          <div
                            onClick={() => exportToExcel()}
                            className="cursor-pointer text-neutral-50 block w-100 rounded-md bg-lime-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-lime-500"
                          >
                            Export Result
                          </div>
                        </div>
                        {!Ischat && (
                          <div className="flex flex-col items-center justify-center text-center py-20">
                            <p>Want Advance Result?</p>
                            <div
                              onClick={() => {setIsChat(true);handleNew()}}
                              className="cursor-pointer mt-4 text-neutral-50 block rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-lime-500"
                            >
                              Open Chat With Data
                            </div>
                          </div>
                        )}
                        {Ischat && (
                          <div>
                            <ChatApp result={result} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
