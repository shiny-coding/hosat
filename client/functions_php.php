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
    $actions = sqlQueryObjects( 
        "SELECT ap,
                area,
                attribute,
                damage,
                distance,
                duration,
                effect,
                id, 
                image_file_name, 
                name,
                sign,
                target,
                type,
                unit_id,
                value
        FROM actions" 
    );

    // $originUnitsData = sqlQueryObjects( 
    $units = sqlQueryObjects( 
        "SELECT ap_current,
                ap_default,
                damage_current,
                damage_default,
                hp_current,
                hp_default,
                hit_range_current,
                hit_range_default,
                id, 
                image_file_name, 
                name, 
                type
        FROM units
        WHERE game_id = -1" 
    );

    // $gameData = (object)[];

    $gameData = (object)[
        'actions' => $actions,
        'units' => $units
    ];

    // $gameData = (object)[
    //     'actions' => (object)[
    //       'var1' => "something",
    //       'var2' => "something else",
    //     ],
    // ];


    // return json_encode( $originUnitsData );
    return json_encode( $gameData );

//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------


    // $lastUnitId = getLastUnitId();
    // $newGameUnits = [];

    // foreach ( $originUnitsData as $key => $originUnitData ) {
    //     $newGameUnits[ $key ] = clone $originUnitData;
    //     $lastUnitId++;
    //     $newGameUnits[ $key ]->unitId = $lastUnitId;

    //     if ( $game_type == 's' ) {
    //         $newGameUnits[ $key ]->gameType = 's';
    //     }        
        
    //     if ( $game_type == 'm' ) {
    //         $newGameUnits[ $key ]->gameType = 'm';
    //     }
    // }

    // saveToDBNewGameUnits( $newGameUnits );
}

function saveToDBNewGameUnits( $units ) {
    //
}

function getUnitsData() {
    createNewGameUnits( 's' );
    getLastGameIdCreated();

    $unitsData = sqlQueryObjects( 
        "SELECT unit_id, unit_type, image_file_name, hp_default, hp_current, mp_default, mp_current, ap_default, ap_current 
            FROM units
            WHERE game_id = -1" );

    // $b=json_encode( $unitsData );
    // $a=5;
    // json_encode( (object)[] ) image_file_name
    // sqlQueryObjects( $sql ) 

    // return $b;

    return json_encode( $unitsData );
}

