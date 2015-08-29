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
            + '<div class="ahp-shell-main-nav-link" id="ahp-shell-main-nav-name">'
              + 'Name'
              + '<div class="ahp-shell-main-nav-link-done"></div>'
            + '</div>'
            + '<div class="ahp-shell-main-nav-link" id="ahp-shell-main-nav-alternatives">'
              + 'Alternatives'
              + '<div class="ahp-shell-main-nav-link-done"></div>'
            + '</div>'            
            + '<div class="ahp-shell-main-nav-link" id="ahp-shell-main-nav-criteria">'
              + 'Criteria'
              + '<div class="ahp-shell-main-nav-link-done"></div>'
            + '</div>'
            + '<div class="ahp-shell-main-nav-link" id="ahp-shell-main-nav-compare-criteria">'
              + 'Compare criteria'
              + '<div class="ahp-shell-main-nav-link-done"></div>'
            + '</div>'
            + '<div class="ahp-shell-main-nav-link" id="ahp-shell-main-nav-compare-alternatives">'
              + 'Compare alternatives'
              + '<div class="ahp-shell-main-nav-link-done"></div>'
            + '</div>'            
            + '<div class="ahp-shell-main-nav-link" id="ahp-shell-main-nav-result">'
              + 'Result'
              + '<div class="ahp-shell-main-nav-link-done"></div>'
            + '</div>'            
          + '</div>'
          + '<div class="ahp-shell-main-content"></div>'
        + '</div>'
        + '<div class="ahp-shell-foot"></div>'
    },
    stateMap  = {
      $container  : null,
      nav_current : null, 
      nav_ready   : [],
      nav_done    : []
    },
    
    markReady, markDone, markCurrent, 
    navFullName, navKey,
    onStatechange, initModule;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //-------------------- BEGIN UTILITY METHODS -----------------
  navFullName = function (key) {
    return "#ahp-shell-main-nav-".concat(key);
  }
  navKey = function (fullname) {
    return fullname.replace("ahp-shell-main-nav-", "");
  }
  //--------------------- END UTILITY METHODS ------------------

  //--------------------- BEGIN DOM METHODS --------------------
  markReady = function (key) {
    $( navFullName(key) ).addClass( "ready" );
    return false;
  }
  markDone = function (key) {
    markReady( key );
    $( navFullName(key) ).children().show();
    return false;
  }
  markCurrent = function (key) {
    markReady( key );
    $( ".ahp-shell-main-nav-link" ).removeClass( "current" );
    $( navFullName(key) ).addClass( "current" );
    return false;
  }
  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  onStatechange = function ( event ) {
    var content_html;
    // nav
    stateMap.nav_ready.forEach(function (key) { 
      markReady( key ); 
    })
    stateMap.nav_done.forEach(function (key) { 
      markDone( key ); 
    })
    markCurrent( stateMap.nav_current );
    
    // content
    switch(stateMap.nav_current) {
      case 'name':
        content_html = ahp.model.decision.get_name();
        break;
      case 'alternatives':
        content_html = ahp.model.decision.get_alternatives().join('<br />');
        break;
      case 'criteria':
        content_html = ahp.model.decision.get_criteria().join('<br />');
        break;
      default :
        content_html = '';
    } 
    $( ".ahp-shell-main-content" ).html(content_html);
    
    return false;
  }
  //-------------------- END EVENT HANDLERS --------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin Public method /initModule/
  initModule = function ( $container ) {
    stateMap.$container = $container;
    $container.html( configMap.main_html );
    
    $( ".ahp-shell-main-nav-link" ).click(function() {
      if ($(this).hasClass("ready")) {
        stateMap.nav_current = navKey(this.id);     
        $(window).trigger( 'statechange' );
      }
      return false;
    });
    
    stateMap.nav_ready = ["name", "result"];  
    stateMap.nav_done = ["criteria"];       // test
    stateMap.nav_current = "alternatives";  // test 

    $(window)
      .bind( 'statechange', onStatechange )
      .trigger( 'statechange' );
      
  };
  // End Public method /initModule/

  return { initModule : initModule };
  //------------------- END PUBLIC METHODS ---------------------
}());
