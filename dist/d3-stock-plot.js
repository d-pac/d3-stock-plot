'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _d3 = require('d3');

var d3 = _interopRequireWildcard(_d3);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _chainableObject = require('chainable-object');

var _chainableObject2 = _interopRequireDefault(_chainableObject);

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

function convertToNumber(value) {
    return Number(value);
}

var Renderer = (function () {
    function Renderer() {
        var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Renderer);

        (0, _chainableObject2['default'])(this, _.defaults(opts, DEFAULTS));
    }

    _createClass(Renderer, [{
        key: '_calculateGraphDimensions',
        value: function _calculateGraphDimensions() {
            return [this.width() - this.margin().left() - this.margin().right(), this.height() - this.margin().top() - this.margin().bottom()];
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
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(arguments[0])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2);

                    var key = _step$value[0];
                    var value = _step$value[1];

                    this[key](value);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

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

            var n = _.size(data);
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

            var svg = d3.select(this.el()).append("svg").attr('class', 'd3-stock-plot').attr("width", this.width()).attr("height", this.height()).append("g").attr("transform", "translate(" + this.margin().left() + "," + this.margin().top() + ")");

            x.domain([0, n]);

            svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

            svg.append("g").attr("class", "y axis").call(yAxis);

            var values = svg.selectAll("values").data(data).enter();

            values.append("line").attr('class', 'range').attr("x1", returnX).attr("x2", returnX).attr("y1", function (d) {
                return y(d.c0);
            }).attr("y2", function (d) {
                return y(d.c1);
            }).style("stroke-width", 1).style("stroke", returnColor).style("fill", "none");

            values.append("circle").attr("class", "point").attr("r", 3.5).attr("cx", returnX).attr("cy", function (d) {
                return y(d.y);
            }).style("fill", returnColor);
        }
    }]);

    return Renderer;
})();

function D3StockPlot() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? DEFAULTS : arguments[0];

    return new Renderer(opts);
}

D3StockPlot.DEFAULTS = DEFAULTS;

exports['default'] = D3StockPlot;
module.exports = exports['default'];
