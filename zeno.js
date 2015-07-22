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
    action_executor:   default_executor,
    action_subscriber: default_subscriber,
    response_handler:  default_response_handler,
    log:              _.noop
  }, options )


  self.act_patrun = patrun()


  self.add = function zeno_add() {
    var spec    = self.pattern.apply( self, arguments )
    var pattern = clean( spec )
    var action  = arguments[arguments.length - 1]
    var issub   = spec.sub$

    var prior = self.act_patrun.find( pattern, true )

    if( prior && issub ) {
      prior.sub.push( action )
    }
    else {
      self.act_patrun.add( pattern, {
        pattern: pattern,
        action:  issub ? _.noop : action,
        prior:   prior,
        sub:     issub ? [action] : []
      })
    }

    options.log({
      type:    issub ? 'sub' : 'add',
      pattern: pattern,
      action:  action.name
    })

    return self
  }


  self.act = function zeno_act() {
    var msg     = self.pattern.apply( self, arguments )
    var respond = arguments[arguments.length - 1]

    respond = _.isFunction( respond ) ? respond : _.noop

    var actdef = self.act_patrun.find( clean(msg) )

    if( actdef ) {
      call_act( self, actdef, msg, respond )
      call_sub( self, actdef, msg )
    }

    return self
  }


  self.find = function zeno_find() {
    var pattern = self.pattern.apply( self, arguments )

    return self.act_patrun.find( clean(pattern) )
  }


  self.list = function zeno_list() {
    var pattern = self.pattern.apply( self, arguments )

    return _.map( self.act_patrun.list( clean(pattern) ), function( entry ) {
      return entry.data
    })
  }


  self.tree = function zeno_tree() {
    var pattern = self.pattern.apply( self, arguments )
    var tree    = {}

    _.each( self.act_patrun.list( clean(pattern) ), function(entry) {
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


  function call_act( instance, actdef, msg, respond ) {
    if( _.noop === actdef.action ) return;

    var responder = options.response_handler( instance, actdef, msg, respond )

    options.log({
      time:    Date.now(),
      type:    'act',
      case:    'in',
      pattern: actdef.pattern,
      action:  actdef.action.name,
      data:    msg
    })

    var delegate = Object.create( instance )
    delegate.prior = function( prior_msg, prior_respond ) {
      if( actdef.prior ) {
        call_act( delegate, actdef.prior, prior_msg, prior_respond )
      }
      else prior_respond()
    }

    options.action_executor( delegate, actdef, msg, function call_res() {
      // normalize err argument to null if there's no error
      var err = (!!arguments[0] ? arguments[0] : null)

      options.log({
        time:    Date.now(),
        type:    'act',
        case:    (err ? 'err' : 'out'),
        pattern: actdef.pattern,
        action:  actdef.action.name,
        data:    arguments[1],
        error:   err
      })

      responder.apply( self, arguments )
    })
  }


  function call_sub( instance, actdef, msg ) {
    for(var i = 0; i < actdef.sub.length; i++ ) {
      options.log({
        time:    Date.now(),
        type:    'pub',
        pattern: actdef.pattern,
        sub:     actdef.sub[i].name,
        data:    msg
      })

      options.action_subscriber( instance, actdef, actdef.sub[i], msg )
    }
  }


  function default_executor( instance, actdef, msg, responder ) {
    actdef.action.call( instance, msg, responder )
  }


  function default_response_handler( instance, actdef, msg, respond ) {
    return function() {
      respond.apply( instance, arguments )
    }
  }


  function default_subscriber( instance, actdef, sub, msg ) {
    sub.call( instance, msg )
  }


  function clean( msg ) {
    return _.omit( msg, function( v, n ) {
      return ~n.indexOf('$')
    })
  }
}
