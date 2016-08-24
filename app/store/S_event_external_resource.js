Ext.define('CL.store.S_event_external_resource',{
    extend: 'Ext.data.Store',

    autoSync: false,
    //autoLoad: true,

    //remoteSort: true,

    model: 'CL.model.M_event_external_resource',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/event_external_resource/list.php',
            create: 'data/event_external_resource/create.php',
            destroy: 'data/event_external_resource/destroy.php',
            update: 'data/event_external_resource/edit.php' 
        },

        reader:{
            type:'json',
            rootProperty: 'result',
            successProperty: 'success'
        },

        writer: {
            type: 'json',
            encode: true,
            rootProperty: 'data',
            writeAllFields: true
        }
    }

});