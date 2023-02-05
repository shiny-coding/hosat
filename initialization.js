const NUMBER_OF_HEROES_IN_ROW = 4;
const NUMBER_OF_HEROES_IN_COLUMN = 3;
const NUMBER_OF_CELLS_BETWEEN_HEROES = 4;
const TEAMS = [ 'white', 'black' ];

let gameDataJson = $('meta[name="game-data-json"]').attr('content');
let gameData = JSON.parse( decodeHtml( gameDataJson ) );

function initialization() {
    initPlayers();
    initGame();
    initBoard();
    initHeroes( gameData );
    initSidePanel();
}

function initPlayers() {
    players = [
        {
            id: 0,
            name: 'Player 1',
            // color: undefined,
            team: undefined
        },
        {   id: 1,
            name: 'Player 2',
            // color: undefined,
            team: undefined
        }
    ];
}

function initGame() {
    game = {
        teamChooseFase: true,
        roundCount: 1,
        turnCount: 1,
        currentTeam: undefined,
        currentPlayerId: undefined
    }   
}

function initBoard() {
    board = {
        $element : $( '#board' ),
        rows: ( NUMBER_OF_HEROES_IN_COLUMN - 1 ) * NUMBER_OF_CELLS_BETWEEN_HEROES + NUMBER_OF_HEROES_IN_COLUMN,
        columns: ( NUMBER_OF_HEROES_IN_ROW - 1 ) * NUMBER_OF_CELLS_BETWEEN_HEROES + NUMBER_OF_HEROES_IN_ROW,
        cells : [],
        isSelectionBlocked: false
    }
    
    for ( let row = 0; row < board.rows; row++ ) {
        board.$element.append( $( `<div class="row" id="row-${row}">` ) ); 
    }

    for ( let column = 0; column < board.columns; column++ ) { 
        board.cells[ column ] = [];
    }

    for ( let row = 0; row < board.rows; row++ ) {        
        for ( let column = 0; column < board.columns; column++ ) {
            let cellId = `cell-${column}-${row}`;                    
            $( '#row-' + row ).append( $( `<div class="cell" id="${cellId}">` ) );        
            let $cell = $( '#' + cellId );       
            let cell = {};  
            cell.$element = $cell;
            cell.indexes = { x: column, y: row };
            cell.isAvailable = false;
            cell.isPathCell = false; 
            let cellSize = vmin2px( 100 / board.rows ); 
            $cell.css( 'width', cellSize + 'px' );
            $cell.css( 'height', cellSize + 'px' );
            setCellOrHeroElementSize( $cell );
            board.cells[ column ][ row ] = cell;
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
    let randomHeroesTeams = shuffle( [  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1 ] );
    let heroCounter = 0;

    for ( let row = 0; row < board.rows; row++ ) {
        for ( let column = 0; column < board.columns; column++ ) {
            if ( column % ( NUMBER_OF_CELLS_BETWEEN_HEROES + 1 ) == 0 &&
                 row % ( NUMBER_OF_CELLS_BETWEEN_HEROES + 1 ) == 0 &&
                 heroCounter < NUMBER_OF_HEROES_IN_ROW * NUMBER_OF_HEROES_IN_COLUMN ) { 

                let heroId = `hero-${randomHeroesId[ heroCounter ]}`;                                    
                board.$element.append( $( `<div class="unit hero" id="${heroId}">` ) );    
                let $hero = $( '#' + heroId ); 
                let heroIndexes = { x: column, y: row };  
                setCellOrHeroElementSize( $hero );     
                setHeroElementPosition( heroIndexes, heroId );    
                setHeroBackground( randomHeroesId[ heroCounter ] );
                let team = randomHeroesTeams[ randomHeroesId[ heroCounter ] ];  

                if ( team == 0 ) {
                    $hero.addClass( 'team0' );
                } else {
                    $hero.addClass( 'team2' );
                }

                for ( let unit of units ) {
                    if ( unit.id == randomHeroesId[ heroCounter ] ) {                        
                        unit.indexes = heroIndexes;
                        unit.isCurrent = false;
                        unit.$element = $hero;   
                        unit.team = TEAMS[ team ];     
                        unit.isCurrent = false;
                        unit.isPartlyMoved = false;               
                    }
                }

                heroCounter++;
            }
        }    
    }
}

function initSidePanel() {
    // sidePanel = {
    //     // fase: 'Team Choose',
    //     turnCounter: 0,
    //     currentPlayerId: undefined
    // }

    $( '#round' ).append( 'TEAM CHOOSE FASE');
    $( '#turn' ).append( 'Choose your team by clicking a hero TWICE in a row!');
}

// function initTurnInfoPanel( unit ) {
//     if ( ! battleFase ) {
//         player1.team = unit.team;

//         if ( unit.team == 1 ) {
//             player1.color = 'Red';
//             player1.current = true;
//             player2.team = 2;
//             player2.color = 'Blue';
//             player2.current = false;
//             setTeamUnitsUnselectable( 2 ) ;
//         } else {
//             player1.color = 'Blue';
//             player1.current = false;
//             player2.team = 1;
//             player2.color = 'Red';
//             player2.current = true;
//             setTeamUnitsUnselectable( 1 ) ;    
//         }

//         battleFase = true;

//         updateTurnInfoPanel();
//     }
// }