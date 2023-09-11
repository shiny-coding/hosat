function px2vmin( px ) {
	let windowWidtht = $(window).width();
	let windowHeight = $(window).height();
	let vmin;
	if (windowWidtht >= windowHeight) {
		vmin = px * 100 / windowHeight;
	} else {
		vmin = px * 100 / windowWidtht;
	}
	return vmin;
}

function vmin2px( vminY, vminX ) {
	let windowWidtht = $( window ).width();
	let windowHeight = $( window ).height();
	let px;
	if ( windowWidtht >= windowHeight ) {
		px = vminY * windowHeight / 100;
	} else {
		px = vminX * windowWidtht / 100;
	}
	return px;
}

function isEmpty( obj ) {
	if ( Object.keys( obj ).length === 0 ) return true;
}

function cloneObject( obj ) {
	if ( typeof obj == 'number' || typeof obj == 'string') {
		return obj;
	}

	let clone;

	if ( Array.isArray( obj ) ) {
		clone = [];
		for ( let i = 0; i < obj.length; i++ ) {
			clone[ i ] = cloneObject( obj[ i ] );
		}

		return clone;
	}

	clone = {};
	for ( let property in obj ) {
		clone[ property ] = cloneObject( obj[ property ] );
	}

	return clone;
}

function shuffle( array ) {
	let currentIndex = array.length, randomIndex;

	while ( currentIndex != 0 ) {
		randomIndex = Math.floor( Math.random() * currentIndex );
		currentIndex--;
		[ array[ currentIndex ], array[ randomIndex ] ] = [ array[ randomIndex ], array[ currentIndex] ];
	}

	return array;
}

function decodeHtml( string ) {
	let map = {
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#039;': "'"
	};

	return string.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {return map[m];});
}