import React from "react";
import { Button } from "./ui/button";
import { post } from "@/app/actions/blogActions";
interface SubmitButtonProps {
  body: string;
  title: string;
  thumbnailUrl?: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  body,
  title,
  thumbnailUrl,
  setText,
  setTitle,
}) => {
  const handleClick = async () => {
    const payload = {
      title: title,
      markdownContent: body,
      thumbnailUrl:
        thumbnailUrl ||
        "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
    };
    await post(payload);
    setText("");
    setTitle("");
  };

  return (
    <Button onClick={() => handleClick()} disabled={!title || !body}>
      Submit
    </Button>
  );
};
