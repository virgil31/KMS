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

    // SHOW INFO
    showInfo: function (targetEl) {
        Ext.create("Ext.window.Window",{
            animateTarget: targetEl,
            autoShow: true,
            modal: true,
            title: 'Chi/Cosa sono i Collaboratori?',
            width: 400,
            height: 275,
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items:[
                {
                    xtype: 'image',
                    src: 'images/icons/icon_info.png',
                    alt: ' ',
                    width: 50,
                    height: 50,
                    margin: '10 0 10 0'
                },
                {
                    xtype: 'label',
                    html:   "<div style='text-align: center'>Un collaboratore è un utente che ha la capacità di aggiungere," +
                            "<br>modificare ed eliminare il contenuto di una Collezione. " +
                            "<br><br>Sia il creatore della Collezione che l'utente designato " +
                            "<br>come gestore di quest'ultimi avranno la possibilità di " +
                            "<br>modificare la lista di collaboratori di una Collezione.</div>"
                }
            ],
            buttonAlign: 'center',
            buttons:[
                {
                    text: 'Capito!',
                    handler: function () {
                        this.up("window").close();
                    }
                }
            ]
        });
    },


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
