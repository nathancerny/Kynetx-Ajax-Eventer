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
