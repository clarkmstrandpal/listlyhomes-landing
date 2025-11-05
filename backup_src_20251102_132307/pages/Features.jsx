import Header from "../components/Header.jsx";
export default function Features() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold">Features</h1>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>Agents-only lead intake and routing by ZIP</li>
          <li>Inbox preview & claim</li>
          <li>SES email delivery, audit log, Slack (optional)</li>
        </ul>
      </main>
    </div>
  );
}
