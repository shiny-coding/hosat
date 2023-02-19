class Action {
    constructor( ap, area, attribute, damage, duration, effect, id, imageFileName, name, distance, sign, target, type, unitId, value ) {
        this.ap = ap;
        this.area = area;
        this.attribute = attribute;
        this.damage = damage;
        this.duration = duration;
        this.effect = effect;
        this.id = id;        
        this.imageFileName = imageFileName;
        this.isSelected = false;
        this.name = name;
        this.distance = distance;
        this.sign = sign;
        this.target = target;
        this.type = type;  
        this.unitId = unitId; 
        this.value = value; 
        this.$element = undefined;
        // Action.actions.push( this );
    }

    // static actions = [];

    static getActionById( actionId ) {
        for ( let action of Action.actions ) {
            if ( action.id == actionId ) {
                return action;
            }
        }
    }

    static getActionByElement( $action ) {
        for ( let action of Action.actions ) {
            if ( ( 'action-' + action.id ) == $action.attr( 'id' ) ) {
                return action;
            }
        }
    }

    // static createActionElement() {
    //     let $element = $( `<div class="action" id="action-${this.id}">${this.name}</div>`);
    //     $( '#unit-actions' ).append( $element ); 

    //     // for ( let actionId of unit.actionsIds ) {
    //     //     let action = Action.getActionById( actionId );
    //     //     let $element = $( `<div class="action" id="action-${action.id}">${action.name}</div>`);
    //     //     $( '#unit-actions' ).append( $element ); 
    //     //     unit.$element = $element;
    //     // }
    // }
}