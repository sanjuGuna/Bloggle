import React, { useState, useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';
import "../styles/CreateBlog.css";

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
  const [image, setImage] = useState(null);
  const [newTag, setNewTag] = useState("");
  const editorRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setBlogData(prev => ({ ...prev, content }));
    
    // Auto-generate excerpt if empty
    if (!blogData.excerpt && content) {
      const plainText = content.replace(/<[^>]*>/g, '');
      setBlogData(prev => ({ 
        ...prev, 
        excerpt: plainText.substring(0, 200) + (plainText.length > 200 ? "..." : "")
      }));
    }
    
    // Calculate read time (approx 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    setBlogData(prev => ({
      ...prev,
      readTime: `${minutes} min read`
    }));
  };

  const handleTagAdd = () => {
    if (newTag && !blogData.tags.includes(newTag)) {
      setBlogData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setBlogData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      setBlogData(prev => ({ ...prev, content }));
    }
    
    const newBlog = {
      ...blogData,
      id: Date.now(),
      image,
      author: currentUser?.username || "Anonymous",
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      likes: 0,
      comments: []
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
      readTime: "5 min read"
    });
    setImage(null);
  };

  return (
    <div className="create-blog">
      <h2>Create a New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Publication</label>
          <input
            type="text"
            name="publication"
            placeholder="Enter publication name..."
            value={blogData.publication}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter blog title..."
            value={blogData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Excerpt</label>
          <textarea
            name="excerpt"
            placeholder="Write a short excerpt..."
            value={blogData.excerpt}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <Editor
            apiKey="your-api-key" // Get from TinyMCE dashboard
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={blogData.content}
            init={{
              height: 400,
              menubar: true,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
            onEditorChange={handleContentChange}
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="tags-input">
            <input
              type="text"
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTagAdd()}
            />
            <button type="button" onClick={handleTagAdd}>Add</button>
          </div>
          <div className="tags-list">
            {blogData.tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
                <button type="button" onClick={() => handleTagRemove(tag)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select 
            name="status" 
            value={blogData.status} 
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="form-group">
          <label>Featured Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
          {image && (
            <div className="image-preview">
              <img src={image} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-meta">
          <p>Estimated read time: {blogData.readTime}</p>
          <p>Will be published as: {currentUser?.username || "Anonymous"}</p>
        </div>

        <button type="submit" className="submit-btn">
          {blogData.status === 'draft' ? 'Save Draft' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;