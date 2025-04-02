 "use client";

 import { Card } from './ui/card';
 import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";


export default function Chatbot() {
  const [userMessage, setUserMessage] = useState(""); // User input
  const [chatHistory, setChatHistory] = useState([]); // Conversation history
  const [loading, setLoading] = useState(false); // Loading state
  const [isOpen, setIsOpen] = useState(false); // State to toggle chatbot visibility

  const chatEndRef = useRef(null); // Scroll to the end of the chat after each new message

  // Fetch the initial chat history when the component mounts
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/chat-history");
        if (response.ok) {
          const data = await response.json();
          setChatHistory(data.messages || []);
        } else {
          console.error("Failed to fetch chat history");
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchHistory();
  }, []);

  // Scroll to the bottom of the chat when the component renders or new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Handle user input and submit
  const handleMessageSubmit = async (e) => {
    if (e.key === "Enter" && userMessage.trim()) {
      e.preventDefault();
      setLoading(true);

      try {
        const previousChatHistory = chatHistory
          .map((msg) => `Q: ${msg.question}\nA: ${msg.answer}`)
          .join("\n");

        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            previousChatHistory: previousChatHistory,
          }),
        });

        if (response.ok) {
          const { reply } = await response.json();

          // Update the chat history with the new message and reply
          setChatHistory((prevHistory) => [
            ...prevHistory,
            { question: userMessage, answer: reply },
          ]);

          setUserMessage(""); // Clear the input field
        } else {
          console.error("Error sending message:", response.statusText);
        }
      } catch (error) {
        console.error("Error submitting message:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      {/* Floating Button */}
      {!isOpen && (
       <Button
       onClick={toggleChatbot}
       className={`fixed bottom-4 right-4 rounded-full hover:translate-y-[-10px] transition-transform duration-300 shadow-lg z-40 p-3 ${
         isOpen ? "bg-gradient-to-r from-[#f5a293] to-[#8e89f0] hover:bg-finance-accent/90" : "bg-gradient-to-r from-[#f5a293] to-[#8e89f0] hover:bg-[#f5a293]"
       }`}
       size="icon"
     >
       <MessageCircle className="h-6 w-6" />
     </Button>





      )}

      {/* Chatbot Modal */}
      {isOpen && (
       <Card className="fixed bottom-6 right-6 flex flex-col h-96 w-80 bg-white rounded-[20px] shadow-lg z-50 hover:translate-y-[-5px] transition-transform duration-300">
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#f5a293] to-[#8e89f0] rounded-t-[20px]">
          <h2 className="text-white font-semibold text-m flex-1 text-center">FinanceSecure Assistant</h2>
          <button
            onClick={toggleChatbot}
            className="text-white font-bold text-lg"
          >
              X
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Chat History Section */}
            {chatHistory.length === 0 && (
              <p className="text-center text-muted-foreground">Start your conversation!</p>
            )}
            {chatHistory.map((msg, index) => (
              <div key={index} className="space-y-2">
                {/* User's Message */}
                <div className="flex justify-end w-full">
                  <div className="bg-[#8e89f0] text-white p-3 rounded-lg max-w-[80%]">
                    {msg.question}
                  </div>
                </div>

                {/* AI's Response */}
                <div className="flex">
                  <div className="bg-[#f5a293] text-white p-3 rounded-lg max-w-[80%]">
                    
                    <div className="text-sm">{msg.answer}</div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} /> {/* To scroll to the latest message */}
          </div>

          {/* Input Section (fixed at the bottom) */}
          <div className="p-4 bg-gray-100 rounded-lg flex items-center space-x-2 rounded-b-[20px]">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={handleMessageSubmit} // Trigger message submit on Enter key press
              placeholder="Type a message..."
              className="border-2 p-2 rounded-[20px] w-full"
              disabled={loading}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
