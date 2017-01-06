const template = `<article id='restaurant-content'>
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
export { template }
