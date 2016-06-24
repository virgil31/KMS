Ext.define('CL.model.M_quick_search', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',                type: 'int'},
        {name: 'type',              type: 'string'},
        {name: 'description',       type: 'string'},
        {name: 'to_display',      type: 'string'}
        //{name: 'total_likes',     type: 'int'}
    ]
});