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
  //   * ready( key )
  //   * done( key )
 

  decision = (function () {
    var get_name, 
        get_alternatives, add_alternative,
        get_criteria, add_criterion, 
        ready, done;
    
    get_name = function () { return stateMap.name; };
    get_alternatives = function () { return stateMap.alternatives; };
    get_criteria     = function () { return stateMap.criteria; };
    add_alternative  = function ( item ) { stateMap.alternatives.push( item ); };
    add_criterion    = function ( item ) { stateMap.criteria.push( item ); };
    
    ready = function ( key ) {
      var out = false;
      switch(key) {
        case 'name':
          out = true;
          break;
        case 'alternatives':
          if (done('name')) { out = true };
          break;
        case 'criteria':
          if (done('alternatives')) { out = true };
          break;
        case 'compare-criteria':
          if (done('criteria')) { out = true };
          break;  
        case 'compare-alternatives':
          if (done('criteria') && done('alternatives')) { out = true };
          break;    
        case 'result':
          if (done('result')) { out = true };
          break; 
      }    
      return(out);  
    }
    
    done = function ( key ) {
      var out = false;
      switch(key) {
        case 'name':
          if (stateMap.name != null) { out = true };
          break;
        case 'alternatives':
          if (stateMap.alternatives.length > 1) { out = true };
          break;
        case 'criteria':
          if (stateMap.criteria.length > 1) { out = true };
          break;
        case 'compare-criteria':
          // 
          break;  
        case 'compare-alternatives':
          //
          break;    
        case 'result':
          //
          break;    
      }        
      return(out);  
    }
    
    return {
      get_name         : get_name,
      get_alternatives : get_alternatives,
      get_criteria     : get_criteria,
      add_alternative  : add_alternative,
      add_criterion    : add_criterion,
      ready            : ready,
      done             : done
    };
  }());
  

  initModule = function () {

  };

  return {
    initModule : initModule,
    decision   : decision
  };
}());