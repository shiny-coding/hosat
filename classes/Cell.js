class Cell {
    constructor( id, indexes, $cell ) {     
        this.id = id;   
        this.indexes = indexes;
        this.isAvailable = false;
        this.isPathCell = false; 
        this.$element = $cell;
    }

    // constructor( id, indexes ) {     
    //     this.id = id;   
    //     this.indexes = indexes;
    //     this.isAvailable = false;
    //     this.isPathCell = false; 
    //     this.$element = undefined;
    // }

    static getCellById( cellId ) {
        for ( let cell of game.cells ) {
            if ( cell.id == cellId ) {
                return cell;
            }
        }
    }
}