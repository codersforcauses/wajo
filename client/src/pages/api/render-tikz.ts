import { NextApiRequest, NextApiResponse } from "next";
import tikzjax from "node-tikzjax";
/**
 * For implementation details and examples, see the official repository:
 * {@link https://github.com/prinsss/node-tikzjax}.
 *
 * @param {string} source - The TeX/TikZ source code to be rendered into SVG.
 * @param {JSON} TeXOptions - The configuration options for rendering.
 *
 * @example
 * // Basic Usage:
 * import tex2svg from 'node-tikzjax';
 *
 * const source = `
 * \begin{document}
 * \begin{tikzpicture}
 * \draw (0,0) circle (1in);
 * \end{tikzpicture}
 * \end{document}`;
 *
 * const svg = await tex2svg(source, TeXOptions);
 *
 * TeXOptions include:
 * @property {boolean} showConsole - Print the TeX engine log to the console. Default: `false`.
 * @property {Object} texPackages - Additional TeX packages to load. Default: `{}`.
 * @property {string} tikzLibraries - Additional TikZ libraries to load. Default: `''`.
 * @property {string} addToPreamble - Additional code to append to the preamble of the input. Default: `''`.
 * @property {boolean} embedFontCss - Embed font CSS in the SVG. Useful for HTML embedding. Default: `false`.
 * @property {string} fontCssUrl - URL of the font CSS file. Default: `'https://cdn.jsdelivr.net/npm/node-tikzjax@latest/css/fonts.css'`.
 * @property {boolean} disableOptimize - Disable SVG optimization with SVGO. Default: `false`.
 *
 */
const TeXOptions = {
  showConsole: true,
};

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
      const wrappedCode = `\\begin{document}\n${tikzCode}\n\\end{document}`;
      // Use node-tikzjax to render the TikZ code into SVG
      console.log(wrappedCode);
      const svg = await tikzjax(wrappedCode, TeXOptions);
      res.status(200).json({ svg });
    } catch (error: any) {
      console.error("Error rendering TikZ:", error);
      res
        .status(500)
        .json({ error: "Error rendering TikZ", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
