Ext.define('CL.model.M_event_thread_message', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',                        type: 'int'},
        {name: 'message',                   type: 'string'},

        {name: 'thread_id',                 type: 'int'},
        {name: 'thread_name',               type: 'string'},
        {name: 'thread_prefix',             type: 'string'},

        {name: 'sent_by',                   type: 'int'},
        {name: 'sent_by_name',              type: 'string'},

        {name: 'sent_at',    type: 'date', dateReadFormat: 'Y-m-d H:i:s.u',  dateWriteFormat: 'd-m-Y H:i'},

        {name: 'event_id',             type: 'int'},
        {name: 'event_name',           type: 'string'}
    ]
});