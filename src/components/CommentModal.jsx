import { useState, useEffect } from "react";
import axios from "axios";
import { Send, Smile, X } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react"; // ✅ Correct Picker for React
// import "emoji-mart/css/emoji-mart.css";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useQuery } from "@tanstack/react-query";

export default function CommentModal({ boardId, onClose, token }) {
  // console.log("boardId in commentModal:", boardId);
  // const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleAddComment = async () => {
    if (!text.trim()) return;
    await axios.post(
      `https://teamsync-backend-5s2n.onrender.com/api/comments/${boardId}`,
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // setComments([res.data, ...comments]);
    setText("");
  };

  // const fetchComments = async () => {
  //   const res = await axios.get(
  //     `https://teamsync-backend-5s2n.onrender.com/api/comments/${boardId}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   setComments(res.data);
  // };

  const { data: comments } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      return await axios.get(`https://teamsync-backend-5s2n.onrender.com/api/comments/${boardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    if (boardId) {
      // fetchComments();
    }
  }, [boardId, token]);

  console.log("comment:", comments);
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={"max-w-2xl w-full h-[85vh] p-0 flex flex-col"}>
        <div className="p-6 border-b border-gray-200">
          <div>
            <DialogHeader>
              <DialogTitle className={"text-xl"}>Board Comment</DialogTitle>
              <DialogDescription>
                Add your thoughts , what you think about this board
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
        <ScrollArea className={"px-6 pt-4 pb-2 flex-1 overflow-y-auto"}>
          <div className="space-y-4 pr-2">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full text-white flex items-center justify-center text-xs font-semibold">
                  {comment.author.username
                    ?.trim()
                    ?.split(" ")[0]
                    ?.charAt(0)
                    .toUpperCase() || "U"}
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800">
                      {comment.author?.username || "Unknown"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <div className="border-t w-full sticky bottom-0 border-gray-200 p-6 bg-white z-10">
            <div className="flex gap-3 items-start">
              <div className="size-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full text-white flex items-center justify-center text-xs font-semibold">
                Me
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3">
                  <Textarea
                    placeholder="Write a comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={
                      "resize-none border-none shadow-none focus-visible:ring-0 text-sm"
                    }
                    rows={3}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 relative">
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={() => setShowEmojiPicker((prev) => !prev)}
                    >
                      <Smile className="size-4 text-muted-foreground" />
                    </Button>
                    {showEmojiPicker && (
                      <div className="absolute z-50 bottom-10 left-0">
                        <Picker
                          data={data}
                          onEmojiSelect={addEmoji}
                          theme={"light"}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <DialogClose>
                      <Button
                        variant={"ghost"}
                        onClick={() => setText("")}
                        className={"text-sm text-muted-foreground"}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={handleAddComment}
                      className={
                        "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                      }
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
