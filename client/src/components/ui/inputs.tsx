import axios from "axios";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
// example
/** 
Here is inline math: \(x^2 + y^2 = z^2\)

Here is block math:
$$
E = mc^2
$$

**/
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
