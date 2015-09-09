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
      name             : 'Decision',
      alternatives     : ['Alternative 1', 'Alternative 2'],
      criteria         : ['Criterion 1', 'Criterion 2', 'Criterion 3'],
      compare_criteria : {'0_0':'5', '0_1':'1/5', '0_2':'9', '1_2':'1/7'}
    },

    decision, initModule;
    
  // The decision object API
  // ---------------------
  // The decision object is available at ahp.model.decision
  // Public methods:
  //   * get_name()
  //   * get_alternatives()
  //   * set_alternative( item, i )
  //   * get_criteria()
  //   * set_criterion( item, i )
  //   * get_compare_criteria()
  //   * set_compare_criteria( item, i )
  //   * ready( key )
  //   * done( key )
 

  decision = (function () {
    var get_name, set_name,
        get_alternatives, set_alternative,
        get_criteria, set_criterion, 
        get_compare_criteria, set_compare_criteria,
        ready, done;
    
    get_name = function () { return stateMap.name; };
    set_name = function ( item ) { stateMap.name = item };
    
    get_alternatives = function () { return stateMap.alternatives; };
    set_alternative  = function ( item, i ) { 
      if (i < stateMap.alternatives.length) {
        if (item != null) {
          stateMap.alternatives[i] = item;
        } else {
          stateMap.alternatives.splice(i, 1);
        }
      } else {
        stateMap.alternatives.push( item ); 
      }
    };
    
    get_criteria  = function () { return stateMap.criteria; };
    set_criterion = function ( item, i ) { 
      if (i < stateMap.criteria.length) {
        if (item != null) {
          stateMap.criteria[i] = item;
        } else {
          stateMap.criteria.splice(i, 1);
        }
      } else {
        stateMap.criteria.push( item ); 
      }
    };
    
    get_compare_criteria  = function () { return stateMap.compare_criteria; };
    set_compare_criteria = function ( item, i ) {
      stateMap.compare_criteria[i] = item;
    };
    
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
          if (stateMap.name != '') { out = true };
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
      get_name             : get_name,
      set_name             : set_name,
      get_alternatives     : get_alternatives,
      set_alternative      : set_alternative,
      get_criteria         : get_criteria,
      set_criterion        : set_criterion,
      get_compare_criteria : get_compare_criteria,
      set_compare_criteria : set_compare_criteria,
      ready                : ready,
      done                 : done
    };
  }());
  

  initModule = function () {

  };

  return {
    initModule : initModule,
    decision   : decision
  };
}());