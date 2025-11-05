// src/lib/sign.js
export async function signBody(bodyString, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const ts = Math.floor(Date.now() / 1000);
  const data = enc.encode(`${ts}.${bodyString}`); // matches the curl Variant A you used
  const sigBuf = await crypto.subtle.sign("HMAC", key, data);
  const bytes = new Uint8Array(sigBuf);
  const hex = [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
  return { ts, sig: hex };
}
