Ext.define('CL.controller.C_user', {
    extend: 'Ext.app.Controller',

    routes: {
        'user/:aaa' : 'showView'
    },

    stores: [
        'S_user'
    ],
    models: [
        //
    ],
    views: [
        'user.V_profile'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({

        }, this);
    },
    /////////////////////////////////////////////////

    //SHOW VIEW
    showView: function(param1){

        var user_id = param1;

        if(Ext.ComponentQuery.query('user_profile').length == 0)
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].add({xtype: 'user_profile'});

        Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('user_profile_id');
        // ^^

        Ext.StoreManager.lookup('S_user').load({
            callback: function(){
                var record = this.getById(param1);
                Ext.ComponentQuery.query("user_profile label[name=first_last_name]")[0].setText(record.get("last_name")+" "+record.get("first_name")+" (#"+record.get("id")+")");
                Ext.ComponentQuery.query("user_profile label[name=group_name]")[0].setText(record.get("group_name"));
                Ext.ComponentQuery.query("user_profile label[name=email_address]")[0].setText(record.get("email_address"));
            }
        });

        Ext.ComponentQuery.query('user_profile grid[name=collections]')[0].getStore().load({
            params: {
                user_id: user_id
            }
        });

        //se sto guardando il MIO profilo, sblocco i pulsanti per la creazione di eventi e collection
        // altrimenti li nascondo
        if(Ext.util.Cookies.get("user_id") === param1){
            Ext.ComponentQuery.query('user_profile button[name=on_create_event]')[0].show();
            Ext.ComponentQuery.query('user_profile button[name=on_create_collection]')[0].show();
        }
        else{
            Ext.ComponentQuery.query('user_profile button[name=on_create_event]')[0].hide();
            Ext.ComponentQuery.query('user_profile button[name=on_create_collection]')[0].hide();
        }
    }

});
