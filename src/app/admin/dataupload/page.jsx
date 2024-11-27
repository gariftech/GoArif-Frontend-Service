"use client"; // Required for Next.js client components

import React, { useEffect, useState } from "react";
import "./style.css";
import riwayat from "./widget/riwayat";
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
import ToolBar from "./widget/riwayat";

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
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [itemsPrompt, setListPrompt] = useState([]);

  const [url, setUrl] = useState(""); // Initial value
  const [file, setFile] = useState(null); // Initial value
  const [optionPrompt, setOptionPrompt] = useState(""); // Initial value
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
        console.log("Upload failed:", error);
      }
    }
  };

  const handleGetPrompt = async () => {
    try {
      const response = await apiListPromptFilesum();
      setListPrompt(response.data.data);
    } catch (error) {
      setisLoading(false);
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

      console.log(responseAttch);

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

  useEffect(() => {
    console.log("File state updated:", file);
    console.log(file);
    handleGetPrompt();
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
              onClick={() => {
                setActiveTab("tab1");
                setResult("");
                setUrl("");
                setPragraph("");
                setFile("");
                setPreview("");
                setFileName("");
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
                setResult("");
                setUrl("");
                setPragraph("");
                setFile("");
                setPreview("");
                setFileName("");
              }}
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
                    onClick={() => {
                      setActiveElement(item.key);
                      setResult("");
                      setUrl("");
                      setPragraph("");
                      setFile("");
                      setPreview("");
                      setFileName("");
                    }}
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

              {activeElement == "FileUpload" && (
                <div className="items-center">
                  <div className="px-5 py-2 text-xs">Prompt Rekomendasi</div>
                  <div
                    className="px-5 overflow-y-auto p-2"
                    style={{ maxHeight: "calc(70vh - 300px)" }}
                  >
                    {itemsPrompt.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          console.log(item.name); // Check item structure
                          setUrl(item.name);
                        }}
                        className="text-xs py-4 px-2 cursor-pointer select-none mt-1 md:rounded-2xl shadow-[rgba(59,63,81,0.12)_0px_8px_8px_0px] bg-white hover:bg-gray-50 transition duration-200"
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "tab2" && (
            <ToolBar
              setResult={setResult}
              setPragraph={setPragraph}
              setListPrompt={setListPrompt}
              setUrl={setUrl}
              setTitle={setTitle}
              setTimestamp={setTimestamp}
            />
          )}
        </div>

        {activeTab === "tab2" && (
          <div className="flex justify-center items-center ">
            <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
              {/* Title Input */}
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the title"
                />
              </div>

              {/* Iframe URL Input */}
              <div className="mb-4">
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700"
                >
                  URL File
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={handleUrlChange}
                  className="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter URL for iframe preview"
                />
              </div>

              {/* Iframe Preview */}
              {url && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Preview
                  </label>
                  <div className="mt-2 w-full h-64 border rounded-md overflow-hidden">
                    <iframe
                      src={url}
                      width="100%"
                      height="100%"
                      title="Iframe Preview"
                      className="border-none"
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Result Textarea */}
              <div className="mb-4">
                <label
                  htmlFor="result"
                  className="block text-sm font-medium text-gray-700"
                >
                  Result
                </label>
                <textarea
                  id="result"
                  rows="5"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  className="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the result"
                />
              </div>

              {/* Timestamp Textarea */}
              <div className="mb-4">
                <label
                  htmlFor="prompt"
                  className="block text-sm font-medium text-gray-700"
                >
                  Prompt
                </label>
                <textarea
                  id="timestamp"
                  rows="5"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
            </div>
          </div>
        )}

        {/* file upload sections */}
        {activeElement == "FileUpload" && activeTab === "tab1" && (
          <form onSubmit={handleSubmitGeneral}>
            <div className=" w-full p-10">
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
                            style={{ maxWidth: "200px", maxHeight: "200px" }}
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
                {!isLoading && (
                  <button
                    type="submit"
                    className="text-neutral-50 block mt-5 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Submit
                  </button>
                )}
                {isLoading && (
                  <div className="px-3.5 py-2.5 text-center text-sm font-semibold text-black">
                    <Lottie options={defaultOptions} height={100} width={100} />
                    <div>Sedang Analisa File</div>
                  </div>
                )}
              </div>
            </div>
            {result != "" && (
              <div className="px-10">
                <div className="py-2 text-xs">Hasil</div>
                <textarea
                  name="message"
                  id="message"
                  rows="10"
                  value={result}
                  readOnly={true}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                ></textarea>
              </div>
            )}
          </form>
        )}

        {/* Transcribe Sections */}
        {activeElement == "Transcribe" && activeTab === "tab1" && (
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
                                <p>Preview not available for this file type.</p>
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

      {activeTab === "tab1" && (
        <button
          className="fixed bottom-4 right-4 bg-blue-500 text-neutral-50 p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
          onClick={() => handleChatClick()}
        >
          <MessageCircle className="stroke-primary-content" />
        </button>
      )}
    </div>
  );
};

export default App;
