Ext.define('CL.store.S_event_tag',{
    extend: 'Ext.data.Store',

    autoSync: false,
    //autoLoad: true,

    //remoteSort: true,

    model: 'CL.model.M_event_tag',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/event_tag/list.php',
            create: 'data/event_tag/create.php',
            destroy: 'data/event_tag/destroy.php'
            //update: 'data/event_external_resource/edit.php'
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