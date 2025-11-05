export default function Footer(){
  return (
    <footer className="py-10 border-t border-slate-200/70">
      <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-600"> {new Date().getFullYear()} Listly Homes.</p>
        <nav className="text-sm text-slate-700 flex items-center gap-4">
          <a href="#privacy" className="hover:text-slate-900">Privacy</a>
          <a href="#terms" className="hover:text-slate-900">Terms</a>
          <a href="#contact" className="hover:text-slate-900">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
