import React, { Component } from "react";
import "./App.css";
import queryString from "query-string";
import PlaylistCounter from "./components/PlaylistCounter";
import HoursCounter from "./components/HoursCounter";
import Filter from "./components/Filter";
import Playlist from "./components/Playlist";

/*
 **********************
 ***** CSS Styles *****
 **********************
 */

let cssStyle = {
  defaultStyle: {
    color: "#fff"
  },
  loginButton: {
    backgroundColor: "rgb(62, 218, 42)",
    padding: "8px",
    fontSize: "30px",
    margin: "20px",
    border: "none",
    borderRadius: "5px"
  },
  playlistImg: {
    height: "150px",
    width: "150px"
  },
  playlistStyle: {
    width: "90%",
    display: "inline-block",
    margin: "10px",
    padding: "10px",
    border: "2px solid #fff",
    borderRadius: "10px"
  },
  liDivStyle: {
    width: "25%",
    display: "inline-block",
    textAlign: "left",
    padding: "0 5px",
    boxSizing: "border-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
}

/*
 ****************************
 ***** Fake Server Data *****
 ****************************
 */
// let fakeServerData = {
//   user: {
//     name: "Tom"
//   },
//   playlists: [
//     {
//       name: "Prime Cuts",
//       songs: [
//         {
//           name: "Nuclear",
//           duration: 1234
//         },
//         {
//           name: "Catch Me",
//           duration: 1234
//         }
//       ]
//     },
//     {
//       name: "Vibes",
//       songs: [
//         {
//           name: "Pacific Coast Highway",
//           duration: 1234
//         },
//         {
//           name: "Last To Leave",
//           duration: 1234
//         }
//       ]
//     }
//   ]
// };

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

  /*
  parameters:
    accessToken: needed to make spotify api call
    href: url to access track information for a given playlist
  description:
    Creates an array of promises that are attempting to pull
    playlist track information from spotify, 100 tracks at a time.
    Loops through all tracks in the playlist until no more are remaining.
  */
  async getTrackDataPromises(accessToken, href) {
    // will hold an array of promises, each attempting to pull 1-100 tracks
    const trackDataPromises = [];
    // reference for each batch of track information
    let i = 0;
    // holds next url in which tracks will be pulled from
    let next = href;
    // loops until next is null (no tracks remaining in playlist)
    // i < 100 ensures no infinite loop
    while (next && i < 100) {
      // contains promise from fetch call
      let responsePromise = fetch(next, {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      });
      // converts promise from fetch into json and stores next promise in array
      trackDataPromises[i] = responsePromise.then(response => response.json());
      // waits for the promise to resolve, then updates next
      next = await trackDataPromises[i].then(data => data.next);
      i++;
    }
    // return array of promises
    return trackDataPromises;
  }

  componentDidMount() {
    // pulls access token from url string
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    if (!accessToken) return;

    // pull user data from spotify and update state
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          user: {
            name: data.display_name
          }
        });
      });

    // pull playlist data from spotify api
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    })
      .then(response => response.json())
      .then(playlistData => {
        // array of playlist objects
        let playlists = playlistData.items.slice(0, 1);
        // array of promises pulling track data
        // get track data for each playlist
        let trackDataPromisesArray = playlists.map(playlist => {
          // calls function that will return array of arrays of promises
          // passes access token and base playlist track url as arguments
          const trackDataPromises = this.getTrackDataPromises(
            accessToken,
            playlist.tracks.href
          );
          return trackDataPromises;
        });
        // waits for all promises from trackDataPromisesArray to resolve
        let allTrackDataPromisesArray = Promise.all(trackDataPromisesArray);
        // outer promise that will return updated playlist data when resolved
        let playlistsPromise = allTrackDataPromisesArray.then(
          playlistTrackDataPromises => {
            // iterate through each playlist object
            playlistTrackDataPromises.forEach((playlistTrackData, i) => {
              // waits for all sub promises, representing each offset, to resolve
              let allTrackData = Promise.all(playlistTrackData);
              // inner promise
              let playlistPromise = allTrackData.then(trackData => {
                let combinedTrackData = [];
                // iterate through each offset of track data
                trackData.forEach(offset => {
                  // if there is already track data extracted, combine with current offset
                  // otherwise initialize with current offset track data
                  combinedTrackData = combinedTrackData
                    ? [...combinedTrackData, ...offset.items]
                    : [...offset.items];
                });
                // add property containing track data array to relevant playlist object
                playlists[i].trackDatas = combinedTrackData;
              });
              // return promise for each playlist
              return playlistPromise;
            });
            // return updated playlist array
            return playlists;
          }
        );
        // return promise for all playlists
        return playlistsPromise;
      })
      .then(playlists => {
        console.log(playlists);
        const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        // update state with playlist data
        this.setState({
          playlists: playlists.map(item => {
            let songs = item.trackDatas.map(song => {
              return {
                name: song.track.name,
                // iterate trhough all artists and create comma separated string
                artists: song.track.artists
                  .map(artist => artist.name)
                  .join(", "),
                album: song.track.album.name,
                dateAdded: 
                  new Date(song.added_at).getFullYear() +
                  "-" +
                  months[new Date(song.added_at).getMonth()] +
                  "-" +
                  (new Date(song.added_at).getDate().toString().length > 1
                    ? new Date(song.added_at).getDate()
                    : "0" + new Date(song.added_at).getDate()),
                duration: song.track.duration_ms / 1000
              };
            });

            return {
              name: item.name,
              img: item.images[0].url,
              songs: songs
            };
          })
        });
      });
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
      <div className="App" style={cssStyle.defaultStyle}>
        {this.state.user.name ? (
          <div>
            <header className="App-header">
              <h1 style={{ margin: 0, paddingTop: "2vh" }}>
                {`${this.state.user.name}'s Playlists`}
              </h1>
            </header>
            <PlaylistCounter playlists={playlistsToRender} style={cssStyle} />
            <HoursCounter playlists={playlistsToRender} style={cssStyle} />
            <Filter handleInputChange={this.handleInputChange} style={cssStyle} />
            {playlistsToRender.map((playlist, index) => (
              <Playlist
                title={playlist.name}
                img={playlist.img}
                songs={playlist.songs}
                key={index}
                style={cssStyle}
              />
            ))}
          </div>
        ) : (
          <button
            style={cssStyle.loginButton}
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
