import React, { Component } from 'react';
import './App.css'
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap'
import Profile from './Components/Profile';
import Gallery from './Components/Gallery';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: '',
      artist: null,
      tracks: []
    }
  }
  
  search() {
    const BASE_URL = 'https://api.spotify.com/v1/search';
    const ALBUM_URL = 'https://api.spotify.com/v1/artists'
    const token = localStorage.getItem('token');
    let FETCH_URL = `${BASE_URL}?q=${this.state.query}&type=artist&limit=1`;

    // console.log('FETCH_URL', FETCH_URL);
    fetch(FETCH_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(json => {      
        if (json && json.error) {
          alert(json.error.message);
        } else {
          const artist = json.artists.items[0];
          this.setState({artist})

          FETCH_URL = `${ALBUM_URL}/${artist.id}/top-tracks?country=US`

          fetch(FETCH_URL, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(response => response.json())
          .then(json => {
            if (json && json.error) {
              alert(json.error.message);
            } else {
              const { tracks } = json;              
              this.setState({tracks});
            }
          })
        }
    })
  }

  render() {
    const { query, artist, tracks } = this.state;    

    return (
      <div className="App">
        <div className="App-title" >Music Master</div>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Search for an Artist"
              value={query}
              onChange={event => {this.setState({query: event.target.value})}}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.search();
                }
              }}/>

            <InputGroup.Addon onClick={() => this.search()}>
              <Glyphicon glyph="search"/>
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        {
          artist 
          ?
          <div>
            <Profile artist={artist} />

            <Gallery tracks={tracks}/>
          </div>
          : <div></div>
        }
        
      </div>
    );
  }
}

export default App;
