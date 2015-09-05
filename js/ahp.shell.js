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
      editing: null
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
      content_html = '',
      item, i, div_v, div_e; 
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
        item = ahp.model.decision.get_name();
        content_html += '<div class="edit" id="e0">';
        content_html += '<input type="text" value="'+ item +'"/>';
        content_html += '<input type="button" value="Update" class="ahp-shell-main-content-submit"/>';
        content_html += '</div>';
        content_html += '<div class="view" id="v0">';
        content_html += '<label>'+ item +'</label>';
        content_html += '<input type="button" value="Edit"   class="ahp-shell-main-content-submit"/>';
        content_html += '</div>';
        $( ".ahp-shell-main-content" ).html(content_html);
        if (stateMap.editing != null) { 
          $(".view").hide();
        } else {
          $(".edit").hide();
        }  
        break;
      case 'alternatives':
        ahp.model.decision.get_alternatives().forEach(function (item, i) {
          div_e = 'e' + i;
          div_v = 'v' + i;
          content_html += '<div class="edit" id="'+ div_e +'">';
          content_html += '<input type="text" value="'+ item +'"/>';
          content_html += '<input type="button" value="Update" class="ahp-shell-main-content-submit"/>';
          content_html += '</div>';
          content_html += '<div class="view" id="'+ div_v +'">';
          content_html += '<label>'+ item +'</label>';
          content_html += '<input type="button" value="Edit"   class="ahp-shell-main-content-submit"/>';
          content_html += '</div><br/><br/>';
        }); 
        div_e = 'e' + (i+1);
        div_v = 'v' + (i+1);
        content_html += '<div class="edit" id="'+ div_e +'">';
        content_html += '<input type="text" value="'+ item +'"/>';
        content_html += '<input type="button" value="Update" class="ahp-shell-main-content-submit"/>';
        content_html += '</div>';
        content_html += '<div class="add" id="'+ div_v +'">';
        content_html += '<label></label>';
        content_html += '<input type="button" value="Add"   class="ahp-shell-main-content-submit"/>';
        content_html += '</div>';
        
        $( ".ahp-shell-main-content" ).html(content_html);
        if (stateMap.editing != null) { 
          div_v = "#"+stateMap.editing;
          div_e = div_v.replace("v","e"); 
          $(div_v).hide();
          $(".edit").not(div_e).hide();
          $(".view .ahp-shell-main-content-submit").prop('disabled', true);
          $(".add .ahp-shell-main-content-submit").prop('disabled', true);
        } else {
          $(".view").show();
          $(".add").show();
          $(".edit").hide();
        }
        break;
      case 'criteria':
        ahp.model.decision.get_criteria().forEach(function (item, i) {
          div_e = 'e' + i;
          div_v = 'v' + i;
          content_html += '<div class="edit" id="'+ div_e +'">';
          content_html += '<input type="text" value="'+ item +'"/>';
          content_html += '<input type="button" value="Update" class="ahp-shell-main-content-submit"/>';
          content_html += '</div>';
          content_html += '<div class="view" id="'+ div_v +'">';
          content_html += '<label>'+ item +'</label>';
          content_html += '<input type="button" value="Edit"   class="ahp-shell-main-content-submit"/>';
          content_html += '</div><br/><br/>';
          $( ".ahp-shell-main-content" ).html(content_html);
        });
        if (stateMap.editing != null) { 
          div_v = "#"+stateMap.editing;
          div_e = div_v.replace("v","e"); 
          $(div_v).hide();
          $(".edit").not(div_e).hide();
          $(".view .ahp-shell-main-content-submit").prop('disabled', true);
        } else {
          $(".view").show();
          $(".edit").hide();
        }
        break;
      default :
        content_html = '';
    } 

    

    
    $( ".ahp-shell-main-content-submit" ).click(function() {
      if ($(this).parent().hasClass("view") || $(this).parent().hasClass("add") ) {
         stateMap.editing = this.parentNode.id;
      } else {
        div_v = "#"+stateMap.editing;
        div_e = div_v.replace("v","e");
        item = $(div_e +" input[type=text]" ).val();
        i = stateMap.editing.substring(1,2);
        switch(stateMap.nav_current) {
          case 'name':
            ahp.model.decision.set_name( item );
            break;
          case 'alternatives':
            ahp.model.decision.set_alternative( item, i );
            break;        
          case 'criteria':
            ahp.model.decision.set_criterion( item, i );
            break;             
        }    
        stateMap.editing = null;
      } 
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
        stateMap.editing = null;        
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
