"use client";

import Image from "@tiptap/extension-image";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { type CoverMediaItem, MediaPickerModal } from "./media-picker-modal";

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`grid size-8 cursor-pointer place-items-center rounded-lg text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "bg-primary text-white"
          : "text-muted hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <span
      aria-hidden="true"
      className="mx-1 h-5 w-px self-center bg-black/10 dark:bg-white/15"
    />
  );
}

export function RichTextEditor({
  id,
  name,
  defaultValue,
  required,
  mediaFiles,
}: {
  id: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  mediaFiles?: CoverMediaItem[];
}) {
  const t = useTranslations("admin.blog.form.editor");
  const hiddenRef = useRef<HTMLInputElement>(null);
  const [, setTick] = useState(0);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
      Image,
      Placeholder.configure({ placeholder: t("placeholder") }),
      CharacterCount,
    ],
    content: defaultValue ?? "",
    editorProps: {
      attributes: {
        id,
        class:
          "rich-text min-h-64 px-4 py-3 text-sm text-foreground outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      if (!hiddenRef.current) return;
      hiddenRef.current.value = editor.isEmpty ? "" : editor.getHTML();
      hiddenRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    },
    onSelectionUpdate: () => setTick((n) => n + 1),
    onTransaction: () => setTick((n) => n + 1),
  });

  const setLink = () => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt(t("linkPrompt"), previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url.trim() }).run();
  };

  const addImage = () => {
    if (!editor) return;
    setImageModalOpen(true);
  };

  const insertImage = (url: string) => {
    if (!editor || url.trim() === "") return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white transition-colors focus-within:border-accent dark:border-white/15 dark:bg-white/5">
      <input
        ref={hiddenRef}
        type="hidden"
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
      />
      <div className="flex flex-wrap items-center gap-0.5 border-b border-black/10 bg-black/[0.02] p-1.5 dark:border-white/10 dark:bg-white/[0.03]">
        <ToolbarButton
          label={t("bold")}
          active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          label={t("italic")}
          active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          label={t("strike")}
          active={editor?.isActive("strike")}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <span className="line-through">S</span>
        </ToolbarButton>
        <ToolbarButton
          label={t("code")}
          active={editor?.isActive("code")}
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          <span className="font-mono">{"<>"}</span>
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          label={t("heading2")}
          active={editor?.isActive("heading", { level: 2 })}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label={t("heading3")}
          active={editor?.isActive("heading", { level: 3 })}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          label={t("bulletList")}
          active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M8 6h13M8 12h13M8 18h13" />
            <circle cx="3.5" cy="6" r="1" fill="currentColor" />
            <circle cx="3.5" cy="12" r="1" fill="currentColor" />
            <circle cx="3.5" cy="18" r="1" fill="currentColor" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          label={t("orderedList")}
          active={editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M4 15.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5c0 .6-.4 1-1 1.5L4 18h3" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          label={t("blockquote")}
          active={editor?.isActive("blockquote")}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          &ldquo;
        </ToolbarButton>
        <ToolbarButton
          label={t("codeBlock")}
          active={editor?.isActive("codeBlock")}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m8 8-4 4 4 4" />
            <path d="m16 8 4 4-4 4" />
            <path d="m13 5-2 14" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          label={t("horizontalRule")}
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          &mdash;
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          label={t("link")}
          active={editor?.isActive("link")}
          onClick={setLink}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
            <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
          </svg>
        </ToolbarButton>
        <ToolbarButton label={t("image")} onClick={addImage}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.5-3.5L6 23" />
          </svg>
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
      <div className="flex items-center justify-end gap-3 border-t border-black/10 bg-black/[0.02] px-4 py-1.5 text-xs text-muted dark:border-white/10 dark:bg-white/[0.03]">
        <span>
          {t("words", {
            count: editor?.storage.characterCount.words() ?? 0,
          })}
        </span>
        <span
          aria-hidden="true"
          className="h-3 w-px bg-black/10 dark:bg-white/15"
        />
        <span>
          {t("characters", {
            count: editor?.storage.characterCount.characters() ?? 0,
          })}
        </span>
      </div>
      <MediaPickerModal
        open={imageModalOpen}
        onCloseAction={() => setImageModalOpen(false)}
        onSelectAction={insertImage}
        files={mediaFiles ?? []}
      />
    </div>
  );
}
