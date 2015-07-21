/* Copyright (c) 2015 Richard Rodger, MIT License */
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
    action_executor:  default_executor,
    response_handler: default_response_handler,
    log:              null
  }, options )


  self.act_patrun = patrun()


  self.add = function zeno_add() {
    ;var i=0,args=Array(arguments.length);// eslint-disable-line
    ;for(;i<args.length;i++)args[i]=arguments[i]// eslint-disable-line

    var pattern = self.pattern.apply( self, args )
    var action  = _.last( args )

    var actdef = {
      pattern: pattern,
      action:  action
    }

    self.act_patrun.add( pattern, actdef )

    self.log( { type:'add', pattern:pattern } )

    return self
  }


  self.act = function zeno_act() {
    ;var i=0,args=Array(arguments.length);// eslint-disable-line
    ;for(;i<args.length;i++)args[i]=arguments[i]// eslint-disable-line

    var msg     = self.pattern.apply( self, args )
    var respond = _.last( args )

    respond = _.isFunction( respond ) ? respond : _.noop

    var actdef = self.act_patrun.find( msg )

    if( actdef ) {
      var responder = options.response_handler( self, actdef, msg, respond )

      self.log( { type:'act', case:'in', pattern:actdef.pattern, data:msg } )
      options.action_executor( self, actdef, msg, responder )
    }

    return self
  }


  self.find = function zeno_find() {
    ;var i=0,args=Array(arguments.length);// eslint-disable-line
    ;for(;i<args.length;i++)args[i]=arguments[i]// eslint-disable-line

    var pattern = self.pattern.apply( self, args )

    return self.act_patrun.find( pattern )
  }


  self.list = function zeno_list() {
    ;var i=0,args=Array(arguments.length);// eslint-disable-line
    ;for(;i<args.length;i++)args[i]=arguments[i]// eslint-disable-line

    var pattern = self.pattern.apply( self, args )

    return _.map( self.act_patrun.list( pattern ), function( entry ) {
      return entry.data
    })
  }


  self.tree = function zeno_tree() {
    ;var i=0,args=Array(arguments.length);// eslint-disable-line
    ;for(;i<args.length;i++)args[i]=arguments[i]// eslint-disable-line

    var pattern = self.pattern.apply( self, args )
    var tree    = {}

    _.each( self.act_patrun.list( pattern ), function(entry) {
      var cur = tree, n

      _.each( entry.match, function( v, k ) {
        n = k + ':' + v
        cur = cur[n] ? cur[n] : (cur[n] = {})
      })

      cur._ = self.act_patrun.find(entry.match)
    })

    return tree
  }


  self.pattern = function zeno_pattern() {
    ;var i=0,args=Array(arguments.length);// eslint-disable-line
    ;for(;i<args.length;i++)args[i]=arguments[i]// eslint-disable-line

    for( i = 0; i < args.length; i++ ) {
      if( _.isString( args[i] ) ) {
        args[i] = jsonic( args[i] )
      }
      else if( !_.isPlainObject( args[i] ) ) {
        args[i] = null
      }
    }

    return _.extend.apply( null, args )
  }


  self.log = function zeno_log( entry ) {
    if( options.log ) {
      entry
        = _.isPlainObject(entry) ? entry
        : _.isFunction( entry ) ? entry()
        : { value:entry }

      entry.time = Date.now()
      options.log( entry )
    }
    return self
  }


  function default_executor( instance, actdef, msg, responder ) {
    actdef.action.call( instance, msg, responder )
  }


  function default_response_handler( instance, actdef, msg, respond ) {
    return function() {
      ;var i=0,args=Array(arguments.length);// eslint-disable-line
      ;for(;i<args.length;i++)args[i]=arguments[i]// eslint-disable-line

      // normalize err argument to null if there's no error
      args[0] = !!args[0] ? args[0] : null

      self.log( { type:'act', case:'out',
                  pattern:actdef.pattern, data:args[1] } )
      respond.apply( instance, args )
    }
  }
}
