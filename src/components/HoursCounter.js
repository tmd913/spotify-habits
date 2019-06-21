import React from "react";

const HoursCounter = props => {
  let allSongs = props.playlists.reduce((songs, playlist) => {
    return songs.concat(playlist.songs);
  }, []);

  let totalDuration = allSongs.reduce((sum, song) => {
    return (sum += song.duration);
  }, 0);

  return (
    <div style={{ ...props.style.defaultStyle, width: "40%", display: "inline-block" }}>
      <h2>{`${Math.round(totalDuration / 60 ** 2)} Hours`}</h2>
    </div>
  );
};

export default HoursCounter;