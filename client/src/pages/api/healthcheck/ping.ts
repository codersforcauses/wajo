/**
 * API Route Handler for a simple ping response.
 *
 * This handler responds to API requests by returning a simple message.
 * It serves as a demonstration of a minimal API route implementation in Next.js.
 *
 * @fileoverview API endpoint located at `/api/ping` for returning a static response.
 *
 * @module /api/healthcheck/ping
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */

import { NextApiRequest, NextApiResponse } from "next";

/**
 * API Route Handler for responding with a simple message.
 *
 * This endpoint demonstrates a basic API route in Next.js that sends a plain text response.
 * It serves as an example of setting up a minimal API route.
 *
 * @param {NextApiRequest} _req - The incoming HTTP request object. It is unused in this handler.
 * @param {NextApiResponse} res - The HTTP response object used to send the text response.
 *
 * @returns {void} Sends a plain text response indicating the source of the response.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
): void {
  res
    .status(200)
    .json("This response is from client.src.pages.api.healthcheck.ping");
}
