"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import CodeMirror from "@uiw/react-codemirror";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { EditorView } from "@codemirror/view";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import {
  atomDark,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownInput() {
  const [text, setText] = useState("\n".repeat(29));
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const customStyles = EditorView.theme({
    ".cm-activeLine": { backgroundColor: "transparent !important" }, // Removes highlight
    ".cm-gutters": { backgroundColor: "#0d1118" }, // Line number gutter color
  });
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`border-2 rounded-lg shadow-md p-6 flex flex-col overflow-hidden`}
    >
      {/* Header Section */}
      <div className={`flex justify-between items-center mb-4 border-b-2 pb-3`}>
        <div className="space-x-2">
          <Button
            onClick={() => setIsPreviewMode(false)}
            className={`${
              !isPreviewMode ? "bg-gray-800" : "bg-gray-500"
            } text-white`}
          >
            Edit
          </Button>
          <Button
            onClick={() => setIsPreviewMode(true)}
            className={`${
              isPreviewMode ? "bg-gray-800" : "bg-gray-500"
            } text-white`}
          >
            Preview
          </Button>
        </div>
        <h2 className={`text-lg font-semibold`}>Markdown Editor</h2>
      </div>

      {/* Content Section */}
      <div className={`border-2 rounded-lg flex-grow overflow-auto p-2 flex`}>
        {isPreviewMode ? (
          mounted ? (
            <div
              className={`markdown p-4 border rounded-md w-full `}
              style={{ maxHeight: "100%" }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkBreaks]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                      <SyntaxHighlighter
                        style={theme === "dark" ? atomDark : prism}
                        language={match[1]}
                        PreTag="div"
                        showLineNumbers
                        wrapLongLines
                        customStyle={{
                          fontSize: "0.875rem",
                          padding: "1rem",
                          borderRadius: "6px",
                          overflow: "auto",
                          maxHeight: "100%",
                        }}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={`p-1 rounded`} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {text}
              </ReactMarkdown>
            </div>
          ) : (
            <p className={`text-gray-500`}>Loading preview...</p>
          )
        ) : (
          <div className="w-full overflow-auto">
            {mounted ? (
              <CodeMirror
                theme={theme === "dark" ? githubDark : githubLight}
                value={text}
                onChange={(value) => setText(value)}
                extensions={[customStyles]}
                placeholder={`# Write your markdown here...`}
              />
            ) : (
              <p className="text-gray-500">Loading editor...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
