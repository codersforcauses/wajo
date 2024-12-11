import { NextApiRequest, NextApiResponse } from "next";

const mockLoginResponse = {
  access: "mock-access-token",
  refresh: "mock-refresh-token",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin123#") {
      res.status(200).json(mockLoginResponse);
    } else {
      res.status(401).json({
        detail:
          "Invalid credentials. See src/pages/api/auth/token for valid login.",
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
