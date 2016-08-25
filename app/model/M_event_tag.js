Ext.define('CL.model.M_event_tag', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',                        type: 'int'},
        {name: 'event_id',                  type: 'int'},
        {name: 'type',                      type: 'string'},
        {name: 'target_id',                 type: 'string'}
    ]
});