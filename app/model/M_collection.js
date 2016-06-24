Ext.define('CL.model.M_collection', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',            type: 'int'},
        {name: 'title',         type: 'string'},
        {name: 'description',   type: 'string'},
        {name: 'tags',          type: 'string'},
        {name: 'created_at',    type: 'date'},

        {name: 'created_by',        type: 'int'},
        {name: 'created_by_name',   type: 'string'}
    ]
});