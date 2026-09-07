export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const targetGateway = process.env.NEXT_PUBLIC_GATEWAY_URL || "https://3web3d.online";
    const response = await fetch(`${targetGateway}/api/v3/ducks/strike`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof req.body === "string" ? req.body : JSON.stringify(req.body)
    });
    const data = await response.json().catch(() => ({ success: true }));
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}