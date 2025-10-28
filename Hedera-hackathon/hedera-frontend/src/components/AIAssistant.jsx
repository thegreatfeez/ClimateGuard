// src/components/AIAssistant.jsx
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, X, Bot, User, Volume2, VolumeX } from 'lucide-react';

function AIAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m ClimateGuard AI, your personal climate assistant. I can help you with weather predictions, disaster preparedness, and eco-friendly tips. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    "What should I do during a heatwave?",
    "How can I prepare for floods?",
    "Tips for reducing carbon footprint",
    "What's the weather forecast?",
    "How do I earn more tokens?"
  ];

  const aiResponses = {
    heatwave: "During a heatwave, follow these essential steps:\n\n1. Stay hydrated - drink water regularly even if you don't feel thirsty\n2. Stay indoors during peak heat hours (12 PM - 3 PM)\n3. Use fans or air conditioning if available\n4. Wear light, loose-fitting clothing\n5. Check on elderly neighbors and vulnerable individuals\n6. Avoid strenuous activities outdoors\n7. Never leave children or pets in parked vehicles\n\nStay safe! 🌡️",
    
    flood: "To prepare for floods, take these precautions:\n\n1. Create an emergency kit with essentials:\n   • Non-perishable food and water (3-day supply)\n   • Flashlights and batteries\n   • First aid supplies\n   • Important documents in waterproof container\n\n2. Know your evacuation routes\n3. Move valuables to higher floors\n4. Install sump pumps in basements\n5. Stay informed via weather alerts\n6. Avoid walking or driving through floodwater\n7. Turn off utilities if instructed\n\nPreparation saves lives! 🌊",
    
    carbon: "Here are effective ways to reduce your carbon footprint:\n\n1. Transportation:\n   • Use public transport, bike, or walk\n   • Carpool when possible\n   • Consider electric vehicles\n\n2. Home Energy:\n   • Switch to LED bulbs\n   • Use renewable energy sources\n   • Improve insulation\n\n3. Food:\n   • Eat more plant-based meals\n   • Buy local and seasonal produce\n   • Reduce food waste\n\n4. Consumption:\n   • Buy less, choose quality\n   • Recycle and compost\n   • Support sustainable brands\n\nLog these actions in ClimateGuard to earn tokens! 🌱",
    
    weather: "Based on your location (Lagos, Nigeria), here's your forecast:\n\n📅 Today: Partly cloudy, 32°C\n⚠️ Alert: High UV index - use sun protection\n\n📅 Tomorrow: Scattered thunderstorms, 28-31°C\n⚠️ Alert: Heavy rainfall expected in evening\n\n📅 Next 3 days: Partly cloudy with occasional rain\n\nUpgrade to Premium for 14-day forecasts! ☁️",
    
    tokens: "Maximize your token earnings:\n\n1. High-Value Activities (3x-5x multipliers):\n   • Tree planting: 3x points\n   • Renewable energy use: 2.5x points\n   • Recycling: 1.5x points\n\n2. Daily Consistency:\n   • Log activities regularly\n   • Complete verification quickly\n\n3. Premium Benefits:\n   • 2x token multiplier (Premium)\n   • 5x token multiplier (Enterprise)\n   • Priority verification\n\n4. DAO Participation:\n   • Vote on proposals for bonus tokens\n   • Refer friends for rewards\n\nStart logging your eco-actions today! 💰",
    
    default: "I can help you with:\n\n• Weather forecasts and alerts\n• Disaster preparedness tips\n• Carbon footprint reduction strategies\n• Token earning advice\n• Eco-friendly lifestyle recommendations\n\nJust ask me anything about climate and sustainability! 🌍"
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('heatwave') || lowerMessage.includes('heat')) {
      return aiResponses.heatwave;
    } else if (lowerMessage.includes('flood') || lowerMessage.includes('rain') || lowerMessage.includes('water')) {
      return aiResponses.flood;
    } else if (lowerMessage.includes('carbon') || lowerMessage.includes('footprint') || lowerMessage.includes('reduce') || lowerMessage.includes('eco')) {
      return aiResponses.carbon;
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('forecast') || lowerMessage.includes('temperature')) {
      return aiResponses.weather;
    } else if (lowerMessage.includes('token') || lowerMessage.includes('earn') || lowerMessage.includes('reward')) {
      return aiResponses.tokens;
    } else {
      return aiResponses.default;
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiMessage = {
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Voice response if enabled
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiMessage.content);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    }, 1500);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a1f1a] rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col border border-[#22c55e]/30 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Bot size={24} className="text-[#22c55e]" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">ClimateGuard AI</h2>
              <p className="text-white/80 text-sm">Your Climate Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
              title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
            >
              {voiceEnabled ? (
                <Volume2 size={20} className="text-white" />
              ) : (
                <VolumeX size={20} className="text-white" />
              )}
            </button>
            
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-blue-500' : 'bg-[#22c55e]'
                }`}>
                  {message.role === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>
                
                <div>
                  <div className={`rounded-2xl p-4 ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-[#153029] text-white border border-[#1a3a2e]'
                  }`}>
                    <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-gray-500 text-xs mt-1 px-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-[#22c55e] rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-[#153029] border border-[#1a3a2e] rounded-2xl p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-gray-400 text-sm mb-3">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="bg-[#153029] hover:bg-[#1a3a2e] text-gray-300 text-sm px-4 py-2 rounded-lg border border-[#1a3a2e] hover:border-[#22c55e] transition"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-[#1a3a2e]">
          <div className="flex items-end space-x-2">
            <div className="flex-1 bg-[#153029] border border-[#1a3a2e] rounded-xl p-3 focus-within:border-[#22c55e] transition">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about climate..."
                className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none"
                rows={2}
              />
            </div>
            
            <button
              onClick={handleVoiceInput}
              disabled={isListening}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                isListening 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-[#153029] hover:bg-[#1a3a2e] border border-[#1a3a2e]'
              }`}
            >
              <Mic size={20} className={isListening ? 'text-white' : 'text-gray-400'} />
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 bg-[#22c55e] hover:bg-[#16a34a] rounded-xl flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} className="text-white" />
            </button>
          </div>
          
          <p className="text-gray-500 text-xs mt-2 text-center">
            🎙️ Click the mic for voice input • Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;