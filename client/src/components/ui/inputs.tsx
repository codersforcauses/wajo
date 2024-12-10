import axios from "axios";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useState } from "react";

import { Button } from "@/components/ui/button";

/**
 * @see {@link https://github.com/fast-reflexes/better-react-mathjax} for more details
 *
 * @example
 * // Inline Math Example:
 * // Render an inline mathematical expression using \( and \).
 * <MathJax>
 *   {"This is an inline equation: \\(x^2 + y^2 = z^2\\)"}
 * </MathJax>
 *
 * // Block Math Example:
 * // Render a block mathematical expression using $$.
 * <MathJax>
 *  {`
 *    This is a block equation:
 *      $$
 *      E = mc^2
 *      $$
 *   `}
 * </MathJax>
 */
export default function MathInput() {
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleWrite = () => {
    preview && setPreview(false);
  };

  const handlePreview = () => {
    !preview && setPreview(true);
  };

  return (
    <MathJaxContext>
      <div>
        <div>
          <Button onClick={handleWrite}>Write</Button>
          <Button onClick={handlePreview}>Preview</Button>
        </div>
        <div className="w-full border-2 border-black">
          {preview ? (
            <div className="whitespace-pre-wrap">
              {/* Render content with newlines preserved */}
              <MathJax>{input}</MathJax>
            </div>
          ) : (
            <textarea
              placeholder="Enter text and math (use `$` for block math, `\(` and `\)` for inline math)"
              onChange={handleInput}
              value={input}
              rows={5}
              className="w-full"
            />
          )}
        </div>
      </div>
    </MathJaxContext>
  );
}

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
export function TikZInput() {
  const [tikzCode, setTikzCode] = useState("");
  const [svg, setSvg] = useState("");

  const handleRender = async () => {
    try {
      const response = await axios.post("/api/render-tikz", { tikzCode });
      setSvg(response.data.svg); // Set the rendered SVG
    } catch (error) {
      console.error("Error rendering TikZ:", error);
    }
  };

  return (
    <div>
      <textarea
        value={tikzCode}
        onChange={(e) => setTikzCode(e.target.value)}
        placeholder="Enter TikZ code"
        rows={10}
        cols={50}
      />
      <button onClick={handleRender}>Render TikZ</button>
      {svg && <div dangerouslySetInnerHTML={{ __html: svg }} />}
    </div>
  );
}
