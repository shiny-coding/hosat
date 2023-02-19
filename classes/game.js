class Game {
    constructor( gameData ) {
        // this.players = 
        this.cells = Board.createCells();
        this.units = Board.createUnits( gameData );

        //---------------------------------------------------------------------

        this.teamChooseFase = true;
        this.currentTeam = undefined;
        this.currentPlayerId = undefined;
        this.roundCount = 1;
        this.turnCount = 1;
        this.isSelectionBlocked = false;
    } 
}