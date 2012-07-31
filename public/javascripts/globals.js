/*globals app, Backbone, $, resize*/
// Filename: router.js
define([
	'jQuery',
	'Underscore'
], function( $, _ ){
	
	var globals = {};

	globals.pageWidth = $(window).width();
	globals.pageHeight = $(window).height();
	globals.footerHeight = 110;
	globals.headerHeight = 90;
	globals.screenContentHeight = globals.pageHeight - globals.footerHeight - globals.headerHeight;


	return globals;
});