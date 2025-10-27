// src/components/StatsCard.jsx
function StatsCard({ title, value, subtitle, icon: Icon, trend, trendValue }) {
  return (
    <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e] hover:border-[#22c55e] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        {Icon && (
          <div className="w-10 h-10 bg-[#22c55e]/10 rounded-lg flex items-center justify-center">
            <Icon size={20} className="text-[#22c55e]" />
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <p className="text-white text-3xl font-bold">{value}</p>
      </div>
      
      {subtitle && (
        <p className="text-gray-400 text-sm">{subtitle}</p>
      )}
      
      {trend && (
        <div className="mt-3 flex items-center space-x-2">
          <span className={`text-sm font-semibold ${trend === 'up' ? 'text-[#22c55e]' : 'text-red-500'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
          <span className="text-gray-500 text-sm">vs last month</span>
        </div>
      )}
    </div>
  );
}

export default StatsCard;