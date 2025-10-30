// src/components/AIAssistant.jsx - IMPROVED VERSION
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, X, Bot, User, Volume2, VolumeX } from 'lucide-react';

// Get API key from environment variable
const GEMINI_API_KEY = 'AIzaSyCmRmu_iLk4_QykI1WEMwY-DLSJM8nJmoI';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

function AIAssistant({ isOpen, onClose, weatherData, forecastData, alerts }) {
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
    "What's the weather like today?",
    "Any weather alerts I should know about?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Build context from weather data
  const buildWeatherContext = () => {
    let context = "Current Weather Context:\n";
    
    if (weatherData) {
      context += `Location: ${weatherData.location}\n`;
      context += `Temperature: ${weatherData.temp}°C (Feels like: ${weatherData.feelsLike}°C)\n`;
      context += `Conditions: ${weatherData.description}\n`;
      context += `Humidity: ${weatherData.humidity}%\n`;
      context += `Wind Speed: ${weatherData.windSpeed} km/h\n`;
      context += `Visibility: ${weatherData.visibility} km\n`;
    } else {
      context += "Weather data not currently available.\n";
    }

    if (forecastData && forecastData.length > 0) {
      context += "\nUpcoming Forecast (next 3 days):\n";
      forecastData.slice(0, 3).forEach((day, index) => {
        const dayName = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : `Day ${index + 1}`;
        context += `${dayName}: ${day.condition}, High: ${day.high}°C, Low: ${day.low}°C`;
        if (day.rain > 0) context += `, Rain: ${day.rain}mm`;
        context += `\n`;
      });
    } else {
      context += "\nForecast data not currently available.\n";
    }

    if (alerts && alerts.length > 0) {
      context += "\nActive Weather Alerts:\n";
      alerts.slice(0, 3).forEach(alert => {
        context += `- ${alert.category} (${alert.severity}): ${alert.details}\n`;
      });
    } else {
      context += "\nNo active weather alerts at this time.\n";
    }

    return context;
  };

  // Call Gemini API
  const callGeminiAPI = async (userMessage) => {
    try {
      const weatherContext = buildWeatherContext();
      
      const systemPrompt = `You are ClimateGuard AI, a helpful climate and weather assistant. You provide accurate, concise, and actionable advice about weather, climate change, disaster preparedness, and eco-friendly living.

${weatherContext}

Important guidelines:
- Be friendly and conversational
- Provide practical, actionable advice
- Use the weather context provided when relevant to the user's question
- If asked about weather and data is available, refer to the actual data provided
- If weather data is not available, provide general advice
- Keep responses concise but informative (2-3 paragraphs max)
- Use emojis sparingly for clarity
- Focus on safety and preparedness
- Encourage sustainable practices
- Never make up weather data - only use what's provided in the context

User question: ${userMessage}

Please provide a helpful response based on the context above.`;

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Gemini API Error:', errorData);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if response has expected structure
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid API response structure');
      }
      
      const aiResponse = data.candidates[0].content.parts[0].text;
      return aiResponse;

    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Provide helpful fallback response
      if (error.message.includes('API request failed: 429')) {
        return "I'm experiencing high demand right now. Please try again in a moment. In the meantime, you can check the weather dashboard for current conditions and alerts.";
      }
      
      return "I apologize, but I'm having trouble connecting right now. Please try again in a moment. For immediate weather information, check the Alerts page or Dashboard.";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Get AI response from Gemini
      const aiResponseText = await callGeminiAPI(currentInput);
      
      const aiMessage = {
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);

      // Voice response if enabled
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponseText);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Please try Chrome or Edge.');
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

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error !== 'no-speech') {
        alert(`Voice recognition error: ${event.error}`);
      }
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
              <p className="text-white/80 text-sm">Powered by Gemini</p>
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
                disabled={isTyping}
              />
            </div>
            
            <button
              onClick={handleVoiceInput}
              disabled={isListening || isTyping}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                isListening 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-[#153029] hover:bg-[#1a3a2e] border border-[#1a3a2e]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Voice input"
            >
              <Mic size={20} className={isListening ? 'text-white' : 'text-gray-400'} />
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 bg-[#22c55e] hover:bg-[#16a34a] rounded-xl flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send message"
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