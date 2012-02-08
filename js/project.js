if(typeof Object.create !== 'function'){
  Object.create = function ( obj ) {
    function F() {}
    F.prototype = obj;
    return new F();
  }
} 
if(typeof String.prototype.ucFirst !== 'function'){
  String.prototype.ucFirst = function ( ) {
    var cpy = this.trim().toLowerCase();
    var first = '';
    if(cpy.length > 1){
      first = cpy.charAt(0); 
      cpy = cpy.substring(1, cpy.length);
    }else{
      return '';
    }
    first = first.toUpperCase();  
    return first + cpy; 
  }
}
"use strict"

  

if(typeof KY_LIBRARY === 'undefined'){
  window.KY_LIBRARY = {};
}

if(typeof KY_LIBRARY.EXPEDIA_CALENDAR === 'undefined'){
  KY_LIBRARY.EXPEDIA_CALENDAR = {};
}

if(typeof KY_LIBRARY.listener === 'undefined'){
KY_LIBRARY.listener = (function () {
  var that = {},
  listeners = {},
  potentials = {},
  registers = {};
  that.addListener = function (options) {
   
    if(typeof options === 'object'){
      if(typeof options.name === 'string'){
        if(typeof listeners[options.name] === 'undefined'){
          console.log('ADDING LISTENER ', options.name);
          listeners[options.name] = options; 
          options.init();

        }
      }
    }
    that.unloadpotentials();
  };

  that.addEvent = function (name, newEvent) {
    if(listeners[name] === 'object'){
      listeners[name].addEvent(newEvent);
    }else{
      if(typeof potentials[name] === 'object'){
        potentials[name].push(newEvent);
      }else{
        potentials[name] = Object.create(Array.prototype);
        potentials[name].push(newEvent);
        
      }
    }
    that.unloadpotentials();
  };

  that.unloadpotentials = function () {
    $KOBJ.each(potentials, function (name, array) {
      if(typeof listeners[name] === 'object') {
        $K.each(array, function (i, val) {
          listeners[name].addEvent(val); 
        });
      }
    });
  }
  
  that.createNewRegister = function (event) {
    var random = Math.floor(Math.random()) + "",
        millis = new Date().getMilliseconds() + "",
        index = random + millis;
    console.log('eveandaf log', event);
    registers[index] = event;
    return index;
  }
  that.dataReturned = function (reg_number, type, calendar_id, data) {
    console.log('REGUADA', registers, reg_number);
    if(typeof registers[reg_number] === 'undefined'){
      return null;
    }
    registers[reg_number].dataReturned(type, calendar_id, data);

  }

  return that;
}());
}
(function () {

var listener = (function () {
  var that = {},
  events = [];
  that.name = 'calendar_event_click';
                
  that.init = function () {
    console.log('initing');
    $K('.rb-n,.te').live('click', function (e) {
      var clicked = $K(this),
          bubble = $K('div.bubble:visible'),
          class_attrs = clicked.attr('class').split(/\s+/),
          bubble_links = bubble.find('.eb-footer a[id*=details], .eb-footer a[id*=copy]'),
          filtered;
          filtered = $KOBJ.map(class_attrs, function (arg, i) {
            var arg = arg.trim();
            if(arg.match(/^ca-evp[1-9]*/) !== null){
              return parseInt(arg);   
            }else {
              return null;   
            }
          });
          bubble_links.each( function (i, link) {
            var app;
            var airline_id = $K(link).attr('airline_id', filtered[0]);
            $K(link).click(function (e) {
              that.searchData(airline_id);
            });
                                    
                                
          });
                            
    });
  } 
                    
  that.addEvent = function (newEvent) {
    events.push(newEvent);
  }

  that.triggerEvents = function (airline_id, data) {
    console.log('triggerData');
    $K.each(events, function (i, event){
      if(event.filter(airline_id, data)){
        event.run(airline_id, data);   
      }
    });        
   }

   that.searchData = function (airline_id){
    var details = {},
        timer,
        load,
        timeout;
        console.log('searchData');
        load = function () {
          var from_time;
          var until_time;
          from_time = ('input[title="From time"]:visible').val;
          until_time =  $K('input[title="Until time"]:visible').val();
          details.from_date = $K('input[title="From date"]').val(); 
          details.from_time = from_time || 'any'; 
          details.until_date = $K('input[title="Until date"]').val();
          details.until_time = from_time || 'any';
          details.where = $K('div[id$=location] input').val();
          that.triggerEvents(airline_id, details);
        };
                        
        timeout = function () {
          if($K('input[title="From date"]').length) {
            load();
            clearTimeout(timer);
            return;
          }
          timer = setTimeout(timeout, 1000);
        };
        if(typeof airline_id === 'undefined'){
          return null;   
        }
        timeout();
   } 
                    
                    
   return that;
                    
                    
}());
KY_LIBRARY.listener.addListener(listener);
}());

// STARTING SHELL
if(typeof KY_LIBRARY.EXPEDIA_CALENDAR.default_shell === 'undefined'){
KY_LIBRARY.EXPEDIA_CALENDAR.default_shell = function (templates) {
    // define the outer div
    var shellHTML = $K('<div></div>')
                    .attr('id', 'boot');

    var innerShellHTML = $K('<div></div>');

    var htmlDiv = $K('<div></div>')
                  .addClass('twitter_html');

    var bodyDiv = $K('<div></div>')
                  .addClass('twitter_body');

    var containerDiv = $K('<div></div>')
                       .addClass('container');


    var tabsList = $K('<ul></ul>')
                   .addClass('tabs');


    var tabContentDiv = $K('<div></div>')
                        .addClass('tab-content');

    $K.each(templates, function (key, val) {
      var listTag = $K('<li></li>');
      var linkTag = $K('<a></a>');
      var templateDiv = $K('<div></div>');
      linkTag.attr('href', '#' + key);
      linkTag.html(key);
      listTag.append(linkTag);
      tabsList.prepend(listTag);
      templateDiv.attr('id', key);
      templateDiv.css('height', '330px');
      tabContentDiv.append(templateDiv);
    });
    containerDiv.prepend(tabsList);

    containerDiv.append(tabContentDiv);

    bodyDiv.append(containerDiv);

    htmlDiv.append(bodyDiv);
    innerShellHTML.append(htmlDiv)
    
    innerShellHTML.css('margin-top', '10px');

    shellHTML.append(innerShellHTML);
    shellHTML.css('float', 'right');

    

    $K('.ep-dp').before(shellHTML);

    tabsList.tabs();
    return shellHTML; 
}


}

// END SHELL
/*
 * Create events object
 */
if(typeof KY_LIBRARY.events === 'undefined'){
  KY_LIBRARY.events = {};
}
/*
 *  Done creating events object
 */

/*
 *  This is an event you can create your own events
 *  Events must have the following methods
 *  filter
 *  run 
 *  and optionally dataReturned
 *  starting default event
 */
if(typeof KY_LIBRARY.events.default_event === 'undefined'){
KY_LIBRARY.events.default_event = function () {
  var that = {},
  presenters = {},
  shell = {},
  templates = {},
  reg_number;
  that.init = function (options) {
    shell = options.shell || KY_LIBRARY.EXPEDIA_CALENDAR.default_shell;
    that.listener_name = options.name;
    templates = options.templates;
    reg_number = KY_LIBRARY.listener.createNewRegister(that);
      
  }
  that.filter = function (calendar_id, data) {
    return true; 
  }

  that.run = function (calendar_id, details) {
    var placeShell,
    presenter = presenters[calendar_id];
    if (typeof presenter === 'undefined') {
      console.log('presenting');
      presenters[calendar_id] = {};
      presenters[calendar_id].shell = shell(templates);
      presenters[calendar_id].details = details;
      $K.each(templates, function (key, value) {
        setTimeout(200, value.search(reg_number, calendar_id, details));
      });
    }else {
     
      placeShell = function () {
        var prop;
        var sh;
        if($K('.ep-dp').text().length) {
          sh = shell(templates);
          $K('.ep-dp').append(sh);
          $K.each(templates, function (i, template){
            var html = sh.find('#', template.name);
            template.writeResults(html, presenter[template.name]);
          });
          return;
        }
        setTimeout(placeShell, 100);
      }
      placeShell();
    }
  }

  that.dataReturned = function (type, calendar_id, data) {
    var sh,
    html, 
    sh = presenters[calendar_id].shell; 
    html = sh.find('#' + type);
    if(typeof data !== 'undefined') {
    console.log('datareturned');
      presenters[calendar_id][type] = data;
      templates[type].writeResults(html, data);
    }
  }
  return that;
}
}
/**
 * Ending Default event
 */
// init html_writers
if(typeof KY_LIBRARY.EXPEDIA_CALENDAR.html_writers === 'undefined') {
KY_LIBRARY.EXPEDIA_CALENDAR.html_writers = (function(){
  var that = {};
  that.drop_box = 'https://dl.dropbox.com/u/57162158/';
  
  that.addStars = function (rowElement, tripAdvisorRating) {
    rowElement.raty({
      readOnly: true,
      start : tripAdvisorRating,
      path : that.drop_box + 'jquery.raty-2.1.0/img/'
    });
    return true;
  }
  that.createDetail = function(row, name, value){
    var clone = row.clone();
    clone.find('.detail_name h4').html(name);
    clone.find('.detail_value').html(value);
    clone.attr('show', 'yes');
    return clone;
  }
  that.createImageURL = (function () {
    var base_url = 'https://images.travelnow.com/';
    return function (loc, custom_base) {
      if(typeof custom_base === 'undefined'){
        return base_url + loc;  
      }else{
        return custom_base + loc;
      }
    };
  }());
  that.tableWriterHandler = function () {
    $(selector).tablesorter({ sortList : [[1, 0]]});
  }
  that.createImageTag = function (loc, classes, custom_base) {
    var imageTag = $('<img></img>')
                   .attr('src', that.createImageURL(loc, custom_base))
                   .addClass(classes);
    return imageTag;
  };
  that.buildTemplateBase = function (div, name){
    var detailedView = $K('<div></div>')
                       .addClass('detailed_view');

   
    var returnDiv = $K('<div></div>')
                     .addClass('span20');

    var returnButton = $K('<button></button>')
                       .addClass('btn show_results')
                       .html('BACK');

    var header = $K('<div></div>')
                 .addClass('row detailed_header');
    var headerSpan = $K('<span></span>')
                     .addClass('span17');
    var headerText = $K('<h3></h3>')
                     .addClass('blue')
                     .html(name.ucFirst() + ' Details For ' + '<span class="company_name"> </span>');
    var headerImage = $K('<span></span>')
                      .addClass('span2 detailed_logo')
                      .html('<img class="detailed_image_logo"/>');
    
    var dealBody = $K('<div></div>')
                   .addClass('deals_body');
    var dealBodyRow = $K('<div></div>')
                      .addClass('row')
                      .attr('show', 'no');
    var detailName = $K('<div></div>')
                     .addClass('span7 detail_name')
                     .html('<h4></h4>');
    var detailValue = $K('<div></div>')
                      .addClass('span12 detail_value');

    var outerButton = $K('<div></div>')
                      .addClass('span20 offset3');
    var innerButton = $K('<button></button>')
                      .addClass('btn danger purchase')
                      .html('PURCHASE');
                      
    var table = $K('<table></table>')
                .addClass('zebra-striped deals');
    var tableBody = $K('<tbody></tbody>');


    returnDiv.append(returnButton);

    // Building the header

    headerSpan.append(headerText);
    header.append(headerSpan);
    header.append(headerImage);

    // Done Building header
    
    // Building the body
      
    dealBodyRow.append(detailName);
    dealBodyRow.append(detailValue);
    dealBody.append(dealBodyRow);

    // Done Builing body
    

    // Building the button
    outerButton.append(innerButton);

    // done building button
    
    // building the table
    
    table.append(tableBody);

    // done building the table

    // building detailView
    detailedView.append(returnDiv);
    detailedView.append(header);
    header.after(dealBody);
    dealBody.after(outerButton);

    // done building detailView

    div.append(detailedView)
    div.append(table);



  }
  return that;
}());
// finish html writers

}

// loading hotels
if(typeof KY_LIBRARY.EXPEDIA_CALENDAR.hotels === 'undefined'){

KY_LIBRARY.EXPEDIA_CALENDAR.hotels = function() {
  var that = Object.create(KY_LIBRARY.EXPEDIA_CALENDAR.html_writers);
  var view_element; 
  var hotel_deals_element;  
  var deal_results;
  that.name = 'hotels';
  that.search_data = {};
  that.calendar_id = '';
  var create_listeners = function () {
    var show_results = view_element.find('.show_results');
    var get_hotel = view_element.find('.get_hotel');
    show_results.live('click', function () {
      view_element.hide();
      hotel_deals_element.show();
    });
    get_hotel.live('click', function () {
      var link = get_hotel.attr('page_link');
      window.open(link);

    });
  };
  that.writeResults = function (shell, data) {
    that.buildTemplateBase(shell, that.name);
    var html = $('#' + that.name);
    var resultHtml = $.map(data.HotelListResponse.HotelList.HotelSummary, function (element, index) {
      var rowElement = $('<tr></tr>');
      var tdElement = $('<td></td>');
      var imageElement = that.createImageTag(element.thumbNailUrl);
      var parElement = $('<p></p>').addClass('blue');
      var nameElement = $('<h2></h2>').html(element.name).addClass('blue').addClass('name');
      var rateElement = $('<h2></h2>').html('$' + element.highRate).addClass('blue').addClass('price');
      var cityElement = $('<p></p>').html(element.city);
      var starRatingElement = $('<div></div>')
          .addClass('star-rating');
      
      view_element = html.find('.detailed_view');
      hotel_deals_element = html.find('.deals');
      deal_results = hotel_deals_element.find('tbody');
      create_listeners();
      rowElement.append(tdElement.clone().append(imageElement));
      rowElement.append(tdElement.clone().append(nameElement));
      nameElement.after(cityElement)
                 .after(starRatingElement);
      rowElement.append(tdElement.clone().append(rateElement));
      deal_results.append(rowElement);
      that.rowElementClick(rowElement, element);
      that.addStars(starRatingElement, element.tripAdvisorRating);
      return rowElement;
    });
    if(typeof handler === 'function'){
      handler('#hotel_deals');
    }
      
  }
  that.rowElementClick = function (rowElement, element) {
    rowElement.click(function () {
      that.detailedView(element);
      hotel_deals_element.hide();
      view_element.show();
    });
  }
  that.detailedView = function (element) {
    var header = view_element.find('.detailed_header');
    var name_element = view_element.find('.company_name');
    var image_element = view_element.find('.detailed_image_logo');
    var hotel_body = view_element.find('.deals_body');
    var row = hotel_body.find('[show=no]');
    var rate_details = element.RoomRateDetailsList.RoomRateDetails;
    var charge_details = rate_details.RateInfo.ChargeableRateInfo;
    var get_hotel = view_element.find('.get_hotel');
    var desc = that.createDetail(row, "Description: ", rate_details.roomDescription); 
    var loc = that.createDetail(row, "Location: ", element.locationDescription);
    var nightly = that.createDetail(row, "Nightly Rate: ", charge_details["@nightlyRateTotal"]);
    var sur = that.createDetail(row, "Sur Charge: ", charge_details["@surchargeTotal"]);
    var total = that.createDetail(row, "Total: ", charge_details["@total"]);
    hotel_body.find('[show=yes]').remove();
    hotel_body.append(loc)
              .append(nightly)
              .append(sur)
              .append(total)
              .append(desc);
    get_hotel.attr('page_link', element.deepLink);
    name_element.html(element.name);
    image_element.attr('src', that.createImageURL(element.thumbNailUrl));
  }
  that.search = function (reg_number, cal_id, find) {
    var app = KOBJ.get_application('a1299x153');
    console.log(find);
    app.raise_event('hotels_data', 
                   {'calendar_id' : cal_id,
                     'reg_number' : reg_number,
                    'search_params' : JSON.stringify(find) 
                    });
    console.log('Implement search for hotels');
  }
  return that; 
};

}
// done loading hotels


// loading cars
if(typeof KY_LIBRARY.EXPEDIA_CALENDAR.cars === 'undefined') {

KY_LIBRARY.EXPEDIA_CALENDAR.cars = function () {
  var that = Object.create(KY_LIBRARY.EXPEDIA_CALENDAR.html_writers);
  var view_element;
  var car_deals_element;
  var deal_results;
  that.name = 'cars';
  var create_listeners = function () {
    var show_results = view_element.find('.show_results');
    var rent_car = view_element.find('.purchase');
    show_results.live('click', function () {
      view_element.hide();
      car_deals_element.show();
    });
    rent_car.live('click', function () {
      var link = rent_car.attr('page_link');
      window.open(link);

    });


  };
  that.writeResults = function (html, data) {
    that.buildTemplateBase(html, that.name);
    html = $('#' + that.name);
    console.log(html);
    var resultHtml = $.map(data.AvailabilityResult.CarAvailability, function (element, index) {
      var rowElement = $('<tr></tr>'); 
      var tdElement = $('<td></td>');
      var rateElement = $('<span></span>')
                        .prepend('<p class="car_price blue">' + element.RateInfo.displayRate.$t + ' </p>')
                        .append('<p class="car_price_description">' + element.RateInfo.rateTypeDescription.$t + '</p>');
      var companyUrl = 'carLogos/' + element.companyCode.$t + '.gif';
      var imageElement = that.createImageTag(companyUrl, 'car_logo', that.drop_box);
      var totalElement = $('<span></span>')
                         .prepend('<p class="car_price blue">' + element.RateInfo.nativeApproximateTotalPrice.$t + '</p>')
                         .append('<p class="car_price_description"> total </p>');
      view_element = html.find('.detailed_view');
      car_deals_element = html.find('.deals');
      deal_results = car_deals_element.find('tbody');
      create_listeners();
      rowElement.append(tdElement.clone().append(imageElement));
      rowElement.append(tdElement.clone().append(rateElement));
      rowElement.append(tdElement.clone().append(totalElement));
      deal_results.append(rowElement);
      that.rowElementClick(rowElement, element);
    });
    return resultHtml;
  }
  that.rowElementClick = function(rowElement, element){
    rowElement.click(function() {
        that.detailedView(element);
        car_deals_element.hide();
        view_element.show();
    });
  }
  that.detailedView = function (data) {
    var header = view_element.find('.detailed_header'); 
    var company_name_class = view_element.find('.company_name');
    var company_name = data.companyName.$t; 
    var img_element = view_element.find('.detailed_image_logo');
    var image_url = 'carLogos/' + data.companyCode.$t + '.gif';
    var car_body = view_element.find('.deals_body');
    var row = car_body.find('[show=no]');
    var rate_info = data.RateInfo;
    var car_class,
        loc,
        desc,
        rate,
        total,
        extra;
    car_body.find('[show=yes]').remove();
    if(typeof company_name === 'string'){
      company_name_class.html(company_name.ucFirst()); 
    }
    img_element.attr('src', that.drop_box + image_url);
    
    
    
    car_class = that.createDetail(row, 'Class: ', data.carClass.$t);
    loc = that.createDetail(row, 'Location: ', data.locationString.$t);
    desc = that.createDetail(row, 'Description: ', data.carInfoString.$t);
    rate = that.createDetail(row, 'Rate: ', rate_info.displayRate.$t + ' ' + rate_info.rateTypeDescription.$t);
    total = that.createDetail(row, 'Total Price: ', rate_info.displayRate.$t);
    extra = that.createDetail(row, 'Extra Praic: ', rate_info.nativeExtraDayCharge.$t);
    car_body.append(car_class)
            .append(loc)
            .append(desc)
            .append(rate)
            .append(total)
            .append(extra);
    that.buildAffLink(data);
      


  }
  that.buildAffLink = function (data) {
    var rent_car = view_element.find('.purchase');
    var page_link = 'https://secure.travelnow.com/itinerary/reserve.jsp';
    var val;
    var other_val;
    var key;
    var key_other;
    page_link += '?cid=' + '374820';
    page_link += '&Submit=' + 'BOOK NOW';
    for(key in data){
      val = data[key];  
      if(typeof val.$t !== 'undefined'){
        page_link += '&' + key + '=' + val.$t;
      }else{
        for(key_other in val){
          other_val = val[key_other];
          if(typeof other_val.$t !== 'undefined'){
            page_link += '&' + key_other + '=' + other_val.$t;
          }
        }
      }
    }
    rent_car.attr('page_link', page_link);

  }
 
  that.search = function (reg_number, cal_id, find) {
    var app = KOBJ.get_application('a1299x153');
    console.log(find);
    app.raise_event('cars_data', 
                   {'calendar_id' : cal_id,
                    'reg_number' : reg_number,
                    'search_params' : JSON.stringify(find) 
                    });
  }
  
  return that;
};
}
// finished loading cars
