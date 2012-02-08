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
