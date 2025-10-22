"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";

const ThumbsUpDown = ({ articleSlug }: { articleSlug: string }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [alreadyVoted, setAlreadyVoted] = useState(true);

  const fetchData = async () => {
    const response = await fetch(`/api/get-likes/${articleSlug}`);
    if (!response.ok) {
      console.error("failed to fetch likes");
    } else {
      const data = await response.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const votedStorage = localStorage.getItem(`voted-${articleSlug}`);
    if (!votedStorage) {
      setAlreadyVoted(false);
    }
  }, [articleSlug]);

  const like = async () => {
    if (!alreadyVoted) {
      setAlreadyVoted(true);
      await fetch(`/api/like/${articleSlug}`);
      localStorage.setItem(`voted-${articleSlug}`, "true");
      fetchData();
    }
  };

  const dislike = async () => {
    if (!alreadyVoted) {
      setAlreadyVoted(true);
      await fetch(`/api/dislike/${articleSlug}`);
      localStorage.setItem(`voted-${articleSlug}`, "true");
      fetchData();
    }
  };

  return (
    <div className="w-fit h-fit flex flex-row items-center justify-center gap-4 pb-12">
      <div className="w-fit h-fit flex flex-col items-end justify-center gap-2">
        <button
          onClick={like}
          className={`${
            alreadyVoted
              ? "opacity-50 cursor-default scale-75 origin-bottom-right border-none px-0"
              : "h-fit cursor-pointer"
          } origin-bottom bg-transparent border-2 border-teal/60 hover:border-teal text-teal/60 hover:text-teal font-bold p-2 rounded-lg duration-500`}
        >
          <ThumbsUp />
        </button>
        <p className="text-xs text-teal mr-1">{likes}</p>
      </div>
      <div className="w-fit h-fit flex flex-col items-start justify-center gap-2">
        <button
          onClick={dislike}
          className={`${
            alreadyVoted
              ? "opacity-50 cursor-default scale-75 origin-bottom-left border-none px-0"
              : "h-fit cursor-pointer"
          } origin-bottom bg-transparent border-2 border-error/60 hover:border-error text-error/60 hover:text-error font-bold p-2 rounded-lg duration-500`}
        >
          <ThumbsDown />
        </button>
        <p className="text-xs text-error ml-1">{dislikes}</p>
      </div>
    </div>
  );
};

export default ThumbsUpDown;
