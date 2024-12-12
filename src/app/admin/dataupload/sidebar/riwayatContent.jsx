"use client"; // Required for Next.js client components

import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, FileArchive } from "lucide-react";
import { apiListRiwayatDelete, apiListRiwayat } from "../../../../libs/api";
import Swal from "sweetalert2";

const RiwayatContent = ({
  activeTab,
  url,
  setTitle,
  title,
  handleUrlChange,
  result,
  setResult,
  timestamp,
  setTimestamp,
}) => {
  const [itemsPrompt, setList] = useState([]);

  return (
    <div className="flex-1 justify-center items-center w-full px-10">
      {activeTab === "tab2" && url === "" && (
        <div>
           History Not Found
        </div>
      )}
      {activeTab === "tab2" && url !== "" && (
        <div>
          <div className="flex-1 justify-center items-center w-full">
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
    </div>
  );
};

export default RiwayatContent;
