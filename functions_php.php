<?php

// function getLastIdOfTable( tableName ) {
    //
// }

function getLastGameIdCreated() {
    // SELECT id FROM blahblah ORDER BY id DESC LIMIT 1
    $gameId = sqlQueryValue( "SELECT game_id FROM units ORDER BY game_id DESC LIMIT 1" );
    return $gameId;
}

function getLastUnitId() {
    // SELECT id FROM blahblah ORDER BY id DESC LIMIT 1
    $unitId = sqlQueryValue( "SELECT unit_id FROM units ORDER BY unit_id DESC LIMIT 1" );
    return $unitId;
}

function createNewGameUnits( $game_type ) {
    $originUnitsData = sqlQueryObjects( 
        "SELECT unit_id, unit_type, hp_default, hp_current, mp_default, mp_current, ap_default, ap_current 
            FROM units
            WHERE game_id = -1" );

    $lastUnitId = getLastUnitId();
    $newGameUnits = [];

    foreach ( $originUnitsData as $key => $originUnitData ) {
        $newGameUnits[ $key ] = clone $originUnitData;
        $lastUnitId++;
        $newGameUnits[ $key ]->unitId = $lastUnitId;

        if ( $game_type == 's' ) {
            $newGameUnits[ $key ]->gameType = 's';
        }        
        
        if ( $game_type == 'm' ) {
            $newGameUnits[ $key ]->gameType = 'm';
        }
    }

    saveToDBNewGameUnits( $newGameUnits );
}

function saveToDBNewGameUnits( $units ) {
    //
}

function getUnitsData() {
    createNewGameUnits( 's' );
    getLastGameIdCreated();

    $unitsData = sqlQueryObjects( 
        "SELECT unit_id, unit_type, hp_default, hp_current, mp_default, mp_current, ap_default, ap_current 
            FROM units
            WHERE game_id = -1" );

    // $b=json_encode( $unitsData );
    // $a=5;
    // json_encode( (object)[] ) 
    // sqlQueryObjects( $sql ) 

    // return $b;

    return json_encode( $unitsData );
}
