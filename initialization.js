// function initBoard1() {
//     const NUMBER_OF_HEROES_IN_ROW = 4;
//     const NUMBER_OF_HEROES_IN_COLUMN = 3;
//     const NUMBER_OF_CELLS_BETWEEN_HEROES = 5;
//     const BOARD_SIZE_X = ( NUMBER_OF_HEROES_IN_ROW - 1 ) * NUMBER_OF_CELLS_BETWEEN_HEROES + NUMBER_OF_HEROES_IN_ROW;
//     const BOARD_SIZE_Y = ( NUMBER_OF_HEROES_IN_COLUMN - 1 ) * NUMBER_OF_CELLS_BETWEEN_HEROES + NUMBER_OF_HEROES_IN_COLUMN;

//     for ( let row = 0; row < BOARD_SIZE_Y; row++ ) {
//         $( '#board' ).append( $( `<div class="row" id="row-${row}">` ) ); 
//     }

//     for ( let row = 0; row < BOARD_SIZE_Y; row++ ) {
//         for ( let column = 0; column < BOARD_SIZE_X; column++ ) {
//             let cellId = `cell-${column}-${row}`;                    
//             $( '#row-' + row ).append( $( `<div class="cell" id="${cellId}">` ) );        
//             let $cell = $( '#' + cellId ); 
//             let cellSize = vmin2px( 100 / BOARD_SIZE_Y ); 
//             $cell.css( 'width', cellSize + 'px' );
//             $cell.css( 'height', cellSize + 'px' );
//             $cell.text(column + '-' + row); //TODO   
//         }    
//     }
// }

function initUnits() {
    for ( let unit of unitsLibrary ) {
        units.push( cloneObject( unit ) );
    }
}

// function initBoard2() {
//     board = {
//         '$element' : $( '#board' ),
//         'cells' : []
//     };

//     const NUMBER_OF_HEROES_IN_ROW = 4;
//     const NUMBER_OF_HEROES_IN_COLUMN = 3;
//     const NUMBER_OF_CELLS_BETWEEN_HEROES = 5;
//     const BOARD_SIZE_X = ( NUMBER_OF_HEROES_IN_ROW - 1 ) * NUMBER_OF_CELLS_BETWEEN_HEROES + NUMBER_OF_HEROES_IN_ROW;
//     const BOARD_SIZE_Y = ( NUMBER_OF_HEROES_IN_COLUMN - 1 ) * NUMBER_OF_CELLS_BETWEEN_HEROES + NUMBER_OF_HEROES_IN_COLUMN;

//     for ( let row = 0; row < BOARD_SIZE_Y; row++ ) {
//         board.$element.append( $( `<div class="row" id="row-${row}">` ) ); 
//     }

//     for ( let row = 0; row < BOARD_SIZE_Y; row++ ) {
//         for ( let column = 0; column < BOARD_SIZE_X; column++ ) {
//             let cellId = `cell-${column}-${row}`;                    
//             $( '#row-' + row ).append( $( `<div class="cell" id="${cellId}">` ) );        
//             let $cell = $( '#' + cellId );       
//             let cell = {};  
//             cell.indexes = { x: column, y: row };
//             cell.$element = $cell;
//             let cellSize = vmin2px( 100 / BOARD_SIZE_Y ); 
//             $cell.css( 'width', cellSize + 'px' );
//             $cell.css( 'height', cellSize + 'px' );
//             board.cells.push( cell );
//             $cell.text(column + '-' + row); //TODO   
//         }    
//     }
// }

function initBoard() {
    let heroesTeams = [  1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2 ];
    shuffle( heroesTeams );

    let heroesIds = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
    shuffle( heroesIds );

    let $board = $( '#board' );

    for ( let row = 0; row < BOARD_SIZE_Y; row++ ) {
        $board.append( $( `<div class="row" id="row-${row}">` ) ); 
    }

    let cellCounter = 0;

    for ( let row = 0; row < BOARD_SIZE_Y; row++ ) {
        for ( let column = 0; column < BOARD_SIZE_X; column++ ) {
            let cellId = `cell-${column}-${row}`;                    
            $( '#row-' + row ).append( $( `<div class="cell" id="${cellId}">` ) );        
            let $cell = $( '#' + cellId );       
            // $cell.text(column + '-' + row); //TODO         
            let cell = {};  
            cells.push( cell );
            cell.id = cellCounter;
            cell.$element = $cell;
            cell.indexes = { x: column, y: row };
            setCellOrHeroElementSize( $cell );
            cellCounter++;
        }    
    }

    let heroCounter = 0;

    for ( let row = 0; row < BOARD_SIZE_Y; row++ ) {
        for ( let column = 0; column < BOARD_SIZE_X; column++ ) {
            if ( column % ( NUMBER_OF_CELLS_BETWEEN_HEROES + 1 ) == 0 &&
                 row % ( NUMBER_OF_CELLS_BETWEEN_HEROES + 1 ) == 0 &&
                 heroCounter < NUMBER_OF_HEROES_IN_ROW * NUMBER_OF_HEROES_IN_COLUMN ) { 

                let heroId = `hero-${heroesIds[ heroCounter ]}`;                                    
                $board.append( $( `<div class="hero" id="${heroId}">` ) );    
                let $hero = $( '#' + heroId ); 
                let heroIndexes = { x: column, y: row };  
                setCellOrHeroElementSize( $hero );     
                setHeroElementPosition( heroIndexes, heroId );    
                setHeroBackground( heroesIds[ heroCounter ] );
                let team = heroesTeams[ heroesIds[ heroCounter ] ];                

                if ( team == 1 ) {
                    $hero.addClass( 'team1' );
                } else {
                    $hero.addClass( 'team2' );
                }

                for ( let unit of units ) {
                    if ( unit.id == heroesIds[ heroCounter ] ) {
                        unit.team = team;
                        unit.indexes = heroIndexes;
                        unit.$element = $hero;
                    }
                }
               
                heroCounter++;
            }
        }    
    }
}

function initTeamChoose() {
    $( '#global-turn-count' ).append( 'Choose your team by clicking a hero!');
}

function initTurnInfoPanel( unit ) {
    if ( ! battleFase ) {
        player1.team = unit.team;

        if ( unit.team == 1 ) {
            player1.color = 'Red';
            player1.current = true;
            player2.team = 2;
            player2.color = 'Blue';
            player2.current = false;
            setTeamUnitsUnselectable( 2 ) ;
        } else {
            player1.color = 'Blue';
            player1.current = false;
            player2.team = 1;
            player2.color = 'Red';
            player2.current = true;
            setTeamUnitsUnselectable( 1 ) ;    
        }

        battleFase = true;

        updateTurnInfoPanel();
    }
}