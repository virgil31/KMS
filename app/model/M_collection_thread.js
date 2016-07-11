Ext.define('CL.model.M_collection_thread', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',                        type: 'int'},
        {name: 'title',                     type: 'string'},

        {name: 'created_by',                type: 'int'},
        {name: 'created_by_name',           type: 'string'},

        {name: 'closed_by',                type: 'int'},
        {name: 'closed_by_name',           type: 'string'},

        {name: 'created_at',    type: 'date', dateReadFormat: 'Y-m-d H:i:s.u',  dateWriteFormat: 'd-m-Y H:i'},
        {name: 'closed_at',     type: 'date', dateReadFormat: 'Y-m-d H:i:s.u',  dateWriteFormat: 'd-m-Y H:i'},

        {name: 'collection_id',             type: 'int'},
        {name: 'collection_name',           type: 'string'}
    ]
});