"use client"; // Required for Next.js client components

import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, FileArchive } from "lucide-react";
import { apiListRiwayatDelete, apiListRiwayat } from "../../../../libs/api";
import Swal from "sweetalert2";

const RiwayatContent = ({
  activeTab,
  url,
  result,
  setResult,
}) => {
  const [itemsPrompt, setList] = useState([]);

  return (
    <div className="flex-1 justify-center items-center w-full px-10">
      {activeTab === "tab2" && result === null && (
        <div>
          Belum Memiliki Riwayat
        </div>
      )}
    </div>
  );
};

export default RiwayatContent;
