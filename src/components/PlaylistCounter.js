import React from "react";

const PlaylistCounter = props => (
  <div style={{ ...props.style.defaultStyle, width: "40%", display: "inline-block" }}>
    <h2>
      {props.playlists ? `${props.playlists.length} Playlists` : "0 Playlists"}
    </h2>
  </div>
);

export default PlaylistCounter;