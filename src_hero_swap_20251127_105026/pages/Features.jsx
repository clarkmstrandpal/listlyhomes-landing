export default function Features(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Features</h1>
      <ul className="mt-6 space-y-3 text-gray-700 list-disc pl-6">
        <li>Agents-only authentication with JWT</li>
        <li>ZIP routing and send-log</li>
        <li>S3 static site + API Gateway + Lambda + DynamoDB</li>
      </ul>
    </div>
  );
}
