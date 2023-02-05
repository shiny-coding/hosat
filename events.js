function onCellClick( e ) {
    if ( game.teamChooseFase || game.isSelectionBlocked ) return;   

    let unit = getCurrentUnit();
    if ( !unit ) return;

    let $cell = $( this ); 
    let cell = getCellByElement( $cell ); 

    if ( cell.isPathCell ) {
        animateMoveByPath( unit );     
    } else if ( cell.isAvailable ) {
        $cells.removeClass( 'path-cell' ); 
        drawMovePath( $cell, unit );
    }
}

function onUnitClick( e ) {
    if ( game.isSelectionBlocked ) return;  

    let $unit = $( this );
    let unit = getUnitByElement( $unit );   
    updateSidebar( unit );  
    
    if ( game.teamChooseFase ) {
        if ( unit.isCurrent ) {
            let team = unit.team;
            
            if ( team == TEAMS[0] ) {
                game.currentTeam = TEAMS[0];   
                game.currentPlayerId = 0;             
                players[0].team = TEAMS[0];
                players[1].team = TEAMS[1];
            } else {
                game.currentTeam = TEAMS[1];
                game.currentPlayerId = 1;
                players[0].team = TEAMS[1];
                players[1].team = TEAMS[0];
            }

            showCellsAvailable( unit ); //перенести в функцию юнита!!!
            // unit.isCurrent = false;
            game.roundCount = 1;
            game.turnCount = 1;            
            game.teamChooseFase = false;
        } else {
            for ( let unit of units ) unit.isCurrent = false;
            unit.isCurrent = true;
            return;
        }
    }    
    
    if ( unit.team != game.currentTeam || isPartlyMoved() ) return;

    if ( unit.team == game.currentTeam && !isPartlyMoved() ) {
        for ( let unit of units ) unit.isCurrent = false;
        unit.isCurrent = true;
        $cells.removeClass( 'available-cell' );
        showCellsAvailable( unit );
    }
}

function onEndClick( e ) {
    let isAllUnitsMoved = true;

    for ( let unit of units ) {
        if ( !unit.isMooved ) {
            isAllUnitsMoved = false;
            break;
        }
    }

    if ( isAllUnitsMoved ) {
        for ( let unit of units ) {
            unit.isPartlyMooved = false;
            unit.apCurrent = unit.apDefault; //TODO учесть заклинания
        }

        game.roundCount++;
    } else {
        game.turnCount++;
    }
    
    $cells.removeClass( 'available-cell' );
    for ( let unit of units ) {
        unit.isCurrent = false;
    }

    if ( game.currentTeam == TEAMS[0] ) {
        game.currentTeam = TEAMS[1]; 
        game.currentPlayerId = 1;
    } else {
        game.currentTeam = TEAMS[0];
        game.currentPlayerId = 0;
    }

    updateSidebar(); 
}
