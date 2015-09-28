import 'd3';

export const DEFAULTS = {
    margin: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 20
    },
    width: 960,
    height: 500
};

class Renderer {
    constructor( el,
                 opts ){
        this.el( el );
        this._config = opts;
    }

    _calculateGraphDimensions(){
        return [
            this.width() - this.margin().left - this.margin().right,
            this.height() - this.margin().top - this.margin().bottom
        ]
    }

    el( value = undefined ){
        if( typeof value !== 'undefined' ){
            this._el = value;
            return this;
        }
        return this._el;
    }

    margin( value = undefined ){
        if( typeof value !== 'undefined' ){
            this._config.margin = value;
            return this;
        }
        return this._config.margin;
    }

    width( value = undefined ){
        if( typeof value !== 'undefined' ){
            this._config.width = value;
            return this;
        }
        return this._config.width;
    }

    height( value = undefined ){
        if( typeof value !== 'undefined' ){
            this._config.height = value;
            return this;
        }
        return this._config.height;
    }

    render( data ){
        const [width, height] = this._calculateGraphDimensions();

        const n = data.length;
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

        const svg = d3.select( this.el() ).append( "svg" )
            .attr( "width", this.width() )
            .attr( "height", this.height() )
            .append( "g" )
            .attr( "transform", "translate(" + this.margin().left + "," + this.margin().top + ")" );

        x.domain( [ 0, n ] );

        svg.append( "g" )
            .attr( "class", "x axis" )
            .attr( "transform", "translate(0," + height + ")" )
            .call( xAxis );

        svg.append( "g" )
            .attr( "class", "y axis" )
            .call( yAxis );

        var points = svg.selectAll( ".point" )
            .data( data ).enter();

        points
            .append( "line" )
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

        points
            .append( "circle" )
            .attr( "class", "dot" )
            .attr( "r", 3.5 )
            .attr( "cx", returnX )
            .attr( "cy", function( d ){
                return y( d.y );
            } )
            .style( "fill", returnColor );
    }
}

export default function( {el= undefined, opts= DEFAULTS} ){
    return new Renderer( el, opts );
}