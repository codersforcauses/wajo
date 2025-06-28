/**
 * Lexical editor toolbar plugin with support for text formatting, font size, list handling,
 * quote/code blocks, hyperlink editing, and color styling.
 */

import { $createCodeNode, $isCodeNode, CODE_LANGUAGE_MAP } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createQuoteNode, $isHeadingNode } from "@lexical/rich-text";
import {
  $getSelectionStyleValueForProperty,
  $isAtNodeEnd,
  $isParentElementRTL,
  $patchStyleText,
  $setBlocksType,
} from "@lexical/selection";
import { $findMatchingParent } from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  ElementNode,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  Klass,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  OUTDENT_CONTENT_COMMAND,
  RangeSelection,
  TextFormatType,
  TextNode,
} from "lexical";
import {
  Baseline,
  Bold,
  Code,
  Eraser,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  PaintBucket,
  Plus,
  Quote,
  Type,
  Underline,
} from "lucide-react";
import React, { Dispatch, useCallback, useEffect, useState } from "react";

import {
  blockTypeToBlockName,
  MAX_ALLOWED_FONT_SIZE,
  MIN_ALLOWED_FONT_SIZE,
  useToolbarState,
} from "@/context/editor-toolbar";
import { rgbToHex, sanitizeUrl } from "@/lib/utils";
import {
  clearFormatting,
  updateFontSize,
  updateFontSizeInSelection,
  UpdateFontSizeType,
} from "@/types/editor-plugins";

/**
 * Returns CSS classes depending on active formatting state.
 * @param isActive - Whether the formatting is currently active
 */
function $renderActiveCSS(isActive: boolean) {
  return isActive
    ? "bg-amber-200 text-amber-700 hover:bg-amber-100"
    : "bg-white hover:bg-amber-100";
}

/**
 * Finds the top-level Lexical node above a given node.
 * @param node - The starting Lexical node
 */
function $findTopLevelElement(node: LexicalNode) {
  let topLevelElement =
    node.getKey() === "root"
      ? node
      : $findMatchingParent(node, (e) => {
          const parent = e.getParent();
          return parent !== null && $isRootOrShadowRoot(parent);
        });

  if (topLevelElement === null) {
    topLevelElement = node.getTopLevelElementOrThrow();
  }
  return topLevelElement;
}

/**
 * Returns the node that is currently selected (anchor/focus based).
 * @param selection - A Lexical range selection
 */
export function getSelectedNode(
  selection: RangeSelection,
): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
  }
}

/**
 * Finds the nearest ancestor of a given node that matches a class.
 * @param node - The starting node
 * @param klass - The class to match
 */
export function $getNearestNodeOfType<T extends ElementNode>(
  node: LexicalNode,
  klass: Klass<T>,
): T | null {
  let parent: ElementNode | LexicalNode | null = node;

  while (parent != null) {
    if (parent instanceof klass) {
      return parent as T;
    }

    parent = parent.getParent();
  }

  return null;
}

/**
 * The main toolbar plugin rendering text formatting buttons, list and link controls, and color settings.
 * @param setIsLinkEditMode - State dispatcher for triggering inline link editing
 *
 * @see [Lexical Github Docs](https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx)
 */
export default function ToolbarPlugin({
  setIsLinkEditMode,
}: {
  setIsLinkEditMode: Dispatch<boolean>;
}) {
  const [activeEditor] = useLexicalComposerContext();
  const { toolbarState, updateToolbarState } = useToolbarState();
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null,
  );

  const $handleHeadingNode = useCallback(
    (selectedElement: LexicalNode) => {
      const type = $isHeadingNode(selectedElement)
        ? selectedElement.getTag()
        : selectedElement.getType();

      if (type in blockTypeToBlockName) {
        updateToolbarState(
          "blockType",
          type as keyof typeof blockTypeToBlockName,
        );
      }
    },
    [updateToolbarState],
  );

  const $handleCodeNode = useCallback(
    (element: LexicalNode) => {
      if ($isCodeNode(element)) {
        const language =
          element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
        updateToolbarState(
          "codeLanguage",
          language ? CODE_LANGUAGE_MAP[language] || language : "",
        );
        return;
      }
    },
    [updateToolbarState],
  );

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element = $findTopLevelElement(anchorNode);
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      updateToolbarState("isRTL", $isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      const isLink = $isLinkNode(parent) || $isLinkNode(node);
      updateToolbarState("isLink", isLink);

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();

          updateToolbarState("blockType", type);
        } else {
          $handleHeadingNode(element);
          $handleCodeNode(element);
        }
      }

      // Handle buttons
      updateToolbarState(
        "fontColor",
        $getSelectionStyleValueForProperty(selection, "color", "#000000"),
      );
      updateToolbarState(
        "bgColor",
        $getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "#ffffff",
        ),
      );
      updateToolbarState(
        "fontFamily",
        $getSelectionStyleValueForProperty(selection, "font-family", "Arial"),
      );
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }

      // If matchingParent is a valid node, pass it's format type
      updateToolbarState(
        "elementFormat",
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || "left",
      );
    }

    if ($isRangeSelection(selection)) {
      // Update text format
      updateToolbarState("isBold", selection.hasFormat("bold"));
      updateToolbarState("isItalic", selection.hasFormat("italic"));
      updateToolbarState("isUnderline", selection.hasFormat("underline"));
      updateToolbarState(
        "isStrikethrough",
        selection.hasFormat("strikethrough"),
      );
      updateToolbarState("isSubscript", selection.hasFormat("subscript"));
      updateToolbarState("isSuperscript", selection.hasFormat("superscript"));
      updateToolbarState("isHighlight", selection.hasFormat("highlight"));
      updateToolbarState("isCode", selection.hasFormat("code"));
      updateToolbarState(
        "fontSize",
        $getSelectionStyleValueForProperty(selection, "font-size", "15px"),
      );
      updateToolbarState("isLowercase", selection.hasFormat("lowercase"));
      updateToolbarState("isUppercase", selection.hasFormat("uppercase"));
      updateToolbarState("isCapitalize", selection.hasFormat("capitalize"));
    }
    if ($isNodeSelection(selection)) {
      const nodes = selection.getNodes();
      for (const selectedNode of nodes) {
        const parentList = $getNearestNodeOfType<ListNode>(
          selectedNode,
          ListNode,
        );
        if (parentList) {
          const type = parentList.getListType();
          updateToolbarState("blockType", type);
        } else {
          const selectedElement = $findTopLevelElement(selectedNode);
          $handleHeadingNode(selectedElement);
          $handleCodeNode(selectedElement);
          // Update elementFormat for node selection (e.g., images)
          if ($isElementNode(selectedElement)) {
            updateToolbarState(
              "elementFormat",
              selectedElement.getFormatType(),
            );
          }
        }
      }
    }
  }, [activeEditor, updateToolbarState, $handleHeadingNode, $handleCodeNode]);

  useEffect(() => {
    return activeEditor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        $updateToolbar();
      });
    });
  }, [activeEditor]);

  return (
    <div className="sticky top-0 z-40 flex flex-wrap items-center gap-1 border-b bg-white p-1 shadow-sm">
      <TextStyleButtons activeEditor={activeEditor} />
      <div className="h-6 w-px bg-gray-300"></div>
      <AdditionalButtons
        activeEditor={activeEditor}
        setIsLinkEditMode={setIsLinkEditMode}
      />
      <div className="h-6 w-px bg-gray-300"></div>
      <FontSizeButtons activeEditor={activeEditor} />
      <div className="h-6 w-px bg-gray-300"></div>
      <ColourButtons activeEditor={activeEditor} />
    </div>
  );
}

function TextStyleButtons({ activeEditor }: { activeEditor: LexicalEditor }) {
  const { toolbarState } = useToolbarState();

  const formatText = (format: TextFormatType) => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <div className="flex gap-1">
      <button
        onClick={() => formatText("bold")}
        className={`rounded p-2 ${$renderActiveCSS(toolbarState.isBold)}`}
        title="Bold (Ctrl+B)"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => formatText("italic")}
        className={`rounded p-2 ${$renderActiveCSS(toolbarState.isItalic)}`}
        title="Italic (Ctrl+I)"
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => formatText("underline")}
        className={`rounded p-2 ${$renderActiveCSS(toolbarState.isUnderline)}`}
        title="Underline (Ctrl+U)"
      >
        <Underline size={16} />
      </button>
      <button
        onClick={() =>
          activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
        }
        className={`rounded p-2 ${$renderActiveCSS(false)}`}
        title="Indent (Tab)"
      >
        <IndentIncrease size={16} />
      </button>
      <button
        onClick={() =>
          activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
        }
        className={`rounded p-2 ${$renderActiveCSS(false)}`}
        title="Outdent (Shift+Tab)"
      >
        <IndentDecrease size={16} />
      </button>
    </div>
  );
}

function FontSizeButtons({ activeEditor }: { activeEditor: LexicalEditor }) {
  const { toolbarState } = useToolbarState();
  const selectionFontSize = toolbarState.fontSize?.replace("px", "") || "16";
  const [inputValue, setInputValue] = useState<string>(selectionFontSize);
  const [inputChanged, setInputChanged] = useState<boolean>(false);

  useEffect(() => {
    setInputValue(selectionFontSize);
  }, [selectionFontSize]);

  const applyFontSize = (size: number) => {
    const clampedSize = Math.min(
      MAX_ALLOWED_FONT_SIZE,
      Math.max(MIN_ALLOWED_FONT_SIZE, size),
    );
    setInputValue(String(clampedSize));
    updateFontSizeInSelection(activeEditor, `${clampedSize}px`, null);
    setInputChanged(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      const parsed = parseInt(inputValue, 10);
      if (!isNaN(parsed)) {
        applyFontSize(parsed);
      }
    } else {
      setInputChanged(true);
    }
  };

  const handleBlur = () => {
    if (inputChanged && inputValue !== "") {
      const parsed = parseInt(inputValue, 10);
      if (!isNaN(parsed)) {
        applyFontSize(parsed);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Limit input length to prevent UI overflow
    if (value.length <= 4) {
      setInputValue(value);
    }
  };

  return (
    <div className="flex flex-shrink-0 items-center gap-1">
      <Type size={16} className="flex-shrink-0" />
      <button
        type="button"
        disabled={parseInt(inputValue) <= MIN_ALLOWED_FONT_SIZE}
        onClick={() =>
          updateFontSize(activeEditor, UpdateFontSizeType.decrement, inputValue)
        }
        className={`flex-shrink-0 rounded border px-2 py-1 text-sm disabled:opacity-50 ${$renderActiveCSS(false)}`}
        title="Decrease Font Size"
      >
        <Minus size={16} />
      </button>
      <div className="relative flex-shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-16 overflow-hidden rounded border px-2 py-1 text-center font-mono text-sm tabular-nums"
          style={{
            minWidth: "4rem",
            maxWidth: "4rem",
          }}
          min={MIN_ALLOWED_FONT_SIZE}
          max={MAX_ALLOWED_FONT_SIZE}
          title={`Font size: ${inputValue}px`}
        />
      </div>
      <button
        type="button"
        disabled={parseInt(inputValue) >= MAX_ALLOWED_FONT_SIZE}
        onClick={() =>
          updateFontSize(activeEditor, UpdateFontSizeType.increment, inputValue)
        }
        className={`flex-shrink-0 rounded border px-2 py-1 text-sm disabled:opacity-50 ${$renderActiveCSS(false)}`}
        title="Increase Font Size"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

function AdditionalButtons({
  activeEditor,
  setIsLinkEditMode,
}: {
  activeEditor: LexicalEditor;
  setIsLinkEditMode: Dispatch<boolean>;
}) {
  const { toolbarState } = useToolbarState();

  const formatBulletList = () => {
    if (toolbarState.blockType === "bullet") {
      activeEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  const formatNumberList = () => {
    if (toolbarState.blockType === "number") {
      activeEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (toolbarState.blockType === "quote") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      }
    });
  };

  const formatCode = () => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      const topLevelElement = anchorNode.getTopLevelElementOrThrow();

      if ($isCodeNode(topLevelElement)) {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  };

  const insertLink = useCallback(() => {
    if (!toolbarState.isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl("https://"),
      );
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, setIsLinkEditMode, toolbarState.isLink]);

  return (
    <div className="flex gap-1">
      <button
        onClick={formatBulletList}
        className={`rounded p-2 ${$renderActiveCSS(toolbarState.blockType === "bullet")}`}
        title="Bulleted List"
      >
        <List size={16} />
      </button>
      <button
        onClick={formatNumberList}
        className={`rounded p-2 ${$renderActiveCSS(toolbarState.blockType === "number")}`}
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>

      <button
        onClick={formatQuote}
        className={`rounded p-2 ${$renderActiveCSS(toolbarState.blockType === "quote")}`}
        title="Quote"
      >
        <Quote size={16} />
      </button>

      <button
        onClick={formatCode}
        className={`rounded p-2 ${$renderActiveCSS(toolbarState.blockType === "code")}`}
        title="Code Block"
      >
        <Code size={16} />
      </button>

      <button
        onClick={insertLink}
        className={`rounded p-2 ${$renderActiveCSS(toolbarState.isLink)}`}
        title={toolbarState.isLink ? "Unlink" : "Insert Link"}
      >
        <Link size={16} />
      </button>
    </div>
  );
}

function ColourButtons({ activeEditor }: { activeEditor: LexicalEditor }) {
  const { toolbarState } = useToolbarState();

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [activeEditor],
  );

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ color: value });
    },
    [applyStyleText],
  );

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ "background-color": value });
    },
    [applyStyleText],
  );

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => clearFormatting(activeEditor)}
        className={`rounded p-2 ${$renderActiveCSS(false)}`}
        title="Clear Formatting"
      >
        <Eraser size={16} />
      </button>
      <ColorInput
        label="Font"
        color={toolbarState.fontColor || "#000000"}
        onChange={onFontColorSelect}
        icon={<Baseline size={16} />}
      />
      <ColorInput
        label="Background"
        color={toolbarState.bgColor || "#ffffff"}
        onChange={onBgColorSelect}
        icon={<PaintBucket size={16} />}
      />
    </div>
  );
}

function ColorInput({
  label,
  color,
  onChange,
  icon,
}: {
  label: string;
  color: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
}) {
  const [inputValue, setInputValue] = useState(color);

  useEffect(() => {
    setInputValue(color);
  }, [color]);

  const commitInput = () => {
    onChange(inputValue);
  };

  return (
    <div className="flex flex-row items-center gap-1 text-xs">
      {icon}
      <div className="relative h-7 w-16 overflow-hidden rounded border shadow-sm">
        <input
          type="color"
          value={rgbToHex(inputValue)}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-100"
          title={label + " Color"}
        />
        <input
          type="text"
          value={rgbToHex(inputValue)}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={commitInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitInput();
            }
          }}
          className="absolute bottom-[-2px] left-0 w-full border-none bg-white bg-opacity-80 text-center text-xs text-black outline-none"
          style={{ height: "1.0rem" }}
        />
      </div>
    </div>
  );
}
