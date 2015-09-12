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
      current_nav : null,
      current_item: null
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
  getPairs = function ( len ) {
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
      item, item1, val,
      i, j, i1, i2, 
      div_v, div_e; 
    // nav
    keys.forEach(function (key) { 
      if (ahp.model.decision.ready( key )) {  
        markReady( key );
      }
      if (ahp.model.decision.done( key )) {  
        markDone( key );
      }      
    });
    markCurrent( stateMap.current_nav );
    
    // content
    switch(stateMap.current_nav) {
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
        if ( item == '' ) { stateMap.current_item = "0";}
        if (stateMap.current_item != null) { 
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
        if (stateMap.current_item != null) { 
          div_v = "#v"+stateMap.current_item;
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
        if (stateMap.current_item != null) { 
          div_v = "#v"+stateMap.current_item;
          div_e = div_v.replace("v","e"); 
          $(".view").not(div_v).show();
          $(div_e).show();
          $(".view .ahp-shell-main-content-submit").prop('disabled', true);
        } else {
          $(".view").show();
        }
        break;
      case 'compare-criteria':
        (getPairs(ahp.model.decision.get_criteria().length)).forEach(function (item) {
          div_e = 'e' + item;
          div_v = 'v' + item;
          i1 = item.split('_')[0];
          i2 = item.split('_')[1];
          content_html += '<div class="edit" id="'+ div_e +'">';
          content_html += '<table><tr>';
          content_html += '<th colspan="4" align="left">'  + ahp.model.decision.get_criteria()[i1] + '</th>';
          content_html += '<td></td>'
          content_html += '<th colspan="4" align="right">' + ahp.model.decision.get_criteria()[i2] + '</th>';
          content_html += '</tr><tr>';
          [9,7,5,3,1,3,5,7,9].forEach(function (item1, j) {
            (j <= 4) ? val = item1 : val = '1/'+ item1;
            if (ahp.model.decision.get_compare_criteria()[item] == val) {
              content_html += '<td><input type="radio" name="c'+ item +'" value="'+ val +'" checked></td>';
            } else {
              content_html += '<td><input type="radio" name="c'+ item +'" value="'+ val +'"></td>';
            }
          });
          content_html += '</tr><tr>';
          [9,7,5,3,1,3,5,7,9].forEach(function (item1) {
            content_html += '<td>'+ item1 +'</td>';
          });
          content_html += '</tr></table>' 
          content_html += '<input type="button" value="Update" class="ahp-shell-main-content-submit"/>';
          content_html += '</div>';
          content_html += '<div class="view" id="'+ div_v +'">';
          content_html += '<label>'+ ahp.model.decision.get_criteria()[i1] + ' vs ' + ahp.model.decision.get_criteria()[i2] +'('+ahp.model.decision.get_compare_criteria()[item] +  ') </label>';
          content_html += '<input type="button" value="Edit"   class="ahp-shell-main-content-submit"/>';
          content_html += '</div><br/><br/><br/>';
        });
        $( ".ahp-shell-main-content" ).html(content_html);
        if (stateMap.current_item != null) { 
          div_v = "#v"+stateMap.current_item;
          div_e = div_v.replace("v","e"); 
          $(".view").not(div_v).show();
          $(div_e).show();
          $(".view .ahp-shell-main-content-submit").prop('disabled', true);
        } else {
          $(".view").show();
        }
        break;
      case 'compare-alternatives':
        ahp.model.decision.get_criteria().forEach(function (citem, i) {
          (getPairs(ahp.model.decision.get_alternatives().length)).forEach(function (item) {
            div_e = 'e' + i + '_' + item;
            div_v = 'v' + i + '_' + item;
            i1 = item.split('_')[0];
            i2 = item.split('_')[1];
            content_html += '<div class="edit" id="'+ div_e +'">';
            content_html += '<table><tr>';
            content_html += '<th colspan="4" align="left">'  + ahp.model.decision.get_alternatives()[i1] + '</th>';
            content_html += '<td></td>'
            content_html += '<th colspan="4" align="right">' + ahp.model.decision.get_alternatives()[i2] + '</th>';
            content_html += '</tr><tr>';
            [9,7,5,3,1,3,5,7,9].forEach(function (item1, j) {
              (j <= 4) ? val = item1 : val = '1/'+ item1;
              if (ahp.model.decision.get_compare_alternatives( i )[item] == val) {
                content_html += '<td><input type="radio" name="c'+ item +'" value="'+ val +'" checked></td>';
              } else {
                content_html += '<td><input type="radio" name="c'+ item +'" value="'+ val +'"></td>';
              }
            });
            content_html += '</tr><tr>';
            [9,7,5,3,1,3,5,7,9].forEach(function (item1) {
              content_html += '<td>'+ item1 +'</td>';
            });
            content_html += '</tr></table>' 
            content_html += '<input type="button" value="Update" class="ahp-shell-main-content-submit"/>';
            content_html += '</div>';
            content_html += '<div class="view" id="'+ div_v +'">';
            content_html += '<label>'+ citem + ': ' +ahp.model.decision.get_alternatives()[i1] + ' vs ' + ahp.model.decision.get_alternatives()[i2] +'('+ahp.model.decision.get_compare_alternatives( i )[item] + ') </label>';
            content_html += '<input type="button" value="Edit"   class="ahp-shell-main-content-submit"/>';
            content_html += '</div><br/><br/><br/>';
          });
        });
        $( ".ahp-shell-main-content" ).html(content_html);
        if (stateMap.current_item != null) { 
          div_v = "#v"+stateMap.current_item;
          div_e = div_v.replace("v","e"); 
          $(".view").not(div_v).show();
          $(div_e).show();
          $(".view .ahp-shell-main-content-submit").prop('disabled', true);
        } else {
          $(".view").show();
        }
    } 


    
    $( ".ahp-shell-main-content-submit" ).click(function() {
      if ($(this).parent().hasClass("view")) {
         stateMap.current_item = this.parentNode.id.substr(1);
      } else if ($(this).hasClass("delete")) {
        if (! confirm("Are you sure?")) {
           return false;
        } else { 
          switch(stateMap.current_nav) {         
            case 'alternatives':
              ahp.model.decision.set_alternative( null, stateMap.current_item );
              break;        
            case 'criteria':
              ahp.model.decision.set_criterion( null, stateMap.current_item );
              break;
          }
          stateMap.current_item = null;          
        }
      } else {
        div_v = "#v"+stateMap.current_item;
        div_e = div_v.replace("v","e");
        
        if (stateMap.current_nav == 'name' || stateMap.current_nav == 'criteria' || stateMap.current_nav == 'alternatives') {
          item = $(div_e +" input[type=text]" ).val().trim();
          if (item == "") {
            // better yet $(div_e +" .error_msg")
            $(".error_msg").text("should be a non-empty string");
            $(".error_msg").show(); 
            return false;
          }
          switch(stateMap.current_nav) {
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
              ahp.model.decision.set_alternative( item, stateMap.current_item );
              break;        
            case 'criteria':
              if (ahp.model.decision.get_criteria().indexOf(item) > -1)
              {
                $(".error_msg").text("already exists");
                $(".error_msg").show(); 
                return false;
              }
              ahp.model.decision.set_criterion( item, stateMap.current_item );
              break;             
          }    
        } else if (stateMap.current_nav == 'compare-criteria') {
          item = $(div_e +" input[type=radio]:checked" ).val();
          ahp.model.decision.set_compare_criteria( item, stateMap.current_item );
        } else if (stateMap.current_nav == 'compare-alternatives') {
          item = $(div_e +" input[type=radio]:checked" ).val();
          var c = stateMap.current_item.split('_')[0]; 
          var pair = stateMap.current_item.substr(c.length+1);
          ahp.model.decision.set_compare_alternatives( item, c, pair );
        }
        stateMap.current_item = null;
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
        stateMap.current_nav = navKey(this.id); 
        stateMap.current_item = null;        
        $(window).trigger( 'statechange' );
      }
      return false;
    });
    
    stateMap.current_nav = 'name';

    $(window)
      .bind( 'statechange', onStatechange )
      .trigger( 'statechange' );
      
  };
  // End Public method /initModule/

  return { initModule : initModule };
  //------------------- END PUBLIC METHODS ---------------------
}());
