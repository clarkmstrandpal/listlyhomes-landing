export default function TestimonialCard({
  quote = "Nibh mattis elit eget volutpat amet, enim, at proin aliquam. Convallis turpis elementum leo at gravida. Nunc at.",
  name = "Nguyen Thao My",
  avatar = "/img/avatar-1.jpg",
}) {
  return (
    <div className="relative">
      <div className="rounded-3xl bg-blue-50/60 border border-blue-100 p-5 pr-24 text-[15px] text-slate-700 shadow-[0_1px_0_rgba(16,24,40,.04)]">
        {quote}
        <div className="mt-3 text-blue-500 text-sm font-medium flex items-center gap-2">
          <span className="opacity-60">›</span>
          {name}
        </div>
      </div>
      <img
        src={avatar}
        alt={name}
        className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-md"
      />
    </div>
  );
}
