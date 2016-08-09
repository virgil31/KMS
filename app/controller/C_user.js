Ext.define('CL.controller.C_user', {
    extend: 'Ext.app.Controller',

    routes: {
        'user/:aaa' : 'showView',
        'user/:aaa/edit' : 'showViewEdit'
    },

    stores: [
        'S_user'
    ],
    models: [
        //
    ],
    views: [
        'user.V_profile',
        'user.V_edit'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({
            "user_edit button[action=do_edit]":{
                click: this.doEdit
            }
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

                Ext.ComponentQuery.query("user_profile grid[name=user_activity]")[0].setTitle("Attività Recenti di <div style='font-weight: bold; display: inline;' >"+record.get("last_name")+" "+record.get("first_name")+"</div>");
                Ext.ComponentQuery.query("user_profile grid[name=user_interested_activity]")[0].setTitle("Attività d'Interesse per <div style='font-weight: bold; display: inline;' >"+record.get("last_name")+" "+record.get("first_name")+"</div>");

            }
        });

        Ext.ComponentQuery.query('user_profile grid[name=collections]')[0].getStore().load({
            params: {
                user_id: user_id
            }
        });


        Ext.StoreManager.lookup("S_user_activity").proxy.extraParams.user_id = user_id;
        Ext.StoreManager.lookup("S_user_activity").loadPage(1);

        Ext.StoreManager.lookup("S_user_interested_activity").proxy.extraParams.user_id = user_id;
        Ext.StoreManager.lookup("S_user_interested_activity").loadPage(1);




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
    },

    //SHOW VIEW EDIT
    showViewEdit: function(user_id) {

        // se non sono loggato ed il mio user_id non corrisponde con quello che voglio modificare
        // allora rimando alla home page
        if(Ext.util.Cookies.get("user_id") == null || Ext.util.Cookies.get("user_id") !== user_id){
            CL.app.getController("C_user").redirectTo("home");
            document.location.reload(true);
        }

        if (Ext.ComponentQuery.query('user_edit').length == 0)
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].add({xtype: 'user_edit'});

        Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('user_edit_id');
        // ^^

        // ottengo il record dello user per caricarlo nel form
        Ext.ComponentQuery.query("user_edit form")[0].getForm().reset();
        Ext.StoreManager.lookup("S_user").load({
            callback:function () {
                this.each(function(record_user){
                    if(record_user.get("id") == user_id)
                        Ext.ComponentQuery.query("user_edit form")[0].getForm().loadRecord(record_user);
                });
            }
        });
    },

    // DO EDIT
    doEdit: function (btn) {
        var form = btn.up("form"),
            record = form.getRecord(),
            values = form.getValues();

        record.set(values);

        if(form.isValid){
            if(record.dirty){
                Ext.StoreManager.lookup("S_user").sync({
                    success: function () {

                        Ext.create("Ext.window.Window", {
                            autoShow: true,
                            modal: true,
                            closable: false,
                            draggable: false,
                            resizable: false,
                            title: 'Profilo Aggiornato!',
                            padding: 10,
                            layout: {
                                type: 'vbox',
                                align: 'center'
                            },
                            items: [
                                {
                                    xtype: 'image',
                                    src: 'images/icons/icon_ok.png',
                                    alt: " ",
                                    width: 60,
                                    height: 60
                                },
                                {
                                    xtype: 'label',
                                    html: '<div style="text-align: center">Le tue informazioni sono state salvate!</div>',
                                    margin: '10 0 10 0'
                                }
                            ],
                            buttonAlign: 'center',
                            buttons: [
                                {
                                    text: 'Perfetto!',
                                    handler: function () {
                                        CL.app.getController("C_user").redirectTo("user/"+record.get("id"));
                                        document.location.reload(true);
                                    }
                                }
                            ]
                        });
                    },
                    failure: function () {
                        Ext.Msg.alert("Ops...","C'è stato un problema :( Si prega di riprovare più tardi.")
                    }
                });
            }
            else{
                CL.app.getController("C_user").redirectTo("user/"+record.get("id"));
                document.location.reload(true);
            }


        }
    }

});
