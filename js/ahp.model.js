/*
 * ahp.model.js
 * Model module
*/

/*jslint browser : true, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : false,
white : true
*/

/*global $, ahp */
ahp.model = (function () {
  'use strict';
  var
    configMap = { },
    stateMap  = {
      name         : 'Decision',
      alternatives : ['Alternative 1', 'Alternative 2'],
      criteria     : ['Criterion 1', 'Criterion 2', 'Criterion 3']
    },

    decision, initModule;
    
  // The decision object API
  // ---------------------
  // The decision object is available at ahp.model.decision
  // Public methods:
  //   * get_name()
  //   * get_alternatives()
  //   * get_criteria()
  //   * add_alternative( item )
  //   * add_criterion( item )
 

  decision = (function () {
    var get_name, get_alternatives, get_criteria, add_alternative, add_criterion;
    
    get_name = function () { return stateMap.name; };
    get_alternatives = function () { return stateMap.alternatives; };
    get_criteria     = function () { return stateMap.criteria; };
    add_alternative  = function ( item ) { stateMap.alternatives.push( item ); };
    add_criterion    = function ( item ) { stateMap.criteria.push( item ); };
    
    return {
      get_name         : get_name,
      get_alternatives : get_alternatives,
      get_criteria     : get_criteria,
      add_alternative  : add_alternative,
      add_criterion    : add_criterion,
    };
  }());
  

  initModule = function () {

  };

  return {
    initModule : initModule,
    decision   : decision
  };
}());