"use client";
import React, { useState } from "react";
import Image from "next/image";
import Chart from "chart.js";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-5 w-full">
      {/* Welcome Section */}
      <div className="flex-1 min-w-[250px] h-[20%] shadow-lg bg-white rounded-3xl p-5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-base font-medium">Welcome, Hilyathul Wahid</p>
        </div>
        <div className="flex flex-col justify-end items-end h-full">
          <p className="text-3xl font-semibold ">Free Edition</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm py-1 px-3 bg-lime-600 rounded-md shadow-lg text-white-500 mt-2"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* Size Storage */}
      <div className="flex-1 min-w-[250px] h-[20%] shadow-lg bg-white rounded-3xl p-5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-base font-medium">Size Storage</p>
        </div>
        <div className="flex flex-col justify-end items-end h-full">
          <p className="text-3xl font-semibold pb-10">20 / 200 MB</p>
        </div>
      </div>

      {/* Riwayat Transcribe */}
      <div className="flex-1 min-w-[250px] h-[20%] shadow-lg bg-white rounded-3xl p-5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-base font-medium">Project</p>
        </div>
        <div className="flex flex-col justify-end items-end h-full">
          <p className="text-3xl font-semibold pb-10">3 Project</p>
        </div>
      </div>
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

const SubscriptionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Explore how AI can help you with everyday tasks",
      features: [
        "Size Storage 200MB",
        "5 Upload File",
        "5 Transcribe Audio File",
        "Limited file uploads and advanced data analysis",
        "5 Prompt Recomendations",
      ],
      buttonText: "Your current plan",
      buttonDisabled: true,
      buttonClass: "bg-gray-300 text-gray-500 cursor-not-allowed",
    },
    {
      name: "Plus",
      price: "$20/Month",
      description: "Level up productivity and creativity with expanded access",
      features: [
        "Size Storage 2GB",
        "Chat with your data",
        "Unlimited File Analysis",
        "AI Prompt Recomended",
        "Create and use custom GPTs",
        "Access to Tabular and Sentimen Analysis",
      ],
      buttonText: "Get Plus",
      buttonDisabled: false,
      buttonClass: "bg-green-500 text-white-500 hover:bg-green-600",
      isPopular: true,
    },
    {
      name: "Pro",
      price: "$200/Month",
      description: "Get the best of OpenAI with the highest level of access",
      features: [
        "Size Storage 20GB",
        "Unlimited access chat with data",
        "Unlimited advanced transcribe",
        "Access to Pro mode for harder questions",
        "Extended access to tabular and sentimen analysis",
      ],
      buttonText: "Get Pro",
      buttonDisabled: false,
      buttonClass: "bg-black text-white-500 hover:bg-gray-800",
    },
  ];

  return (
    <div className="fixed inset-0 bg-white-500 z-99999 flex flex-col items-center px-5 py-10 overflow-auto">
      <h1 className="text-3xl font-bold mb-8 mt-20">Upgrade your plan</h1>
      <div className="flex flex-col md:flex-row gap-6 w-full md:w-4/5 justify-center ">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative flex flex-col items-start p-6 border rounded-lg shadow-md ${
              plan.isPopular ? "border-green-500" : "border-gray-200"
            }`}
          >
            {plan.isPopular && (
              <span className="absolute top-3 right-3 bg-green-100 text-green-700 px-3 py-1 text-sm font-medium rounded-lg">
                POPULAR
              </span>
            )}
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-2xl font-bold my-2">{plan.price}</p>
            <p className="text-gray-600">{plan.description}</p>
            <ul className="mt-4 mb-6 text-gray-500 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-green-500 mr-2">✔</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              disabled={plan.buttonDisabled}
              className={`w-full py-2 px-4 rounded ${plan.buttonClass}`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 text-sm text-gray-600">
        Need more capabilities for your business?{" "}
        <a href="#" className="text-blue-600 underline">
          See Enterprise plans
        </a>
      </div>
      <button
        className={`w-full py-2 px-4 rounded`}
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};
