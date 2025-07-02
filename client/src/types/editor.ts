import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import {
  $isTextNode,
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  Klass,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode,
} from "lexical";

import { preserveAllowedStylesExportDOM } from "@/types/editor-plugins";

const MIN_ALLOWED_FONT_SIZE = 8;
const MAX_ALLOWED_FONT_SIZE = 72;

/**
 * Lexical theme classes applied to each supported node type.
 * Used by Lexical to render styled HTML.
 */
const theme = {
  paragraph: "m-0",
  quote: "border-l-4 border-gray-300 pl-4 py-2 italic bg-gray-50",
  heading: {
    h1: "text-3xl font-bold mb-4",
    h2: "text-2xl font-bold mb-3",
    h3: "text-xl font-bold mb-2",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal ml-4",
    ul: "list-disc ml-4",
  },
  text: {
    bold: "font-bold",
    code: "bg-gray-100 p-1 rounded-md",
    italic: "italic",
    strikethrough: "line-through",
    subscript: "sub",
    superscript: "sup",
    underline: "underline",
    underlineStrikethrough: "underline line-through",
  },
  code: "whitespace-pre-wrap break-words relative block leading-[1.0] px-4 py-2 my-2 border border-gray-300 rounded-lg bg-gray-50",
  link: "text-blue-600 underline hover:text-blue-800",
};

/**
 * Constructs a DOM import map to preserve supported styles from pasted HTML.
 *
 * @returns A map of DOM node tag names to their custom Lexical conversion behavior.
 */
const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
};

/**
 * Validates font-size string and ensures it's within allowed limits.
 *
 * @param input - The font size string (e.g., "14px").
 * @returns Validated font size or empty string if invalid.
 */
export const parseAllowedFontSize = (input: string): string => {
  const match = input.match(/^(\d+(?:\.\d+)?)px$/);
  if (match) {
    const n = Number(match[1]);
    if (n >= MIN_ALLOWED_FONT_SIZE && n <= MAX_ALLOWED_FONT_SIZE) {
      return input;
    }
  }
  return "";
};

/**
 * Validates whether a color string is in the allowed `rgb(r, g, b)` format.
 *
 * @param input - The CSS color string.
 * @returns The valid color string or an empty string if invalid.
 */
export function parseAllowedColor(input: string) {
  return /^rgb\(\d+, \d+, \d+\)$/.test(input) ? input : "";
}

/**
 * Extracts only whitelisted inline styles (font-size, color, background-color).
 *
 * @param element - The HTML element to inspect.
 * @returns A string of extra styles, e.g., "font-size:14px;color:rgb(0,0,0);"
 */
export const getExtraStyles = (element: HTMLElement): string => {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = "";
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== "" && fontSize !== "15px") {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== "" && color !== "rgb(0, 0, 0)") {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
};

/**
 * Export map used for serializing Lexical nodes to HTML.
 * Only `ParagraphNode` and `TextNode` preserve styles via `preserveAllowedStylesExportDOM`.
 */
const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, preserveAllowedStylesExportDOM],
  [TextNode, preserveAllowedStylesExportDOM],
]);

/**
 * Lexical initial configuration object with custom theme, supported nodes, HTML handling, and error logging.
 */
export const initialConfig = {
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace: "InlineEditor",
  nodes: [
    ParagraphNode,
    TextNode,
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    CodeNode,
    CodeHighlightNode,
    HorizontalRuleNode,
  ],
  onError: (error: any) => {
    console.error("Lexical error:", error);
  },
  theme,
};
