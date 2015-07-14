;(function() {
  var root = this

  var has_require     = typeof require !== 'undefined'
  var has_exports     = typeof exports !== 'undefined'
  var has_module      = typeof module  !== 'undefined'


  function core_seneca(a) {
    return 'foo'
  }

  var previous = root.core_seneca
  core_seneca.noConflict = function() {
    root.core_seneca = previous;
    return core_seneca;
  }

  root.core_seneca = core_seneca

  // $lab:coverage:off$
  if( typeof exports !== 'undefined' ) {
    if( typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = core_seneca
    }
    exports.core_seneca = core_seneca
  } 
  // $lab:coverage:on$

}).call(this);




