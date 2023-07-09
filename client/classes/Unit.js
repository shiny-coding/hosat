class Unit {
    constructor( indexes, team, $unit ) {

        this.indexes = indexes;
        this.isCurrent = false; // for teamChooseFase
        this.isMoved = false;
        this.isPartlyMoved = false;
        // this.isSelected = false;
        this.movePath = undefined;
		this.team = team;
        this.pathMap = [];
        this.$element = $unit;
        this.$element.click( this.onUnitClick );
    }

    static units = [];
    static $units = $( '.unit' );

    static createUnits( gameData, allActions ) {
        let randomHeroesIndexes = shuffle( [ ...Array( gameData.heroes.length ).keys() ] );
        let randomHeroesTeams = shuffle( [  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1 ] );
        let unitCounter = 0;

        for ( let row = 0; row < Board.ROWS; row++ ) {
            for ( let column = 0; column < Board.COLUMNS; column++ ) {
                if ( column % ( Board.NUMBER_OF_CELLS_BETWEEN_HEROES + 1 ) == 0 &&
                    row % ( Board.NUMBER_OF_CELLS_BETWEEN_HEROES + 1 ) == 0 &&
                    unitCounter < Board.NUMBER_OF_HEROES_IN_ROW * Board.NUMBER_OF_HEROES_IN_COLUMN ) {

                    let heroIndex = randomHeroesIndexes[ unitCounter ];
					let hero = gameData.heroes[ heroIndex ];

                    Board.$element.append( `<div class="unit" id="unit-${hero._id}">` );
                    let heroIndexes = { x: column, y: row };
                    let team = randomHeroesTeams[ unitCounter ];
                    let $element = $( `#unit-${hero._id}`);

                    if ( team == 0 ) {
                        $element.addClass( 'team0' );
                    } else {
                        $element.addClass( 'team1' );
                    }

					let actions = allActions.filter( action => hero.actions.includes( action.name ) )

                    let unit = new Unit(
                        heroIndexes,
                        Game.game.TEAMS[ team ],
                        $element
                    );
					Object.assign( unit, hero, { actions } );

                    Unit.units.push( unit );
                    Unit.setUnitElementSize( unit );
                    Unit.setUnitElementPosition( unit );
                    Unit.setUnitBackground( unit );
                    unit.$element.addClass( `${hero.image}` );
                    unitCounter++;

                    unit.$element.append( `<div class="healthbar">` );
                }
            }
        }
    }

    /**
     * @param {Unit} unit
     */
    static setUnitElementSize( unit ) {
        let size = vmin2px( 100 / Board.ROWS ); 
        unit.$element.css( 'width', size + 'px' );
        unit.$element.css( 'height', size + 'px' );    
    }

    /**
     * @param {Unit} unit
     */
    static setUnitElementPosition( unit ) {  
        let cellOffset = $( `#cell-${unit.indexes.x}-${unit.indexes.y}` ).offset();
        unit.$element.offset( { top: cellOffset.top, left: cellOffset.left } );
    }

    /**
     * @param {Unit} unit
     */
    static setUnitBackground( unit ) {
        let imagePath = 'url(/images/heroes/' + unit.image + '.png)';
        $( '#unit-' + unit._id ).css( 'background-image', imagePath );

        if ( unit.team == Game.game.TEAMS[ 0 ] ) {
            $( '#unit-' + unit._id ).addClass( 'team0' );
        } else {
            $( '#unit-' + unit._id ).addClass( 'team1' );
        }
    }

    /**
     * @param {Unit} unit
     */
    static getUnitByElement( $unit ) {
        for ( let unit of Unit.units ) {
            if ( ( 'unit-' + unit._id ) == $unit.attr( 'id' ) ) {
                return unit;
            }
        }
    }

    // /**
    //  * @param {Unit} unit
    //  */
    // static getSelectedUnit() {
    //     for ( let unit of Unit.units ) {
    //         if ( unit.isSelected == true) {
    //             return unit;
    //         }
    //     }
    
    //     return false;
    // }

    /**
     * @param {Unit} unit
     */
    static getCurrentUnit() {
        for ( let unit of Unit.units ) {
            if ( unit.isCurrent == true) {
                return unit;
            }
        }
    
        return false;
    }

    static isThereAPartlyMovedUnit() {
        for ( let unit of Unit.units ) {
            if (    unit.apCurrent < unit.apDefault && 
                    unit.apCurrent > 0 && 
                    !unit.isMoved ) 
                return true;
        }

        return false;
    }

    static updateInfoPanel( unit ) { // updateUnitInfoPanel ??!!
        // let unit = Unit.getCurrentUnit();
        // let unit = Unit.getSelectedUnit();
        
        // Board.$element.append( `<div class="unit" id="unit-${heroId}">` );


        // $( '#unit-stats' ).html( `
        //     ${unit.name}<br>
        //     <div class=""><img src="${imgSrc}">Action Points: ${unit.apCurrent} / ${unit.apDefault}</div> 
        //     Health Points: ${unit.hpCurrent} / ${unit.hpDefault}<br>
        //     Damage: ${unit.damageCurrent} / ${unit.damageDefault}<br>  
        //     Mana Points: ${unit.mpCurrent} / ${unit.mpDefault}<br> 
        //     Attack Distance: ${unit.hitRangeCurrent} / ${unit.hitRangeDefault} ` 
        // ); 

        // $( '#unit-stats' ).html( `
        //     ${unit.name}<br>
        //     <div id="action-points" class=""><img src="${imgSrc}">Action Points: ${unit.apCurrent} / ${unit.apDefault}</div> 
        //     Health Points: ${unit.hpCurrent} / ${unit.hpDefault}<br>
        //     Damage: ${unit.damageCurrent} / ${unit.damageDefault}<br>  
        //     Mana Points: ${unit.mpCurrent} / ${unit.mpDefault}<br> 
        //     Attack Distance: ${unit.hitRangeCurrent} / ${unit.hitRangeDefault} ` 
        // ); 

        // $('#unit-stats #action-points img').attr('src', );

        // if ( unit ) {
        //     $( '#unit-stats' ).html( `
        //         ${unit.name}<br>
        //         Action Points: ${unit.apCurrent} / ${unit.apDefault}<br> 
        //         Health Points: ${unit.hpCurrent} / ${unit.hpDefault}<br>
        //         Damage: ${unit.damageCurrent} / ${unit.damageDefault}<br>  
        //         Mana Points: ${unit.mpCurrent} / ${unit.mpDefault}<br> 
        //         Attack Distance: ${unit.hitRangeCurrent} / ${unit.hitRangeDefault} ` 
        //     ); 
        // } else {
        //     $( '#unit-stats' ).html( '' );
        // }

        // let imagePath = 'url(/images/heroes/' + unit.image + '.png)';
        
        if ( unit ) {
            $( '#unit-stats' ).html( `
                ${unit.name}<br>
                <div id="action-points" class="attribute"><img src="">
                    Action Points: ${unit.apCurrent} / ${unit.apDefault}
                </div> 
                Health Points: ${unit.hpCurrent} / ${unit.hpDefault}<br>
                Damage: ${unit.damageCurrent} / ${unit.damageDefault}<br>  
                <div id="mana-points" class="attribute"><img src="">
                    Mana Points: ${unit.mpCurrent} / ${unit.mpDefault}
                </div> 
                <div id="hit-range" class="attribute"><img src="">
                    Hit Range: ${unit.hitRangeCurrent} / ${unit.hitRangeDefault}
                </div> 
            ` ); 
        } else {
            $( '#unit-stats' ).html( '' );
        }

        $( '#unit-stats #mana-points img' ).attr( 'src', '/images/attributes/' + 'mana_points_512_512' + '.png' );
        $( '#unit-stats #hit-range img' ).attr( 'src', '/images/attributes/' + 'hit_range_500_500' + '.png' );
    }

    showAvailableCells() {        
        for ( let x = 0; x < Board.COLUMNS; x++ ) {          
            this.pathMap[ x ] = [];        
            for ( let y = 0; y < Board.ROWS; y++ ) {       
                this.pathMap[ x ][ y ] = -1;
            }
        }
    
        for ( let iteratedUnit of Unit.units ) {
            this.pathMap[ iteratedUnit.indexes.x ][ iteratedUnit.indexes.y ] = -2; 
        }
    
        this.pathMap[ this.indexes.x ][ this.indexes.y ] = 0;
    
        for ( let i = 1; i <= this.apCurrent; i++ ) {
            for ( let x = 0; x < Board.COLUMNS; x++ ) {
                for ( let y = 0; y < Board.ROWS; y++ ) {
    
                    if ( this.pathMap[ x ][ y ] == i - 1 ) {
                        for ( let x2 = x-1; x2 <= x+1; x2++ ) {   
                            for ( let y2 = y-1; y2 <= y+1; y2++ ) {
    
                                if (    x2 >= 0 && x2 < Board.COLUMNS &&
                                        y2 >= 0 && y2 < Board.ROWS &&                                 
                                        Math.abs( x - x2 ) + Math.abs( y - y2 ) <= 1 &&
                                        this.pathMap[ x2 ][ y2 ] == -1   ) {    
                                    
                                    this.pathMap[ x2 ][ y2 ] = i;                               
                                }
                            }
                        }
                    }
                }
            }
        }

        for ( let cell of Cell.cells ) {            
            cell.isAvailable = false; 
        }

        for ( let cell of Cell.cells ) {
                if ( this.pathMap[ cell.indexes.x ][ cell.indexes.y ] > 0 ) {
                    cell.isAvailable = true; 
                    cell.$element.addClass( 'available-cell' );            
                }
        }
    }

    drawMovePath( $cell ) {
        let cellIindexes = Cell.getCellByElement( $cell ).indexes;
        let unitIndexes = this.indexes;
        let preferHorizontalMovement = Math.abs( cellIindexes.x - unitIndexes.x ) < Math.abs( cellIindexes.y - unitIndexes.y );
        let current = cellIindexes; //TODO remove current ???
        let distance = this.pathMap[ cellIindexes.x ][ cellIindexes.y ];    
        let currentDistance = distance; //TODO ???
        let movePath = [];
    
        while ( current.x != unitIndexes.x || current.y != unitIndexes.y ) {    
            let stopSearch = false;
            let bestCandidate = null;
    
            for ( let x = current.x - 1; x <= current.x + 1; x++ ) {   
                for ( let y = current.y - 1; y <= current.y + 1; y++ ) {
                    if ( y < 0 || y > Board.ROWS - 1 || x < 0 || x > Board.COLUMNS - 1 ) continue;
    
                    if ( this.pathMap[ x ][ y ] == currentDistance - 1 ) {
                        let isHorizontalMovement = Math.abs( x - current.x ) != 0 && Math.abs( y - current.y ) == 0;                    
                        bestCandidate = { x, y };
    
                        if ( preferHorizontalMovement == isHorizontalMovement ) {
                            stopSearch = true;
                            break;
                        } 
                    }
                }
    
                if ( stopSearch ) break;
            }
    
            current = bestCandidate;
            movePath.push( bestCandidate );
            currentDistance--;
    
            if ( currentDistance < 0 ) break;
        }
        
        movePath.reverse();
        movePath.shift();
        movePath.push( cellIindexes );      
        this.movePath = movePath;
    
        for ( let row = 0; row < Board.ROWS; row++ ) {        
            for ( let column = 0; column < Board.COLUMNS; column++ ) {
                for ( let step of movePath ) {
                    for ( let cell of Cell.cells ) {
                        if ( cell.indexes.x == step.x && cell.indexes.y == step.y ) {
                            cell.isPathCell = true;
                            cell.$element.addClass( 'path-cell' ); 
                        }
                    }
                }
            }
        }
    }

    animateMoveByPath() {
        let nextCellIndexes = this.movePath.shift();
        let $cell = $( `#cell-${nextCellIndexes.x}-${nextCellIndexes.y}` );
        let cellOffset = $cell.offset();  
        this.apCurrent--; 
        Game.game.$end.removeClass( 'end-red' );
        Game.game.$end.removeClass( 'end-green' );
        Game.game.$end.addClass( 'end-yellow' );
        Game.game.isSelectionBlocked = true;
    
        this.$element.animate( {
            left: cellOffset.left,
            top: cellOffset.top
        }, {
            duration: 500,
            easing: "linear",
            done: function() {
                this.indexes = nextCellIndexes;
                Cell.$cells.removeClass( 'available-cell' ); 
                this.showAvailableCells(); 
                Unit.updateInfoPanel();             
                $cell.removeClass( 'path-cell' ); 
    
                if ( this.movePath.length > 0 ) {                    
                    this.animateMoveByPath();  
                    // this.markPossibleTargets();
                } else {
                    Game.game.isSelectionBlocked = false;
                    if ( this.apCurrent == 0 ) {
                        this.isMoved = true;
                        this.$element.addClass( 'moved' );
                        Game.game.$end.removeClass( 'end-red' );
                        Game.game.$end.removeClass( 'end-yellow' );
                        Game.game.$end.addClass( 'end-green' );
                    }
                }  

                this.markPossibleTargets();
            }.bind( this )
        } ); 
    }

    markPossibleTargets() {
        for ( let unit of Unit.units ) {
            unit.$element.removeClass( 'attackable' );         
        }
        
        for ( let unit of Unit.units ) {
            if ( this.isCurrent && ( unit.team != this.team ) ) {
                let dx = Math.abs( unit.indexes.x - this.indexes.x );
                let dy = Math.abs( unit.indexes.y - this.indexes.y );
                let distance = dx + dy;
                if ( this.hitRangeCurrent >= distance ) {
                    unit.$element.addClass( 'attackable' );
                }
            }
        }
    }

    onUnitClick( event ) {
        if ( Game.game.isSelectionBlocked ) return;  

        for ( let unit of Unit.units ) {
            unit.$element.removeClass( 'attackable' );
        } 

        let $unit = $( this );
        let unit = Unit.getUnitByElement( $unit );    
        // for ( let unit of Unit.units ) {
        //     unit.isSelected = false;
        //     unit.$element.removeClass( 'attackable' );
        // } 
        // unit.isSelected = true;          
        
        if ( Game.game.teamChooseFase ) {
            if ( unit.isCurrent ) {
                let team = unit.team;
                
                if ( team == Game.game.TEAMS[0] ) {
                    Game.game.currentTeam = Game.game.TEAMS[0];   
                    Game.game.currentPlayerId = 0;             
                    Game.game.players[0].team = Game.game.TEAMS[0];
                    Game.game.players[1].team = Game.game.TEAMS[1];
                } else {
                    Game.game.currentTeam = Game.game.TEAMS[1];
                    Game.game.currentPlayerId = 1;
                    Game.game.players[0].team = Game.game.TEAMS[1];
                    Game.game.players[1].team = Game.game.TEAMS[0];
                }

                unit.showAvailableCells();
                // unit.isCurrent = false;
                Game.game.roundCount = 1;
                Game.game.turnCount = 1;            
                Game.game.teamChooseFase = false;
                Game.game.updateTurnsInfoPanel();
                // Unit.updateInfoPanel();     
                unit.markPossibleTargets();           
            } else {
                for ( let unit of Unit.units ) unit.isCurrent = false;
                unit.isCurrent = true;
                // return;
            }

            Unit.updateInfoPanel(); 
            return;
        }

        // unit.isCurrent = true;  // ???????????????????????????????????!!!!!!!!!!!!!!!!!!!!!!!!!!!! isCurrent or isSelected
        Unit.updateInfoPanel( unit ); 

        // for ( let unit of Unit.units ) {
        //     unit.isSelected = false;
        //     unit.$element.removeClass( 'attackable' );
        // } 

        let isThereAPartlyMovedUnit = Unit.isThereAPartlyMovedUnit();

        if ( Game.game.currentTeam == unit.team
                && !isThereAPartlyMovedUnit 
                && !unit.isMoved ) {
            Cell.$cells.removeClass( 'available-cell' );
            unit.showAvailableCells();
            for ( let unit of Unit.units ) unit.isCurrent = false;
            unit.isCurrent = true;
            unit.markPossibleTargets();
        }

        // if ( unit.hasClass( 'attackable' ) 
        //         && Game.game.currentTeam != unit.team ) {

        //     let currentUnitDamage = undefined;

        //     for ( let unit of Unit.units ) {
        //         if ( unit.isCurrent == true ) {
        //             currentUnitDamage = unit.damageCurrent;
        //         }
        //     } 

        //     unit.hpCurrent -= currentUnitDamage;
        //     Unit.updateInfoPanel(); 
        // }                
    }
}