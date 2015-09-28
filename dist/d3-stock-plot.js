'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _d3 = require('d3');

var d3 = _interopRequireWildcard(_d3);

var DEFAULTS = {
    margin: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 20
    },
    width: 960,
    height: 500
};

var Renderer = (function () {
    function Renderer(el, opts) {
        _classCallCheck(this, Renderer);

        this.el(el);
        this._config = opts;
    }

    _createClass(Renderer, [{
        key: '_calculateGraphDimensions',
        value: function _calculateGraphDimensions() {
            return [this.width() - this.margin().left - this.margin().right, this.height() - this.margin().top - this.margin().bottom];
        }
    }, {
        key: 'el',
        value: function el() {
            var value = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

            if (typeof value !== 'undefined') {
                this._el = value;
                return this;
            }
            return this._el;
        }
    }, {
        key: 'margin',
        value: function margin() {
            var value = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

            if (typeof value !== 'undefined') {
                this._config.margin = value;
                return this;
            }
            return this._config.margin;
        }
    }, {
        key: 'width',
        value: function width() {
            var value = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

            if (typeof value !== 'undefined') {
                this._config.width = value;
                return this;
            }
            return this._config.width;
        }
    }, {
        key: 'height',
        value: function height() {
            var value = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

            if (typeof value !== 'undefined') {
                this._config.height = value;
                return this;
            }
            return this._config.height;
        }
    }, {
        key: 'data',
        value: function data() {
            var value = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

            if (typeof value !== 'undefined') {
                this._data = value;
                return this;
            }
            return this._data;
        }
    }, {
        key: 'render',
        value: function render(_ref) {
            var _ref$el = _ref.el;
            var el = _ref$el === undefined ? undefined : _ref$el;
            var _ref$data = _ref.data;
            var data = _ref$data === undefined ? undefined : _ref$data;
            var _ref$margin = _ref.margin;
            var margin = _ref$margin === undefined ? undefined : _ref$margin;
            var _ref$width = _ref.width;
            var width = _ref$width === undefined ? undefined : _ref$width;
            var _ref$height = _ref.height;
            var height = _ref$height === undefined ? undefined : _ref$height;

            typeof width !== 'undefined' && this.width(width);
            typeof height !== 'undefined' && this.height(height);
            typeof margin !== 'undefined' && this.margin(margin);
            typeof el !== 'undefined' && this.el(el);
            typeof data !== 'undefined' && this.data(data);

            el = this.el();
            if (!el) {
                throw new Error('"el" required.');
            }

            data = this.data();
            if (!data) {
                throw new Error('"data" required.');
            }

            var _calculateGraphDimensions2 = this._calculateGraphDimensions();

            var _calculateGraphDimensions22 = _slicedToArray(_calculateGraphDimensions2, 2);

            width = _calculateGraphDimensions22[0];
            height = _calculateGraphDimensions22[1];

            if (typeof width === 'undefined') {
                throw new Error('"width" required.');
            }
            if (typeof height === 'undefined') {
                throw new Error('"height" required.');
            }

            var n = data.length;
            var x = d3.scale.linear().range([0, width]);
            var y = d3.scale.linear().range([height, 0]);
            var color = d3.scale.category10();
            var xAxis = d3.svg.axis().scale(x).orient("bottom");
            var yAxis = d3.svg.axis().scale(y).orient("left");
            var returnX = function returnX(d) {
                return x(d.x);
            };
            var returnColor = function returnColor(d) {
                return color(d.state);
            };

            var svg = d3.select(this.el()).append("svg").attr('class', 'd3-stock-plot').attr("width", this.width()).attr("height", this.height()).append("g").attr("transform", "translate(" + this.margin().left + "," + this.margin().top + ")");

            x.domain([0, n]);

            svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

            svg.append("g").attr("class", "y axis").call(yAxis);

            var points = svg.selectAll(".point").data(data).enter();

            points.append("line").attr("x1", returnX).attr("x2", returnX).attr("y1", function (d) {
                return y(d.c0);
            }).attr("y2", function (d) {
                return y(d.c1);
            }).style("stroke-width", 1).style("stroke", returnColor).style("fill", "none");

            points.append("circle").attr("class", "dot").attr("r", 3.5).attr("cx", returnX).attr("cy", function (d) {
                return y(d.y);
            }).style("fill", returnColor);
        }
    }]);

    return Renderer;
})();

function D3StockPlot() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref2$el = _ref2.el;
    var el = _ref2$el === undefined ? undefined : _ref2$el;
    var _ref2$opts = _ref2.opts;
    var opts = _ref2$opts === undefined ? DEFAULTS : _ref2$opts;

    return new Renderer(el, opts);
}

D3StockPlot.DEFAULTS = DEFAULTS;

exports['default'] = D3StockPlot;
module.exports = exports['default'];
