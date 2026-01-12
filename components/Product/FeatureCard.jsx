const FeatureCard = ({ icon: Icon, title, subtitle, colorClass }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
    <Icon className={`w-5 h-5 ${colorClass}`} />
    <div>
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);


export default FeatureCard;