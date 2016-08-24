Ext.define('CL.model.M_event', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',            type: 'int'},
        {name: 'title',         type: 'string'},
        {name: 'description',   type: 'string'},

        {name: 'tags',          type: 'string'},
        {name: 'created_at',    type: 'date', dateReadFormat: 'Y-m-d H:i:s.u',  dateWriteFormat: 'd-m-Y H:i'},
        {name: 'closed_at',    type: 'date', dateReadFormat: 'Y-m-d H:i:s.u',  dateWriteFormat: 'd-m-Y H:i'},


        {name: 'created_by',        type: 'int'},
        {name: 'created_by_name',   type: 'string'}
    ]
});