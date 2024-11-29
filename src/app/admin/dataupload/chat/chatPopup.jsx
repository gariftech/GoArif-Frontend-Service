import { MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Halo! Ada yang bisa kami bantu?" },
  ]);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { sender: "user", text: message }]);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Terima kasih! Pesan Anda telah diterima." },
      ]);
      setMessage("");
    }
  };

  // Scroll otomatis ke bawah setelah pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    const divElement = document.getElementById("result");
    if (divElement) {   
      console.log(divElement); // Logs the div element
      divElement.style.backgroundColor = 'yellow'; // Example: change background color
    }
  }, [messages]);

  return (
    <div>
      {/* Tombol chat */}
      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-neutral-50 p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
        onClick={toggleChat}
      >
        <MessageCircle className="stroke-primary-content" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-indigo-500 shadow-lg rounded-lg border border-gray-300 max-w-80">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-50  text-white p-4 rounded-t-lg">
            <span>GoArif Assistance</span>
            <button className="text-xl font-bold" onClick={toggleChat}>
              ✖
            </button>
          </div>

          {/* Body chat */}
          <div className="p-4 h-80 overflow-y-auto">
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 max-w-full break-words rounded-lg ${
                      msg.sender === "user"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span>{msg.text}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="flex p-4 border-t border-gray-200">
            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Ketik pesan..."
              className="flex-1 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
              rows="2"  // Mengatur tinggi awal textarea
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 px-4 py-2 bg-blue-600 text-red rounded-lg hover:bg-indigo-400 focus:outline-none"
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;
