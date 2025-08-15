import React from "react";

const BlogCard = ({ title, excerpt, author, date }) => {
    return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-600 text-sm mb-2">
        By {author} • {date}
    </p>
    <p>{excerpt}</p>
    <button className="mt-2 text-blue-600 hover:underline">
        Read more →
    </button>
    </div>
  );
};

export default BlogCard;
