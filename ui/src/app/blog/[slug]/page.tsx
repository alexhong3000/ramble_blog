"use client";

import React, { useEffect, useState } from "react";
import { getPostBySlug } from "@/app/actions/blogActions";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import {
  atomDark,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@/app/hooks/useTheme";
type Post = {
  _id: string;
  title: string;
  markdownContent: string;
  thumbnailUrl: string;
  slug: string;
  createdAt: string;
} | null;

export default function Page() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  useEffect(() => {
    if (!slug || Array.isArray(slug)) return; // Ensure slug is a valid string

    const fetchPostBySlug = async () => {
      try {
        const data = await getPostBySlug(slug);
        setPost(data);
      } catch (error) {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPostBySlug();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-4 w-full mt-4" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center text-gray-500 mt-10">Post not found</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              width={96}
              height={96}
              className="rounded-lg object-cover"
            />
            <div>
              <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
              <span className="text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
            {post.markdownContent}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
}
