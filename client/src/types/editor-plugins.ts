import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $patchStyleText } from "@lexical/selection";
import { $getNearestBlockElementAncestorOrThrow } from "@lexical/utils";
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  CLEAR_HISTORY_COMMAND,
  DOMExportOutput,
  isHTMLElement,
  LexicalEditor,
  LexicalNode,
} from "lexical";
import React, { useEffect, useLayoutEffect } from "react";

import {
  DEFAULT_FONT_SIZE,
  MAX_ALLOWED_FONT_SIZE,
  MIN_ALLOWED_FONT_SIZE,
} from "@/context/editor-toolbar";

/**
 * Extracts and preserves only allowed inline styles during DOM export.
 *
 * @param editor - The Lexical editor instance.
 * @param target - The target Lexical node to export.
 * @returns Filtered DOM output containing only whitelisted inline styles.
 */
export const preserveAllowedStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode,
): DOMExportOutput => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    const allowedStyles = ["font-size", "color", "background-color"];
    for (const el of [
      output.element,
      ...output.element.querySelectorAll("[style]"),
    ]) {
      const style = el.getAttribute("style");
      if (style) {
        const newStyle = style
          .split(";")
          .map((s) => s.trim())
          .filter((s) => allowedStyles.some((allowed) => s.startsWith(allowed)))
          .join("; ");
        if (newStyle) {
          el.setAttribute("style", newStyle);
        } else {
          el.removeAttribute("style");
        }
      }
    }
  }
  return output;
};

/**
 * Plugin to set the initial HTML content of the Lexical editor.
 *
 * @param initHtml - The initial HTML to insert on mount.
 * @returns null (React functional component)
 *
 * @see [Source Code](https://github.com/facebook/lexical/discussions/3208)
 */
export const SetInitialValuePlugin: React.FC<{ initHtml: string }> = ({
  initHtml = "",
}) => {
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
    if (editor && initHtml) {
      editor.update(() => {
        const content = $generateHtmlFromNodes(editor, null);

        if (!!initHtml && content !== initHtml) {
          const parser = new DOMParser();
          const dom = parser.parseFromString(initHtml, "text/html");
          const nodes = $generateNodesFromDOM(editor, dom);

          const root = $getRoot();
          root.clear();

          const selection = root.select();
          selection.removeText();
          selection.insertNodes(nodes);
          editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
        }
      });
    }
  }, [initHtml]);

  return null;
};

/**
 * Plugin to invoke a callback whenever the editor content changes.
 *
 * @param onChange - A callback receiving the current editor content as HTML.
 * @returns null (React functional component)
 *
 * @see [Lexical Source Code](https://github.com/facebook/lexical/blob/main/packages/lexical-react/src/LexicalOnChangePlugin.ts)
 */
export function OnChangePlugin({
  onChange,
}: {
  onChange: (content: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(async ({ editorState }) => {
      const html = await editorState.read(() => {
        return $generateHtmlFromNodes(editor, null); // exports editor state as HTML string
      });
      onChange(html);
    });
  }, [editor, onChange]);

  return null;
}

const VERTICAL_GAP = 10;
const HORIZONTAL_OFFSET = 5;

/**
 * Calculates and sets the position of a floating link editor.
 *
 * @param targetRect - DOMRect of the selection or target.
 * @param floatingElem - The floating element (e.g., link editor).
 * @param anchorElem - The anchor container element.
 * @param verticalGap - Vertical spacing from the target.
 * @param horizontalOffset - Horizontal spacing from the target.
 *
 * @see [Lexical Source Code](https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/utils/setFloatingElemPositionForLinkEditor.ts)
 */
export function setFloatingElemPositionForLinkEditor(
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  verticalGap: number = VERTICAL_GAP,
  horizontalOffset: number = HORIZONTAL_OFFSET,
): void {
  const scrollerElem = anchorElem.parentElement;

  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = "0";
    floatingElem.style.transform = "translate(-10000px, -10000px)";
    return;
  }

  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElem.getBoundingClientRect();
  const editorScrollerRect = scrollerElem.getBoundingClientRect();

  let top = targetRect.top - verticalGap;
  let left = targetRect.left - horizontalOffset;

  if (top < editorScrollerRect.top) {
    top += floatingElemRect.height + targetRect.height + verticalGap * 2;
  }

  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset;
  }

  top -= anchorElementRect.top;
  left -= anchorElementRect.left;

  floatingElem.style.opacity = "1";
  floatingElem.style.transform = `translate(${left}px, ${top}px)`;
}

/**
 * Clears all formatting (style and format) from the current text selection.
 *
 * @param editor - The Lexical editor instance.
 *
 * @see [Lexical Source Code](https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/utils.ts)
 */
export const clearFormatting = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor;
      const focus = selection.focus;
      const nodes = selection.getNodes();
      const extractedNodes = selection.extract();

      if (anchor.key === focus.key && anchor.offset === focus.offset) {
        return;
      }

      nodes.forEach((node, idx) => {
        // We split the first and last node by the selection
        // So that we don't format unselected text inside those nodes
        if ($isTextNode(node)) {
          // Use a separate variable to ensure TS does not lose the refinement
          let textNode = node;
          if (idx === 0 && anchor.offset !== 0) {
            textNode = textNode.splitText(anchor.offset)[1] || textNode;
          }
          if (idx === nodes.length - 1) {
            textNode = textNode.splitText(focus.offset)[0] || textNode;
          }
          /**
           * If the selected text has one format applied
           * selecting a portion of the text, could
           * clear the format to the wrong portion of the text.
           *
           * The cleared text is based on the length of the selected text.
           */
          // We need this in case the selected text only has one format
          const extractedTextNode = extractedNodes[0];
          if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
            textNode = extractedTextNode;
          }

          if (textNode.__style !== "") {
            textNode.setStyle("");
          }
          if (textNode.__format !== 0) {
            textNode.setFormat(0);
          }
          const nearestBlockElement =
            $getNearestBlockElementAncestorOrThrow(textNode);
          if (nearestBlockElement.__format !== 0) {
            nearestBlockElement.setFormat("");
          }
          if (nearestBlockElement.__indent !== 0) {
            nearestBlockElement.setIndent(0);
          }
          node = textNode;
        } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
          node.replace($createParagraphNode(), true);
        }
      });
    }
  });
};

export enum UpdateFontSizeType {
  increment = 1,
  decrement,
}

/**
 * Calculates the next font size based on the change type.
 *
 * @param size - Current font size (numeric).
 * @param type - Update type (increment or decrement).
 * @returns Next font size as number.
 */
const calculateNextFontSize = (
  size: number,
  type: UpdateFontSizeType | null,
) => {
  if (!type) return size;

  if (type === UpdateFontSizeType.increment) {
    if (size < MIN_ALLOWED_FONT_SIZE) return MIN_ALLOWED_FONT_SIZE;
    if (size < 12) return size + 1;
    if (size < 20) return size + 2;
    if (size < 36) return size + 4;
    if (size <= 60) return size + 12;
    return MAX_ALLOWED_FONT_SIZE;
  }

  // decrement
  if (size > MAX_ALLOWED_FONT_SIZE) return MAX_ALLOWED_FONT_SIZE;
  if (size >= 48) return size - 12;
  if (size >= 24) return size - 4;
  if (size >= 14) return size - 2;
  if (size >= 9) return size - 1;
  return MIN_ALLOWED_FONT_SIZE;
};

/**
 * Updates font size in the current selection.
 *
 * @param editor - Lexical editor instance.
 * @param explicitSize - Font size string to apply directly (e.g., "16px").
 * @param updateType - Optional increment/decrement type.
 *
 * @see [Lexical Source Code](https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/utils.ts)
 */
export const updateFontSizeInSelection = (
  editor: LexicalEditor,
  explicitSize: string | null,
  updateType: UpdateFontSizeType | null,
) => {
  const getNext = (prev: string | null): string => {
    const fallback = `${DEFAULT_FONT_SIZE}px`;
    const numeric = Number((prev || fallback).replace(/[^\d]/g, ""));
    return `${calculateNextFontSize(numeric, updateType)}px`;
  };

  editor.update(() => {
    const selection = editor.isEditable() ? $getSelection() : null;
    if (selection) {
      $patchStyleText(selection, {
        "font-size": explicitSize || getNext,
      });
    }
  });
};

/**
 * Wrapper to update font size based on current input and adjustment type.
 *
 * @param editor - Lexical editor instance.
 * @param type - Font size adjustment type (increment/decrement).
 * @param input - Current font size input string.
 *
 * @see [Lexical Source Code](https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/utils.ts)
 */
export const updateFontSize = (
  editor: LexicalEditor,
  type: UpdateFontSizeType | null,
  input: string,
) => {
  const size = input.trim();
  if (size) {
    const next = calculateNextFontSize(Number(size), type);
    updateFontSizeInSelection(editor, `${next}px`, null);
  } else {
    updateFontSizeInSelection(editor, null, type);
  }
};
