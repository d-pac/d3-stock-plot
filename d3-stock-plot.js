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
    width: 960,
    height: 500,
    el: false,
    data: false
};

function convertToNumber( value ){
    return Number( value );
}

function Renderer( opts ){
    chainable( this, _.defaults( opts || {}, DEFAULTS ) );
}

Renderer.prototype._calculateGraphDimensions = function _calculateGraphDimensions(){
    return {
        width: this.width() - this.margin().left() - this.margin().right(),
        height: this.height() - this.margin().top() - this.margin().bottom()
    }
};

Renderer.prototype.render = function render( opts ){
    if( opts ){
        Object.keys( opts ).forEach( function( key ){
            this[ key ]( opts[ key ] );
        }, this );
    }
    if( !this.el() ){
        throw new Error( '"el" required.' );
    }
    if( !this.data() ){
        throw new Error( '"data" required.' );
    }

    var gd = this._calculateGraphDimensions();
    this._graph = {
        width: gd.width,
        height: gd.height,
        x: d3.scale.linear().range( [ 0, gd.width ] ),
        y: d3.scale.linear().range( [ gd.height, 0 ] ),
        color: d3.scale.category10()
    };

    var n = _.size( this.data() );
    var xAxis = d3.svg.axis()
        .scale( this._graph.x )
        .orient( "bottom" );
    var yAxis = d3.svg.axis()
        .scale( this._graph.y )
        .orient( "left" );
    this._graph.content = d3.select( this.el() )
        .append( "svg" )
        .attr( 'class', 'd3-stock-plot' )
        .attr( "width", this.width() )
        .attr( "height", this.height() )
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
                .attr( 'r', 7 );
        } )
        .on( 'mouseout', function( d ){
            d3.select( '#v' + d.id + " .point" )
                .transition().duration( 500 ).ease( 'cubic-in-out' ).delay( 0 )
                .attr( 'r', 3.5 );
        } );

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
        .style( "fill", "none" );

    values
        .append( "circle" )
        .attr( "class", "point" )
        .attr( "r", 3.5 )
        .attr( "cx", returnX )
        .attr( "cy", function( d ){
            return _this._graph.y( d.y[ 1 ] );
        } )
        .style( "fill", returnColor );
};

module.exports = function D3StockPlot( opts ){
    return new Renderer( opts || DEFAULTS );
};

module.exports.DEFAULTS = DEFAULTS;
