Ext.define('CL.store.S_event_thread',{
    extend: 'Ext.data.Store',

    autoSync: false,
    //autoLoad: false,
    //remoteSort: true,

    model: 'CL.model.M_event_thread',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/event_thread/list.php',
            create: 'data/event_thread/create.php',
            destroy: 'data/event_thread/destroy.php',
            update: 'data/event_thread/edit.php' 
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