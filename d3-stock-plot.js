var d3 = require( 'd3' );
var _ = require( 'lodash' );
var chainable = require( 'chainable-object' );

var DEFAULTS = {
    margin: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 20
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
    if(opts){
        Object.keys( opts ).forEach( function( key ){
            this[ key ]( opts[ key ] );
        }, this );
    }
    var el = this.el();
    if( !el ){
        throw new Error( '"el" required.' );
    }

    var data = this.data();
    if( !data ){
        throw new Error( '"data" required.' );
    }

    var graph = this._calculateGraphDimensions();

    var n = _.size( data );
    var x = d3.scale.linear().range( [ 0, graph.width ] );
    var y = d3.scale.linear().range( [ graph.height, 0 ] );
    var color = d3.scale.category10();
    var xAxis = d3.svg.axis()
        .scale( x )
        .orient( "bottom" );
    var yAxis = d3.svg.axis()
        .scale( y )
        .orient( "left" );
    var returnX = function( d ){
        return x( d.x );
    };
    var returnColor = function( d ){
        return color( d.state );
    };

    var svg = d3.select( this.el() )
        .append( "svg" )
        .attr( 'class', 'd3-stock-plot' )
        .attr( "width", this.width() )
        .attr( "height", this.height() )
        .append( "g" )
        .attr( "transform", "translate(" + this.margin().left() + "," + this.margin().top() + ")" );

    x.domain( [ 0, n ] );

    svg.append( "g" )
        .attr( "class", "x axis" )
        .attr( "transform", "translate(0," + graph.height + ")" )
        .call( xAxis );

    svg.append( "g" )
        .attr( "class", "y axis" )
        .call( yAxis );

    var values = svg.selectAll( "values" )
        .data( data ).enter();

    values
        .append( "line" )
        .attr( 'class', 'range' )
        .attr( "x1", returnX )
        .attr( "x2", returnX )
        .attr( "y1", function( d ){
            return y( d.c0 );
        } )
        .attr( "y2", function( d ){
            return y( d.c1 );
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
            return y( d.y );
        } )
        .style( "fill", returnColor );
};

module.exports = function D3StockPlot( opts ){
    return new Renderer( opts || DEFAULTS );
};

module.exports.DEFAULTS = DEFAULTS;
