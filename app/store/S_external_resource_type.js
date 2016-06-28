Ext.define('CL.store.S_external_resource_type',{
    extend: 'Ext.data.Store',

    //autoSync: false,
    autoLoad: true,

    //remoteSort: true,

    model: 'CL.model.M_generic',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/external_resource_type/list.php',
            //create: 'data/collection_external_resource/create.php',
            //destroy: 'data/collection_external_resource/destroy.php',
            //update: 'data/collection_external_resource/edit.php'
        },

        reader:{
            type:'json',
            rootProperty: 'result',
            successProperty: 'success'
        }/*,

        writer: {
            type: 'json',
            encode: true,
            rootProperty: 'data',
            writeAllFields: true
        }*/
    }

});