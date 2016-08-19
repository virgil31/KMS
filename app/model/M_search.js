Ext.define('CL.model.M_search', {
    extend: 'Ext.data.Model',

    idProperty: 'composed_id',

    fields: [
        {name: 'id',                type: 'int'},
        {name: 'type',              type: 'string'},
        {name: 'composed_id',               type: 'string'},
        {name: 'description',               type: 'string'},
        {name: 'tooltip',                   type: 'string'}
    ]
});