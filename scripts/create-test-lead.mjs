#!/usr/bin/env node
import process from 'node:process';

const defaultBase = 'https://2v0q4zm2v6.execute-api.us-east-1.amazonaws.com/dev';

function parseArgs(argv) {
  const options = {};
  for (const arg of argv.slice(2)) {
    if (!arg.startsWith('--')) continue;
    const eqIndex = arg.indexOf('=');
    if (eqIndex === -1) {
      options[arg.slice(2)] = true;
    } else {
      const key = arg.slice(2, eqIndex);
      const value = arg.slice(eqIndex + 1);
      options[key] = value;
    }
  }
  return options;
}

const args = parseArgs(process.argv);
const apiBase = (args['api-base'] || process.env.VITE_API_BASE || defaultBase).replace(/\/$/, '');

const now = new Date();
const isoStamp = now.toISOString();
const payload = {
  source: args.source || 'landing',
  intent: args.intent || 'buy',
  name: args.name || `Playground Lead ${isoStamp}`,
  email:
    args.email || `playground+${isoStamp.replace(/[:.]/g, '-')}`.toLowerCase() + '@example.com',
  phone: args.phone || '555-0199',
  zip: args.zip || '33101',
  max_price: args['max-price'] || '750000',
  notes: args.notes || 'Generated via scripts/create-test-lead.mjs'
};

async function main() {
  const url = `${apiBase}/v1/ingest`;
  console.log(`Submitting lead to ${url} ...`);
  console.log('Payload:', payload);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();
  if (!response.ok) {
    console.error(`Request failed with status ${response.status}`);
    console.error(responseText);
    process.exitCode = 1;
    return;
  }

  console.log('Lead submitted successfully. Raw response:');
  console.log(responseText);
}

main().catch((error) => {
  console.error('Failed to submit lead.');
  console.error(error);
  process.exitCode = 1;
});
