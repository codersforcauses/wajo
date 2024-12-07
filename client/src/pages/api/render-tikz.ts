import { NextApiRequest, NextApiResponse } from "next";
import tikzjax from "node-tikzjax";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { tikzCode } = req.body; // Get the TikZ code from the request body
    if (!tikzCode) {
      return res.status(400).json({ error: "TikZ code is required." });
    }

    try {
      // Use node-tikzjax to render the TikZ code into SVG
      const svg = await tikzjax(tikzCode);
      res.status(200).json({ svg });
    } catch (error) {
      console.error("Error rendering TikZ:", error);
      res.status(500).json({ error: "Error rendering TikZ" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
