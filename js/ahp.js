/*
 * ahp.js
 * Root namespace module
*/

/*jslint           browser : true,   continue : true,
  devel  : true,    indent : 2,       maxerr  : 50,
  newcap : true,     nomen : true,   plusplus : true,
  regexp : true,    sloppy : true,       vars : false,
  white  : true
*/
/*global $, ahp */

var ahp = (function () {
  var initModule = function ( $container ) {
    ahp.shell.initModule( $container );
  };

  return { initModule: initModule };
}());
