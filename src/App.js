import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { defaultCipherList } from "constants";

let defaultStyle = {
  color: "#fff"
};

let fakeServerData = {
  user: {
    name: "Tom",
    playlists: [
      {
        name: "Prime Cuts",
        songs: [
          {
            name: "Nuclear",
            duration: 1234
          },
          {
            name: "Catch Me",
            duration: 1234
          },
          {
            name: "Say It",
            duration: 1234
          }
        ]
      },
      {
        name: "Vibes",
        songs: [
          {
            name: "Pacific Coast Highway",
            duration: 1234
          },
          {
            name: "Last To Leave",
            duration: 1234
          },
          {
            name: "Better Not",
            duration: 1234
          }
        ]
      },
      {
        name: "Human Music",
        songs: [
          {
            name: "Emily",
            duration: 1234
          },
          {
            name: "Out Of Love",
            duration: 1234
          },
          {
            name: "Another Day In Paradise",
            duration: 1234
          }
        ]
      },
      {
        name: "Mix",
        songs: [
          {
            name: "Crawl Outta Love",
            duration: 1234
          },
          {
            name: "Shake Something",
            duration: 1234
          },
          {
            name: "Sensations",
            duration: 1234
          }
        ]
      }
    ]
  }
};

const PlaylistCounter = props => (
  <div style={{ ...defaultStyle, width: "40%", display: "inline-block" }}>
    <h2>
      {props.playlists ? `${props.playlists.length} Playlists` : "0 Playlists"}
    </h2>
  </div>
);

const HoursCounter = props => {
  let allSongs = props.playlists.reduce((songs, playlist) => {
    return songs.concat(playlist.songs);
  }, []);

  let totalDuration = allSongs.reduce((sum, song) => {
    return (sum += song.duration);
  }, 0);

  return (
    <div style={{ ...defaultStyle, width: "40%", display: "inline-block" }}>
      <h2>{`${Math.round(totalDuration / 60 ** 2)} Hours`}</h2>
    </div>
  );
};

const Filter = props => (
  <div>
    <input type="text" onChange={props.handleInputChange} />
    Filter
  </div>
);

const Playlist = props => (
  <div style={{ width: "30%", display: "inline-block" }}>
    <img src="" alt="" />
    <h3>{props.title}</h3>
    <ul style={{ listStyleType: "none", textAlign: "left" }}>
      <li>{props.songs[0].name}</li>
      <li>{props.songs[1].name}</li>
      <li>{props.songs[2].name}</li>
    </ul>
  </div>
);

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterText: ""
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ serverData: fakeServerData });
    }, 1000);
  }

  handleInputChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    let playlistsToRender = this.state.serverData.user ? this.state.serverData.user.playlists.filter(
      playlist => (
        playlist.name
          .toLowerCase()
          .includes(this.state.filterText.toLowerCase())
      )
    ) : [];

    return (
      <div className="App" style={defaultStyle}>
        {this.state.serverData.user ? (
          <div>
            <header className="App-header">
              <h1 style={{ margin: 0, paddingTop: "2vh" }}>
                {`${this.state.serverData.user.name}'s Playlists`}
              </h1>
            </header>
            <PlaylistCounter playlists={playlistsToRender} />
            <HoursCounter playlists={playlistsToRender} />
            <Filter handleInputChange={this.handleInputChange} />
            {playlistsToRender.map(playlist => (
              <Playlist title={playlist.name} songs={playlist.songs} />
            ))}
          </div>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    );
  }
}

export default App;
