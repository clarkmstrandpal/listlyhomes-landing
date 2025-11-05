export default function FeatureCard({ icon: Icon, title, children }) {
  return (
    <div className="card card-hover p-6">
      <div className="flex items-center gap-3 mb-2">
        {Icon ? <Icon className="w-5 h-5" /> : <div className="w-5 h-5 rounded bg-gradient-core" />}
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="text-slate-600 leading-relaxed">{children}</p>
    </div>
  );
}

