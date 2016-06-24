Ext.define('CL.model.M_user', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',                type: 'int'},
        {name: 'first_name',        type: 'string'},
        {name: 'last_name',         type: 'string'},
        {name: 'email_address',     type: 'string'},
        {name: 'group_name',        type: 'string'}
    ]
});