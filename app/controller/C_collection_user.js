Ext.define('CL.controller.C_collection_user', {
    extend: 'Ext.app.Controller',

    stores: [
        'S_collection_user'
    ],
    models: [
        'M_collection_user'
    ],
    views: [
        'collection_user.V_list_by_collection',
        'collection_user.V_create'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({
            'collection_user_create button[action=do_create]':{
                click: this.doCreate
            }
        }, this);
    },
    /////////////////////////////////////////////////

    //ON CREATE
    onCreate: function(targetEl){
        Ext.StoreManager.lookup("S_user").load({
            callback: function () {
                Ext.widget("collection_user_create",{
                    animateTarget: targetEl
                });
            }
        });
    },

    //DO CREATE
    doCreate: function (btn) {
        var win = btn.up("window"),
            form = win.down("form"),
            values = form.getValues();


        if(form.isValid()){
            values.collection_id = (window.location.hash.split("/"))[1];

            var store = Ext.StoreManager.lookup("S_collection_user");
            store.add(values);
            store.sync({
                success: function () {
                    store.reload();
                    win.close();
                },
                failure: function (batch) {
                    store.rejectChanges();
                    var error_message = batch.proxy.getReader().metaData.msg

                    store.reload();

                    Ext.Msg.alert("Attenzione!",error_message);
                }
            });

        }
    }

});
