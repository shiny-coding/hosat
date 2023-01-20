<?php
require_once 'utilities_mysql.php';

function convertObjectToCamelCase( $object ) {
	$newObject = (object)[];
	foreach ( $object as $key => $value ) {
		$camelCaseKey = '';
		if ( strpos( $key, '_' ) ) {
			$keyExploded = explode( '_', $key );
			foreach ( $keyExploded as $index => $val )
				$camelCaseKey .= ( $index == 0 ) ? $val : strtoupper( substr( $val, 0, 1 ) ) . substr( $val, 1 );
		} else $camelCaseKey = $key;
		$newObject->$camelCaseKey = $object->$key;
	}
	return $newObject;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////





function errorHandler($errno, $errstr, $errfile, $errline) {
	http_response_code( 500 );
	// var_dump( xdebug_get_function_stack() );
	return false;
}

function exception_handler($exception) {
	http_response_code( 500 );
	echo "<div class='xdebug-error'>Uncaught exception: " , $exception->getMessage(), "</div>";
}

function setPlayerIdCookieIfNotExist() {	
	if ( !isset( $_COOKIE[ 'playerid' ] ) ) {
		$playerId = '';
		for ( $i=0; $i < 30 ; $i++ ) { $playerId .= rand( 0, 9 ); }
		setcookie( 'playerid', $playerId, time() + 3600*24*30, "/" );
		$_COOKIE[ 'playerid' ] = $playerId;
	}
}

// function setGameIdCookie( $gameId ) {	
// 		$_COOKIE[ 'gameid' ] = $gameId;


// }

// function setGameIdCookieIfNotExist( $gameId ) {	
// 	if ( !isset( $_COOKIE[ 'gameid' ] ) ) {
// 		// $isGameIdCookieExist = sqlQueryValue( "SELECT COUNT(*) FROM games WHERE player1_id = '$_COOKIE[playerid]' AND player2_id IS NULL" );
// 		$_COOKIE[ 'gameid' ] = $gameId;
// 	}

// }

function createGame( $name, $boardSize, $player1Id ) {
	sqlQuery( "INSERT INTO games ( name, board_size, player1_id ) VALUES( '$name', $boardSize, '$player1Id' )" );
}

function setGameIdCookie( $gameId ) {
	setcookie( 'gameid', $gameId, time() + 3600*24*30, "/");
	$_COOKIE[ 'gameid' ] = $gameId;
}

// smartyAssignVariable( 'gameDataJson', $gameDataJson);
function smartyAssignVariable( $key, $value) {
	global $smarty;
	$smarty->assign( $key, $value );
}

// smartyAssignTemplate( 'content', 'create_game');
function smartyAssignTemplate( $key, $templateName) {
	global $smarty;
	$template = $smarty->fetch( __DIR__ . "/$templateName.tpl" );	
	$smarty->assign( $key, $template );
}

function getOrSetPlayerId() {
	$playerId = '';
	if ( isset( $_COOKIE[ 'playerid' ] ) ) {
		$playerId = $_COOKIE[ 'playerid' ];
	} else {
		for ( $i=0; $i < 30 ; $i++ ) { $playerId .= rand( 0, 9 ); }
		setcookie( 'playerid', $playerId, time() + 3600*24*30, "/" );
		$_COOKIE[ 'playerid' ] = $playerId;
	}
	return $playerId;
}

function deleteEmptyGame() {
	$isExistEmptyGame = sqlQueryValue( "SELECT COUNT(*) FROM games WHERE player1_id = '$_COOKIE[playerid]' AND player2_id IS NULL" );
	if ( $isExistEmptyGame ) sqlQuery( "DELETE FROM games WHERE player1_id = '$_COOKIE[playerid]' AND player2_id IS NULL" );
}

set_exception_handler('exception_handler');
set_error_handler( "errorHandler" );