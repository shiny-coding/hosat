class Action {
    constructor( 
        ap, 
        area, 
        attribute, 
        damage, 
        duration, 
        effect, 
        id, 
        imageFileName, 
        name, 
        distance, 
        sign, 
        target, 
        type, 
        unitId, 
        value,
        $element
    ) {
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
        this.$element = $element;
        this.$element.click( this.onActionClick );
        // $( 'body' ).on( 'click', '.action', onActionClick );
    }

    static actions = [];
    static $actions = $( '.action' );

    static createActions( gameData ) {
        let actions = [];
        //TODO
        // type: buff, debuff, damage, control, 
        // air : 1.Haste. 2. wind blow
        // spells: magic mirror, 
        // earth: slow, rock armor
        // Stats Enhancement
        // Stats Weakening
        // Displacement смещение
        for ( let item of gameData.actions ) {
            let $element = $( `<div class="action" id="action-${item.id}">${item.name}</div>`);
            let action = new Action( 
                item.ap,
                item.area, 
                item.attribute,
                item.damage, 
                item.duration, 
                item.effect, 
                item.id, 
                item.imageFileName,
                item.name, 
                item.distance,
                item.sign,
                item.target,
                item.type,
                item.unitId, 
                item.value,
                $element
            );

            actions.push( action );
            $( '#unit-actions' ).append( $element ); 
        }

        return actions;
    }

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

    onActionClick( event ) {
        let $action = $( this );
        let action = Action.getActionByElement( $action ); 
        
        if ( action.isSelected == false ) {
            for ( let action of Action.actions ) {
                action.isSelected = false;
                action.$element.removeClass( 'action-selected' );
            }
    
            action.isSelected = true;
            action.$element.addClass( 'action-selected' );
        } else {
            action.isSelected = false;
            action.$element.removeClass( 'action-selected' );
        }
    
        Unit.updateInfoPanel();
    
        markPossibleTargets( action.id );
    }
}