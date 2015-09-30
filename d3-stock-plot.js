'use strict';

var d3 = require( 'd3' );
var _ = require( 'lodash' );
var chainable = require( 'chainable-object' );

var DEFAULTS = {
    margin: {
        top: 30,
        right: 30,
        left: 30,
        bottom: 30
    },
    el: false,
    data: false,
    ratio: 0.5,
    hitmargin: 4,
    debug: false
};

function convertToNumber( value ){
    return Number( value );
}

function Renderer( opts ){
    this.values( opts );
}

chainable( Renderer.prototype, DEFAULTS );

Renderer.prototype.render = function render( opts ){
    this.values( opts );
    
    if( !this.el() ){
        throw new Error( '"el" required.' );
    }
    if( !this.data() ){
        throw new Error( '"data" required.' );
    }

    var el = d3.select( this.el() );
    var width = parseInt( el.style( 'width' ) );
    var height = this.ratio() * width;
    var gw = width - this.margin().left() - this.margin().right();
    var gh = height - this.margin().top() - this.margin().bottom();
    this._graph = {
        width: gw,
        height: gh,
        x: d3.scale.linear().range( [ 0, gw ] ),
        y: d3.scale.linear().range( [ gh, 0 ] ),
        color: d3.scale.category10()
    };

    var n = _.size( this.data() );
    var xAxis = d3.svg.axis()
        .scale( this._graph.x )
        .orient( "bottom" );
    var yAxis = d3.svg.axis()
        .scale( this._graph.y )
        .orient( "left" );
    this._graph.content = el
        .append( "svg" )
        .attr( 'class', 'd3-stock-plot' )
        .attr( "width", width )
        .attr( "height", height )
        .append( "g" )
        .attr( "transform", "translate(" + this.margin().left() + "," + this.margin().top() + ")" );

    this._graph.x.domain( [ 0, n ] );

    this._graph.content.append( "g" )
        .attr( "class", "x axis" )
        .attr( "transform", "translate(0," + this._graph.height + ")" )
        .call( xAxis );

    this._graph.content.append( "g" )
        .attr( "class", "y axis" )
        .call( yAxis );

    this.update();
};

Renderer.prototype.update = function update( data ){
    var _this = this;

    function returnX( d ){
        return _this._graph.x( d.x );
    }

    function returnColor( d ){
        return _this._graph.color( d.state );
    }

    data = (data)
        ? this.data( data )
        : this.data();

    var values = this._graph.content.selectAll( "values" )
        .data( data ).enter()
        .append( "g" )
        .attr( 'class', 'stock-value' )
        .attr( 'id', function( d ){
            return "v" + d.id;
        } )
        .on( 'mouseover', function( d ){
            d3.select( '#v' + d.id + " .point" )
                .transition().duration( 250 ).ease( 'cubic-out' ).delay( 0 )
                .attr( 'r', 10 );
        } )
        .on( 'mouseout', function( d ){
            d3.select( '#v' + d.id + " .point" )
                .transition().duration( 500 ).ease( 'cubic-in-out' ).delay( 0 )
                .attr( 'r', 3.5 );
        } )
        ;

    //lines
    values
        .append( "line" )
        .attr( 'class', 'range' )
        .attr( "x1", returnX )
        .attr( "x2", returnX )
        .attr( "y1", function( d ){
            return _this._graph.y( d.y[ 0 ] );
        } )
        .attr( "y2", function( d ){
            return _this._graph.y( d.y[ 2 ] );
        } )
        .style( "stroke-width", 1 )
        .style( "stroke", returnColor )
        .style( "fill", "none" )
    ;

    //circles
    values
        .append( "circle" )
        .attr( "class", "point" )
        .attr( "r", 3.5 )
        .attr( "cx", returnX )
        .attr( "cy", function( d ){
            return _this._graph.y( d.y[ 1 ] );
        } )
        .style( "fill", returnColor )
    ;

    //hit boxes
    values.append( 'rect' )
        .each( function(){
            var bounds = this.parentNode.getBBox();
            d3.select( this )
                .attr( {
                    'class': 'hitbox',
                    x: bounds.x - _this.hitmargin(),
                    y: bounds.y - _this.hitmargin(),
                    width: bounds.width + (_this.hitmargin() * 2),
                    height: bounds.height + (_this.hitmargin() * 2)
                } )
                .style( 'fill', 'rgba(0,0,0,' + (_this.debug()
                        ? '0.3'
                        : '0' )
                    + ')' )
            ;
        } );
};

module.exports = function D3StockPlot( opts ){
    return new Renderer( opts || DEFAULTS );
};

module.exports.DEFAULTS = DEFAULTS;
