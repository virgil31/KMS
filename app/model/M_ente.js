Ext.define('CL.model.M_ente', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',                    type: 'int'},
        {name: 'legal_name',            type: 'string'},
        {name: 'short_name',            type: 'string'}
    ]
});