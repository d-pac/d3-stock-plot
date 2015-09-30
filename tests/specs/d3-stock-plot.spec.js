'use strict';

var _ = require('lodash');
var expect = require( 'must' );
var jsdom = require( 'jsdom' );
var fs = require( 'fs' );
var path = require( 'path' );

var subject = require( '../../d3-stock-plot' );
var fixtures = require( '../fixtures' );
var jquery = fs.readFileSync( "./node_modules/jquery/dist/jquery.js", "utf-8" );
var html = {
    header: '<html><head><title></title></head><body>',
    footer: '</body></html>'
};

var data = _.map(fixtures.data, function(d){
   return {
       x: d.x,
       y: [ d.c0, d.y, d.c1 ],
       selected: false,
       id: d.x
   } 
});

var API = [ 'render', 'margin', 'ratio', 'el', 'data', 'update' ];

describe( 'D3 stock plot component', function(){
    var document, $;
    before( function( done ){
        jsdom.env( html.header + html.footer,
            { src: [ jquery ] },
            function( err,
                      window ){
                document = window.document;
                $ = window.$;
                done( err );
            } );
    } );

    describe( 'test environment', function(){
        it( 'should be set up correctly', function(){
            expect( document ).not.to.be.undefined();
            expect( $ ).not.to.be.undefined();
        } );
    } );

    describe( 'API', function(){
        it( 'should expose a function', function(){
            expect( subject ).to.be.a.function();
        } );
        it( 'should expose a DEFAULTS object', function(){
            expect( subject.DEFAULTS ).to.be.an.object();
            [ 'margin', 'ratio' ].forEach( function( propName ){
                expect( subject.DEFAULTS ).to.have.property( propName );
            } );
        } );
        describe( '()', function(){
            var renderer;
            beforeEach( function(){
                renderer = subject();
                $( 'body' ).html('');
            } );
            it( 'should create a renderer', function(){
                expect( renderer ).to.be.an.object();
                API.forEach( function( propName ){
                    expect( renderer[ propName ] ).to.be.a.function();
                } );
            } );
            describe( '.render()', function(){
                it( 'should throw if `el` is `undefined`', function(){
                    expect( function(){
                        renderer.render();
                    } ).to.throw( /el/ );
                } );

                it( 'should throw if `data` is `undefined`', function(){
                    expect( function(){
                        renderer.render( { el: document.body } );
                    } ).to.throw( /data/ );
                } );

                it( 'should render the graph correctly', function(){
                    renderer.render( {
                        el: document.body,
                        data: data
                    } );
                    var $svg = $( 'svg.d3-stock-plot' );
                    fs.writeFileSync( path.resolve( './.tmp/' + Date.now() + '.html' ), html.header + $( 'body' ).html() + html.footer );
                    expect( $( 'svg.d3-stock-plot .point' ).length ).to.equal( data.length );
                    expect( $( 'svg.d3-stock-plot .range' ).length ).to.equal( data.length );
                } );
            } );
            describe( '.update()', function(){
                it( 'should render the graph correctly', function(){
                    renderer.render( {
                        el: document.body,
                        data: data
                    } );
                    renderer.update(data);
                    //var $svg = $( 'svg.d3-stock-plot' );
                    fs.writeFileSync( path.resolve( './.tmp/' + Date.now() + '.html' ), html.header + $( 'body' ).html() + html.footer );
                    //expect( Number( $svg.attr( 'width' ) ) ).to.equal( subject.DEFAULTS.width );
                    //expect( Number( $svg.attr( 'height' ) ) ).to.equal( subject.DEFAULTS.height );
                    //expect( $( 'svg.d3-stock-plot .point' ).length ).to.equal( data.length );
                    //expect( $( 'svg.d3-stock-plot .range' ).length ).to.equal( data.length );
                } );
            } );
        } );
    } )
} );