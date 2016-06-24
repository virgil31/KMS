Ext.define('CL.store.S_quick_search',{
    extend: 'Ext.data.Store',

    //autoLoad: true,

    model: 'CL.model.M_quick_search',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/quick_search/list.php'
            //update: 'data/us_document/edit.php',
            //destroy: 'data/us_document/destroy.php'
            //create: 'data/us/create.php',
        },

        reader:{
            type:'json',
            rootProperty:'result'
        }

        /*writer: {
            type: 'json',
            encode: true,
            root: 'data'
        }*/
    }

});