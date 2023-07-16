class Action {
    constructor( $element ) {

        this.$element = $element;
        this.$element.click( this.onActionClick );
        // $( 'body' ).on( 'click', '.action', onActionClick );
    }

    static actions = [];
    static $actions = $( '.action' );

    static createActions( actionsDatas ) {
        let actions = [];
		let $unitActions = $( '#unit-actions' );
        for ( let actionData of actionsDatas ) {
            let $element = $( `<div class="action" data-name="${actionData.name}">${actionData.name}</div>`);
			$element.hide();
            let action = new Action( $element );
			Object.assign( action, actionData );

            actions.push( action );
			$unitActions.append( $element );
        }

		$unitActions.hide();

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