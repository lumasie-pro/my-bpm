import {
    assign
} from 'min-dash';


/**
 * A palette provider for BPMN 2.0 elements.
 */
export default function PaletteProvider(
    palette, create, elementFactory,
    handTool,
    globalConnect, translate) {

    this._palette = palette;
    this._create = create;
    this._elementFactory = elementFactory;
    this._handTool = handTool;
    this._globalConnect = globalConnect;
    this._translate = translate;

    palette.registerProvider(this);
}

PaletteProvider.$inject = [
    'palette',
    'create',
    'elementFactory',
    'handTool',
    'globalConnect',
    'translate'
];


PaletteProvider.prototype.getPaletteEntries = function() {

    var actions = {},
        create = this._create,
        elementFactory = this._elementFactory,
        handTool = this._handTool,
        globalConnect = this._globalConnect,
        translate = this._translate;

    function createAction(type, group, className, title, options) {

        function createListener(event) {
            var shape = elementFactory.createShape(assign({ type: type }, options));

            if (options) {
                shape.businessObject.di.isExpanded = options.isExpanded;
            }

            create.start(event, shape);
        }

        var shortType = type.replace(/^bpmn:/, '');

        return {
            group: group,
            className: className,
            title: title || translate('Create {type}', { type: shortType }),
            action: {
                dragstart: createListener,
                click: createListener
            }
        };
    }

    function createSubprocess(event) {
        var subProcess = elementFactory.createShape({
            type: 'bpmn:SubProcess',
            x: 0,
            y: 0,
            isExpanded: true
        });

        var startEvent = elementFactory.createShape({
            type: 'bpmn:StartEvent',
            x: 40,
            y: 82,
            parent: subProcess
        });

        create.start(event, [ subProcess, startEvent ], {
            hints: {
                autoSelect: [ startEvent ]
            }
        });
    }

    function createParticipant(event) {
        create.start(event, elementFactory.createParticipantShape());
    }

    assign(actions, {
        'hand-tool': {
            group: 'tools',
            className: 'bpmn-icon-hand-tool',
            title: translate('Activate the hand tool'),
            action: {
                click: function(event) {
                    handTool.activateHand(event);
                }
            }
        },
        'global-connect-tool': {
            group: 'tools',
            className: 'bpmn-icon-connection-multi',
            title: translate('Activate the global connect tool'),
            action: {
                click: function(event) {
                    globalConnect.toggle(event);
                }
            }
        },
        'tool-separator': {
            group: 'tools',
            separator: true
        },
        'create.start-event': createAction(
            'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none',
            translate('Create StartEvent')
        ),
        'create.end-event': createAction(
            'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none',
            translate('Create EndEvent')
        ),
        'create.exclusive-gateway': createAction(
            'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-none',
            translate('Create Gateway')
        ),
        'create.task': createAction(
            'bpmn:Task', 'activity', 'bpmn-icon-task',
            translate('Create Task')
        ),
        'create.subprocess-expanded': {
            group: 'activity',
            className: 'bpmn-icon-subprocess-expanded',
            title: translate('Create expanded SubProcess'),
            action: {
                dragstart: createSubprocess,
                click: createSubprocess
            }
        },
        'create.participant-expanded': {
            group: 'collaboration',
            className: 'bpmn-icon-participant',
            title: translate('Create Pool/Participant'),
            action: {
                dragstart: createParticipant,
                click: createParticipant
            }
        },
        'create.group': createAction(
            'bpmn:Group', 'artifact', 'bpmn-icon-group',
            translate('Create Group')
        ),
    });

    return actions;
};
