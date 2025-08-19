import React, { useState, useRef, useEffect } from 'react';
import '../styles/CreateBlog.css';

const CreateBlog = ({ onCreate, currentUser }) => {
  const [blogData, setBlogData] = useState({
    publication: "",
    title: "",
    excerpt: "",
    content: "",
    tags: [],
    status: "draft",
    readTime: "5 min read",
    likes: 0,
    comments: 0
  });
  const [newTag, setNewTag] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  // Removed unused showImageUpload state
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const titleRef = useRef(null);

  // Auto-focus title on component mount
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  // Handle paste events (including images from clipboard)
  const handlePaste = (e) => {
    const items = Array.from(e.clipboardData.items);
    
    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        insertImageFromFile(file);
        return;
      }
    }
  };

  // Insert image from file with Medium-like styling
  const insertImageFromFile = (file) => {
    if (!file || !editorRef.current) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      // Create image container
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'image-wrapper';
      
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'blog-image';
      img.alt = 'Blog image';
      
      // Create caption input
      const captionDiv = document.createElement('div');
      captionDiv.className = 'image-caption';
      captionDiv.contentEditable = true;
      captionDiv.setAttribute('data-placeholder', 'Type caption for image (optional)');
      
      imageWrapper.appendChild(img);
      imageWrapper.appendChild(captionDiv);

      // Insert at current cursor position or at the end
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(imageWrapper);
        
        // Move cursor after the image
        range.setStartAfter(imageWrapper);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        editorRef.current.appendChild(imageWrapper);
      }

      // Add some spacing after image
      const br = document.createElement('br');
      editorRef.current.appendChild(br);
      
      handleContentChange();
    };
    reader.readAsDataURL(file);
  };

  // Try to set caret where the user drops
  const setCaretFromPoint = (clientX, clientY) => {
    const selection = window.getSelection();
    if (!selection) return;
    if (document.caretRangeFromPoint) {
      const range = document.caretRangeFromPoint(clientX, clientY);
      if (range) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(clientX, clientY);
      if (pos) {
        const range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  // Drag & Drop handlers for images
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    // Best-effort: if leaving the editor area, remove highlight
    if (!editorRef.current || !editorRef.current.contains(e.relatedTarget)) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    // Place caret where dropped
    setCaretFromPoint(e.clientX, e.clientY);

    const dt = e.dataTransfer;
    if (!dt) return;

    // Prefer files
    if (dt.files && dt.files.length > 0) {
      Array.from(dt.files).forEach((file) => {
        if (file.type && file.type.startsWith('image/')) {
          insertImageFromFile(file);
        }
      });
      return;
    }

    // Fallback: handle dragged image from browser (no file), try items
    if (dt.items && dt.items.length > 0) {
      Array.from(dt.items).forEach((item) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file && file.type && file.type.startsWith('image/')) {
            insertImageFromFile(file);
          }
        }
      });
    }
  };

  // Handle file input
  const handleImageInsert = (e) => {
    const file = e.target.files[0];
    if (file) {
      insertImageFromFile(file);
      e.target.value = ''; // Reset input
      // Removed setShowImageUpload(false); since showImageUpload is unused
    }
  };

  // Update content and auto-generate metadata
  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setBlogData((prev) => ({ ...prev, content }));

      // Auto-generate excerpt from content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      
      if (plainText && (!blogData.excerpt || blogData.excerpt.endsWith('...'))) {
        setBlogData((prev) => ({
          ...prev,
          excerpt: plainText.substring(0, 160) + (plainText.length > 160 ? "..." : "")
        }));
      }

      // Calculate reading time
      const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
      const minutes = Math.max(1, Math.ceil(wordCount / 200)); // Average reading speed
      setBlogData((prev) => ({
        ...prev,
        readTime: `${minutes} min read`
      }));
    }
  };

  // Format text (bold, italic, etc.)
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  // Add tag
  const handleTagAdd = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !blogData.tags.includes(trimmedTag)) {
      setBlogData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setNewTag("");
    }
  };

  // Remove tag
  const handleTagRemove = (tagToRemove) => {
    setBlogData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove)
    }));
  };

  // Handle Enter key for tags
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    } else if (e.key === 'Backspace' && !newTag && blogData.tags.length > 0) {
      // Remove last tag on backspace if input is empty
      const lastTag = blogData.tags[blogData.tags.length - 1];
      handleTagRemove(lastTag);
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!blogData.title.trim()) {
      alert('Please enter a title for your story');
      titleRef.current?.focus();
      return;
    }

    if (!blogData.content.trim()) {
      alert('Please add some content to your story');
      editorRef.current?.focus();
      return;
    }

    const newBlog = {
      ...blogData,
      id: Date.now(),
      author: currentUser?.username || "Anonymous",
      authorAvatar: currentUser?.avatar || "",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      comments: [],
      views: 0
    };

    onCreate(newBlog);

    // Reset form
    setBlogData({
      publication: "",
      title: "",
      excerpt: "",
      content: "",
      tags: [],
      status: "draft",
      readTime: "5 min read",
      likes: 0,
      comments: 0
    });
    
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    
    setIsPreview(false);
    titleRef.current?.focus();
  };

  return (
    <div className="create-blog-container">
      {/* Header */}
      <header className="blog-header">
        <div className="header-left">
          <h1>Write your story</h1>
        </div>
        <div className="header-actions">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`preview-btn ${isPreview ? 'active' : ''}`}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <select
            name="status"
            value={blogData.status}
            onChange={handleChange}
            className="status-select"
          >
            <option value="draft">Draft</option>
            <option value="published">Publish</option>
          </select>
        </div>
      </header>

      <main className="blog-main">
        {!isPreview ? (
          <div className="editor-container">
            {/* Publication */}
            <input
              type="text"
              name="publication"
              placeholder="Add to publication"
              value={blogData.publication}
              onChange={handleChange}
              className="publication-input"
            />

            {/* Title */}
            <textarea
              ref={titleRef}
              name="title"
              placeholder="Title"
              value={blogData.title}
              onChange={handleChange}
              className="title-input"
              rows="1"
              onInput={(e) => {
                // Auto-resize textarea
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />

            {/* Editor Toolbar */}
            <div className="editor-toolbar">
              <div className="toolbar-group">
                <button
                  type="button"
                  onClick={() => formatText('bold')}
                  className="toolbar-btn"
                  title="Bold (Ctrl+B)"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  onClick={() => formatText('italic')}
                  className="toolbar-btn"
                  title="Italic (Ctrl+I)"
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  onClick={() => formatText('insertUnorderedList')}
                  className="toolbar-btn"
                  title="Bullet List"
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('Enter link URL:');
                    if (url) formatText('createLink', url);
                  }}
                  className="toolbar-btn"
                  title="Link"
                >
                  🔗
                </button>
                <button
                  type="button"
                  onClick={() => formatText('formatBlock', 'h2')}
                  className="toolbar-btn"
                  title="Heading"
                >
                  H
                </button>
                <button
                  type="button"
                  onClick={() => formatText('formatBlock', 'blockquote')}
                  className="toolbar-btn"
                  title="Quote"
                >
                  "
                </button>
              </div>
              <div className="toolbar-group">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="toolbar-btn image-btn"
                  title="Insert Image"
                >
                  📷 Image
                </button>
              </div>
            </div>

            {/* Content Editor */}
            <div className="editor-wrapper">
              <div
                ref={editorRef}
                contentEditable
                onInput={handleContentChange}
                onPaste={handlePaste}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`content-editor ${isDraggingOver ? 'dragging-over' : ''}`}
                data-placeholder="Tell your story..."
                suppressContentEditableWarning={true}
                style={{ outline: 'none' }}
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageInsert}
                style={{ display: 'none' }}
              />
            </div>

            {/* Helper Text for pasting images in the content writer*/}
            <p className="editor-help">
              💡 <strong>Pro tip:</strong> Copy and paste images directly from your clipboard (Ctrl+V) or drag & drop them into the editor
            </p>

            {/* Tags Section */}
            <div className="tags-section">
              <label className="section-label">Tags</label>
              <div className="tags-input-wrapper">
                <div className="tags-container">
                  {blogData.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="tag-remove"
                        title="Remove tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder={blogData.tags.length === 0 ? "Add tags (press Enter)" : ""}
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="tag-input"
                  />
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div className="excerpt-section">
              <label className="section-label">Story preview</label>
              <textarea
                name="excerpt"
                placeholder="Write a compelling preview to entice readers (auto-generated from content if left empty)"
                value={blogData.excerpt}
                onChange={handleChange}
                rows="3"
                className="excerpt-textarea"
              />
            </div>

            {/* Meta Information */}
            <div className="meta-info">
              <span className="read-time">📖 {blogData.readTime}</span>
              <span className="author-info">
                Publishing as <strong>{currentUser?.username || "Anonymous"}</strong>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="submit-button"
            >
              {blogData.status === "draft" ? "Save Draft" : "Publish Story"}
            </button>
          </div>
        ) : (
          // Preview Mode
          <article className="preview-container">
            <div className="preview-meta">
              {blogData.publication && (
                <div className="publication-name">{blogData.publication}</div>
              )}
              <div className="author-line">
                <span className="author-name">{currentUser?.username || "Anonymous"}</span>
                <span className="separator">·</span>
                <span className="read-time">{blogData.readTime}</span>
                <span className="separator">·</span>
                <span className="publish-date">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  })}
                </span>
              </div>
            </div>

            <h1 className="preview-title">
              {blogData.title || "Your story title will appear here"}
            </h1>

            <div className="preview-excerpt">
              {blogData.excerpt || "Your story preview will appear here..."}
            </div>

            <div 
              className="preview-content"
              dangerouslySetInnerHTML={{ 
                __html: blogData.content || "<p class='empty-content'>Start writing to see your content here...</p>" 
              }}
            />

            {blogData.tags.length > 0 && (
              <div className="preview-tags">
                {blogData.tags.map(tag => (
                  <span key={tag} className="preview-tag">#{tag}</span>
                ))}
              </div>
            )}
          </article>
        )}
      </main>
    </div>
  );
};

export default CreateBlog;