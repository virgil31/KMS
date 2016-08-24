Ext.define('CL.store.S_event',{
    extend: 'Ext.data.Store',

    //autoSync: true,
    //autoLoad: true,

    model: 'CL.model.M_event',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/event/list.php',
            create: 'data/event/create.php',
            destroy: 'data/event/destroy.php',
            update: 'data/event/edit.php'

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