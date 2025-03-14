import "katex/dist/katex.min.css";

import axios from "axios";
import { useState } from "react";
import Latex from "react-latex-next";
import { LatexProps } from "react-latex-next/dist/Latex";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MathInputProps {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

/**
 * Input component for creating questions and solutions.
 * @param props - The properties for the MathInput component.
 * @param props.value - The current numeric value of the input, tracked by `react.setState()`.
 * @param props.onChange - Called when the numeric value changes, should update `value`.
 *
 * Used `react-latex-next` and `node-tikzjax` libraries to achieve this.
 * @see {@link https://github.com/harunurhan/react-latex-next} and {@link https://github.com/prinsss/node-tikzjax} for more details
 *
 * @example
 * // Component usage:
 * const [input, setInput] = useState('');
 * <MathInput
 *   input={input}
 *   onChange={(e) => setInput(e.target.value)}
 * />
 *
 * @example
 * // Input in textarea:
 * // Inline Math Example:
 * // Render an inline mathematical expression using $ and $.
 * <Latex>
 *   {`
 *     We give illustrations for the {1 + 2} processes $e^+e^-$, gluon-gluon and $\\gamma\\gamma \\to W t\\bar b$.
 *   `}
 * </Latex>
 *
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
 * // Tables Using `\begin{array}`
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
 * // Draw TikZ diagrams Example:
 * // Input text wrapped by "```tikz" and "```"
 * ```tikz
 * \usepackage{circuitikz}
 * \begin{document}
 *
 * \begin{circuitikz}[american, voltage shift=0.5]
 * \draw (0,0)
 * to[isource, l=$I_0$, v=$V_0$] (0,3)
 * to[short, -*, i=$I_0$] (2,3)
 * to[R=$R_1$, i>_=$i_1$] (2,0) -- (0,0);
 * \draw (2,3) -- (4,3)
 * to[R=$R_2$, i>_=$i_2$]
 * (4,0) to[short, -*] (2,0);
 * \end{circuitikz}
 *
 * \end{document}
 * ```
 **/
function MathInput({ input, onChange }: MathInputProps) {
  const [preview, setPreview] = useState(false);
  const [renderedOutput, setRenderedOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [writeTab, setWriteTab] = useState<"tab-active" | "tab-inactive">(
    "tab-active",
  );
  const [previewTab, setPreviewTab] = useState<"tab-active" | "tab-inactive">(
    "tab-inactive",
  );
  const [showRules, setShowRules] = useState(false);
  const toggleRules = () => {
    setShowRules(!showRules);
  };

  const handleWrite = () => {
    setPreview(false);
    setWriteTab("tab-active");
    setPreviewTab("tab-inactive");
  };

  const handlePreview = async () => {
    setPreview(true);
    setWriteTab("tab-inactive");
    setPreviewTab("tab-active");
    setLoading(true); // Set loading state to true when starting to fetch

    try {
      // Regex to match TikZ blocks /\\begin{tikzpicture}[\s\S]*?\\end{tikzpicture}/g
      const tikzRegex = /```tikz[\s\S]*?```/g;

      let processedOutput = input;
      const tikzMatches = input.match(tikzRegex);

      console.log("tikzMatches is:", tikzMatches);
      if (tikzMatches) {
        for (const tikzMatch of tikzMatches) {
          const tikzCode = tikzMatch.replace("```tikz", "").replace("```", "");
          const response = await axios.post("/api/render-tikz", {
            tikzCode,
          });

          if (response.status === 200) {
            const svg = response.data.svg;

            // Replace TikZ code with the rendered SVG
            processedOutput = processedOutput.replace(
              tikzMatch,
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
        <Button variant={writeTab} onClick={handleWrite}>
          Write
        </Button>
        <Button variant={previewTab} onClick={handlePreview} disabled={loading}>
          Preview
        </Button>
      </div>
      <div className="w-full bg-slate-200 p-2">
        {preview ? (
          input ? (
            loading ? (
              "Loading..."
            ) : (
              /* Render text and math with TikZ */
              <LatexInput>{renderedOutput}</LatexInput>
            )
          ) : (
            "Please write something to preview."
          )
        ) : (
          <>
            <textarea
              placeholder="Write plain text, math, tables or TikZ diagrams"
              onChange={onChange}
              value={input}
              rows={5}
              className="focus:border-yellow-400 w-full rounded-md border-2 border-slate-400 bg-slate-200 p-2 focus:outline-none"
            />
            <div className="flex">
              <p
                className="cursor-pointer rounded-md border-2 px-2 py-1 hover:bg-slate-600"
                onClick={toggleRules}
              >
                See rules
              </p>
            </div>
            {showRules && (
              <div className="rounded-md border-2 bg-white p-2 shadow-lg">
                <ul className="list-disc pl-5">
                  <li>
                    Separating inline mathematical expression using $ and $.
                    e.g. $e^+e^-$
                  </li>
                  <li>
                    Separating block mathematical expression using $$. e.g. $$ E
                    = mc^2 $$
                  </li>
                  <li>
                    Tables using <b>{"\\begin{array}"}</b>. Separating table
                    using $$.
                  </li>
                  <li>
                    Diagrams using TikzJax. See{" "}
                    <a
                      href="https://github.com/artisticat1/obsidian-tikzjax"
                      className="hover:text-yellow-500 cursor-pointer font-bold underline"
                    >
                      usage and examples
                    </a>
                    . Separating diagram using <b>```tikz</b> and <b>```</b>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface LatexInputProps extends LatexProps {
  className?: string;
}

function LatexInput({ className, ...props }: LatexInputProps) {
  return (
    <div
      className={cn(
        "flex h-auto w-auto items-center justify-center text-pretty",
        className,
      )}
    >
      <Latex {...props} />
    </div>
  );
}

export { LatexInput, MathInput };
