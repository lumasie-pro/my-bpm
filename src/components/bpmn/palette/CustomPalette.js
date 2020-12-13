/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */
import {
    assign
} from 'min-dash';

export default function PaletteProvider(palette, create, elementFactory, globalConnect, translate) {
    this.create = create
    this.elementFactory = elementFactory
    this.globalConnect = globalConnect
    this.translate = translate

    palette.registerProvider(this)
}

PaletteProvider.$inject = [
    'palette',
    'create',
    'elementFactory',
    'globalConnect'
]

PaletteProvider.prototype.getPaletteEntries = function(element) { // 此方法和上面案例的一样
    const {
        create,
        handTool,
        translate,
        elementFactory
    } = this;
    function createTask() {
        return function(event) {
            const shape = elementFactory.createShape({
                type: 'bpmn:Task'
            });
            console.log(shape) // 只在拖动或者点击时触发
            create.start(event, shape);
        }
    }
    function createAction(type,options){
        return function(event){
            var shape = elementFactory.createShape(assign({ type: type }, options));
            if (options) {
                shape.businessObject.di.isExpanded = options.isExpanded;
            }
            create.start(event, shape);
        }
    }

    return {
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
        'tool-separator': {
            group: 'tools',
            separator: true
        },
        'create.start-event':{
            group: 'event',
            className: 'bpmn-icon-start-event-none',
            title: translate('Create StartEvent'),
            action: {
                dragstart: createAction('bpmn:StartEvent'),
                click: createAction('bpmn:StartEvent')
             }
        },
        'create.lindaidai-task': {
            group: 'model',
            className: 'icon-custom lindaidai-task',
            title: '创建一个类型为lindaidai-task的任务节点',
            action: {
                dragstart: createTask(),
                click: createTask()
            }
        }
    }
}
