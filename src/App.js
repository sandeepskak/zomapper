import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import restaurantIcon from './restaurant.png';

class App extends Component {
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.geolocationSuccess, this.geolocationError);
  }

  geolocationSuccess = (position) => {
    let latitude  = position.coords.latitude;
    let longitude = position.coords.longitude;
    this.renderMap(latitude, longitude);
    this.renderMarker({map: this.map, latitude: latitude, longitude: longitude});
    this.fetchNearbyRestaurants(latitude, longitude);
  }

  geolocationError = () => {
    console.log('Unable to retrieve location');
    this.initAutoComplete();
  }

  renderMap = (latitude, longitude) => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: latitude, lng: longitude},
      zoom: 16
    });
    this.map = map;
    this.markers = [];
  }

  renderMarker = (options) => {
    let {map, latitude, longitude, icon} = options;
    let markerPosition = {lat: latitude, lng: longitude};
    let marker = new window.google.maps.Marker({
      position: markerPosition,
      map: map,
      icon: icon
    });
    this.markers.push(marker);
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
      this.extractRestaurantDetails(data.nearby_restaurants);
      this.renderNearbyRestaurants(this.listOfLocations);
      this.createInfoWindows(this.markers, this.restautantDetails);
    })
  }

  extractLocations = (restaurants) => {
    this.listOfLocations = [];
    this.restautantDetails = [];
    for(let restaurant of restaurants) {
      this.listOfLocations.push(restaurant.restaurant.location);
    }
  }

  renderNearbyRestaurants = (locations) => {
    for(let location of locations) {
      this.renderMarker({map: this.map, latitude: parseFloat(location.latitude), longitude: parseFloat(location.longitude), icon: restaurantIcon});
    }
  }

  initAutoComplete = () => {
    let countryRestrict = {'country': 'in'};
    this.autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById('autocomplete'), {
      types: ['(regions)'],
      componentRestrictions: countryRestrict
    });
    this.autocomplete.addListener('place_changed', this.onPlaceChanged);
  }

  onPlaceChanged = () => {
    let place = this.autocomplete.getPlace();
    if (place && place.geometry) {
      let latitude = place.geometry.location.lat();
      let longitude = place.geometry.location.lng();
      this.renderMap(latitude, longitude);
      this.renderMarker({map: this.map, latitude: latitude, longitude: longitude});
      this.fetchNearbyRestaurants(latitude, longitude);
      this.map.panTo(place.geometry.location);
      this.map.setZoom(16);
    } else {
      document.getElementById('autocomplete').placeholder = 'Enter a city';
    }
  }

  createInfoWindow = (marker, popupContent) => {
    let infoWindow = new window.google.maps.InfoWindow({maxWidth: 400});
    let map = this.map;
    window.google.maps.event.addListener(marker, 'click', function () {
      infoWindow.setContent(popupContent);
      infoWindow.open(map, marker);
    });
  }

  createInfoWindows = (markers, restautantDetails) => {
    markers.shift() //removes first element - the location marker of the user
    for (let [index, marker] of markers.entries()) {
      let templateString = `<article id='restaurant-content'>
                              <div class='container'>
                                <div class='col-sm-4 align-left'>
                                  <img class='featured-img inherit-display' src={{thumb}} />
                                </div>
                                <div class='col-sm-10 align-left ml-5'>
                                  <div class='restaurant-details'>
                                    <div class='col-sm-10 align-left ml-10'>
                                      <div class='restaurant-name bold'>{{name}}</div>
                                      <div class='restaurant-locality bold mt-5'>{{location.locality}}</div>
                                      <div class='restaurant-address curtail grey mt-5'>{{location.address}}</div>
                                    </div>
                                    <div class='align-right'>
                                      <div class='restaurant-rating bold' style='background-color: #{{user_rating.rating_color}};'>{{user_rating.aggregate_rating}}</div>
                                      <div class='restaurant-votes mt-5'>{{user_rating.votes}} votes</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class='divider'></div>
                              <div class='col-sm-12 text-left'>
                                <div class='restaurant-cuisine mt-5'>
                                  <span class='col-sm-4 grey'>Cuisines:</span>
                                  <span class='col-sm-8 align-right'>{{cuisines}}</span>
                                </div>
                                <div class='restaurant-cost-for-two mt-5'>
                                  <span class='col-sm-4 grey'>Cost for two:</span>
                                  <span class='col-sm-8 align-right'>&#8377;{{average_cost_for_two}}</span>
                                </div>
                              </div>
                              {{#show_order_url}}
                                {{#book_url}}
                                  <div class='col-sm-12 mt-25'>
                                    <div class='col-sm-3-items menu-button align-left'>
                                      <a target="_blank" href='{{menu_url}}' class='button'>Menu</a>
                                    </div>
                                    <div class='col-sm-3-items order-button align-left'>
                                      <a target="_blank" href='{{order_url}}' class='button'>Order</a>
                                    </div>
                                    <div class='col-sm-3-items book-button align-left'>
                                      <a target="_blank" href='{{book_url}}' class='button'>Book</a>
                                    </div>
                                  </div>
                                {{/book_url}}
                                {{^book_url}}
                                  <div class='col-sm-12 mt-25'>
                                    <div class='col-sm-2-items menu-button align-left'>
                                      <a target="_blank" href='{{menu_url}}' class='button'>Menu</a>
                                    </div>
                                    <div class='col-sm-2-items order-button align-left'>
                                      <a target="_blank" href='{{order_url}}' class='button'>Order</a>
                                    </div>
                                  </div>
                                {{/book_url}}
                              {{/show_order_url}}
                              {{^show_order_url}}
                                {{#book_url}}
                                  <div class='col-sm-12 mt-25'>
                                    <div class='col-sm-2-items menu-button align-left'>
                                      <a target="_blank" href='{{menu_url}}' class='button'>Menu</a>
                                    </div>
                                    <div class='col-sm-2-items book-button align-left'>
                                      <a target="_blank" href='{{book_url}}' class='button'>Book</a>
                                    </div>
                                  </div>
                                {{/book_url}}
                                {{^book_url}}
                                  <div class='col-sm-12 mt-25'>
                                    <div class='menu-button'>
                                      <a target="_blank" href='{{menu_url}}' class='button'>Menu</a>
                                    </div>
                                  </div>
                                {{/book_url}}
                              {{/show_order_url}}
                            </article>`;
      let popupContent = window.Mustache.render(templateString, restautantDetails[index]);
      this.createInfoWindow(marker, popupContent);
    }
  }

  extractRestaurantDetails = (restaurants) => {
    for(let restaurant of restaurants) {
      let {
        name, cuisines, has_online_delivery,
        is_delivering_now, has_table_booking,
        book_url, order_url,
        price_range, user_rating,
        url, thumb, location, average_cost_for_two,
        menu_url
      } = restaurant.restaurant;
      this.restautantDetails.push({
        name: name, cuisines: cuisines,
        has_online_delivery: has_online_delivery,
        is_delivering_now: is_delivering_now,
        has_table_booking: has_table_booking,
        book_url: book_url, order_url: order_url,
        price_range: price_range, user_rating: user_rating,
        url: url, thumb: thumb, location: location,
        average_cost_for_two: average_cost_for_two,
        show_order_url: (has_online_delivery && is_delivering_now),
        menu_url: menu_url
      });
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
          <p className="App-intro">
            <input id="autocomplete" placeholder="Enter a city" type="text" />
          </p>
          <div id="map"></div>
        </div>
      </div>
    );
  }
}

export default App;
