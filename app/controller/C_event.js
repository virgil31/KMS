Ext.define('CL.controller.C_event', {
    extend: 'Ext.app.Controller',

    routes: {
        'event/:aaa' : 'showView',
        'event/:aaa/threads' : 'showThreads',
        'event/:aaa/coworkers' : 'showCoworkers',
        'event/:aaa/external_resources' : 'showExternalResources',
        'event/:aaa/tags' : 'showTags'
        //'event/:aaa/files' : 'showFiles'
    },

    stores: [
        "S_event"
    ],
    models: [
        "M_event"
    ],
    views: [
        'event.V_create',
        'event.V_single_list',
        'event.V_edit'
    ],

    event_id: null,

    //SHOW Files
    /*showExternalResources: function (event_id) {
        //prima mi assicuro che la vista della event sia mostrata
        if(Ext.ComponentQuery.query('event_single_list').length == 0)
            this.showView(event_id);
        else
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('event_single_list_id');

        //dopodichè porto avanti la sezione delle discussioni
        Ext.ComponentQuery.query('event_single_list tabpanel')[0].getLayout().setActiveItem(0);
    },*/



    //SHOW ExternalResources
    showExternalResources: function (event_id) {
        Ext.ComponentQuery.query('viewport panel')[0].body.scrollTo('top',0);   //aggiunto per quando clicco su un link della scheda TAG

        //prima mi assicuro che la vista della event sia mostrata
        if(Ext.ComponentQuery.query('event_single_list').length == 0)
            this.showView(event_id);
        else
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('event_single_list_id');

        //dopodichè porto avanti la sezione delle discussioni
        Ext.ComponentQuery.query('event_single_list tabpanel')[0].getLayout().setActiveItem(1);

        this.updateInfo(event_id);
    },

    //SHOW COWORKER
    showCoworkers: function (event_id) {
        Ext.ComponentQuery.query('viewport panel')[0].body.scrollTo('top',0);   //aggiunto per quando clicco su un link della scheda TAG

        //prima mi assicuro che la vista della event sia mostrata
        if(Ext.ComponentQuery.query('event_single_list').length == 0)
            this.showView(event_id);
        else
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('event_single_list_id');

        //dopodichè porto avanti la sezione delle discussioni
        Ext.ComponentQuery.query('event_single_list tabpanel')[0].getLayout().setActiveItem(2);

        this.updateInfo(event_id);
    },

    // SHOW THREADS
    showThreads: function (event_id) {
        Ext.ComponentQuery.query('viewport panel')[0].body.scrollTo('top',0);   //aggiunto per quando clicco su un link della scheda TAG

        //prima mi assicuro che la vista della event sia mostrata
        if(Ext.ComponentQuery.query('event_single_list').length == 0)
            this.showView(event_id);
        else
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('event_single_list_id');

        //dopodichè porto avanti la sezione delle discussioni
        Ext.ComponentQuery.query('event_single_list tabpanel')[0].getLayout().setActiveItem(3);

        this.updateInfo(event_id);
    },

    //SHOW Tags
    showTags: function (event_id) {
        Ext.ComponentQuery.query('viewport panel')[0].body.scrollTo('top',0);   //aggiunto per quando clicco su un link della scheda TAG

        //prima mi assicuro che la vista della event sia mostrata
        if(Ext.ComponentQuery.query('event_single_list').length == 0)
            this.showView(event_id);
        else
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('event_single_list_id');

        //dopodichè porto avanti la sezione delle discussioni
        Ext.ComponentQuery.query('event_single_list tabpanel')[0].getLayout().setActiveItem(4);


        this.updateInfo(event_id);
    },

    //SHOW VIEW
    showView: function(event_id){
        Ext.ComponentQuery.query('viewport panel')[0].body.scrollTo('top',0);   //aggiunto per quando clicco su un link della scheda TAG


        if(Ext.ComponentQuery.query('event_single_list').length == 0)
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].add({xtype: 'event_single_list'});
        else
            Ext.StoreManager.lookup("S_event_file").loadData([],false);


        Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('event_single_list_id');


        // ^^

        var this_controller = this;

        this.event_id = event_id;


        //resetto campi
        try{
            Ext.ComponentQuery.query("event_single_list label[name=data_chiusura]")[0].setHtml('');
            Ext.ComponentQuery.query("event_single_list label[name=title]")[0].setText("");
            Ext.ComponentQuery.query("event_single_list label[name=description]")[0].setText("");
            Ext.ComponentQuery.query("event_single_list label[name=created_by_name]")[0].setHtml("");
        }catch(e){}

        //riseleziono il tab dei documenti
        Ext.ComponentQuery.query('event_single_list tabpanel')[0].getLayout().setActiveItem(0);

        Ext.getBody().mask("Attendere...");

        Ext.getStore("S_event").load({
            params:{
                event_id: event_id
            },
            callback: function () {
                Ext.getBody().unmask();

                //se non ritorna alcun record, vuol dire che la event con quell'id non esiste
                if(this.getTotalCount() == 0) {
                    //piccolo controllo per evitare che se la event non esiste non mi permette più di tornare indietro
                    if(window.location.hash == "#event/"+event_id)
                        CL.app.getController("C_event").redirectTo("not_found");
                }
                else{
                    var event = this.getAt(0),
                        title = event.get("title"),
                        description = event.get("description"),
                        created_by = event.get("created_by"),
                        created_by_name = event.get("created_by_name"),
                        created_at = event.get("created_at"),
                        closed_at = event.get("closed_at");

                    this_controller.record_event = event; //mi salvo il record della event a livello di controller

                    var result = new Date(closed_at);
                    var giorno = result.getDate(),
                        mese = result.getMonth()+1,
                        anno =  result.getFullYear(),
                        ore = result.getHours(),
                        minuti = result.getMinutes();
                    if(minuti == "0") minuti = "00";
                    if(parseInt(minuti)%10 != 0) minuti = "0"+minuti;

                    var data_scadenza = giorno+"/"+mese+"/"+anno+" alle "+ore+":"+minuti;

                    if(event.get("closed_at") == null)
                        Ext.ComponentQuery.query("event_single_list label[name=data_chiusura]")[0].setHtml('Data di chiusura delle modifiche: <div style="display: inline; color: #963232; font-weight: bold;"><u>ancora attive!</u></div>');
                    else
                        Ext.ComponentQuery.query("event_single_list label[name=data_chiusura]")[0].setHtml('Data di chiusura delle modifiche: <u>'+data_scadenza+'</u>');


                    Ext.ComponentQuery.query("event_single_list label[name=title]")[0].setText(title);
                    Ext.ComponentQuery.query("event_single_list label[name=description]")[0].setHtml("<div style='text-align: center'>"+description+"</div>");
                    Ext.ComponentQuery.query("event_single_list label[name=created_by_name]")[0].setHtml("Evento creato da: <a href='#user/"+created_by+"'><u>"+created_by_name+"</u></a> il "+Ext.Date.format(created_at,'d/m/Y'));

                    //carico gli store del tabpanel
                    Ext.StoreManager.lookup("S_event_file").load({
                        params: {
                            event_id: event_id
                        },
                        callback: function(){
                            // se non ci sono documenti invito l'utente a caricarli
                            // logicamento l'invito scatta solo se l'utente in questione ha permessi di scrittura

                            var numero_documenti =  this.getTotalCount();

                            if(numero_documenti == 0){
                                CL.app.getController("C_permessi").canWriteEvent(CL.app.getController("C_event").event_id, false, function () {

                                    Ext.create("Ext.window.Window",{
                                        animateTarget: Ext.ComponentQuery.query("tbar button[name=app_icon]")[0].getEl(),
                                        autoShow: true,
                                        modal: true,
                                        draggable: false,
                                        resizable: false,
                                        title: 'Documenti e Files',
                                        padding: 10,
                                        layout: {
                                            type: 'vbox',
                                            align: 'center'
                                        },
                                        items: [
                                            {
                                                xtype: 'image',
                                                src: 'images/icons/icon_info.png',
                                                alt: " ",
                                                width: 60,
                                                height: 60
                                            },
                                            {
                                                xtype: 'label',
                                                html: '<div style="text-align: center">Vuoi caricare dei documenti ora?<br></div>',
                                                margin: '10 0 10 0'
                                            }
                                        ],
                                        buttonAlign: 'center',
                                        buttons: [
                                            {
                                                text: 'Carica!',
                                                handler: function () {
                                                    this.up("window").close();

                                                    var btn = Ext.ComponentQuery.query("event_file_list_by_event button[action=carica_documenti]")[0];

                                                    btn.fireEvent("click",btn);
                                                }
                                            }
                                        ]
                                    });

                                });
                            }
                        }
                    });

                }
            }
        })
    },

    updateInfo: function (event_id) {
        //aggiorno le informazioni solo se son passato dalla view di una event ad un'altra
        if(Ext.getStore("S_event").getAt(0) != null){
            if(Ext.getStore("S_event").getAt(0).get("id") != event_id){
                var this_controller = CL.app.getController("C_event");

                //resetto campi
                try{
                    Ext.ComponentQuery.query("event_single_list label[name=data_chiusura]")[0].setHtml('');
                    Ext.ComponentQuery.query("event_single_list label[name=title]")[0].setText("");
                    Ext.ComponentQuery.query("event_single_list label[name=description]")[0].setText("");
                    Ext.ComponentQuery.query("event_single_list label[name=created_by_name]")[0].setHtml("");
                }catch(e){}

                Ext.getBody().mask("Attendere...");

                Ext.getStore("S_event").load({
                    params: {
                        event_id: event_id
                    },
                    callback: function () {
                        Ext.getBody().unmask();

                        //se non ritorna alcun record, vuol dire che la event con quell'id non esiste
                        if (this.getTotalCount() == 0) {
                            //piccolo controllo per evitare che se la event non esiste non mi permette più di tornare indietro
                            if (window.location.hash == "#event/" + event_id)
                                CL.app.getController("C_event").redirectTo("not_found");
                        }
                        else {
                            var event = this.getAt(0),
                                title = event.get("title"),
                                description = event.get("description"),
                                created_by = event.get("created_by"),
                                created_by_name = event.get("created_by_name"),
                                created_at = event.get("created_at"),
                                closed_at = event.get("closed_at");

                            this_controller.record_event = event; //mi salvo il record della event a livello di controller


                            var result = new Date(closed_at);
                            var giorno = result.getDate(),
                                mese = result.getMonth()+1,
                                anno =  result.getFullYear(),
                                ore = result.getHours(),
                                minuti = result.getMinutes();
                            if(minuti == "0") minuti = "00";
                            if(parseInt(minuti)%10 != 0) minuti = "0"+minuti;


                            var data_scadenza = giorno+"/"+mese+"/"+anno+" alle "+ore+":"+minuti;

                            if(event.get("closed_at") == null)
                                Ext.ComponentQuery.query("event_single_list label[name=data_chiusura]")[0].setHtml('Data di chiusura delle modifiche: <div style="display: inline; color: #963232; font-weight: bold;"><u>ancora attive!</u></div>');
                            else
                                Ext.ComponentQuery.query("event_single_list label[name=data_chiusura]")[0].setHtml('Data di chiusura delle modifiche: <u>'+data_scadenza+'</u>');

                            Ext.ComponentQuery.query("event_single_list label[name=title]")[0].setText(title);
                            Ext.ComponentQuery.query("event_single_list label[name=description]")[0].setHtml("<div style='text-align: center'>" + description + "</div>");
                            Ext.ComponentQuery.query("event_single_list label[name=created_by_name]")[0].setHtml("Evento creato da: <a href='#user/" + created_by + "'><u>" + created_by_name + "</u></a> il " + Ext.Date.format(created_at, 'd/m/Y'));
                        }
                    }
                });
            }
        }
    },


    /////////////////////////////////////////////////
    init: function () {
        this.control({
            //DO CREATE
            "event_create button[action=do_create]":{
                click: this.doCreate
            },

            //ON DESTROY
            "event_single_list button[action=on_destroy]":{
                click: this.onDestroy
            },

            // ON EDIT INFO
            "event_single_list button[action=on_edit_info]":{
                click: this.onEditInfo
            },

            // DO EDIT INFO
            "event_edit button[action=do_edit]":{
                click: this.doEditInfo
            },

            // SHARE EVENT
            "event_single_list button[action=share_event]":{
                click: this.shareEvent
            },

            // SHOW LICENSE INFO
            "event_single_list button[action=show_license_info]":{
                click: this.showLicenseInfo
            },


            // ON_CLOSE
            "event_edit button[action=on_close]":{
                click: this.onClose
            }
        }, this);
    },
    /////////////////////////////////////////////////


    // ON_CLOSE
    onClose: function (btn) {
        Ext.create("Ext.window.Window",{
            autoShow: true,
            modal: true,
            resizable: false,
            draggable: false,
            constrain: true,

            title: "Conferma Chiusura",
            width: 400,
            items: [
                {
                    xtype: 'form',
                    padding: 10,
                    defaults:{
                        width: "100%"
                    },
                    layout:{
                        type: 'vbox',
                        align: 'center'
                    },
                    items: [
                        {
                            xtype: 'image',
                            src: 'images/icons/icon_warning.png',
                            alt: " ",
                            width: 80,
                            height: 80,
                            margin: '0 0 10 0'
                        },
                        {
                            xtype: 'label',
                            html: "<div style='text-align: center; margin: 10px; '>La procedura di <b>chiusura</b> di un Evento comporta l'impossibilità di apportagli future modifiche. L'unica sezione che rimarrà attiva sarà quella relativa alle discussioni.<br><br>Per confermare si prega di inserire nel campo qui sotto le parole '<b>chiudi evento</b>'.</div>"
                        },
                        {
                            xtype: 'textfield',
                            emptyText: "Scrivi 'chiudi evento' per continuare",
                            validator: function (val) {
                                return (val === "chiudi evento") ? true : "Scrivi 'chiudi evento' per continuare";
                            }
                        }
                    ],
                    buttonAlign: "center",
                    buttons: [
                        {
                            text: 'Conferma Chiusura',
                            formBind: true,
                            handler: function () {
                                var record = Ext.ComponentQuery.query("event_edit form")[0].getForm().getRecord();

                                record.set({
                                    closed_at: new Date()
                                });

                                Ext.StoreManager.lookup("S_event").sync({
                                    callback: function () {
                                        document.location.reload(true);
                                    }
                                });
                            }
                        }
                    ]
                }
            ]
        });
    },


    // SHOW LICENSE INFO
    showLicenseInfo: function (btn) {

        var event_record = this.record_event;

        Ext.create("Ext.window.Window",{
            autoShow: true,
            animateTarget: btn.el,
            modal: true,
            width: 450,
            title: 'Informazioni Licenza',
            padding: 10,
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items:[
                {
                    xtype: 'image',
                    src: 'images/icons/icon_info.png',
                    width: 70,
                    height: 70,
                    margin: '0 0 20 0'
                },
                {
                    xtype: 'label',
                    name: 'license_name',
                    html: '<div style="font-size: large; ">Licenza: <div style="font-weight: bold; display: inline;">'+event_record.get("license_name")+'</div></div><br>'
                    //html: '<div style="font-size: large; ">Licenza: <div style="font-weight: bold; display: inline;">grassetto</div></div><br>'
                },
                {
                    xtype: 'label',
                    html: '<div style="font-size: small; "><b><i>Cosa vuol dire?</i></b></div>',
                    margin: '0 0 5 0'
                },
                {
                    xtype: 'label',
                    name: 'license_description',
                    width: "100%",
                    html: '<div style="font-size: medium; text-align: center; border: 1px solid black; background: #dbdbdb; padding: 5px;">'+event_record.get("license_description")+'</div>'
                    //html: '<div style="font-size: medium; text-align: center; border: 1px solid black; background: #dbdbdb; padding: 5px;">Succede molto spesso di avere la necessità di utilizzare un elemento inline come elemento di tipo blocco o viceversa. Per sopperire a questo problema è sufficiente modificare la proprietà display dell’oggetto impostandola sul valore desiderato.</div>'
                }
            ]
        });
    },



    // SHARE EVENT
    shareEvent: function(btn){

        Ext.create("Ext.window.Window",{
            autoShow: true,
            animateTarget: btn.el,
            modal: true,
            width: 600,
            title: 'Condividi Evento!',
            padding: 10,
            layout: 'vbox',
            items:[
                {
                    xtype: 'textfield',
                    width: "100%",
                    readOnly: true,
                    value: window.location.href,
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
                                var event_id = CL.app.getController("C_event").event_id,
                                    rec = Ext.StoreManager.lookup("S_event").getById(event_id);
                                window.open("https://twitter.com/share?url="+escape(window.location.href)+"&text=SITAR - Esplora l'evento '"+rec.get("title")+"'!", '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                            }
                        }
                    ]
                }

            ]

        });

    },


    // ON EDIT INFO
    onEditInfo: function () {
        CL.app.getController("C_permessi").canWriteEvent(this.event_id, true,function(){
            var event_record_to_edit = CL.app.getController("C_event").record_event;
            var win = Ext.widget("event_edit");
            win.down("form").loadRecord(event_record_to_edit);
        });
    },

    // DO EDIT INFO
    doEditInfo: function (btn) {
        var win = btn.up("window"),
            form = win.down("form"),
            values = form.getValues(),
            record = form.getRecord();

        record.set(values);
        Ext.StoreManager.lookup("S_event").sync();
        document.location.reload();
    },

    //ON DESTROY
    onDestroy: function(){
        CL.app.getController("C_permessi").canWriteEvent(this.event_id, true, function () {
            Ext.Msg.show({
                animateTarget: Ext.ComponentQuery.query("tbar button[name=app_icon]")[0].getEl(),
                title:'Attenzione!',
                message: 'Sicuro di voler eliminare questo Evento?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function(btn) {
                    if (btn === 'yes') {
                        var event_id = CL.app.getController("C_event").event_id,
                            store = Ext.StoreManager.lookup("S_event"),
                            record_to_delete = Ext.StoreManager.lookup("S_event").getById(event_id);

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
        });


    },

    /*
    //DO DESTROY
    doDestroy: function(){
        var event_id = CL.app.getController("C_event").event_id,
            store = Ext.StoreManager.lookup("S_event");


        store.remove(Ext.create("CL.model.M_event",{
            id: event_id
        }));

        store.sync({
            callback: function(){

            }
        });
    },*/

    //ON CREATE
    onCreate: function (targetEl) {
        Ext.create("Ext.window.Window",{
            autoShow: true,
            modal: true,
            resizable: false,
            constrain: true,
            animateTarget: targetEl,
            title: 'Procedura guidata per un Nuovo Evento',
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
                                Ext.Msg.alert("Attenzione","Per proseguire bisogna essere <b>loggati</b>.");
                            else{
                                //altrimenti chiudo le window e  mostro il form per la creazione di una event vuota
                                /*Ext.ComponentQuery.query("window").forEach(function(win){
                                    win.destroy();
                                });*/
                                this.up("window").close();
                                Ext.widget("event_create");
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

            var recs_added = Ext.getStore("S_event").add(values);

            win.mask("Attendere...");

            Ext.getStore("S_event").sync({

                success: function () {

                    var event_id = recs_added[0].get("id");

                    win.unmask();
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
                                html: '<div style="text-align: center">Informazioni salvate!<br>Nei prossimi passaggi sarà possibile<br>completare la creazione dell\'Evento!</div>',
                                margin: '10 0 10 0'
                            }
                        ],
                        buttonAlign: 'center',
                        buttons: [
                            {
                                text: 'Avanti',
                                handler: function () {
                                    this.up("window").close();
                                    CL.app.getController("C_event").redirectTo("#event/"+event_id );
                                }
                            }
                        ]
                    });
                },
                failure: function () {
                    Ext.getStore("S_event").rejectChanges();
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
