Ext.define('CL.model.M_event_file', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'event_id',            type: 'int'},
        {name: 'file_id',            type: 'int'},
        {name: 'title',         type: 'string'},

        {name: 'full_title',         type: 'string'}, //titolo+estensione
        {name: 'type',          type: 'string'},
        {name: 'uploaded_at',   type: 'date'}
    ]
});