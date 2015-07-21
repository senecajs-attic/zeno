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


function print( f,i,hr ) {
  var nano = hr[0] * 1e9 + hr[1]
  console.log([1===%GetOptimizationStatus(f)?'fast':'SLOW',
               f.name,Math.floor(1e9*i/nano)].join('\t'))
}

// zeno.pattern
start = process.hrtime()
for( var i = 0; i < 1e5; i++ ) {
  z0.pattern( 'a:1',{b:2} )
}
duration = process.hrtime(start)

print(z0.pattern, i, duration)


// zeno.add
start = process.hrtime()
for( var i = 0; i < 1e5; i++ ) {
  z0.add( {a:1,b:2}, function(msg,respond){respond()} )
}
duration = process.hrtime(start)

print(z0.add, i, duration)


// zeno.find
start = process.hrtime()
for( var i = 0; i < 1e5; i++ ) {
  z0.find( {a:1,b:2} )
}
duration = process.hrtime(start)

print(z0.find, i, duration)


// zeno.act
start = process.hrtime()
for( var i = 0; i < 1e5; i++ ) {
  z0.act( {a:1,b:2}, function(){} )
}
duration = process.hrtime(start)

print(z0.act, i, duration)


// zeno.log
start = process.hrtime()
for( var i = 0; i < 1e5; i++ ) {
  z0.log( {x:1} )
}
duration = process.hrtime(start)

print(z0.log, i, duration)


// zeno.list
start = process.hrtime()
for( var i = 0; i < 1e5; i++ ) {
  z0.list( {a:1,b:2} )
}
duration = process.hrtime(start)

print(z0.list, i, duration)


// zeno.tree
start = process.hrtime()
for( var i = 0; i < 1e5; i++ ) {
  z0.tree( {a:1,b:2} )
}
duration = process.hrtime(start)

print(z0.tree, i, duration)





