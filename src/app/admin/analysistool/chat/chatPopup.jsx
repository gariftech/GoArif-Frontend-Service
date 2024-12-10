import React, { useState, useRef, useEffect } from "react";
import { apiChatSend } from "../../../../libs/api";

const ChatApp = ({ result }) => {
  const chatEndRef = useRef(null);

  const initialMessages = JSON.parse(localStorage.getItem("chat")) || [
    {
      sender: "result",
      text: "Hello! How can I assist you today?",
    },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typedMessage, setTypedMessage] = useState(""); // State for typing animation

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      sender: "user",
      text: inputText,
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputText("");

    localStorage.setItem("chat", JSON.stringify(updatedMessages));
    setIsTyping(true);

    try {
      const body = {
        textChat:
          "Berikan jawaban yang sesuai berdasarkan hasil berikut:" +
          result +
          "Jawaban harus sesuai dengan hasil di atas. Jangan tambahkan informasi yang tidak relevan." +
          "Pertanyaan: " +
          inputText,
      };
      const setRiwayat = await apiChatSend(body);

      const botResponseText = setRiwayat.data.message;

      // Animate typing effect
      let currentText = "";
      botResponseText.split("").forEach((char, index) => {
        setTimeout(() => {
          currentText += char;
          setTypedMessage(currentText);

          // Finalize when done typing
          if (index === botResponseText.length - 1) {
            const botResponse = {
              sender: "result",
              text: botResponseText,
            };
            const finalMessages = [...updatedMessages, botResponse];
            setMessages(finalMessages);

            localStorage.setItem("chat", JSON.stringify(finalMessages));
            setIsTyping(false);
            setTypedMessage(""); // Clear typed message
          }
        }, index * 50); // Adjust typing speed here (50ms per character)
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, typedMessage]);

  return (
    <div className="w-full pt-5">
      <div className="w-full bg-white shadow-md rounded-lg p-4">
        {/* Chat History */}
        <div className="space-y-4 overflow-y-auto max-h-[400px]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg shadow-md max-w-[75%] ${
                  msg.sender === "user" ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <p
                  className={`text-sm ${
                    msg.sender === "user" ? "text-white-500" : "text-black"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          {/* Typing Animation */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="p-3 rounded-lg shadow-md bg-gray-200 max-w-[75%]">
                <p className="text-sm text-black">{typedMessage}</p>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Field */}
        <div className="mt-4 flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div
            onClick={handleSendMessage}
            className="bg-lime-500 text-white px-4 py-2 rounded-r-lg hover:bg-lime-500 cursor-pointer"
          >
            Send
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
