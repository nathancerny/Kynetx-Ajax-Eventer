
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
