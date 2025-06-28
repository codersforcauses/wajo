import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { Check, Eye, SquarePen, X } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "sonner";

import FloatingLinkEditorPlugin from "@/components/ui/editor-floating-link";
import ToolbarPlugin from "@/components/ui/editor-toolbar-plugins";
import { ToolbarContext } from "@/context/editor-toolbar";
import { usePatchMutation } from "@/hooks/use-put-data";
import { initialConfig } from "@/types/editor";
import { OnChangePlugin, SetInitialValuePlugin } from "@/types/editor-plugins";
import { Setting } from "@/types/setting";

/**
 * A rich text editor with Lexical that allows inline editing of HTML content.
 * Supports editing, previewing, saving, and cancelling changes.
 * Includes plugins for links, lists, markdown shortcuts, tab indentation, history, etc.
 *
 * @param {object} props
 * @param {string} props.initialContent - The initial HTML content to edit.
 * @param {(isPreview: boolean, content: string) => void} props.onSave - Callback when saving (preview or actual).
 * @param {() => void} props.onCancel - Callback when cancelling edit.
 *
 * @see update [theme](../../types/editor.ts) in editor.ts for styling
 */
function InlineEditor({
  initialContent,
  onSave,
  onCancel,
}: {
  initialContent: any;
  onSave: (isPreview: boolean, content: string) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(initialContent);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const handleSave = (isPreview: boolean) => {
    onSave(isPreview, content);
  };

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="rounded-lg border-2 border-amber-400 p-2">
      <ToolbarContext>
        <LexicalComposer initialConfig={initialConfig}>
          <div className="rounded border bg-white">
            <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
            <div className="relative">
              <RichTextPlugin
                contentEditable={
                  <div className="editor-scroller">
                    <div className="editor" ref={onRef}>
                      <ContentEditable
                        className="min-h-32 resize-none overflow-hidden p-4 outline-none"
                        style={{ minHeight: "120px" }}
                      />
                    </div>
                  </div>
                }
                placeholder={
                  <div className="pointer-events-none absolute left-4 top-4 text-gray-400">
                    Enter some text...
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <LinkPlugin />
              <ListPlugin />
              <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
              <SetInitialValuePlugin initHtml={initialContent} />
              <OnChangePlugin onChange={setContent} />
              <TabIndentationPlugin />
              {floatingAnchorElem && (
                <FloatingLinkEditorPlugin
                  anchorElem={floatingAnchorElem}
                  isLinkEditMode={isLinkEditMode}
                  setIsLinkEditMode={setIsLinkEditMode}
                />
              )}
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => handleSave(true)}
              className="flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              <Eye size={16} />
              Preview
            </button>
            <button
              onClick={() => handleSave(false)}
              className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              <Check size={16} />
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </LexicalComposer>
      </ToolbarContext>
    </div>
  );
}

/**
 * A section of content that can be toggled between view and edit mode.
 * Uses Lexical rich text editor to allow editing of a specific field in a setting object.
 *
 * @param {object} props
 * @param {boolean} props.canEdit - Whether the current user can edit the section.
 * @param {Setting} props.setting - The setting object containing editable values.
 * @param {string} props.sectionKey - The key in the setting's value to edit.
 * @param {string} [props.initialContent] - Optional initial HTML content for the editor.
 *
 * @see [Lexical Docs](https://lexical.dev/docs/react/)
 * @see [Lexical Playground](https://playground.lexical.dev/)
 */
export default function EditableSection({
  canEdit,
  setting,
  sectionKey,
  initialContent = "",
}: {
  canEdit: boolean;
  setting: Setting;
  sectionKey: string;
  initialContent?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const router = useRouter();
  const mutationKey = ["setting.config", `${setting.id}`];
  const { mutate: updateSection } = usePatchMutation({
    mutationKey: mutationKey,
    queryKeys: [mutationKey, ["setting.config"]],
    endpoint: `/setting/config/${setting.id}/`,
    onSuccess: () => {
      toast.success("Saved successfully!");
      router.reload();
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (isPreview: boolean, newContent: string) => {
    setContent(newContent);
    setIsEditing(false);
    if (isPreview === false) {
      const updatedValue = {
        ...setting.value,
        [sectionKey]: newContent,
      };
      updateSection({ value: updatedValue });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="group relative">
      {isEditing && canEdit ? (
        <InlineEditor
          initialContent={content}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="relative">
            {typeof content === "string" ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              content
            )}
            {canEdit && (
              <button
                onClick={handleEdit}
                className="absolute -right-2 -top-2 rounded-full bg-amber-400 p-2 text-white opacity-0 shadow-lg transition-opacity hover:bg-amber-300 group-hover:opacity-100"
              >
                <SquarePen size={20} />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
