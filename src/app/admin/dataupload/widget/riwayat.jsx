import { useState } from "react";
import { ArrowRight, ArrowLeft,FileArchive } from "lucide-react";


function ToolBar() {
  const items = [
    { name: "PDF", key: "PDF", image: <FileArchive/> },
    { name: "CSV", key: "CSV", image: <FileArchive/> },
    { name: "Excel", key: "Excel", image: <FileArchive/> },
    { name: "DOCX", key: "DOCX", image: <FileArchive/> },
    { name: "Audio", key: "Audio", image: <FileArchive/> },
    

    // Add more items as needed
  ];

  return (
    <div id="default-carousel" className="relative w-full max-h-60 justify-center items-center p-3">
      <div className="overflow-hidden rounded-lg md:h-96 p-2">
        {items.map((item, index) => (
          <div
          key={index}
          className="size-text-5 py-4 px-2 cursor-pointer select-none mt-1 md:rounded-2xl shadow-[rgba(59,63,81,0.12)_0px_8px_8px_0px] bg-white hover:bg-gray-50 transition duration-200"
        >
          {item.name}
        </div>
        ))}
      </div>
    </div>
  );
}

export default ToolBar;
