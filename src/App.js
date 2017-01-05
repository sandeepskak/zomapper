import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.geolocationSuccess, this.geolocationError);
  }

  geolocationSuccess = (position) => {
    let latitude  = position.coords.latitude;
    let longitude = position.coords.longitude;
    this.renderMap(latitude, longitude);
  }

  geolocationError() {
    console.log('Unable to retrieve location');
  }

  renderMap = (latitude, longitude) => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: latitude, lng: longitude},
      zoom: 15
    });
    this.map = map;
    this.renderMarker(map, latitude, longitude);
    this.fetchNearbyRestaurants(latitude, longitude);
  }

  renderMarker = (map, latitude, longitude) => {
    console.log(map, latitude, longitude);
    let markerPosition = {lat: latitude, lng: longitude};
    new window.google.maps.Marker({
      position: markerPosition,
      map: map
    });
  }

  fetchNearbyRestaurants = (latitude, longitude) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('user-key', '57800fe3a17bc04ca2e40cfb5cf036fc');
    let options = {
      method: 'GET',
      headers: headers
    };
    let url = "https://developers.zomato.com/api/v2.1/geocode?lat=" + latitude + "&lon=" + longitude;
    window.fetch(url, options)
    .then(response => response.json())
    .then(data => {
      this.extractLocations(data.nearby_restaurants);
    })
  }

  extractLocations = (restaurants) => {
    this.listOfLocations = [];
    for(let restaurant of restaurants) {
      this.listOfLocations.push(restaurant.restaurant.location);
    }
    this.renderNearbyRestaurants(this.listOfLocations);
  }

  renderNearbyRestaurants = (locations) => {
    for(let location of locations) {
      this.renderMarker(this.map, parseFloat(location.latitude), parseFloat(location.longitude));
    }
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
