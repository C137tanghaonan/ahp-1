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
      editing: false
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
    var keys = ['name', 'alternatives', 'criteria', 'compare-criteria', 'compare-alternatives', 'result'],
      content_html; 
    // nav
    keys.forEach(function (key) { 
      if (ahp.model.decision.ready( key )) {  
        markReady( key );
      }
      if (ahp.model.decision.done( key )) {  
        markDone( key );
      }      
    });
    markCurrent( stateMap.nav_current );
    
    // content
    switch(stateMap.nav_current) {
      case 'name':
        if (! stateMap.editing) {
          content_html =  '<input type="text" value="'+ ahp.model.decision.get_name() +'" class="edit"/>';
          content_html += '<input type="button" value="Edit" class="ahp-shell-main-content-submit edit"/>';
        } else {
          content_html =  '<input type="text" value="'+ ahp.model.decision.get_name() +'" class="update"/>';
          content_html += '<input type="button" value="Update" class="ahp-shell-main-content-submit update"/>';
        }        
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
    
    $( ".ahp-shell-main-content-submit" ).click(function() {
      if ($(this).hasClass("update")) {
        ahp.model.decision.set_name($( ".ahp-shell-main-content input" ).val());
      }
      stateMap.editing =  ! stateMap.editing;        
      $(window).trigger( 'statechange' );
      return false;
    });
    
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
        stateMap.editing = false;        
        $(window).trigger( 'statechange' );
      }
      return false;
    });
    
    stateMap.nav_current = 'name';

    $(window)
      .bind( 'statechange', onStatechange )
      .trigger( 'statechange' );
      
  };
  // End Public method /initModule/

  return { initModule : initModule };
  //------------------- END PUBLIC METHODS ---------------------
}());
