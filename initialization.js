const NUMBER_OF_HEROES_IN_ROW = 4;
const NUMBER_OF_HEROES_IN_COLUMN = 3;
const NUMBER_OF_CELLS_BETWEEN_HEROES = 5;

function initBoard() {
    board = {
        '$element' : $( '#board' ),
        'rows': ( NUMBER_OF_HEROES_IN_COLUMN - 1 ) * NUMBER_OF_CELLS_BETWEEN_HEROES + NUMBER_OF_HEROES_IN_COLUMN,
        'columns': ( NUMBER_OF_HEROES_IN_ROW - 1 ) * NUMBER_OF_CELLS_BETWEEN_HEROES + NUMBER_OF_HEROES_IN_ROW,
        'cells' : []
    };
    
    for ( let row = 0; row < board.rows; row++ ) {
        board.$element.append( $( `<div class="row" id="row-${row}">` ) ); 
    }

    for ( let row = 0; row < board.rows; row++ ) {
        for ( let column = 0; column < board.columns; column++ ) {
            let cellId = `cell-${column}-${row}`;                    
            $( '#row-' + row ).append( $( `<div class="cell" id="${cellId}">` ) );        
            let $cell = $( '#' + cellId );       
            let cell = {};  
            cell.$element = $cell;
            cell.indexes = { x: column, y: row };
            let cellSize = vmin2px( 100 / board.rows ); 
            $cell.css( 'width', cellSize + 'px' );
            $cell.css( 'height', cellSize + 'px' );
            setCellOrHeroElementSize( $cell );
            board.cells.push( cell );
            $cell.text(column + '-' + row); //TODO   
        }    
    }
}

function initHeroes( heroesData ) {
    for ( let unit of gameData ) {
        if ( unit.type == 'hero' ) {
            units.push( cloneObject( unit ) );
        }
    }

    // let randomHeroesId = shuffle( [ 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 ] );
    let randomHeroesId = shuffle( [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] );
    let randomHeroesTeams = shuffle( [  1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2 ] );
    let heroCounter = 0;

    for ( let row = 0; row < board.rows; row++ ) {
        for ( let column = 0; column < board.columns; column++ ) {
            if ( column % ( NUMBER_OF_CELLS_BETWEEN_HEROES + 1 ) == 0 &&
                 row % ( NUMBER_OF_CELLS_BETWEEN_HEROES + 1 ) == 0 &&
                 heroCounter < NUMBER_OF_HEROES_IN_ROW * NUMBER_OF_HEROES_IN_COLUMN ) { 

                let heroId = `hero-${randomHeroesId[ heroCounter ]}`;                                    
                board.$element.append( $( `<div class="hero" id="${heroId}">` ) );    
                let $hero = $( '#' + heroId ); 
                let heroIndexes = { x: column, y: row };  
                setCellOrHeroElementSize( $hero );     
                setHeroElementPosition( heroIndexes, heroId );    
                setHeroBackground( randomHeroesId[ heroCounter ] );
                let team = randomHeroesTeams[ randomHeroesId[ heroCounter ] ];  

                if ( team == 1 ) {
                    $hero.addClass( 'team1' );
                } else {
                    $hero.addClass( 'team2' );
                }

                for ( let unit of units ) {
                    if ( unit.id == randomHeroesId[ heroCounter ] ) {
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