/*
 * ahp.shell.js
 * Shell module for ahp
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, ahp */

ahp.shell = (function () {
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      main_html : String()
        + '<div class="ahp-shell-head"></div>'
        + '<div class="ahp-shell-main">'
          + '<div class="ahp-shell-main-nav">'
            + '<div class="ahp-shell-main-nav-link" id="ahp-shell-main-nav-name"></div>'
            + '<div class="ahp-shell-main-nav-link" id="ahp-shell-main-nav-alternatives"></div>'
            + '<div class="ahp-shell-main-nav-link" id="ahp-shell-main-nav-criteria"></div>'
            + '<div class="ahp-shell-main-nav-link" id="ahp-shell-main-nav-compare-criteria"></div>'
            + '<div class="ahp-shell-main-nav-link" id="ahp-shell-main-nav-compare-alternatives"></div>'
            + '<div class="ahp-shell-main-nav-link" id="ahp-shell-main-nav-result"></div>'
          + '</div>'
          + '<div class="ahp-shell-main-content"></div>'
        + '</div>'
        + '<div class="ahp-shell-foot"></div>'
    },
    stateMap  = {
      $container  : null,
      nav_current : null,
      nav_map     : {  // 0 - not ready, 1 - ready, 2 - done
        'name'                 : 0,
        'alternatives'         : 0,
        'criteria'             : 0,
        'compare-criteria'     : 0,
        'compare-alternatives' : 0,
        'result'               : 0
      }
    },
    
    onStatechange, initModule;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //-------------------- BEGIN UTILITY METHODS -----------------
  //--------------------- END UTILITY METHODS ------------------

  //--------------------- BEGIN DOM METHODS --------------------
  markReady = function (key) {
    $( "#ahp-shell-main-nav-".concat(key) ).addClass( "ready" );
    return false;
  }
  markCurrent = function (key) {
    $( ".ahp-shell-main-nav-link" ).removeClass( "current" );
    $( "#ahp-shell-main-nav-".concat(key) ).addClass( "current" );
    return false;
  }
  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  onStatechange = function ( event ) {
    // mark ready
    Object.keys(stateMap.nav_map).forEach(function (key) { 
      if (stateMap.nav_map[key] == 1) {
        markReady ( key );
      }  
    })
    // mark current
    markCurrent ( stateMap.nav_current );
    
    return false;
  }
  //-------------------- END EVENT HANDLERS --------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin Public method /initModule/
  initModule = function ( $container ) {
    stateMap.$container = $container;
    $container.html( configMap.main_html );
    
    $( ".ahp-shell-main-nav-link" ).bind( "click", function() {
      stateMap.nav_current = this.id.replace("ahp-shell-main-nav-", ""); 
      $(window).trigger( 'statechange' );
      return false;
    });
    
    stateMap.nav_map["name"] = 1;  
    stateMap.nav_map["result"] = 1;         // test 
    stateMap.nav_current = "alternatives";  // test 

    $(window)
      .bind( 'statechange', onStatechange )
      .trigger( 'statechange' );
      
  };
  // End Public method /initModule/

  return { initModule : initModule };
  //------------------- END PUBLIC METHODS ---------------------
}());
