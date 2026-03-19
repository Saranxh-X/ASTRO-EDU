import React, { useState, useEffect, useRef } from 'react';
import './AIChatbot.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatbotProps {
  onBack: () => void;
}

const RocketIcon = () => (
  <div className="rocket-icon">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3" />
      <path d="M12 15v5s.8 3.38 3 5c2.2 1.62 5 2 5 2" />
    </svg>
  </div>
);

const AIChatbot: React.FC<AIChatbotProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to Astro Command! I am your AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (userText: string) => {
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      let responseText = "";
      const lowerText = userText.toLowerCase();

      if (lowerText.includes("hello") || lowerText.includes("hi")) {
        responseText = "Greetings, Astronaut! Ready for today's mission?";
      } else if (lowerText.includes("who are you")) {
        responseText = "I am the Astro Edu AI, designed to help you navigate through your learning journey in space!";
      } else if (lowerText.includes("math") || lowerText.includes("science")) {
        responseText = "That sounds like a great topic! You should check out the 'Learn' or 'Practice' sections for more on that.";
      } else if (lowerText.includes("help")) {
        responseText = "I can answer questions about the platform or just chat. What's on your mind?";
      } else {
        responseText = "That's interesting! Tell me more about that. I'm here to support your learning mission.";
      }

      const newMessage: Message = {
        id: Date.now(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    generateAIResponse(inputText);
  };

  return (
    <div className="ai-chatbot-container au-panel">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>
          ←
        </button>
        <h2 className="chat-title">ASTRO AI COMMAND</h2>
        <div className="status-indicator">
          <span className="pulse"></span> ONLINE
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
            {msg.sender === 'ai' && <RocketIcon />}
            <div className={`message-bubble ${msg.sender}`}>
              {msg.text}
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-wrapper ai">
            <RocketIcon />
            <div className="message-bubble ai typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message to Astro AI..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isTyping}
        />
        <button type="submit" className="send-btn" disabled={isTyping || !inputText.trim()}>
          SEND
        </button>
      </form>
    </div>
  );
};

export default AIChatbot;
