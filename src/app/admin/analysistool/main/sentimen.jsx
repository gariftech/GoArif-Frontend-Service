"use client";

import { useState } from "react";
import Lottie from "react-lottie";
import * as animationData from "../../../../assets/gifs/loadingAnim.json";
import { Columns } from "lucide-react";
import ChatApp from "../chat/chatPopup";

const Sentimen = ({
  customQuestions,
  setCustomQuestions,
  result,
  setResult,
  Ischat,
  setIsChat,
}) => {
  const [file, setFile] = useState(null);
  const [customStop, setCustomStop] = useState("");
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

    const columnsAnalysis = columnOptions.join(",");
    // Create a FormData object
    const formData = new FormData();
    formData.append("file", file);
    formData.append("custom_question", customQuestions);
    formData.append("question", customQuestions);
    formData.append("custom_stopwords", customStop);
    formData.append("api_key", "AIzaSyBqYpSLeY5lIzo11DQAL20QLG1Slr4MjIU");
    formData.append("hf_token", "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");

    formData.append("target_variable", JSON.parse(targetVariable));
    // formData.append(
    //   "columns_for_analysis",
    //   "id,age,hypertension,heart_disease,ever_married,work_type,Residence_type,avg_glucose_level,bmi,smoking_status"
    // );

    try {
      setIsLoading(true);
      // Send the form data to the server
      const response = await fetch("https://app.goarif.co/py/v1/analyze", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setResult(result);
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
      <form onSubmit={handleSubmitGeneral} className="space-y-6">
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

        {/* Custom Stop Input */}
        <div>
          <label htmlFor="custom_Stop" className="block text-lg font-medium">
            Custom Stop Words
          </label>
          <input
            id="custom_Stop"
            type="text"
            value={customStop}
            onChange={(e) => setCustomStop(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

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
          {result == null&&  !isLoading && (
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
            <div className="flex flex-wrap">
              <img src={result.sentiment_plot_path} />
              <img src={result.topic_plot_path} />
              <img src={result.topic_plot_path1} />
              <img src={result.topic_plot_path2} />
              <img src={result.wordcloud_positive} />
              <div
                dangerouslySetInnerHTML={{ __html: result.gemini_response_pos }}
              />
              <img src={result.wordcloud_neutral} />
              <div
                dangerouslySetInnerHTML={{ __html: result.gemini_response_neu }}
              />
              <img src={result.wordcloud_negative} />
              <div
                dangerouslySetInnerHTML={{ __html: result.gemini_response_neg }}
              />
              <img src={result.bigram_positive} />
              <div
                dangerouslySetInnerHTML={{
                  __html: result.gemini_response_pos1,
                }}
              />
              <img src={result.bigram_neutral} />
              <div
                dangerouslySetInnerHTML={{
                  __html: result.gemini_response_neu1,
                }}
              />
              <img src={result.bigram_negative} />
              <div
                dangerouslySetInnerHTML={{
                  __html: result.gemini_response_neg1,
                }}
              />
              <img src={result.unigram_positive} />
              <div
                dangerouslySetInnerHTML={{
                  __html: result.gemini_response_pos2,
                }}
              />
              <img src={result.unigram_neutral} />
              <div
                dangerouslySetInnerHTML={{
                  __html: result.gemini_response_neu2,
                }}
              />
              <img src={result.unigram_negative} />
              <div
                dangerouslySetInnerHTML={{
                  __html: result.gemini_response_neg2,
                }}
              />
            </div>
            <button
              className="bg-indigo-500 p-2 my-20 rounded-lg text-white-500"
              onClick={() => window.open(result.pdf_file_path, "_blank")}
            >
              Download File Result
            </button>
          </div>
        )}
      </form>
      {/* {Ischat && (
        <div className="px-5">
          <div className="py-2 text-xs">Chat with Goarif AI</div>
          <ChatApp
            result={
              result.gemini_response_pos +
              result.gemini_response_neu +
              result.gemini_response_neg +
              result.gemini_response_pos1 +
              result.gemini_response_neu1 +
              result.gemini_response_neg1 +
              result.gemini_response_pos2 +
              result.gemini_response_neu2 +
              result.gemini_response_neg2
            }
          />
        </div>
      )} */}
    </div>
  );
};

export default Sentimen;
