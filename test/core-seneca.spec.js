

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


if( typeof core_seneca === 'undefined' ) {
  var assert      = require('assert')
  var lab         = exports.lab = require('lab').script()
  var core_seneca = require('../')  

  var describe = lab.describe
  var it       = lab.it
}


describe('happy', function(){

  it('works', function(fin){
    var out = core_seneca()
    if( 'foo' != out ) throw new Error('foo')

    core_seneca = core_seneca.noConflict()
    fin()
  })

})


