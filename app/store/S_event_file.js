Ext.define('CL.store.S_event_file',{
    extend: 'Ext.data.Store',

    autoSync: true,
    //autoLoad: true,

    //remoteSort: true,

    model: 'CL.model.M_event_file',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/event_file/list.php',
            //create: 'data/event/create.php', //fatto dall'uploader
            destroy: 'data/event_file/destroy.php',
            update: 'data/event_file/edit.php'
        },

        reader:{
            type:'json',
            rootProperty:'result'
        },

        writer: {
            type: 'json',
            encode: true,
            rootProperty: 'data',
            writeAllFields: true
        }
    }

});