Ext.define('CL.model.M_search', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',                type: 'int'},
        {name: 'type',              type: 'string'},
        {name: 'description',               type: 'string'},
        {name: 'tooltip',                   type: 'string'},
    ]
});