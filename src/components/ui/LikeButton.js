import React, { useState } from "react";
import like from "../assets/images/like.png";
import likedTrue from "../assets/images/likedTrue.png";

const LikeButton = ({ initialCount = 0, onClick }) => {
  const [likeCount, setLikeCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    if (!liked) {
      setLikeCount(likeCount + 1);
      onClick();
      setLiked(true);
    }
  };

  return (
    <div className="flex items-center">
      <button onClick={handleLikeClick} disabled={liked}>
        {liked ? (
          <img
            src={likedTrue}
            alt="Liked"
            style={{ height: "20px", width: "20px" }}
          />
        ) : (
          <img
            src={like}
            alt="Like"
            style={{ height: "20px", width: "20px" }}
          />
        )}
      </button>
      <p>
        {/* {likeCount} */}
        {/* {likeCount === 1 ? "person" : "people"} liked this */}
      </p>
    </div>
  );
};

export default LikeButton;
