require('./style.css');
import d3 from "./d3";
import util from './util';
import colorbrewer from './colorbrewer';

var chart = {}; // hack to fix d3 losing prototype functions

var TwitchChart = function(el, selectedCallback, rootChangeCallback) {
  this.selectedCallback = typeof selectedCallback === 'function' ? selectedCallback : function(d) {};
  this.rootChangeCallback = typeof rootChangeCallback === 'function' ? rootChangeCallback : function(d) {};
  this.state = {};
  // this.chart = {};
  this.isMobile = util.isMobile();
  this.init(el);
};

TwitchChart.prototype.init = function(el) {
  // var chart = this.chart;

  chart.wrapper = el || chart.wrapper;

  var parentEl = chart.wrapper.parentNode;
  var parentDim = Math.min(parentEl.offsetWidth, parentEl.offsetHeight);
  chart.width = parentDim;
  chart.height = parentDim;
  chart.radius = parentDim / 2;

  // set up x / y scale vars for zoom
  chart.x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

  chart.y = d3.scale.sqrt()
    .range([0, chart.radius]);

  // make `colors` an ordinal scale
  chart.colors = chart.colors || d3.scale.ordinal()
    .range(colorbrewer.Spectral[11]);

  chart.visWrapper = (chart.visWrapper || d3.select(chart.wrapper).append('svg:svg'))
      .attr('class', 'chart')
      .attr('width', chart.width)
      .attr('height', chart.height);

  chart.vis = (chart.vis || chart.visWrapper.append('svg:g'))
      .attr('id', 'container')
      .attr('transform', 'translate(' + chart.width / 2 + ',' + chart.height / 2 + ')');

  chart.partition = (chart.partition || d3.layout.partition())
      .value(function(d) { return d.viewers; });

  chart.arc = (chart.arc || d3.svg.arc())
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, chart.x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, chart.x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, chart.y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, chart.y(d.y + d.dy)); });

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  chart.bounds = (chart.bounds || chart.vis.append('svg:circle'))
      .attr('r', chart.radius)
      .style('opacity', 0);

};

TwitchChart.prototype.build = function(chartData) {
  // var chart = this.chart;

  // Keep track of current root
  this.state.root = chartData;

  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = chart.partition.nodes(this.state.root);

  var uniqueNames = (function(a) {
      var output = [];
      a.forEach(function(d) {
          if (output.indexOf(d.name) === -1) {
              output.push(d.name);
          }
      });
      return output;
  })(nodes);

  // set domain of colors scale based on data
  chart.colors.domain(uniqueNames);

  chart.path = chart.vis
    .data([chartData])
    .selectAll('path')
    .data(nodes);

  // clear existing chart if there is one
  chart.path.exit()
    .remove();

  chart.path
    .enter()
    .append('svg:path')
    .on('mouseover', this.mouseoverHandler.bind(this))
    // .on('click', this.clickHandler.bind(this)) // TODO: re-enable when we have channels
    .each(function(d) {
      // Setup for switching data: stash the old values for transition.
      d.x0 = d.x;
      d.dx0 = d.dx;
    });

  chart.path
    .order()
    .attr('display', function(d) { return d.depth ? null : 'none'; })
    .attr('d', chart.arc)
    .attr('fill-rule', 'evenodd')
    .attr('class', function(d) { return d.type; })
    .style('fill', function(d) { return chart.colors(d.type === 'channel' ? d.parent.name : d.name); });

  // Add the mouseleave handler to the bounding circle.
  chart.vis.on('mouseleave', this.mouseleaveHandler.bind(this));
};

TwitchChart.prototype.setCurrentNode = function(d) {
  // var chart = this.chart;

  // remove node instead of attempting to set to undefined
  if (!d) {
    this.removeCurrentNode();
    return;
  }

  // Update current chart data
  if (this.state.current !== d)
  this.state.current = d;
  this.state.currentGame = (d.type === 'channel') ? d.parent : d;

  // Then highlight only those that are an ancestor of the current segment.
  var sequenceArray = this.getAncestors(d);
  chart.visWrapper
    .classed('active', true)
    .selectAll('path')
      .classed('current', false)
      .filter(function(node) {
        var isDirectlyActive = sequenceArray.indexOf(node) >= 0;
        var isChildOfActive = sequenceArray.indexOf(node.parent) >= 0;
        var isActive = d.type === 'channel' ? isDirectlyActive : (isDirectlyActive || isChildOfActive);
        return isActive;
      })
      .classed('current', true);
};

TwitchChart.prototype.removeCurrentNode = function() {
  // var chart = this.chart;

  // If we are zoomed, default to current game
  if (this.state.zoomed) {
    this.state.current = this.state.currentGame;
    return;
  }

  // Unset current chart data
  this.state.current = null;
  this.state.currentGame = null;

  // Transition each segment to full opacity and then reactivate it.
  chart.visWrapper
    .classed('active', false)
    .selectAll('path')
      .classed('current', false);
};

// Fade all but the current sequence
TwitchChart.prototype.mouseoverHandler = function(d) {
  this.setCurrentNode(d);
  this.selectedCallback(this.state.current);
}

// Restore everything to full opacity when moving off the visualization.
TwitchChart.prototype.mouseleaveHandler = function(d) {
  this.removeCurrentNode();
  this.selectedCallback(this.state.current);
}

TwitchChart.prototype.clickHandler = function(d) {
  // var chart = this.chart;

  if (util.isMobile()) {

    // double tap for desktop action
    if ((d.type === 'channel' || d.type === 'game') && d !== chart.activeMobile) {
      chart.activeMobile = d;
      return;
    }

  }

  if (d.type === 'channel') {
    window.open(d.url);
    return;
  }

  this.state.root = this.state.root === d && d.parent ? d.parent : d;
  var zooming = this.state.root.type != 'root';
  clearTimeout(chart.zoomTimeout);
  this.state.zoomed = zooming;
  chart.zoomTimeout = setTimeout(function() {
    chart.visWrapper
      .classed('zoomed', zooming);
  }, zooming ? 0 : 800);
  chart.path.transition()
    .duration(1000)
    .attrTween("d", this.arcTweenZoom(this.state.root));

  this.rootChangeCallback(this.state.root)
}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
TwitchChart.prototype.getAncestors = function(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

// When zooming: interpolate the scales.
TwitchChart.prototype.arcTweenZoom = function(d) {
  // var chart = this.chart;

  var xd = d3.interpolate(chart.x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(chart.y.domain(), [d.y, 1])
      // yr = d3.interpolate(chart.y.range(), [d.y ? 20 : 0, chart.radius]);
  return function(d, i) {
    return i
        ? function(t) { return chart.arc(d); }
        : function(t) { chart.x.domain(xd(t)); chart.y.domain(yd(t)); return chart.arc(d); };
  };
};


export default TwitchChart;
