import LeadForm from "../components/LeadForm";

export default function Buy() {
  return (
    <main className="py-10 px-4">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Tell us what you’re looking for
        </h1>
        <p className="text-gray-600">
          Share your ZIP, price range, and criteria. We’ll route you to a
          responsive local agent.
        </p>
      </div>

      <LeadForm />

      <p className="text-center text-xs text-gray-400 mt-6">
        We never sell your info. You’ll be matched to one agent, not a call center.
      </p>
    </main>
  );
}
