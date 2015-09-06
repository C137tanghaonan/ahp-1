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
  // input: len (array length)
  // output: a set of labels for pairwise comparisons 
  // 1 -> empty
  // 2 -> 0_1
  // 3 -> 0_1,0_2,1_2
  // 4 -> 0_1,0_2,0_3,1_2,1_3,2_3   
  screen_labels = function ( len ) {
    var out = [], i, j;
    for (i = 0; i < len; i++) {
      for (j = i + 1; j < len; j++) {
        out.push( i + "_" + j );
      }
    }
    return out;
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
        content_html += '<label class="error_msg"></label>';
        content_html += '</div>';
        content_html += '<div class="view" id="v0">';
        content_html += '<label>'+ item +'</label>';
        content_html += '<input type="button" value="Edit"   class="ahp-shell-main-content-submit"/>';
        content_html += '</div>';
        $( ".ahp-shell-main-content" ).html(content_html);
        if ( item == '' ) { stateMap.editing = "0";}
        if (stateMap.editing != null) { 
          $(".edit").show();
        } else {
          $(".view").show();
        }  
        break;
      case 'alternatives':
        ahp.model.decision.get_alternatives().forEach(function (item, i) {
          div_e = 'e' + i;
          div_v = 'v' + i;
          content_html += '<div class="edit" id="'+ div_e +'">';
          content_html += '<input type="text" value="'+ item +'"/>';
          content_html += '<input type="button" value="Update" class="ahp-shell-main-content-submit"/>';
          content_html += '<input type="button" value="Delete" class="ahp-shell-main-content-submit delete"/>';
          content_html += '<label class="error_msg"></label>';
          content_html += '</div>';
          content_html += '<div class="view" id="'+ div_v +'">';
          content_html += '<label>'+ item +'</label>';
          content_html += '<input type="button" value="Edit"   class="ahp-shell-main-content-submit"/>';
          content_html += '</div><br/><br/>';
        }); 
        div_e = 'e' + (i+1);
        div_v = 'v' + (i+1);
        content_html += '<div class="edit" id="'+ div_e +'">';
        content_html += '<input type="text" value=""/>';
        content_html += '<input type="button" value="Update" class="ahp-shell-main-content-submit"/>';
        content_html += '<label class="error_msg"></label>';
        content_html += '</div>';
        content_html += '<div class="view" id="'+ div_v +'">';
        content_html += '<label></label>';
        content_html += '<input type="button" value="Add"   class="ahp-shell-main-content-submit add"/>';
        content_html += '</div>';
        $( ".ahp-shell-main-content" ).html(content_html);
        if (stateMap.editing != null) { 
          div_v = "#v"+stateMap.editing;
          div_e = div_v.replace("v","e"); 
          $(".view").not(div_v).show();
          $(div_e).show();
          $(".view .ahp-shell-main-content-submit").prop('disabled', true);
        } else {
          $(".view").show();
        }
        break;
      case 'criteria':
        ahp.model.decision.get_criteria().forEach(function (item, i) {
          div_e = 'e' + i;
          div_v = 'v' + i;
          content_html += '<div class="edit" id="'+ div_e +'">';
          content_html += '<input type="text" value="'+ item +'"/>';
          content_html += '<input type="button" value="Update" class="ahp-shell-main-content-submit"/>';
          content_html += '<input type="button" value="Delete" class="ahp-shell-main-content-submit delete"/>';
          content_html += '<label class="error_msg"></label>';
          content_html += '</div>';
          content_html += '<div class="view" id="'+ div_v +'">';
          content_html += '<label>'+ item +'</label>';
          content_html += '<input type="button" value="Edit"   class="ahp-shell-main-content-submit"/>';
          content_html += '</div><br/><br/>';
        });
        div_e = 'e' + (i+1);
        div_v = 'v' + (i+1);
        content_html += '<div class="edit" id="'+ div_e +'">';
        content_html += '<input type="text" value=""/>';
        content_html += '<input type="button" value="Update" class="ahp-shell-main-content-submit"/>';
        content_html += '<label class="error_msg"></label>';
        content_html += '</div>';
        content_html += '<div class="view" id="'+ div_v +'">';
        content_html += '<label></label>';
        content_html += '<input type="button" value="Add"   class="ahp-shell-main-content-submit add"/>';
        content_html += '</div>';
        $( ".ahp-shell-main-content" ).html(content_html);
        if (stateMap.editing != null) { 
          div_v = "#v"+stateMap.editing;
          div_e = div_v.replace("v","e"); 
          $(".view").not(div_v).show();
          $(div_e).show();
          $(".view .ahp-shell-main-content-submit").prop('disabled', true);
        } else {
          $(".view").show();
        }
        break;
      case 'compare-criteria':
        content_html += '<ul>';
        (screen_labels(ahp.model.decision.get_criteria().length)).forEach(function (item, i) {
          content_html += '<li>' + item + '</li>';
        });
        content_html += '</ul>';
        $( ".ahp-shell-main-content" ).html(content_html);
        break;
      case 'compare-alternatives':
        $( ".ahp-shell-main-content" ).html(content_html);
    } 


    
    $( ".ahp-shell-main-content-submit" ).click(function() {
      if ($(this).parent().hasClass("view")) {
         stateMap.editing = this.parentNode.id.substr(1);
      } else if ($(this).hasClass("delete")) {
        if (! confirm("Are you sure?")) {
           return false;
        } else { 
          switch(stateMap.nav_current) {         
            case 'alternatives':
              ahp.model.decision.set_alternative( null, stateMap.editing );
              break;        
            case 'criteria':
              ahp.model.decision.set_criterion( null, stateMap.editing );
              break;
          }
          stateMap.editing = null;          
        }
      } else {
        div_v = "#v"+stateMap.editing;
        div_e = div_v.replace("v","e");
        item = $(div_e +" input[type=text]" ).val().trim();
        if (item == "") {
          // better yet $(div_e +" .error_msg")
          $(".error_msg").text("should be a non-empty string");
          $(".error_msg").show(); 
          return false;
        }
        switch(stateMap.nav_current) {
          case 'name':
            ahp.model.decision.set_name( item );
            break;
          case 'alternatives':
            if (ahp.model.decision.get_alternatives().indexOf(item) > -1)
            {
              $(".error_msg").text("already exists");
              $(".error_msg").show(); 
              return false;
            }
            ahp.model.decision.set_alternative( item, stateMap.editing );
            break;        
          case 'criteria':
            if (ahp.model.decision.get_criteria().indexOf(item) > -1)
            {
              $(".error_msg").text("already exists");
              $(".error_msg").show(); 
              return false;
            }
            ahp.model.decision.set_criterion( item, stateMap.editing );
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
