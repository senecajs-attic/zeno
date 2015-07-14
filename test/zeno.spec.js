

if( typeof it !== 'undefined' ) {
  var orig_it = it
  it = function(desc,test) {
    if( 0 == test.length ) return orig_it(desc,test)
    orig_it(desc, function() {
      var done = false
      waitsFor(function () { return done })
      test(function () { done = true })
    })
  }
}


if( typeof zeno === 'undefined' ) {
  var assert      = require('assert')
  var lab         = exports.lab = require('lab').script()
  var zeno = require('../')  

  var describe = lab.describe
  var it       = lab.it
}


describe('happy', function(){

  it('works', function(fin){
    var out = zeno()
    if( 'foo' != out ) throw new Error('foo')

    zeno = zeno.noConflict()
    fin()
  })

})


