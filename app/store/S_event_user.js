Ext.define('CL.store.S_event_user',{
    extend: 'Ext.data.Store',

    autoSync: false,
    //autoLoad: true,

    //remoteSort: true,

    model: 'CL.model.M_event_user',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/event_user/list.php',
            create: 'data/event_user/create.php',
            destroy: 'data/event_user/destroy.php',
            update: 'data/event_user/edit.php' //usato solamente per l'elezione del gestore dei collaboratori
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