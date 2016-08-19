Ext.define('CL.controller.C_user_pool', {
    extend: 'Ext.app.Controller',

    stores: [
        'S_user_pool'
    ],
    models: [
        'M_user_pool'
    ],
    views: [
        'user_pool.V_list_by_user',
        'user_pool.V_create',
        'user_pool.V_edit'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({

        }, this);
    },
    ////////////////////////////////////////////////

    // ON CREATE
    onCreate: function (targetEl) {
        Ext.StoreManager.lookup("S_user").load();
        Ext.widget("user_pool_create",{
            animateTarget: targetEl
        });
    },

    // DO CREATE
    doCreate: function(btn){
        var win = btn.up("window"),
            form = win.down("form").getForm(),
            values = form.getValues();

        if(form.isValid()){

            win.mask("Creazione Gruppo...");

            Ext.StoreManager.lookup("S_user_pool").add(values);
            Ext.StoreManager.lookup("S_user_pool").sync({
                callback: function () {
                    win.unmask();
                    Ext.StoreManager.lookup("S_user_pool").rejectChanges();
                    win.close();
                    Ext.StoreManager.lookup("S_user_pool").reload();
                }
            });
        }
    },

    // ON EDIT
    onEdit: function (rec, targetEl) {
        Ext.StoreManager.lookup("S_user").load();
        var win = Ext.widget("user_pool_edit",{
            animateTarget: targetEl
        });
        
        win.down("form").loadRecord(rec);
    },

    // DO EDIT
    doEdit: function(btn){
        var win = btn.up("window"),
            form = win.down("form").getForm(),
            values = form.getValues(),
            record = form.getRecord();

        if(form.isValid()){

            win.mask("Modifica Gruppo...");

            record.set(values);
            Ext.StoreManager.lookup("S_user_pool").sync({
                callback: function () {
                    win.unmask();
                    Ext.StoreManager.lookup("S_user_pool").rejectChanges();
                    win.close();
                    Ext.StoreManager.lookup("S_user_pool").reload();
                }
            });
        }
    },

    // ON DESTROY
    onDestroy: function(rec){
        var pool_id = rec.get("pool_id"),
            pool_name = rec.get("pool_name");

        Ext.Msg.confirm("Attenzione!","Sicuro di voler eliminare il gruppo:<br> <b>"+pool_name+"</b>?<br><br>Le liste dei collaboratori ad esso associate<br>rimarranno comunque <u>invariate</u>.",function (btnId) {
            if(btnId == "yes"){
                Ext.StoreManager.lookup("S_user_pool").remove(rec);
                Ext.StoreManager.lookup("S_user_pool").sync();
            }
        });
    }

});
