export default function FeatureCard({ icon, title, text, delay = 0 }) {
  return (
    <div
      className="card shadow-soft p-6 transition-opacity duration-700"
      style={{ animation: `fadeIn .6s ease ${delay}ms both` }}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0">{icon}</div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-600 mt-1">{text}</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  );
}
