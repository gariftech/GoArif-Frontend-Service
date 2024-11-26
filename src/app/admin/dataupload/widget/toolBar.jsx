import { useState } from "react";
import { ArrowRight, ArrowLeft,FileArchive } from "lucide-react";


function ToolBar() {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    { name: "PDF", key: "PDF", image: <FileArchive width={70} height={70}/> },
    { name: "CSV", key: "CSV", image: <FileArchive width={70} height={70}/> },
    { name: "Excel", key: "Excel", image: <FileArchive width={70} height={70}/> },
    { name: "DOCX", key: "DOCX", image: <FileArchive width={70} height={70}/> },
    { name: "Audio", key: "Audio", image: <FileArchive width={70} height={70}/> }

    // Add more items as needed
  ];

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  return (
    <div id="default-carousel" className="relative w-full max-h-60 justify-center items-center">
      <div className="overflow-hidden rounded-lg md:h-96 p-2">
        {items.map((item, index) => (
          <div
            key={item.key} // Use `key` for uniqueness
            className={`${
              index === activeIndex ? "block" : "hidden"
            } cursor-pointer select-none w-full h-40 rounded-r-3xl md:rounded-3xl shadow-[rgba(59,63,81,0.12)_0px_8px_16px_0px] flex items-center justify-center`}
          >
            {item.image}
            <span className="absolute text-white font-bold bottom-20">{item.name}</span>
          </div>
        ))}
      </div>
      {/* <div className="absolute z-30 flex -translate-x-1/2 bottom-10 left-1/2 space-x-3 rtl:space-x-reverse">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              activeIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
            aria-current={activeIndex === index}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
          ></button>
        ))}
      </div> */}
      <button
        type="button"
        className="absolute bottom-7 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={prevSlide}
      >
        {/* Previous button icon */}
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 focus:ring-4 focus:ring-white">
          <ArrowLeft/>
        </span>
      </button>
      <button
        type="button"
        className="absolute bottom-7  end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={nextSlide}
      >
        {/* Next button icon */}
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 focus:ring-4 focus:ring-white">
          <ArrowRight/>
        </span>
      </button>
    </div>
  );
}

export default ToolBar;
