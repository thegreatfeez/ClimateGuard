// src/components/QuickStartGuide.jsx
import { X } from 'lucide-react';
import { useState } from 'react';

function QuickStartGuide() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-[#153029] rounded-xl p-6 border border-[#22c55e] shadow-2xl z-50">
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
      >
        <X size={20} />
      </button>

      <h3 className="text-white text-lg font-bold mb-4">🌱 Quick Start Guide</h3>
      
      <ol className="space-y-3 text-sm">
        <li className="flex items-start space-x-2">
          <span className="text-[#22c55e] font-bold">1.</span>
          <p className="text-gray-300">
            Go to <span className="text-white font-semibold">Carbon Tracker</span> and register
          </p>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-[#22c55e] font-bold">2.</span>
          <p className="text-gray-300">
            Log your eco-friendly activities daily
          </p>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-[#22c55e] font-bold">3.</span>
          <p className="text-gray-300">
            Wait for verification from our team
          </p>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-[#22c55e] font-bold">4.</span>
          <p className="text-gray-300">
            Claim CGT tokens from <span className="text-white font-semibold">Rewards</span> page
          </p>
        </li>
      </ol>

      <button
        onClick={() => setIsOpen(false)}
        className="mt-4 w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold py-2 rounded-lg transition"
      >
        Got it!
      </button>
    </div>
  );
}

export default QuickStartGuide;