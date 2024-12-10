import "katex/dist/katex.min.css";

import axios from "axios";
import { useState } from "react";
import Latex from "react-latex-next";

import { Button } from "@/components/ui/button";

/**
 * @see {@link https://github.com/harunurhan/react-latex-next} and {@link https://github.com/prinsss/node-tikzjax} for more details
 *
 * @example
 * // Inline Math Example:
 * // Render an inline mathematical expression using $ and $.
 * <Latex>
 *   {`
 *     We give illustrations for the {1 + 2} processes $e^+e^-$, gluon-gluon and $\\gamma\\gamma \\to W t\\bar b$.
 *   `}
 * </Latex>
 *
 * // Block Math Example:
 * // Render a block mathematical expression using $$.
 * <Latex>
 *  {`
 *    This is a block equation:
 *      $$
 *      E = mc^2
 *      $$
 *   `}
 * </Latex>
 *
 * // Draw Table Example:
 * // Use `\begin{array}`
 * <Latex>
 *  {`
 *  $$
 *  \begin{array}{|c|c|c|}
 *  \hline
 *  Cell 1 & Cell 2 & Cell 3 \\
 *  \hline
 *  Cell 4 & Cell 5 & Cell 6 \\
 *  \hline
 *  \end{array}
 *  $$
 * `}
 * </Latex>
 *
 * // Draw Graphs Example:
 * // Input text wrapped by `\begin{tikzpicture}` and `\end{tikzpicture}`
 **/
export function MathInput() {
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState(false);
  const [renderedOutput, setRenderedOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleWrite = () => {
    setPreview(false);
  };

  const handlePreview = async () => {
    setPreview(true);
    setLoading(true); // Set loading state to true when starting to fetch

    try {
      // Regex to match TikZ blocks
      const tikzRegex = /\\begin{tikzpicture}[\s\S]*?\\end{tikzpicture}/g;
      let processedOutput = input;
      const tikzMatches = input.match(tikzRegex);
      console.log("tikzMatches is:", tikzMatches);
      if (tikzMatches) {
        for (const tikzCode of tikzMatches) {
          const response = await axios.post("/api/render-tikz", { tikzCode });

          if (response.status === 200) {
            const svg = response.data.svg;

            // Replace TikZ code with the rendered SVG
            processedOutput = processedOutput.replace(
              tikzCode,
              `<div>${svg}</div>`,
            );
          } else {
            throw new Error("Failed to fetch SVG");
          }
        }
      }

      setRenderedOutput(processedOutput);
    } catch (error) {
      console.error("Error rendering TikZ:", error);
      setRenderedOutput("Error rendering TikZ. Please check your input.");
    } finally {
      setLoading(false); // Set loading state to false after fetching is done
    }
  };

  return (
    <div>
      <div>
        <Button onClick={handleWrite}>Write</Button>
        <Button onClick={handlePreview} disabled={loading}>
          {loading ? "Loading..." : "Preview"}
        </Button>
      </div>
      <div className="w-full border-2 border-black">
        {preview ? (
          <div className="whitespace-pre-wrap">
            {/* Render text and math with TikZ */}
            <Latex>{renderedOutput}</Latex>
          </div>
        ) : (
          <textarea
            placeholder="Write plain text, math, and TikZ diagrams"
            onChange={handleInput}
            value={input}
            rows={5}
            className="w-full"
          />
        )}
      </div>
    </div>
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
      console.log("code in tikzInput:", tikzCode);
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

export function LatexInput() {
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleWrite = () => {
    setPreview(false);
  };

  const handlePreview = () => {
    setPreview(true);
  };

  return (
    <div>
      <div>
        <Button onClick={handleWrite}>Write</Button>
        <Button onClick={handlePreview}>Preview</Button>
      </div>
      <div className="w-full border-2 border-black">
        {preview ? (
          <div className="whitespace-pre-wrap">
            <Latex>{input}</Latex>
          </div>
        ) : (
          <textarea
            placeholder="Enter LaTeX code"
            onChange={handleInput}
            value={input}
            rows={5}
            className="w-full"
          />
        )}
      </div>
    </div>
  );
}
