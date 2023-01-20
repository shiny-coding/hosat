<?php

function connectDB() {
	global $mysql;
	$mysql = new mysqli( "localhost", "sky", "mateofsky" );
	$mysql->options( MYSQLI_OPT_INT_AND_FLOAT_NATIVE, TRUE );
	if ( $mysql->connect_error ) die ( "Connection failed: " . $mysql->connect_error );
	if ( !mysqli_select_db( $mysql, "sky" ) ) die ( "Cannot select database 'satomam'" );
	mysqli_set_charset( $mysql, "utf8mb4" );
}

function getLastInsertId() {
	global $mysql;
	return mysqli_insert_id( $mysql );
}

function sqlQuery( $sql ) {
	global $mysql;
	$result = mysqli_query( $mysql, $sql );
	if ( $result === false ) {
		$error_string = mysqli_error( $mysql );
		trigger_error( "SQL ERROR: $error_string\n" . $sql, E_USER_ERROR );
	}
	return $result;
}

function sqlQueryValue( $sql ) {
	return mysqli_fetch_row( sqlQuery( $sql ) )[ 0 ];
}

function sqlQueryValues( $sql ) {
	$result = [];
	$rows = sqlQuery( $sql );
	while ( $row = mysqli_fetch_row( $rows ) )
		$result[] = $row[ 0 ];
	return $result;
}

function sqlQueryAssoc( $sql ) {
	return mysqli_fetch_assoc( sqlQuery( $sql ) );
}

function sqlQueryAssocs( $sql ) {
	$result = [];
	$rows = sqlQuery( $sql );
	while ( $row = mysqli_fetch_assoc( $rows ) )
		array_push( $result, $row );
	return $result;
}

function sqlQueryObject( $sql ) {
	return convertObjectToCamelCase( mysqli_fetch_object( sqlQuery( $sql ) ) );
}

function sqlQueryObjects( $sql ) {
	$result = [];
	$rows = sqlQuery( $sql );
	while ( $row = mysqli_fetch_object( $rows ) )
		array_push( $result, convertObjectToCamelCase( $row ) );
	return $result;
}

connectDB();