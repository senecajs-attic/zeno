

if( typeof it !== 'undefined' ) {
  var orig_it = it
  it = function(desc,test) {
    if( 0 == test.length ) return orig_it(desc,test)
    orig_it(desc, function() {
      var done = false
      waitsFor(function () { return done })

      try {
        test(function () { done = true })
      }
      catch( e ) {
        done = true
        throw e
      }
    })
  }
}


if( typeof zeno === 'undefined' ) {
  var jsonic = require('jsonic')
  var expect = require('code').expect
  var lab    = exports.lab = require('lab').script()
  var zeno   = require('../')  

  var describe = lab.describe
  var it       = lab.it
}
else {
  expect = code.expect
  __dirname = '@@@-never-match-@@@'
}


describe('happy', function(){

  it('works', function(fin){
    var z0 = zeno()

    function a0( msg, respond ) {
      respond(null,{x:msg.x})
    }

    var p0 = z0.pattern('a:1',{b:2})
    expect( p0 ).to.deep.equal( {a:1,b:2} )

    var r0 = z0.add({a:1},a0)
    expect( r0 ).to.equal( z0 )

    var ad0 = z0.find({a:1})
    expect( a0 ).to.equal( ad0.action )

    z0.act({x:0})

    z0.act({a:1,x:9},function(err,out){
      if( err ) return fin(err)
      expect( out.x ).to.equal( 9 )
      fin()
    })
  })


  it('pattern', function(fin){
    var z0 = zeno()

    expect( z0.pattern({a:1}) ).to.deep.equal( {a:1} )
    expect( z0.pattern('a:1') ).to.deep.equal( {a:1} )

    expect( z0.pattern({a:1,b:2})   ).to.deep.equal( {a:1,b:2} )
    expect( z0.pattern('a:1,b:2')   ).to.deep.equal( {a:1,b:2} )
    expect( z0.pattern({a:1},'b:2') ).to.deep.equal( {a:1,b:2} )
    expect( z0.pattern('a:1',{b:2}) ).to.deep.equal( {a:1,b:2} )
    expect( z0.pattern({a:1},{b:2}) ).to.deep.equal( {a:1,b:2} )
    expect( z0.pattern('a:1','b:2') ).to.deep.equal( {a:1,b:2} )

    function f0(){}
    f0.b=2
    expect( z0.pattern({a:1},f0) ).to.deep.equal( {a:1} )

    fin()
  })


  it('find', function(fin){
    var z0 = zeno()
    expect( z0.find('x:0') ).to.equal( null ) 

    z0.add('a:0',function a0(){})
    
    var find0 = z0.find('a:0')
    expect( find0.pattern ).to.deep.equal( { a: 0 } )
    expect( find0.action.name ).to.deep.equal( 'a0' )

    find0 = z0.find( {a:0} )
    expect( find0.pattern ).to.deep.equal( { a: 0 } )
    expect( find0.action.name ).to.deep.equal( 'a0' )

    z0.add('a:1',function a1(){})

    var find1 = z0.find('a:1')
    expect( find1.pattern ).to.deep.equal( { a: 1 } )
    expect( find1.action.name ).to.deep.equal( 'a1' )

    z0.add('a:1,b:2',function a1b2(){})

    var find2 = z0.find('a:1,b:2')
    expect( find2.pattern ).to.deep.equal( { a: 1, b: 2 } )

    expect( z0.find('a:1','b:2').pattern ).to.deep.equal( { a: 1, b: 2 } )
    expect( z0.find('a:1',{b:2}).pattern ).to.deep.equal( { a: 1, b: 2 } )
    expect( z0.find({a:1},{b:2}).pattern ).to.deep.equal( { a: 1, b: 2 } )

    // still a match!
    expect( z0.find('a:1,b:2,c:3').pattern ).to.deep.equal( { a: 1, b: 2 } )

    expect( z0.find('b:2') ).to.equal( null ) 

    fin()
  })


  it('list', function(fin){
    var z0 = zeno()
    expect( z0.list().length ).to.equal( 0 )

    z0.add('b:0',function b0(){})
    
    var list0 = z0.list()
    expect( list0.length ).to.equal( 1 )
    expect( list0[0].pattern ).to.deep.equal( { b: 0 } )
    expect( list0[0].action.name ).to.deep.equal( 'b0' )

    z0.add('b:1',function b1(){})
    var list1 = z0.list()
    expect( list1.length ).to.equal( 2 )
    expect( list1[0].pattern ).to.deep.equal( { b: 0 } )
    expect( list1[0].action.name ).to.deep.equal( 'b0' )
    expect( list1[1].pattern ).to.deep.equal( { b: 1 } )
    expect( list1[1].action.name ).to.deep.equal( 'b1' )

    // alphanumeric order
    z0.add('a:0',function a0(){})
    var list2 = z0.list()
    expect( list2.length ).to.equal( 3 )
    expect( list2[0].pattern ).to.deep.equal( { a: 0 } )
    expect( list2[0].action.name ).to.deep.equal( 'a0' )
    expect( list2[1].pattern ).to.deep.equal( { b: 0 } )
    expect( list2[1].action.name ).to.deep.equal( 'b0' )
    expect( list2[2].pattern ).to.deep.equal( { b: 1 } )
    expect( list2[2].action.name ).to.deep.equal( 'b1' )

    var list3 = z0.list({a:0})
    expect( list3.length ).to.equal( 1 )
    expect( list3[0].pattern ).to.deep.equal( { a: 0 } )
    expect( list3[0].action.name ).to.deep.equal( 'a0' )

    fin()
  })


  it('tree', function(fin){
    var z0 = zeno()

    z0.add('c:0',function c0(){})
    expect( z0.tree() )
      .to.deep.include({"c:0":{_:{pattern:{c:0}}}})

    z0.add('b:1,c:0',function b1c0(){})
    expect( z0.tree() )
      .to.deep.include({"b:1":{"c:0":{_:{pattern:{b:1,c:0}}}},"c:0":{_:{pattern:{c:0}}}})

    z0.add('a:2,b:1,c:0',function a2b1c0(){})
    expect( z0.tree() )
      .to.deep.include({"a:2":{"b:1":{"c:0":{_:{pattern:{a:2,b:1,c:0}}}}},"b:1":{"c:0":{_:{pattern:{b:1,c:0}}}},"c:0":{_:{pattern:{c:0}}}})

    z0.add('a:2,b:1',function a2b1(){})
    expect( z0.tree() )
      .to.deep.include({"a:2":{"b:1":{_:{pattern:{a:2,b:1}},"c:0":{_:{pattern:{a:2,b:1,c:0}}}}},"b:1":{"c:0":{_:{pattern:{b:1,c:0}}}},"c:0":{_:{pattern:{c:0}}}})

    z0.add('a:2',function a2(){})
    expect( z0.tree() )
      .to.deep.include({"a:2":{_:{pattern:{a:2}},"b:1":{_:{pattern:{a:2,b:1}},"c:0":{_:{pattern:{a:2,b:1,c:0}}}}},"b:1":{"c:0":{_:{pattern:{b:1,c:0}}}},"c:0":{_:{pattern:{c:0}}}})

    expect( z0.tree('a:2') )
      .to.deep.include({"a:2":{_:{pattern:{a:2}},"b:1":{_:{pattern:{a:2,b:1}},"c:0":{_:{pattern:{a:2,b:1,c:0}}}}}})

    fin()
  })


  it('error', function(fin){
    var entries = []

    zeno()
      .add('a:1',function(m,r){r(new Error('x'))})
      .act('a:1',function(err){
        expect(err.message).to.equal('x')
        fin()
      })
  })


  it('log', function(fin){
    var entries = [], i = 0

    zeno({
      log:function(entry){
        entries.push( entry )
      }})

      .log({x:1})
      .log(function(){ return {y:1} })
      .log('z')

      .add('a:1',function(m,r){r(0,{x:m.x})})
      .act('a:1,x:9', function(err,out){
        if( err ) return fin(err)
        expect( out.x ).to.equal( 9 )

        expect( entries[i++] ).to.deep.include( 
          {x:1} )
        expect( entries[i++] ).to.deep.include( 
          {y:1} )
        expect( entries[i++] ).to.deep.include( 
          {value:'z'} )
        expect( entries[i++] ).to.deep.include( 
          {type:'add', pattern:{a:1}} )
        expect( entries[i++] ).to.deep.include( 
          { type:'act', case:'in', pattern:{a:1}, data:{a:1,x:9}})
        expect( entries[i++] ).to.deep.include(
          { type:'act', case:'out', pattern:{a:1}, data:{x:9}})

        fin()
      })
    
  })


  it('prior', function(fin){
    var entries = [], d = 0

    zeno({
      log:function(entry){
        entries.push( entry )
      }})

      .add('a:1',function A(m,r){
        r(0,{x:m.x})
      })
      .add('a:1',function B(m,r){
        m.x=2
        this.prior(m,function(e,o){
          if(e) return r(e)
          o.y=m.y
          r(0,o)
        })
      })

      .add('b:2',function A(m,r){
        this.prior(m,function(e,o){
          r(0,{z:m.z})
        })
      })

      .act('a:1,y:3',function(e,o){
        expect(o).to.deep.equal({x:2,y:3})

        d++ && 2 === d && fin()
      })

      .act('b:2,z:4',function(e,o){
        expect(o).to.deep.equal({z:4})

        d++ && 2 === d && fin()
      })
  })
  

})


