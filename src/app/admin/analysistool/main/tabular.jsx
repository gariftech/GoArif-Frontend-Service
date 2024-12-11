"use client";

import { useState } from "react";
import Lottie from "react-lottie";
import * as animationData from "../../../../assets/gifs/loadingAnim.json";
import { Columns } from "lucide-react";
import ChatApp from "../chat/chatPopup";

const Tabular = ({
  customQuestions,
  setCustomQuestions,
  result,
  setResult,
  Ischat,
  setIsChat,
}) => {
  const [file, setFile] = useState(null);
  const [targetVariable, setTargetVariable] = useState("");
  const [columnOptions, setColumnOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      parseFile(uploadedFile);
    }
  };

  const parseFile = (uploadedFile) => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      const isCSV = uploadedFile.name.endsWith(".csv");

      if (isCSV) {
        const lines = data.split("\n");
        const headers = lines[0].split(","); // Assuming the first row contains headers
        setColumnOptions(headers);
      } else {
        alert("Please upload a CSV file");
      }
    };
    reader.readAsText(uploadedFile);
  };

  const handleNew = () => {
    JSON.parse(localStorage.getItem("chatHistory")) || [
      {
        sender: "result",
        text: "Hello! How can I assist you today?",
      },
    ];
  };

  const handleSubmitGeneral = async (e) => {
    e.preventDefault();
    setResult(null);
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const columnsAnalysis = columnOptions.join(",").replace(targetVariable+",","");
    // Create a FormData object
    const formData = new FormData();
    formData.append("file", file);
    formData.append("custom_question", customQuestions);
    formData.append("api_key", "AIzaSyBqYpSLeY5lIzo11DQAL20QLG1Slr4MjIU");
    formData.append("target_variable", JSON.parse(targetVariable));
    formData.append("columns_for_analysis", columnsAnalysis);

    try {
      setIsLoading(true);
      // Send the form data to the server
      const response = await fetch("https://app.goarif.co/py/v1/multiclass", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setResult(result);
      console.log(result);

      // const responseAttch = await AttachmentFile({
      //   file,
      // });

      // const body = {
      //   title: file.name,
      //   type: "File Upload",
      //   file: [responseAttch.data.file[0]],
      //   prompt: result.question,
      //   result: result.result,
      // };
      // const setRiwayat = await apiListRiwayatPost(body);
      setIsLoading(false);
    } catch (error) {
      console.log("Error uploading file:", error);
      setIsLoading(false);
    }
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
    <div className="w-full mx-auto px-8">
      <form className="space-y-6">
        {/* File Input (CSV or Excel) */}
        <div>
          <label htmlFor="file" className="block text-lg font-medium">
            Upload CSV or Excel File
          </label>
          <input
            id="file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        {/* Custom Question Input */}
        <div>
          <label
            htmlFor="custom_question"
            className="block text-lg font-medium"
          >
            Custom Question
          </label>
          <textarea
            id="custom_question"
            type="text-area"
            rows="4"
            value={customQuestions}
            onChange={(e) => setCustomQuestions(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        {/* Target Variable Input */}
        {/* <div>
          <label htmlFor="target_variable" className="block text-lg font-medium">Target Variable</label>
          <input
            id="target_variable"
            type="text"
            value={targetVariable}
            onChange={(e) => setTargetVariable(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div> */}

        {/* Columns for Analysis (Select) */}
        <div>
          <label
            htmlFor="columns_for_analysis"
            className="block text-lg font-medium"
          >
            Select Target Variable
          </label>
          <select
            id="target_variable"
            value={targetVariable} // Should be a scalar value (string)
            onChange={(e) => setTargetVariable(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          >
            <option value="">Select a column</option>
            {columnOptions.map((column, index) => (
              <option key={index} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div>
          {result == null && !isLoading && (
            <button
              onClick={handleSubmitGeneral}
              className="w-full py-3 bg-blue-600 text-white-500 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          )}
        </div>
        {isLoading && (
          <div className="px-3.5 py-2.5 text-center text-sm font-semibold text-black">
            <Lottie options={defaultOptions} height={100} width={100} />
            <div>Please Wait</div>
          </div>
        )}
        {result !== null && (
          <div className="pt-2">
            <div className="block text-lg font-medium">Result</div>
            <img src={result.plot3_path} />
            <div dangerouslySetInnerHTML={{ __html: result.response3 }} />
            <img src={result.plot4_path} />
            <div dangerouslySetInnerHTML={{ __html: result.response4 }} />
            <button
              className="bg-indigo-500 p-2 my-20 rounded-lg text-white-500"
              onClick={() => window.open(result.pdf_file_path, "_blank")}
            >
              Download File Result
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Tabular;
