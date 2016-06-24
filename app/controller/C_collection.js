Ext.define('CL.controller.C_collection', {
    extend: 'Ext.app.Controller',

    routes: {
        'collection/:aaa' : 'showView'
    },

    stores: [
        "S_collection"
    ],
    models: [
        "M_collection"
    ],
    views: [
        'collection.V_create',
        'collection.V_single_list'
    ],

    collection_id: null,

    //SHOW VIEW
    showView: function(collection_id){

        if(Ext.ComponentQuery.query('collection_single_list').length == 0)
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].add({xtype: 'collection_single_list'});
        else
            Ext.StoreManager.lookup("S_collection_file").loadData([],false);


        Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('collection_single_list_id');


        // ^^

        this.collection_id = collection_id;

        //resetto campi
        try{
            Ext.ComponentQuery.query("collection_single_list label[name=title]")[0].setText("");
            Ext.ComponentQuery.query("collection_single_list label[name=description]")[0].setText("");
            Ext.ComponentQuery.query("collection_single_list label[name=created_by_name]")[0].setHtml("");
        }catch(e){}

        //riseleziono il tab dei documenti
        Ext.ComponentQuery.query('collection_single_list tabpanel')[0].getLayout().setActiveItem(0);

        Ext.getBody().mask("Attendere...");

        Ext.getStore("S_collection").load({
            params:{
                collection_id: collection_id
            },
            callback: function () {
                Ext.getBody().unmask();

                //se non ritorna alcun record, vuol dire che la collection con quell'id non esiste
                if(this.getTotalCount() == 0) {
                    //piccolo controllo per evitare che se la collection non esiste non mi permette più di tornare indietro
                    if(window.location.hash == "#collection/"+collection_id)
                        CL.app.getController("C_collection").redirectTo("not_found");
                }
                else{
                    var collection = this.getAt(0),
                        title = collection.get("title"),
                        description = collection.get("description"),
                        created_by = collection.get("created_by"),
                        created_by_name = collection.get("created_by_name"),
                        created_at = collection.get("created_at");

                    //console.log(collection);

                    Ext.ComponentQuery.query("collection_single_list label[name=title]")[0].setText(title);
                    Ext.ComponentQuery.query("collection_single_list label[name=description]")[0].setHtml(description);
                    Ext.ComponentQuery.query("collection_single_list label[name=created_by_name]")[0].setHtml("Collezione creata da: <a href='#user/"+created_by+"'>"+created_by_name+"</a> il "+Ext.Date.format(created_at,'d-m-Y'));

                    //carico gli store del tabpanel
                    Ext.StoreManager.lookup("S_collection_file").load({
                        params: {
                            collection_id: collection_id
                        }
                    });
                }
            }
        })
    },


    /////////////////////////////////////////////////
    init: function () {
        this.control({
            //DO CREATE
            "collection_create button[action=do_create]":{
                click: this.doCreate
            },

            //ON DESTROY
            "collection_single_list button[action=on_destroy]":{
                click: this.onDestroy
            }
        }, this);
    },
    /////////////////////////////////////////////////

    //ON DESTROY
    onDestroy: function(){
        Ext.Msg.show({
            title:'Attenzione!',
            message: 'Sicuro di voler eliminare questa collection?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'yes') {
                    var collection_id = CL.app.getController("C_collection").collection_id,
                        store = Ext.StoreManager.lookup("S_collection"),
                        record_to_delete = Ext.StoreManager.lookup("S_collection").getById(collection_id);

                    store.remove(record_to_delete);
                    Ext.getBody().mask("Attendere...");
                    store.sync({
                        callback: function(){
                            Ext.getBody().unmask();
                            window.history.back();
                        }
                    });
                }
            }
        });
    },

    //DO DESTROY
    doDestroy: function(){
        var collection_id = CL.app.getController("C_collection").collection_id,
            store = Ext.StoreManager.lookup("S_collection");


        store.remove(Ext.create("CL.model.M_collection",{
            id: collection_id
        }));

        store.sync({
            callback: function(){

            }
        });
    },

    //ON CREATE
    onCreate: function (targetEl) {
        Ext.create("Ext.window.Window",{
            autoShow: true,
            modal: true,
            resizable: false,
            constrain: true,
            animateTarget: targetEl,
            title: 'Procedura guidata per una Nuova Collezione',
            width: 500,
            padding: 10,
            layout:{
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'image',
                    src: 'images/logos/logo_sitar_red3.png',
                    alt: ' ',
                    width: 300,
                    height: 79
                },
                {
                    xtype: 'button',
                    text: 'asd',
                    hidden: true
                },
                {
                    xtype: 'label',
                    html: '<div style="text-align: center">Proseguendo sarà possibile Lorem ipsum dolor sit amet, consectetuer<br>' +
                    'adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. <br>' +
                    'Cum sociis natoque penatibus et magnis dis parturient montes ridiculus mus. ' +
                    '</div>',
                    margin: '0 0 10 0'
                },
                {
                    xtype: 'button',
                    text: 'Avanti >',
                    margin: '0 0 10 0',
                    listeners:{
                        click: function(){
                            if(Ext.util.Cookies.get("user_id")===null)
                                Ext.Msg.alert("Attenzione","Per proseguire bisogna essere loggati.");
                            else{
                                //altrimenti chiudo le window e  mostro il form per la creazione di una collection vuota
                                /*Ext.ComponentQuery.query("window").forEach(function(win){
                                    win.destroy();
                                });*/
                                this.up("window").close();
                                Ext.widget("collection_create");
                            }
                        }
                    }
                }
            ]
        })
    },

    //DO CREATE
    doCreate: function(btn){

        var win = btn.up("window"),
            form = win.down("form").getForm(),
            values = form.getValues();

        if(form.isValid()){
            values["created_by"] = Ext.util.Cookies.get("user_id");

            values["tags"] = Ext.JSON.encode(
                [
                    {
                        id:     123,
                        type:   "information_source"
                    },
                    {
                        id:     456,
                        type:   "archaeo_part"
                    }
                ]
            );

            //console.log(values);

            Ext.getStore("S_collection").add(values);

            win.mask("Attendere...");

            Ext.getStore("S_collection").sync({

                success: function () {
                    var collection_id = Ext.getStore("S_collection").getAt(0).get("id");

                    win.unmask();
                    win.close();
                    Ext.create("Ext.window.Window",{
                        autoShow: true,
                        modal: true,
                        closable: false,
                        draggable: false,
                        resizable: false,
                        title: 'Fatto!',
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
                                html: '<div style="text-align: center">Collezione correttamente creata!<br>E\' ora possibile caricarci i tuoi files!</div>',
                                margin: '10 0 10 0'
                            }
                        ],
                        buttonAlign: 'center',
                        buttons: [
                            {
                                text: 'Avanti',
                                handler: function () {
                                    this.up("window").close();
                                    CL.app.getController("C_collection").redirectTo("#collection/"+collection_id );
                                }
                            }
                            /*{
                                text: 'Carica Files!',
                                handler: function () {
                                    this.up("window").close();
                                    CL.app.getController("C_collection").redirectTo("#collection/"+collection_id );
                                    CL.app.getController("C_uploader").showCollectionUploader(Ext.getBody(),collection_id);
                                }
                            }*/
                        ]
                    });
                },
                failure: function () {
                    Ext.getStore("S_collection").rejectChanges();
                    win.unmask();
                    Ext.create("Ext.window.Window",{
                        autoShow: true,
                        modal: true,
                        title: 'Ops',
                        padding: 10,
                        layout: {
                            type: 'vbox',
                            align: 'center'
                        },
                        items: [
                            {
                                xtype: 'image',
                                src: 'images/icons/icon_warning.png',
                                alt: " ",
                                width: 60,
                                height: 60
                            },
                            {
                                xtype: 'label',
                                html: '<div style="text-align: center">Sembra essersi verificato un errore :(<br>Se il problema persiste contattare il supporto a<br> <b>kms_support@gmail.com</b></div>',
                                margin: '0 0 10 0'
                            }
                        ],
                        buttonAlign: 'center',
                        buttons: [
                            {
                                text: 'Ok',
                                handler: function () {
                                    this.up("window").close();
                                }
                            }
                        ]
                    });
                }
            });
        }
    }

});
