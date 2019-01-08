import React, { Component } from "react";
import "./App.css";
import queryString from "query-string";

let defaultStyle = {
  color: "#fff"
};

let loginButton = {
  backgroundColor: "rgb(62, 218, 42)",
  padding: "8px",
  fontSize: "30px",
  margin: "20px",
  border: "none",
  borderRadius: "5px"
};

let playlistImg = {
  height: "150px",
  width: "150px"
};

let playlistStyle = {
  width: "25%",
  display: "inline-block",
  margin: "10px",
  padding: "10px",
  border: "2px solid #fff",
  borderRadius: "10px"
};

let fakeServerData = {
  user: {
    name: "Tom"
  },
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
  <div style={playlistStyle}>
    <img src={props.img} alt="Playlist Cover" style={playlistImg} />
    <h3>{props.title}</h3>
    <ul style={{textAlign: "left"}}>
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
      user: {},
      playlists: [],
      filterText: "",
      accessToken: ""
    };
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    if (!accessToken) return;

    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);

        this.setState({
          user: {
            name: data.display_name
          }
        });
      });

    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    })
      .then(response => response.json())
      .then(playlistData => {
        let playlists = playlistData.items;
        let trackDataPromises = playlists.map(playlist => {
          let responsePromise = fetch(playlist.tracks.href, {
            headers: {
              Authorization: "Bearer " + accessToken
            }
          });
          let trackDataPromise = responsePromise.then(response => response.json());
          return trackDataPromise;
        });
        let allTracksDataPromises = Promise.all(trackDataPromises);
        let playlistsPromise = allTracksDataPromises.then(trackDatas => {
          trackDatas.forEach((trackData, i) => {
            playlists[i].trackDatas = trackData;
          });
          return playlists
        })
        return playlistsPromise;
      })
      .then(playlists => this.setState({
        playlists: playlists.map(item => {
          console.log(item.trackDatas);

          let songs = item.trackDatas.items.map(song => {
            return {
              name: song.track.name,
              duration: song.track.duration_ms / 1000
            }
          }) 

          return {
            name: item.name,
            img: item.images[0].url,
            songs: songs
          }
        })
      }));  
  }

  handleInputChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    let playlistsToRender =
      this.state.user && this.state.playlists
        ? this.state.playlists.filter(playlist =>
            playlist.name
              .toLowerCase()
              .includes(this.state.filterText.toLowerCase())
          )
        : [];

    return (
      <div className="App" style={defaultStyle}>
        {this.state.user.name ? (
          <div>
            <header className="App-header">
              <h1 style={{ margin: 0, paddingTop: "2vh" }}>
                {`${this.state.user.name}'s Playlists`}
              </h1>
            </header>
            <PlaylistCounter playlists={playlistsToRender} />
            <HoursCounter playlists={playlistsToRender} />
            <Filter handleInputChange={this.handleInputChange} />
            {playlistsToRender.map((playlist, index) => (
              <Playlist
                title={playlist.name}
                img={playlist.img}
                songs={playlist.songs}
                key={index}
              />
            ))}
          </div>
        ) : (
          <button
            style={loginButton}
            onClick={() => (window.location = "http://localhost:8888/login")}
          >
            Sign in with Spotify
          </button>
        )}
      </div>
    );
  }
}

export default App;
