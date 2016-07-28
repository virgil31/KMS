Ext.define('CL.store.S_collection',{
    extend: 'Ext.data.Store',

    //autoSync: true,
    //autoLoad: true,

    model: 'CL.model.M_collection',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/collection/list.php',
            create: 'data/collection/create.php',
            destroy: 'data/collection/destroy.php',
            update: 'data/collection/edit.php'

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