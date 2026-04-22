'use client'

import type { Editor } from '@tiptap/react'

interface Props {
  editor: Editor | null
  onImageUpload: () => void
}

function ToolBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded text-sm hover:bg-gray-100 transition-colors ${
        active ? 'bg-gray-200 text-black' : 'text-gray-600'
      }`}
    >
      {children}
    </button>
  )
}

export function EditorToolbar({ editor, onImageUpload }: Props) {
  if (!editor) return null

  function setLink() {
    const prev = editor?.getAttributes('link').href
    const url = window.prompt('URL', prev)
    if (url === null) return
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50">
      <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
        <strong>B</strong>
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
        <em>I</em>
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
        <s>S</s>
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
        {'<>'}
      </ToolBtn>

      <span className="w-px h-4 bg-gray-300 mx-1" />

      <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="H1">
        H1
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2">
        H2
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3">
        H3
      </ToolBtn>

      <span className="w-px h-4 bg-gray-300 mx-1" />

      <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
        &#8226;&#8212;
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">
        1&#8212;
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
        &#8220;&#8221;
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">
        {'{ }'}
      </ToolBtn>

      <span className="w-px h-4 bg-gray-300 mx-1" />

      <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Link">
        Link
      </ToolBtn>
      <ToolBtn onClick={onImageUpload} title="Insert image">
        Img
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
        HR
      </ToolBtn>

      <span className="w-px h-4 bg-gray-300 mx-1" />

      <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
        &#8592;
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
        &#8594;
      </ToolBtn>
    </div>
  )
}
