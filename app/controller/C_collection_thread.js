Ext.define('CL.controller.C_collection_thread', {
    extend: 'Ext.app.Controller',

    stores: [
        'S_collection_thread'
    ],
    models: [
        'M_collection_thread'
    ],
    views: [
        'collection_thread.V_list_by_collection',
        'collection_thread.V_create'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({

            //ON CREATE
            'collection_thread_list_by_collection button[action=on_create]':{
                click: this.onCreate
            },

            //DO CREATE
            "collection_thread_create button[action=do_create]":{
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
            title: 'Cosa sono le Discussioni e chi può aprirle/rispondere?',
            width: 500,
            height: 320,
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
                    html:   "<div style='text-align: center'>" +
                        "Le discussioni, come in qualsiasi forum, servono per dare informazioni," +
                        "<br>effettuare domande, richieste di modifiche e/o aggiunte..." +
                        "<br><br><b>E' bene sottolineare che chiunque può avviarne una e<br> lasciare nuovi messaggi</>!</b>" +
                        "<br><br><u>La loro esistenza è temporalmente separata dalla data di chiusura" +
                        "<br>dell'entità alla quale è associata: infatti quest'ultima viene gestita" +
                        "<br>direttamente dai collaboratori in base al livello di maturità raggiunto" +
                        "<br>dalla stessa." +
                        "</div>"
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

    // ON CREATE
    onCreate: function (btn) {
        Ext.widget("collection_thread_create",{
            animateTarget: btn.el
        });
    },

    // DO CREATE
    doCreate: function (btn) {
        var win = btn.up("window"),
            form = win.down("form"),
            values = form.getValues();


        // verifico che il testo del messaggio (senza tags) sia di almeno 50 caratteri
        var regex = /(<([^>]+)>)/ig,
            message_without_tags = values.message.replace(regex , "");
        message_without_tags = message_without_tags.split("&nbsp;").join("").trim();

        if(message_without_tags.length<50) {
            Ext.Msg.alert("Attenzione", "Il testo del messaggio deve essere di almeno 50 caratteri!");
        }
        else{
            //altrimenti se il form è valido la creazione può avvenire
            if(form.isValid()){
                if(Ext.util.Cookies.get("user_id")===null)
                    Ext.Msg.alert("Attenzione","Per proseguire bisogna essere <b>loggati</b>.");
                else {
                    var collection_id = (window.location.hash.split("/"))[1];
                    values.collection_id = collection_id;
                    values.created_by = Ext.util.Cookies.get("user_id");

                    Ext.StoreManager.lookup("S_collection_thread").add(values);

                    Ext.ComponentQuery.query("collection_thread_create")[0].mask("Attendere...");
                    Ext.StoreManager.lookup("S_collection_thread").sync({
                        callback: function () {
                            Ext.ComponentQuery.query("collection_thread_create")[0].unmask();

                            Ext.StoreManager.lookup("S_collection_thread").reload();

                            win.close();

                            Ext.create("Ext.window.Window",{
                                autoShow: true,
                                modal: true,
                                closable: false,
                                draggable: false,
                                resizable: false,
                                title: 'Perfetto!',
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
                                        html: '<div style="text-align: center">Discussione salvata!<br>La troverai nella lista qui sotto,<br>in attesa di nuovi messaggi!</div>',
                                        margin: '10 0 10 0'
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
        }
    },


    // SHARE
    share: function(btn,rec_thread){
        var thread_id = rec_thread.get("id"),
            thread_title = rec_thread.get("title"),
            thread_prefix = rec_thread.get("prefix"),
            collection_title = rec_thread.get("collection_name");

        var url_to_share = window.location.origin+window.location.pathname+"#thread/"+thread_id;

        Ext.create("Ext.window.Window",{
            autoShow: true,
            animateTarget: btn.el,
            modal: true,
            width: 600,
            title: 'Condividi Documento!',
            padding: 10,
            layout: 'vbox',
            items:[
                {
                    xtype: 'textfield',
                    width: "100%",
                    readOnly: true,
                    value: url_to_share,
                    labelAlign: 'top',
                    fieldLabel: 'Link diretto da copiare e incollare',
                    selectOnFocus: true
                },
                {
                    xtype: 'label',
                    margin: '0 0 5 0',
                    html: '<b>Oppure...</b>'
                },
                {
                    xtype: 'panel',
                    width: "100%",
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items:[
                        {
                            xtype: 'button',
                            width: 220,
                            height: 46,
                            style: "background-image: url('images/buttons/button_share_fb.png') !important; " +
                            "background-size: 100% 100%;" +
                            "border-color: transparent;" +
                            "background-color: transparent",
                            handler: function () {
                                window.open("http://www.facebook.com/sharer.php?u=https://www.youtube.com/watch?v=0dnlPIuRsh8&p[title]=YOUR_TITLE&p[summary]=YOUR_SUMMARY", '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                            }
                        },
                        {
                            xtype: 'button',
                            width: 240,
                            height: 54,
                            style: "background-image: url('images/buttons/button_share_twitter.png') !important; " +
                            "background-size: 100% 100%;" +
                            "border-color: transparent;" +
                            "background-color: transparent",
                            handler: function () {
                                window.open("https://twitter.com/share?url="+escape(window.location.href)+"&text=SITAR - Guarda la discussione '"+thread_prefix+" "+thread_title+"' sulla Collezione '"+collection_title+"'!", '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                            }
                        }
                    ]
                }

            ]

        });

    }


});
