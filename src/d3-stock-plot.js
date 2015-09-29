import * as d3 from 'd3';
import * as _ from 'lodash';
import chainable from 'chainable-object';

const DEFAULTS = {
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

class Renderer {
    constructor( opts = {} ){
        chainable( this, _.defaults( opts, DEFAULTS ) );
    }

    _calculateGraphDimensions(){
        return [
            this.width() - this.margin().left() - this.margin().right(),
            this.height() - this.margin().top() - this.margin().bottom()
        ]
    }

    render( {el= undefined, data= undefined, margin=undefined, width=undefined, height=undefined} ){
        for( let [key, value] of Object.entries( arguments[ 0 ] ) ){
            this[ key ]( value );
        }

        el = this.el();
        if( !el ){
            throw new Error( '"el" required.' );
        }

        data = this.data();
        if( !data ){
            throw new Error( '"data" required.' );
        }

        [ width, height ] = this._calculateGraphDimensions();

        const n = _.size( data );
        const x = d3.scale.linear().range( [ 0, width ] );
        const y = d3.scale.linear().range( [ height, 0 ] );
        const color = d3.scale.category10();
        const xAxis = d3.svg.axis()
            .scale( x )
            .orient( "bottom" );
        const yAxis = d3.svg.axis()
            .scale( y )
            .orient( "left" );
        const returnX = function( d ){
            return x( d.x );
        };
        const returnColor = function( d ){
            return color( d.state );
        };

        const svg = d3.select( this.el() )
            .append( "svg" )
            .attr( 'class', 'd3-stock-plot' )
            .attr( "width", this.width() )
            .attr( "height", this.height() )
            .append( "g" )
            .attr( "transform", "translate(" + this.margin().left() + "," + this.margin().top() + ")" );

        x.domain( [ 0, n ] );

        svg.append( "g" )
            .attr( "class", "x axis" )
            .attr( "transform", "translate(0," + height + ")" )
            .call( xAxis );

        svg.append( "g" )
            .attr( "class", "y axis" )
            .call( yAxis );

        var values = svg.selectAll( "values" )
            .data( data ).enter();

        values
            .append( "line" )
            .attr('class', 'range')
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
    }
}

function D3StockPlot( opts = DEFAULTS ){
    return new Renderer( opts );
}

D3StockPlot.DEFAULTS = DEFAULTS;

export default D3StockPlot;