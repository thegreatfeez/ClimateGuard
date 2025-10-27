// src/components/FeatureCard.jsx
function FeatureCard({ title, description, image, buttonText, onClick, className = '' }) {
  return (
    <div className={`bg-[#153029] rounded-xl overflow-hidden border border-[#1a3a2e] hover:border-[#22c55e] transition-all duration-300 ${className}`}>
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-2/5 bg-gradient-to-br from-[#1a3a2e] to-[#0a1f1a] p-8 flex items-center justify-center">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-6xl">{title.includes('Alert') ? '🌦️' : title.includes('Carbon') ? '🌱' : '🪙'}</div>
          )}
        </div>

        {/* Content Section */}
        <div className="md:w-3/5 p-6 flex flex-col justify-center">
          <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-400 text-sm mb-4">{description}</p>
          <button
            onClick={onClick}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold px-6 py-2 rounded-lg transition self-start"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeatureCard;