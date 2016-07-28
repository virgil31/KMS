Ext.define('CL.model.M_collection_tag', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',                        type: 'int'},
        {name: 'collection_id',             type: 'int'},
        {name: 'type',                      type: 'string'},
        {name: 'target_id',                 type: 'string'}
    ]
});