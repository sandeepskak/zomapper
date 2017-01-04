import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.geolocationSuccess, this.geolocationError);
  }

  geolocationSuccess(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: latitude, lng: longitude},
      zoom: 16
    });
    var markerPosition = {lat: latitude, lng: longitude};
    var marker = new window.google.maps.Marker({
      position: markerPosition,
      map: map
    });
  }

  geolocationError() {
    console.log('Unable to retrieve location');
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Mapper</h2>
        </div>
        <div className="map-container">
          <p className="App-intro"></p>
          <div id="map"></div>
        </div>
      </div>
    );
  }
}

export default App;
