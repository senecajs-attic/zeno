"use strict";

var _      = require('lodash')
var patrun = require('patrun')
var jsonic = require('jsonic')
  

module.exports = function zeno( options ) {
  return new Zeno( options )
}




/**
 *  Note:
 *     * `arguments` built-in is converted to `args` array using optimized for loop.
 */
function Zeno( options ) {
  var self = this


  options = _.extend( {
    action_executor: direct_executor
  }, options )


  self.act_patrun = patrun()


  self.add = function zeno_add() {
    var i=0,args=Array(arguments.length);for(;i<args.length;i++)args[i]=arguments[i]

    var pattern = self.pattern.apply( self, args )
    var action  = _.last( args )

    var actdef = {
      pattern: pattern,
      action:  action
    }

    self.act_patrun.add( pattern, actdef )

    return self
  }


  self.act = function zeno_act() {
    var i=0,args=Array(arguments.length);for(;i<args.length;i++)args[i]=arguments[i]

    var msg     = self.pattern.apply( self, args )
    var respond = _.last( args )

    respond = _.isFunction( respond ) ? respond : _.noop

    var actdef = self.find( msg )

    if( actdef ) {
      options.action_executor( self, actdef, msg, respond )
    }

    return self
  }


  self.find = function zeno_find() {
    var i=0,args=Array(arguments.length);for(;i<args.length;i++)args[i]=arguments[i]

    var pattern = self.pattern.apply( self, args )

    return self.act_patrun.find( pattern )
  }

  
  self.pattern = function zeno_pattern() {
    var i=0,args=Array(arguments.length);for(;i<args.length;i++)args[i]=arguments[i]

    for( var i = 0; i < args.length; i++ ) {
      if( _.isString( args[i] ) ) {
        args[i] = jsonic( args[i] )
      }
      else if( !_.isPlainObject( args[i] ) ) {
        args[i] = null
      }
    }

    return _.extend.apply( null, args )
  }



  function direct_executor( instance, actdef, msg, respond ) {
    actdef.action.call( instance, msg, respond )
  }
}
