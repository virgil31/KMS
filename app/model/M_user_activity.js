Ext.define('CL.model.M_user_activity', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',                    type: 'int'},
        {name: 'user_id',               type: 'int'},
        {name: 'user_name',             type: 'string'},
        {name: 'activity_description',  type: 'string'},
        {name: 'date',                  type: 'date', dateReadFormat: 'Y-m-d H:i:s.u',  dateWriteFormat: 'd-m-Y H:i'}
    ]
});