;(function() {
  var root = this

  var has_require     = typeof require !== 'undefined'
  var has_exports     = typeof exports !== 'undefined'
  var has_module      = typeof module  !== 'undefined'


  function zeno(a) {
    return 'foo'
  }

  var previous = root.zeno
  zeno.noConflict = function() {
    root.zeno = previous;
    return zeno;
  }

  root.zeno = zeno

  // $lab:coverage:off$
  if( typeof exports !== 'undefined' ) {
    if( typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = zeno
    }
    exports.zeno = zeno
  } 
  // $lab:coverage:on$

}).call(this);




