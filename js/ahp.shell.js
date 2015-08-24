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
            + '<div class="ahp-shell-main-nav-link ahp-shell-main-nav-name"></div>'
            + '<div class="ahp-shell-main-nav-link ahp-shell-main-nav-alternatives"></div>'
            + '<div class="ahp-shell-main-nav-link ahp-shell-main-nav-criteria"></div>'
            + '<div class="ahp-shell-main-nav-link ahp-shell-main-nav-compare-criteria"></div>'
            + '<div class="ahp-shell-main-nav-link ahp-shell-main-nav-compare-alternatives"></div>'
            + '<div class="ahp-shell-main-nav-link ahp-shell-main-nav-result"></div>'
          + '</div>'
          + '<div class="ahp-shell-main-content"></div>'
        + '</div>'
        + '<div class="ahp-shell-foot"></div>'
    },
    initModule;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //-------------------- BEGIN UTILITY METHODS -----------------
  //--------------------- END UTILITY METHODS ------------------

  //--------------------- BEGIN DOM METHODS --------------------
  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  //-------------------- END EVENT HANDLERS --------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin Public method /initModule/
  initModule = function ( $container ) {
    $container.html( configMap.main_html );
    
    $( ".ahp-shell-main-nav-link" ).bind( "click", function() {
      $( ".ahp-shell-main-nav-link" ).removeClass( "current" );
      $( this ).addClass( "current" );
    });
    
  };
  // End Public method /initModule/

  return { initModule : initModule };
  //------------------- END PUBLIC METHODS ---------------------
}());
