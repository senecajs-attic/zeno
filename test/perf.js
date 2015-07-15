var zeno = require('..')
var _    = require('lodash')

var z0 = zeno()

function warmup() {
  z0.add( {a:1,b:2}, _.noop )
  z0.add( {a:1,b:2}, _.noop )
}

for( var i = 0; i < 111; i++ ) {
  warmup()
}

global.gc()

var start,duration


function print( f,i,d ) {
  console.log([1===%GetOptimizationStatus(f)?'fast':'SLOW',
               f.name,Math.floor(1000*i/d)].join('\t'))
}

// zeno.pattern
start = Date.now()
for( var i = 0; i < 1e5; i++ ) {
  z0.pattern( 'a:1',{b:2} )
}
duration = Date.now() - start

print(z0.pattern, i, duration)


// zeno.add
start = Date.now()
for( var i = 0; i < 1e5; i++ ) {
  z0.add( {a:1,b:2}, _.noop )
}
duration = Date.now() - start

print(z0.add, i, duration)


// zeno.find
start = Date.now()
for( var i = 0; i < 1e5; i++ ) {
  z0.find( {a:1,b:2} )
}
duration = Date.now() - start

print(z0.find, i, duration)





