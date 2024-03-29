class Game {
    constructor() {
        this.teamChooseFase = true;
        this.currentTeam = undefined;
        this.currentPlayerId = undefined;
        this.roundCount = 1;
        this.turnCount = 1;
        this.isSelectionBlocked = false;
        this.players = [
            {
                id: 0,
                name: 'Player 1',
                team: undefined
            },
            {   id: 1,
                name: 'Player 2',
                team: undefined
            }
        ];
        this.TEAMS = [ 0, 1 ]; // TODO
        this.$end = $( '#end' );
        this.$end.click( this.onEndClick );
        // $( 'body' ).on( 'click', '.action', onActionClick );
    }

    static game = {};

    static createGame() {
        Game.game = new Game();
        Game.game.initiateTurnsInfoPanel();
    }

    initiateTurnsInfoPanel() {
        $( '#round' ).append( 'TEAM CHOOSE FASE');
    }

    // /**
    //  * @param {Cell} cell
    //  */
    updateTurnsInfoPanel() {
        // if ( Game.game.currentTeam ) {
            $( '#round' ).text( 'Round ' + Game.game.roundCount );

            if ( Game.game.currentTeam == Game.game.TEAMS[0] ) {
                $( '#turn' ).removeClass( 'team1-color' );
                $( '#turn' ).addClass( 'team0-color' );
                $( '#turn' ).text( 'Turn ' + Game.game.turnCount + ' ( Black team )' );

            } else {
                $( '#turn' ).removeClass( 'team0-color' );
                $( '#turn' ).addClass( 'team1-color' );
                $( '#turn' ).text( 'Turn ' + Game.game.turnCount + ' ( White team )' );
            }
        // }
    }

    onEndClick( event ) {
        if ( Game.game.teamChooseFase || Game.game.isSelectionBlocked ) return;

		const TURNS_PER_ROUND = 12;
        if ( Game.game.turnCount == TURNS_PER_ROUND ) {
            Game.game.roundCount++;
            Game.game.turnCount = 1;

            for ( let unit of Unit.units ) {
                unit.usedTurn = false;
                unit.actionPoints = unit.defaultState.actionPoints; //TODO учесть заклинания
            }
        } else {
            Game.game.turnCount++;

            // for ( let unit of Unit.units ) {
            //     if ( unit.actionPoints < unit.defaultState.actionPoints && unit.actionPoints > 0 ) {
            //         unit.usedTurn = true;
            //     }
            // }

			// What about summoned units ?

			let currentUnit = Unit.getCurrentUnit();
			if ( currentUnit ) {
				currentUnit.usedTurn = true;
				currentUnit.actionPoints = currentUnit.defaultState.actionPoints;
			}
        }

        Cell.$cells.removeClass( 'available-cell' );
        $( '#unit-stats' ).text( '' );

        if ( Game.game.currentTeam == Game.game.TEAMS[0] ) {
            Game.game.currentTeam = Game.game.TEAMS[1];
            Game.game.currentPlayerId = 1;
        } else {
            Game.game.currentTeam = Game.game.TEAMS[0];
            Game.game.currentPlayerId = 0;
        }

        Unit.updateInfoPanel();
    }
}