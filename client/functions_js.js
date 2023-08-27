
function distance( a, b ) {
	let dx = Math.abs( a.x - b.x );
	let dy = Math.abs( a.y - b.y );
	return dx + dy;
}

function isOnBoard( position ) {
	return position.x >= 0 && position.x < Board.COLUMNS && position.y >= 0 && position.y < Board.ROWS;
}

function positionsEqual( a, b ) {
	return a.x == b.x && a.y == b.y;
}