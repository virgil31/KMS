Ext.define('CL.model.M_quick_search', {
    extend: 'Ext.data.Model',

    idProperty: 'composed_id',

    fields: [
        {name: 'id',                type: 'int'},
        {name: 'composed_id',               type: 'string'},
        {name: 'type',              type: 'string'},
        {name: 'description',       type: 'string'},
        {name: 'to_display',      type: 'string'}
        //{name: 'total_likes',     type: 'int'}
    ]

});