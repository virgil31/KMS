Ext.define('CL.model.M_user_pool', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'pool_id',               type: 'int'},
        {name: 'pool_name',             type: 'string'},

        {name: 'user_id',               type: 'int'},
        {name: 'user_name',             type: 'string'},

        {name: 'created_by',            type: 'int'},
        {name: 'created_by_name',       type: 'string'}
     
    ]
});