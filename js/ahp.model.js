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
      name                 : 'Decision',
      alternatives         : ['Alternative 1', 'Alternative 2'],
      criteria             : ['Criterion 1', 'Criterion 2', 'Criterion 3'],
      compare_criteria     : {'0_1':'1/5', '0_2':'9', '1_2':'1/7'},
      compare_alternatives : {'0_0_1':'1/5', '1_0_1':'7'}
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
  //   * get_compare_alternatives()
  //   * set_compare_alternatives( item, i )
  //   * criteria_weights()
  //   * alternative_weights( c )
  //   * result_weights()
  //   * ready( key )
  //   * done( key )
 

  decision = (function () {
    var get_name,                 set_name,
        get_alternatives,         set_alternative,
        get_criteria,             set_criterion, 
        get_compare_criteria,     set_compare_criteria,
        get_compare_alternatives, set_compare_alternatives,
        criteria_weights,         alternative_weights, 
        result_weights,           
        compare_criteria_matrix,  compare_alternatives_matrix,
        eigenvector,              normalize,
        ready,                    done;
    
    get_name = function () { return stateMap.name; };
    set_name = function ( item ) { stateMap.name = item };
    
    get_alternatives = function () { return stateMap.alternatives; };
    set_alternative  = function ( item, i ) { 
      var n1, n2;
      if (i < stateMap.alternatives.length) {
        if (item != null) {
          stateMap.alternatives[i] = item;
        } else {
        alert(Object.keys(stateMap.compare_alternatives))
          // modify compare_alternatives first: delete & shift
          for (var c = 0; c < stateMap.criteria.length; c++) {
            for (var i1 = 0; i1 < stateMap.alternatives.length; i1++) {
              for (var i2 = i1+1; i2 < stateMap.alternatives.length; i2++) {
                if (stateMap.compare_alternatives[c+'_'+i1+'_'+i2]) {
                  if (i1 < i) {
                    if (i2 == i) {
                      delete stateMap.compare_alternatives[c+'_'+i1+'_'+i2];
                    } else if (i2 > i) {
                      stateMap.compare_alternatives[c+'_'+i1+'_'+(i2-1)] = stateMap.compare_alternatives[c+'_'+i1+'_'+i2];
                      delete stateMap.compare_alternatives[c+'_'+i1+'_'+i2];
                    }                
                  } else if (i1 == i) {
                    delete stateMap.compare_alternatives[c+'_'+i1+'_'+i2];
                  } else if (i1 > i) {
                    stateMap.compare_alternatives[c+'_'+(i1-1)+'_'+(i2-1)] = stateMap.compare_alternatives[c+'_'+i1+'_'+i2];
                    delete stateMap.compare_alternatives[c+'_'+i1+'_'+i2];
                  }   
                }                
              }
            }  
          }    
          alert(Object.keys(stateMap.compare_alternatives))
          // delete element
          stateMap.alternatives.splice(i, 1);
        }
      } else {
        stateMap.alternatives.push( item ); 
      }
    };
    
    get_criteria  = function () { return stateMap.criteria; };
    set_criterion = function ( item, i ) { 
      var n1, n2;
      if (i < stateMap.criteria.length) {
        if (item != null) {
          stateMap.criteria[i] = item;
        } else {
          // modify compare_criteria first: delete & shift
          for (var i1 = 0; i1 < stateMap.criteria.length; i1++) {
            for (var i2 = i1+1; i2 < stateMap.criteria.length; i2++) {
              if (stateMap.compare_criteria[i1+'_'+i2] != null) {
                if (i1 < i) {
                  if (i2 == i) {
                    delete stateMap.compare_criteria[i1+'_'+i2];
                  } else if (i2 > i) {
                    stateMap.compare_criteria[i1+'_'+(i2-1)] = stateMap.compare_criteria[i1+'_'+i2];
                    delete stateMap.compare_criteria[i1+'_'+i2];
                  }                
                } else if (i1 == i) {
                  delete stateMap.compare_criteria[i1+'_'+i2];
                } else if (i1 > i) {
                  stateMap.compare_criteria[(i1-1)+'_'+(i2-1)] = stateMap.compare_criteria[i1+'_'+i2];
                  delete stateMap.compare_criteria[i1+'_'+i2];
                }  
              }              
            }
          }            
          // delete element
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
    
    get_compare_alternatives  = function () { return stateMap.compare_alternatives; };
    set_compare_alternatives = function ( item, i ) {
      stateMap.compare_alternatives[i] = item;
    };
    
    criteria_weights = function () {
      return normalize( eigenvector (compare_criteria_matrix()));
    };
    
    alternative_weights = function ( c ) {
      return normalize( eigenvector( compare_alternatives_matrix( c )));
    };
    
    result_weights = function () {
      var out = [], sum;
      stateMap.alternatives.forEach(function (aitem, i) {
        sum = 0;
        stateMap.criteria.forEach(function (citem, j) {
          sum += criteria_weights()[j] * alternative_weights(j)[i];
        });
        out.push(sum);
      });
      return normalize( out );
    }
    
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
          if (done('criteria') && done('alternatives') && done('compare-criteria')) { out = true };
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
          var n = stateMap.criteria.length;
          out = (Object.keys(stateMap.compare_criteria).length == Math.round(n*(n - 1)/2)); 
          break;  
        case 'compare-alternatives':
          var n = stateMap.alternatives.length;
          out = (Object.keys(stateMap.compare_alternatives).length == stateMap.criteria.length * Math.round(n*(n - 1)/2) );
          break;    
        case 'result':
          out = done('compare-criteria') && done('compare-alternatives');
          break;    
      }        
      return(out);  
    }
    
// internal functions
    compare_criteria_matrix = function () {
      var len = stateMap.criteria.length, 
          out = [], i, j;
      for (i = 0; i < len; i++) {
        out[i] = [];
        for (j = 0; j < len; j++) {
          if (stateMap.compare_criteria[i+'_'+j] != null){
            out[i][j] = eval(stateMap.compare_criteria[i+'_'+j]);
          } else if (i == j) {
            out[i][j] = 1;
          } else {
            out[i][j] = 1/out[j][i];
          }
        }
      }
      return out;      
    }
    
    compare_alternatives_matrix = function ( c ) {
      var len = stateMap.alternatives.length, 
          out = [], i, j;
      for (i = 0; i < len; i++) {
        out[i] = [];
        for (j = 0; j < len; j++) {
          if (stateMap.compare_alternatives[c+'_'+i+'_'+j] != null){
            out[i][j] = eval(stateMap.compare_alternatives[c+'_'+i+'_'+j]);
          } else if (i == j) {
            out[i][j] = 1;
          } else {
            out[i][j] = 1/out[j][i];
          }
        }
      }
      return out;      
    }

    eigenvector = function ( ar ) {
      var len = ar.length, out = [], i, j;
      for (i = 0; i < len; i++) {
        out[i] = 1;
        for (j = 0; j < len; j++) {
          out[i] *= ar[i][j];
        }
        out[i] = Math.pow(out[i], 1/len);
      }
      return out;
    }

    normalize = function ( ar ) {
      var sum = 0;
      ar.forEach(function (item) {
        sum += item;
      });
      if (sum != 0) {
        ar.forEach(function (item, i) {
          ar[i] = item / sum;
        });
      }
      return ar;
    }
// end internal functions        
    
    return {
      get_name                 : get_name,
      set_name                 : set_name,
      get_alternatives         : get_alternatives,
      set_alternative          : set_alternative,
      get_criteria             : get_criteria,
      set_criterion            : set_criterion,
      get_compare_criteria     : get_compare_criteria,
      set_compare_criteria     : set_compare_criteria,
      get_compare_alternatives : get_compare_alternatives,
      set_compare_alternatives : set_compare_alternatives,
      criteria_weights         : criteria_weights,
      alternative_weights      : alternative_weights,
      result_weights           : result_weights,
      ready                    : ready,
      done                     : done
    };
  }());
  

  initModule = function () {

  };

  return {
    initModule : initModule,
    decision   : decision
  };
}());