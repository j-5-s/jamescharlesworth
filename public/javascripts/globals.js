/*globals app, Backbone, $, resize*/
// Filename: router.js
define([
	'jQuery',
	'Underscore'
], function( $, _ ){
	
	var globals = {};

	globals.pageWidth = $(window).width();
	globals.pageHeight = $(window).height();

	return globals;
});