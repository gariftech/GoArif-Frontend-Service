"use client"; // Required for Next.js client components

import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, FileArchive } from "lucide-react";
import { apiListRiwayatDelete, apiListRiwayat } from "../../../../libs/api";
import Swal from "sweetalert2";

const Riwayat = ({
  setResult,
  setUrl,
  setTitle,
  setTimestamp,
}) => {
  const [itemsPrompt, setList] = useState([]);

  const handleGetPrompt = async () => {
    try {
      const response = await apiListRiwayat();
      setList(response.data.data);
    } catch (error) {
      // setisLoading(false);
    }
  };

  const handleDelete = async (index) => {
    // Show the SweetAlert confirmation popup
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    // If the user confirms the deletion
    if (result.isConfirmed) {
      try {
        await apiListRiwayatDelete(index);
        handleGetPrompt();
      } catch (error) {}
    }
  };

  const handleClick = async (e) => {
    if (e.type !== "Transcribe File") {
      setTitle(e.title);
      setUrl(e.file[0]);
      setResult(e.result);
      setTimestamp(e.prompt);
    }else{
      setTimestamp("");
      setTitle(e.title);
      setUrl(e.file[0]);
      setResult(e.result);
    }
  };

  // useEffect(() => {
  //   handleGetPrompt();
  // }, []);

  return (
    <div
      id="default-carousel"
      className="relative w-full max-h-100 justify-center items-center p-3"
    >
      <div className="overflow-y-auto rounded-lg md:h-96 p-2">
        {itemsPrompt.length > 0 ? (
          itemsPrompt.map((item, index) => (
            <div
              onClick={() => handleClick(item)}
              key={index}
              className="text-xs py-4 px-2 cursor-pointer select-none mt-1 md:rounded-2xl border-2 border-indigo-100 shadow-[rgba(59,63,81,0.12)_0px_0px_0px_0px] bg-white hover:bg-gray-50 transition duration-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  {/* Truncate title to 20 characters */}
                  {item.title.length > 20
                    ? item.title.slice(0, 20) + "..."
                    : item.title}
                  <br />
                  {/* Truncate type to 20 characters */}(
                  {item.type.length > 20
                    ? item.type.slice(0, 20) + "..."
                    : item.type}
                  )
                </div>
                {/* Delete Button */}
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center text-gray-500">
            <span className="text-xl mr-2">🔍</span>
            <span>History not found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Riwayat;
