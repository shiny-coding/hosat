function onCellClick( e ) {
    if ( game.teamChooseFase || game.isSelectionBlocked ) return;

    let unit = getCurrentUnit();

    if ( !unit ) return;    

    // let cell = getCurrentCell();
    // $cells.removeClass( 'path-cell' ); 

    let $cell = $( this ); 
    // let cell = getCell( $cell ); 

    // if ( !isCellAvailable( $cell ) ) return;

    if ( isCellOfPath( $cell ) ) {
        //
    }

    // if ( choosenCellId == cell.id ) {
    //     let step = 0;
    //     let path = calculateMovePath( cell.indexes, unit.indexes );
    //     animateMoveByPath( path );
    //     // setTeamUnitsUnselectable( unit.team ); //TODO
    //     choosenCellId = null;
    // }

    if ( isCellAvailable( $cell ) ) {
        drawMovePath( $cell, unit );
    }
}

function onUnitClick( e ) {
    let $unit = $( this );
    let unit = getUnitByElement( $unit );
    
    if ( game.teamChooseFase ) {
        if ( unit.isCurrent ) {
            let team = unit.team;
            players[0].team = team;
            
            if ( team == UNIT_TEAMS[0] ) players[1].team = UNIT_TEAMS[1];
                else players[1].team = UNIT_TEAMS[0];
            
            game.roundCount = 1;
            game.turnCount = 1;
            game.currentPlayerId = 0;
            game.teamChooseFase = false;
            updateSidebar( unit );  
        } else {
            for ( let unit of units ) unit.isCurrent = false;
            unit.isCurrent = true;
            describeUnit( unit );
        }

        return; 
    }

    $cells.removeClass( 'available-cell' );

    for ( let unit of units ) {
        unit.isCurrent = false;
        unit.pathMap = null;
    } 
    // 
    // let $unit = $( this );
    // let unit = getUnitByElement( $unit );
    unit.isCurrent = true;
    setCellsAvailable( unit );
    // describeUnit( unit );
    // initTurnInfoPanel( unit );
}

function onEndTurnClick( e ) {
    let unit = getUnitById( choosenUnitId );

    if ( unit.team == 1 ) {
        player1.current = false;
        player2.current = true;
        
        setTeamUnitsUnselectable( 1 ) ;
        unsetTeamUnitsUnselectable( 2 );

        for ( let unit of units ) {
            if ( unit.team == 2 ) {
                choosenUnitId = unit.id;
                break;
            }
        }
    } else {
        player1.current = true;
        player2.current = false;

        setTeamUnitsUnselectable( 2 ) ;
        unsetTeamUnitsUnselectable( 1 );

        for ( let unit of units ) {
            if ( unit.team == 1 ) {
                choosenUnitId = unit.id;

                break;
            }
        }
    }

    $cells.removeClass( 'available-cell' );
    turnCount++;

    describeUnit( choosenUnitId );
    setCellsAvailable( unit );
    updateTurnInfoPanel();
}