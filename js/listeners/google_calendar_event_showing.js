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

