function isPartlyMoved() {
    for ( let unit of Unit.units ) {
        if ( unit.apCurrent < unit.apDefault && unit.apCurrent > 0 ) {
            return unit;
        }
    }

    return false;
}

function isOneRoundOneMovedUnit() {
    let movedUnitsCounter = 0;

    for ( let unit of Unit.units ) {
        if ( unit.isMoved ) {
            movedUnitsCounter++;
        }
    }

    if ( movedUnitsCounter == game.turnCount ) return true;
        else return false;
}

function isCellOfPath( cell ) {
    for ( let cell of Board.cells ) {
        if ( cell.indexes.x == cellIindexes.x && cell.indexes.y == cellIindexes.y ) {
            return cell.$element;
        }
    }
}


function markPossibleTargets( actionId ) {
    let choosenUnit = getUnitByActionId( actionId );

    for ( let unit of Unit.units ) {
        let dx = Math.abs( unit.indexes.x - choosenUnit.indexes.x );
        let dy = Math.abs( unit.indexes.y - choosenUnit.indexes.y );
        let distance = dx + dy;
        // let actionDistance = Action.getActionById( actionId ).id;
        let action = Action.getActionById( actionId );

        if ( action.distance >= distance ) {
            if ( unit.team == game.currentTeam ) {
                unit.$element.addClass( 'possible-target-ally' );
            } else {
                unit.$element.addClass( 'possible-target-enemy' );
            }
        }
    }

}

