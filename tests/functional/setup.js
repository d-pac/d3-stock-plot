'use strict';

var _ = require('lodash');
var stockplot = require('../../d3-stock-plot');
var data = require( '../fixtures/data' );
var $ = require('jquery');

data = _.map(data, function(d){
   return {
       x: d.x,
       y: [ d.c0, d.y, d.c1 ],
       selected: false,
       id: d.x
   } 
});

var el = $('#preview')[0];
var graph = stockplot();
graph.render({
    el: el,
    data: data
});
