import { useState, useEffect } from "react";
import { File, FileWarning, MessageCircle, WholeWord } from "lucide-react";
import { apiListPromptFilesum } from "../../../../libs/api";

const itemsFile = [
  { name: "File Upload", key: "FileUpload", image: <File height={20} /> },
  { name: "Transcribe", key: "Transcribe", image: <WholeWord height={20} /> },
  { name: "Tabular", key: "Tabular", image: <WholeWord height={20} /> },
  { name: "Sentimen Analyst", key: "Sentimen Analyst", image: <WholeWord height={20} /> },
];

const ToolBar = ({
  setResult,
  setUrl,
  setPragraph,
  setFile,
  setPreview,
  setFileName,
  setActiveElement,
  activeElement
}) => {
  const [itemsPrompt, setListPrompt] = useState([]);
  const [isLoading, setisLoading] = useState(false); // Initial value

  const handleGetPrompt = async () => {
    try {
      const response = await apiListPromptFilesum();
      setListPrompt(response.data.data);
    } catch (error) {
      setisLoading(false);
    }
  };

  useEffect(() => {
    handleGetPrompt();
  }, []);

  return (
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
            className={`justify-center p-3 cursor-pointer select-none rounded-3xl md:rounded-3xl shadow-[rgba(59,63,81,0.12)_0px_4px_4px_0px] bg-white ${
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
          <div className="px-5 pb-5 text-xs">Prompt Rekomendasi</div>
          <div
            className="px-5 overflow-y-auto mb-10"
            style={{ maxHeight: "calc(70vh - 300px)" }}
          >
            {itemsPrompt.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  console.log(item.name); // Check item structure
                  setUrl(item.name);
                }}
                className="text-xs py-4 px-2 cursor-pointer select-none mt-1 rounded-2xl md:rounded-2xl border-2 border-indigo-100 shadow-[rgba(59,63,81,0.12)_0px_0px_0px_0px] bg-white hover:bg-gray-50 transition duration-200"
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolBar;
