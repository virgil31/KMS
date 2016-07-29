Ext.define('CL.controller.C_collection_tag', {
    extend: 'Ext.app.Controller',

    stores: [
        'S_collection_tag'
    ],
    models: [
        'M_collection_tag'
    ],
    views: [
        'collection_tag.V_list_by_collection'
        //'collection_tag.V_create',
        //'collection_tag.V_edit'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({

            //ON CREATE
           'collection_tag_list_by_collection button[action=on_create]':{
               click: this.onCreate
           },

            //DO CREATE
            "collection_tag_create button[action=do_create]":{
                click: this.doCreate
            }

        }, this);
    },
    /////////////////////////////////////////////////

    // ON CREATE
    onCreate: function (btn) {
        alert("TODO create");
        /*
        Ext.widget("collection_tag_create",{
            animateTarget: btn.el
        });
        */
    },

    // DO CREATE
    doCreate: function (btn) {
        var win = btn.up("window"),
            form = win.down("form"),
            values = form.getValues();


        var collection_id = (window.location.hash.split("/"))[1];
        values.collection_id = collection_id;

        if(form.isValid()){
            Ext.StoreManager.lookup("S_collection_tag").add(values);
            Ext.StoreManager.lookup("S_collection_tag").sync();
        }
    }
    
});