"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Quote, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, 
  Image as ImageIcon, Undo, Redo, Code
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Masukkan URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Masukkan URL Gambar:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex items-center gap-0.5 border border-border border-b-0 rounded-t-lg p-1.5 bg-muted/30 flex-wrap">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${editor.isActive("bold") ? "bg-brand text-white" : "hover:bg-muted text-muted-foreground"}`}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${editor.isActive("italic") ? "bg-brand text-white" : "hover:bg-muted text-muted-foreground"}`}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${editor.isActive("underline") ? "bg-brand text-white" : "hover:bg-muted text-muted-foreground"}`}
        title="Underline"
      >
        <UnderlineIcon className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-brand text-white" : "hover:bg-muted text-muted-foreground"}`}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${editor.isActive("heading", { level: 3 }) ? "bg-brand text-white" : "hover:bg-muted text-muted-foreground"}`}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${editor.isActive("bulletList") ? "bg-brand text-white" : "hover:bg-muted text-muted-foreground"}`}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${editor.isActive("orderedList") ? "bg-brand text-white" : "hover:bg-muted text-muted-foreground"}`}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${editor.isActive("blockquote") ? "bg-brand text-white" : "hover:bg-muted text-muted-foreground"}`}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-brand text-white" : "hover:bg-muted text-muted-foreground"}`}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-brand text-white" : "hover:bg-muted text-muted-foreground"}`}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-brand text-white" : "hover:bg-muted text-muted-foreground"}`}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        type="button"
        onClick={addLink}
        className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${editor.isActive("link") ? "bg-brand text-white" : "hover:bg-muted text-muted-foreground"}`}
        title="Add Link"
      >
        <LinkIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={addImage}
        className="h-8 w-8 rounded hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
        title="Add Image"
      >
        <ImageIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${editor.isActive("codeBlock") ? "bg-brand text-white" : "hover:bg-muted text-muted-foreground"}`}
        title="Code Block"
      >
        <Code className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="h-8 w-8 rounded hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="h-8 w-8 rounded hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </button>
    </div>
  );
};

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl border border-border max-w-full",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: placeholder || "Tulis isi artikel di sini...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none min-h-[300px] focus:outline-none p-5 border border-border rounded-b-lg bg-white",
      },
    },
  });

  return (
    <div className="w-full">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
