Ext.define('CL.model.M_collection_external_resource', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',                        type: 'int'},
        {name: 'collection_id',             type: 'int'},
        {name: 'title',                     type: 'string'},
        {name: 'url',                       type: 'string'},
        {name: 'type_id',                   type: 'int'},
        {name: 'type_name',                 type: 'string'}
    ]
});