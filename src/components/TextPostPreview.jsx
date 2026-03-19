import { useState } from "react";

export default function TextPostPreview({ posts }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!posts || posts.length === 0) return null;

  const post = posts[active];

  function copyToClipboard() {
    navigator.clipboard.writeText(post.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Text Posts
        </h3>
        <div className="flex gap-1">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                i === active
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* LinkedIn-style preview */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
        {/* Profile header */}
        <div className="p-4 flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            JK
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900 text-sm">
              Joshua Kite
            </p>
            <p className="text-xs text-gray-500">
              Health & Longevity Coach | Helping busy professionals reclaim
              their energy
            </p>
            <p className="text-xs text-gray-400">1d</p>
          </div>
        </div>

        {/* Post content */}
        <div className="px-4 pb-4">
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 text-left leading-relaxed">
            {post.content}
          </pre>
        </div>

        {/* Engagement bar */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
          <span>👍 42</span>
          <span>·</span>
          <span>12 comments</span>
          <span>·</span>
          <span>3 reposts</span>
        </div>
      </div>

      {/* Topic tags */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-500">Topics:</span>
        {post.topics.map((topic) => (
          <span
            key={topic}
            className="text-xs px-2 py-1 rounded-full bg-emerald-900/30 text-emerald-400"
          >
            {topic}
          </span>
        ))}
      </div>

      {/* Copy button */}
      <button
        onClick={copyToClipboard}
        className="w-full py-3 bg-gray-800 text-gray-200 rounded-xl font-medium hover:bg-gray-700 transition-all cursor-pointer"
      >
        {copied ? "Copied!" : "Copy to Clipboard"}
      </button>
    </div>
  );
}
