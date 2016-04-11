/*
*	Date: 2016/4/7
*	Author: summer
*	introduce: homework for 360star
*/

;(function(w, d, undefined) {

	var perdefined = {
		'ease': '.25,.1,.25,1',
		'linear': '0,0,1,1',
		'ease-in': '.42,0,1,1',
		'ease-out': '0,0,.58,1',
		'ease-in-out':'.42,0,.58,1'
	};

	//get DOM node

	var canvas = $('#canvas'), 
		ctx = canvas.getContext('2d');   // cavans's context

	var p0 = $('#cp0'),
		p1 = $('#cp1'),
		p2 = $('#cp2'),
		p3 = $('#cp3'),
		current = $('#current'),
		compare = $('#compare'),
		during = $('#during');

	var W = canvas.width,            // cavans's width
		H = canvas.height,           // canvas's height
		ORIGIN = [0, H - H * 0.25],  // canvas's origin
		END = [300, 150];            // canvas's end
	init();

	on(during, 'mousemove', function() {
		$('.during-output')[0].innerHTML = this.value + 's';
	});

	on(canvas, 'click', canvasClickHandler.bind(this));
	
	startDrag(cp1, cp1, function(x, y) {
		var coordinates = [x + 10, y + 10, parseInt(cp2.style.left, 10) + 10, parseInt(cp2.style.top, 10) + 10];
		drawCanvasByCubicBezier(ctx, coordinates, ORIGIN, END, '#000');
		update(coordinates, ORIGIN, END, '#000');
		console.log('start')
	});
	startDrag(cp2, cp2, function(x, y) {
		var coordinates = [parseInt(cp1.style.left, 10) + 10, parseInt(cp1.style.top, 10) + 10, x + 10, y + 10];
		drawCanvasByCubicBezier(ctx, coordinates, ORIGIN, END, '#000');
		update(coordinates, ORIGIN, END, '#000');
	});

	// update the example of result

	function update(a, b, c, color) {
		
	}

	// the handler of canvas click event
	function canvasClickHandler(e) {
		var x = e.offsetX,
			y = e.offsetY,
			cp1_x = parseInt(cp1.style.left, 10),
			cp2_x = parseInt(cp2.style.left, 10),
			cp1_y = parseInt(cp1.style.top, 10),
			cp2_y = parseInt(cp2.style.top, 10),
			distance1 = Math.sqrt(Math.pow(cp1_x - x, 2) + Math.pow(cp1_y - y, 2)),
			distance2 = Math.sqrt(Math.pow(cp2_x - x, 2) + Math.pow(cp2_y - y, 2)),
			cur, coordinates;
		cur = distance2 > distance1 ? cp1 : cp2;
		cur.style.left = x - 10 + 'px';
		cur.style.top = y - 10 + 'px';
		coordinates = cur === cp1 ? [x, y, cp2_x + 10, cp2_y + 10] : [cp1_x + 10, cp1_y + 10, x, y];
		drawCanvasByCubicBezier(ctx, coordinates, ORIGIN, END);
	}

	function init() {
		var coordinates = getCoordinates('0.25,0.1,0.25,1');
		drawCanvasByCubicBezier(ctx, coordinates, ORIGIN, END);
		cp1.style.left = coordinates[0] - 10 + 'px';
		cp1.style.top = coordinates[1] - 10 + 'px';

		cp2.style.left = coordinates[2] - 10 + 'px';
		cp2.style.top = coordinates[3] - 10 + 'px';
	}
	/**
	 * @param  {[Object]}    the object of canvas's context
	 * @param  {[String]}    the string of cubic-bezier, for example '0.25,0.1,0.25,1'
	 * @param  {[Array]}	 the origin point of canvas, for example '[0, 0]'	
	 * @param  {[Array]}     the end point of cavans, for example '[100, 100]'
	 * @return {[undefined]}  no return
	 */
	function drawCanvasByCubicBezier(c, p, o, e, color) {
		c.clearRect(0, 0, W, H);
		c.beginPath();
		c.moveTo(o[0], o[1]);
		c.bezierCurveTo(p[0], p[1], p[2], p[3], e[0], e[1]);
		c.moveTo(o[0], o[1]);
		c.lineTo(p[0], p[1]);
		c.moveTo(e[0], e[1]);
		c.lineTo(p[2], p[3]);
		c.strokeStyle = color;
		c.lineCap = 'round';
		c.lineWidth = 3;
		c.stroke();
		c.beginPath();
		c.arc(p[0], p[1], 10, 0, Math.PI * 2, true);
		c.arc(p[2], p[3], 10, 0, Math.PI * 2, true);
		c.fillStyle = color;
		c.fill();
	}
	/**
	 * @param  {[String]}  
	 * @return {[type]}	
	 * @description 
	 */
	function getCoordinates(s) {
		var _f, _p;
		if(typeof s === 'string') {
			if(s.indexOf('#') === 0) {
				s = s.slice(1);	
			}

			_p = s.split(',');
			if(_p.length !== 4)
				throw 'Wrong coordinates';
			return _p.map(function(item, index) {
				_f = parseFloat(item);
				return index % 2 === 0 ? (_f * 300) : (ORIGIN[1] - _f * 300);
			})
		}

	}

	function $(selector) {
		if(selector.indexOf('#') !== -1 && selector.indexOf('#') === 0) 
			return document.querySelector(selector);
		return document.querySelectorAll(selector);
	}
	function on(elem, event, cb) {
		elem.addEventListener(event, cb, false);
	}

	function remove(elem, event, cb) {
		elem.removeEventListener(event, cb, false);
	}
})(window, document);