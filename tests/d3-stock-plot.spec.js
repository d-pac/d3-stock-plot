'use strict';

var expect = require( 'must' );
var jsdom = require( 'jsdom' );

var subject = require( '../dist/d3-stock-plot' );
var fixtures = require( './fixtures' );

describe( 'D3 stock plot component', function(){
    var document, $;
    before( function( done ){
        jsdom.env( '<html><head><title></title></head><body></body></html>',
            [ "http://code.jquery.com/jquery.js" ],
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
            [ 'margin', 'width', 'height' ].forEach( function( propName ){
                expect( subject.DEFAULTS ).to.have.property( propName );
            } );
        } );
        describe( '()', function(){
            var renderer;
            beforeEach( function(){
                renderer = subject();
            } );
            it( 'should create a renderer', function(){
                expect( renderer ).to.be.an.object();
                [ 'render', 'margin', 'width', 'height' ].forEach( function( propName ){
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
            } );
        } );
    } )
} );