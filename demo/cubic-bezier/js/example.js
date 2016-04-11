/*
 * Copyright (c) 2013 Lea Verou. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */

(function() {

var self = window.bezierLibrary = {
	curves: {},
	
	render: function() {
		var items = $$('a', library);
		
		for(var i=items.length; i--;) {
			library.removeChild(items[i]);
		}
		
		for (var name in self.curves) {
			try { var bezier = new CubicBezier(self.curves[name]); }
			catch(e) { continue; }
			
			self.add(name, bezier);
		}
	},
	
	add: function (name, bezier) {
		var canvas = document.createElement('canvas').prop({
				width:100,
				height:100
			}),
			a = document.createElement('a').prop({
				href: '#' + bezier.coordinates,
				bezier: bezier,
				bezierCanvas: new BezierCanvas(canvas, bezier, .15)
			});
		
		if(!bezier.applyStyle) console.log(bezier);
		bezier.applyStyle(a);
		
		library.insertBefore(a, $('footer', library));
		
		a.appendChild(canvas)
		
		a.appendChild(document.createElement('span').prop({
			textContent: name,
			title: name
		}));
		
		a.appendChild(document.createElement('button').prop({
			innerHTML: '×',
			title: 'Remove from library',
			onclick: function(evt) {
				evt.stopPropagation();
				
				if (confirm('Are you sure you want to delete this? There is no going back!')) {
					self.deleteItem(this.parentNode);
				}
				
				return false;
			}
		}));
		
		a.bezierCanvas.plot(self.thumbnailStyle);
		
		a.onclick = this.selectThumbnail;
		
		if (!/^a$/i.test(a.previousElementSibling.nodeName)) {
			a.onclick();
		}
	},
	
	selectThumbnail: function() {
		var selected = $('.selected', this.parentNode);
		
		if (selected) {
			selected.classList.remove('selected');
			selected.bezierCanvas.plot(self.thumbnailStyle);
		}
		
		this.classList.add('selected');
		
		this.bezierCanvas.plot(self.thumbnailStyleSelected);
		
		compare.style.cssText = this.style.cssText;

		compare.style.setProperty(prefix + 'transition-duration', getDuration() + 's', null);

		compareCanvas.bezier = this.bezier;
		
		compareCanvas.plot({
			handleColor: 'rgba(255,255,255,.5)',
			bezierColor: 'white',
			handleThickness: .03,
			bezierThickness: .06
		});
	},
	
	deleteItem: function(a) {
		var name = $('span', a).textContent;
							
		delete bezierLibrary.curves[name];

		bezierLibrary.save();
		
		library.removeChild(a);
		
		if (a.classList.contains('selected')) {	
			$('a:first-of-type', library).onclick();
		}
	},
	
	save: function(curves) {
		localStorage.curves = JSON.stringify(curves || self.curves);
	},
	
	thumbnailStyle: {
		handleColor: 'rgba(0,0,0,.3)',
		handleThickness: .018,
		bezierThickness: .032
	},
	
	thumbnailStyleSelected: {
		handleColor: 'rgba(255,255,255,.6)',
		bezierColor: 'white',
		handleThickness: .018,
		bezierThickness: .032
	}
};

})();

/**
 * Init
 */

// Ensure global vars for ids (most browsers already do this anyway, so…)
[
	'values', 'curve','P1','P2', 'current', 'compare', 'duration', 
	'library', 'save', 'go', 'import', 'export', 'json', 'importexport'
].forEach(function(id) { window[id] = $('#' + id); });

var ctx = curve.getContext("2d"),
	bezierCode = $('h1 code'),
	curveBoundingBox = curve.getBoundingClientRect(),
	bezierCanvas = new BezierCanvas(curve, null, [.25, 0]),
	currentCanvas = new BezierCanvas(current, null, .15),
	compareCanvas = new BezierCanvas(compare, null, .15),
	favicon = document.createElement('canvas'),
	faviconCtx = favicon.getContext('2d');

// Add predefined curves
if (!localStorage.curves) {
	bezierLibrary.save(CubicBezier.predefined);
}

bezierLibrary.curves = JSON.parse(localStorage.curves);

bezierLibrary.render();

if(location.hash) {
	bezierCanvas.bezier = window.bezier = new CubicBezier(location.hash);
	
	var offsets = bezierCanvas.offsets;
	
	P1.style.prop(offsets[0]);
	P2.style.prop(offsets[1]);
}

favicon.width = favicon.height = 16;

update();
updateDelayed();

/**
 * Event handlers
 */
// Make the handles draggable
P1.onmousedown = 
P2.onmousedown = function() { 
	var me = this;
	
	document.onmousemove = function drag(e) {
		var x = e.pageX, y = e.pageY,
			left = curveBoundingBox.left,
			top = curveBoundingBox.top;
		
		if (x === 0 && y == 0) {
			return;
		}
		
		// Constrain x
		x = Math.min(Math.max(left, x), left + curveBoundingBox.width);
		
		me.style.prop({
			left: x - left + 'px',
			top: y - top + 'px'
		});
		
		update();
	};
	
	document.onmouseup = function () {
		me.focus();
		
		document.onmousemove = document.onmouseup = null;
	}
};

P1.onkeydown =
P2.onkeydown = function(evt) {
	var code = evt.keyCode;
	
	if(code >= 37 && code <= 4="" 10="" 40)="" {="" evt.preventdefault();="" arrow="" keys="" pressed="" var="" left="parseInt(this.style.left)," top="parseInt(this.style.top)" offset="3" *="" (evt.shiftkey?="" :="" 1);="" switch="" (code)="" case="" 37:="" this.style.left="left" -="" +="" 'px';="" break;="" 38:="" this.style.top="top" 39:="" 40:="" }="" update();="" updatedelayed();="" return="" false;="" };="" p1.onblur="P2.onblur" =="" p1.onmouseup="P2.onmouseup" updatedelayed;="" curve.onclick="function(evt)" x="evt.pageX" left,="" y="evt.pageY" top;="" find="" which="" point="" is="" closer="" distp1="distance(x," y,="" parseint(p1.style.left),="" parseint(p1.style.top)),="" distp2="distance(x," parseint(p2.style.left),="" parseint(p2.style.top));="" (distp1="" <="" distp2?="" p1="" p2).style.prop({="" left:="" 'px',="" top:="" 'px'="" });="" function="" distance(x1,="" y1,="" x2,="" y2)="" math.sqrt(math.pow(x1="" 2)="" math.pow(y1="" y2,="" 2));="" curve.onmousemove="function(evt)" height="curveBoundingBox.height," this.parentnode.setattribute('data-time',="" math.round(100="" curveboundingbox.width));="" this.parentnode.setattribute('data-progression',="" (3*height="" y)="" (height="" .5)));="" save.onclick="function()" rawvalues="bezier.coordinates" '',="" name="prompt('If" you="" want,="" can="" give="" it="" a="" short="" name',="" rawvalues);="" if(name)="" bezierlibrary.add(name,="" bezier);="" bezierlibrary.curves[name]="rawValues;" bezierlibrary.save();="" go.onclick="function()" current.classlist.toggle('move');="" compare.classlist.toggle('move');="" duration.oninput="function()" val="getDuration();" this.nextelementsibling.textcontent="val" '="" second'="" (val="=" 1?="" ''="" 's');="" current.style.setproperty(prefix="" 'transition-duration',="" 's',="" null);="" compare.style.setproperty(prefix="" window['import'].onclick="function()" json.value="" ;="" importexport.classname="import" json.focus();="" window['export'].onclick="function()" close="" button="" importexport.elements[2].onclick="function()" this.parentnode.removeattribute('class');="" importexport.onsubmit="function()" if(this.classname="==" 'import')="" overwrite="!confirm('Add" to="" current="" curves?="" clicking="" “cancel”="" will="" them="" with="" the="" new="" ones.');="" try="" newcurves="JSON.parse(json.value);" catch(e)="" alert('sorry="" mate,="" this="" doesn’t="" look="" like="" valid="" json="" so="" i="" can’t="" do="" much="" :(');="" if(overwrite)="" bezierlibrary.curves="newCurves;" else="" for(var="" in="" newcurves)="" newname="name;" while(bezierlibrary.curves[newname])="" ++i;="" bezierlibrary.curves[newname]="newCurves[name];" bezierlibrary.render();="" this.removeattribute('class');="" **="" helper="" functions="" getduration()="" (isnan(val="Math.round(duration.value" 10)="" 10))="" ?="" null="" val;="" update()="" redraw="" canvas="" beziercanvas.bezier="currentCanvas.bezier" window.bezier="new" cubicbezier(="" beziercanvas.offsetstocoordinates(p1)="" .concat(beziercanvas.offsetstocoordinates(p2))="" );="" beziercanvas.plot();="" currentcanvas.plot({="" handlecolor:="" 'rgba(255,255,255,.5)',="" beziercolor:="" 'white',="" handlethickness:="" .03,="" bezierthickness:="" .06="" show="" cubic-bezier="" values="" params="$$('.param'," beziercode),="" prettyoffsets="bezier.coordinates.toString().split(',');" i--;)="" params[i].textcontent="prettyOffsets[i];" webkit-friendly="" version,="" if="" needed="" webkitwarning="$('header"> p');
	
	if (!bezier.inRange) {
		var webkitBezier = bezier.clipped;
		
		webkitWarning.style.maxHeight = '3em';
		$('a', webkitWarning).tabIndex = '0';
		
		$('code', webkitWarning).textContent = webkitBezier;
		
		if (prefix === '-webkit-') {
			webkitBezier.applyStyle(current);
		}
	}
	else {
		webkitWarning.style.maxHeight = '';
		$('a', webkitWarning).tabIndex = '-1';
	}
}

// For actions that can wait
function updateDelayed() {
	bezier.applyStyle(current);
	
	var hash = '#' + bezier.coordinates;
	
	bezierCode.parentNode.href = hash;
	
	if(history.pushState) {
		history.pushState(null, null, hash);
	}
	else {
		location.hash = hash;
	}
	
	// Draw dynamic favicon
	
	faviconCtx
		.clearRect(0,0,16,16)
		.prop('fillStyle', '#0ab')
		.roundRect(0, 0, 16, 16, 2)
		.fill()
		.drawImage(current, 0, 0, 16, 16);
	
	
	$('link[rel="shortcut icon"]').setAttribute('href', favicon.toDataURL());
	
	document.title = bezier + ' ✿ cubic-bezier.com';
}</=>