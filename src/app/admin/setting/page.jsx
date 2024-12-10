"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const dataPayments = [
  {
    name: "Subscription Plan A",
    valid: "13-12-2023",
    price: "$ 50",
    status: "nonactive",
  },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("account"); // Manage active tab
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [dataPayment, setDataPayment] = useState(dataPayments);
  const accountStatus = "Basic"; // Change to "Pro" or "Basic" as needed

  const handleUpdateAccount = () => {
    const payload = { name, dateOfBirth, address };
    console.log("Updating account with payload:", payload);
    // Add API call here
  };

  const handleChangePassword = () => {
    const payload = { currentPassword, newPassword };
    console.log("Changing password with payload:", payload);
    // Add API call here
  };

  const handleDownloadInvoice = (invoiceId) => {
    console.log(`Downloading invoice with ID: ${invoiceId}`);
    // Implement the logic for downloading the invoice
  };

  return (
    <div className="p-4 w-full">
      <nav className="flex mb-4">
        <button
          onClick={() => setActiveTab("account")}
          className={`px-4 py-2 text-sm font-medium focus:outline-none transition border-b-2 ${
            activeTab === "account"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-gray-500 hover:text-blue-500"
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab("payment")}
          className={`px-4 py-2 text-sm font-medium focus:outline-none transition border-b-2 ${
            activeTab === "payment"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-gray-500 hover:text-blue-500"
          }`}
        >
          Payment
        </button>
      </nav>

      <main>
        {activeTab === "account" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={email}
                disabled
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Account Status</label>
              <p className="font-semibold">{accountStatus}</p>
              {accountStatus !== "Pro" && (
                <button className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded hover:bg-yellow-600">
                  Upgrade to Pro
                </button>
              )}
            </div> */}
            <button
              onClick={handleUpdateAccount}
              className="bg-blue-500 text-white-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Update
            </button>

            <h2 className="text-lg font-semibold mt-8 mb-4">Change Password</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              className="bg-green-500 text-white-500 px-4 py-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        )}

        {activeTab === "payment" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Payment History</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    No
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Name Payment
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Valid Until
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Price
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataPayment.map((payment, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{index  + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {payment.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {payment.valid}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">$50</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {payment.status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button onClick={handleDownloadInvoice} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                        Download Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
