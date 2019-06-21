import React from "react";

const Playlist = props => (
  <div style={props.style.playlistStyle}>
    <img src={props.img} alt="Playlist Cover" style={props.style.playlistImg} />
    <h3>{props.title}</h3>
    <div>
      <ul>
        <li style={{ listStyle: "none", fontWeight: "700" }}>
          <div style={{ ...props.style.liDivStyle, width: "35%" }}>Title</div>
          <div style={props.style.liDivStyle}>Artist(s)</div>
          <div style={props.style.liDivStyle}>Album</div>
          <div style={{ ...props.style.liDivStyle, width: "15%" }}>Date Added</div>
        </li>
        <hr />
      </ul>
    </div>
    <ul style={{ textAlign: "left" }}>
      {props.songs.map(song => {
        return (
          <div key={song.name + song.album + song.dateAdded}>
            <li className="track-item" style={{ listStyleImage: "+" }}>
              <div style={{ ...props.style.liDivStyle, width: "35%" }}>
                <span>{song.name}</span>
              </div>
              <div style={props.style.liDivStyle}>{song.artists}</div>
              <div style={props.style.liDivStyle}>{song.album}</div>
              <div style={{ ...props.style.liDivStyle, width: "15%" }}>
                {song.dateAdded}
              </div>
            </li>
            <hr />
          </div>
        );
      })}
    </ul>
  </div>
);

export default Playlist;