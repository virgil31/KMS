Ext.define('CL.controller.C_event_file', {
    extend: 'Ext.app.Controller',

    routes: {
        'event/:aaa/file/:bbb' : 'showView'
    },

    stores: [
        'S_event_file'
    ],
    models: [
        'M_event_file'
    ], 
    views: [
        'event_file.V_list_by_event',
        'event_file.V_edit',
        'event_file.V_single_list'
    ],

    //SHOW VIEW
    showView: function(event_id,file_id){


        if(Ext.ComponentQuery.query('event_file_single_list').length == 0)
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].add({xtype: 'event_file_single_list'});


        Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('event_file_single_list_id');

        // ^^

        this.event_id = event_id;
        this.file_id = file_id;


        //resetto campi
        try{
            Ext.ComponentQuery.query("event_file_single_list label[name=title]")[0].setHtml("");
            Ext.ComponentQuery.query("event_file_single_list label[name=description]")[0].setHtml("");
            Ext.ComponentQuery.query("event_file_single_list label[name=created_by_name]")[0].setHtml("");
            Ext.ComponentQuery.query("event_file_single_list label[name=data_chiusura]")[0].setHtml("");

            Ext.ComponentQuery.query("event_file_single_list panel[name=preview]")[0].remove(0);
        }catch(e){}

        Ext.getBody().mask("Attendere...");
        var store = Ext.create("CL.store.S_event_file");
        store.load({
            params:{
                event_id: event_id,
                file_id: file_id
            },
            callback: function () {
                Ext.getBody().unmask();

                //se non ritorna alcun record, vuol dire che la event con quell'id non esiste
                if(this.getTotalCount() == 0) {
                    //piccolo controllo per evitare che se la event non esiste non mi permette più di tornare indietro
                    if(window.location.hash == "#event/"+CL.app.getController("C_event_file").event_id+"/file/"+file_id)
                        CL.app.getController("C_event").redirectTo("not_found");
                }
                else{
                    var event_file = this.getAt(0),
                        title = event_file.get("title"),
                        extension = event_file.get("extension"),
                        event_id = event_file.get("event_id"),
                        event_name = event_file.get("event_name"),
                        uploaded_by = event_file.get("uploaded_by"),
                        uploaded_by_name = event_file.get("uploaded_by_name"),
                        uploaded_at = event_file.get("uploaded_at"),
                        event_created_at = event_file.get("event_created_at"),
                        event_closed_at = event_file.get("event_closed_at");


                    uploaded_at = new Date(uploaded_at);

                    var giorno = uploaded_at.getDate(),
                        mese = uploaded_at.getMonth()+1,
                        anno =  uploaded_at.getFullYear(),
                        ore = uploaded_at.getHours(),
                        minuti = uploaded_at.getMinutes();

                    uploaded_at = giorno+"/"+mese+"/"+anno+" ("+ore+":"+minuti+")";

                    var result = new Date(event_closed_at);
                    giorno = result.getDate();
                    mese = result.getMonth()+1;
                    anno =  result.getFullYear();
                    ore = result.getHours();
                    minuti = result.getMinutes();

                    if(minuti == "0") minuti = "00";
                    if(parseInt(minuti)%10 != 0) minuti = "0"+minuti;


                    var data_scadenza = giorno+"/"+mese+"/"+anno+" alle "+ore+":"+minuti;

                    if(event_file.get("event_closed_at") == null)
                        Ext.ComponentQuery.query("event_file_single_list label[name=data_chiusura]")[0].setHtml('Data di chiusura delle modifiche: <div style="display: inline; color: #963232; font-weight: bold;"><u>ancora attive!</u></div>');
                    else
                        Ext.ComponentQuery.query("event_file_single_list label[name=data_chiusura]")[0].setHtml('Data di chiusura delle modifiche: <u>'+data_scadenza+'</u>');

                    Ext.ComponentQuery.query("event_file_single_list label[name=title]")[0].setHtml(title);
                    Ext.ComponentQuery.query("event_file_single_list label[name=description]")[0].setHtml("Evento di riferimento: <a href='#event/"+event_id+"'><b><u> \""+event_name+"\"</u></b></a>");
                    Ext.ComponentQuery.query("event_file_single_list label[name=created_by_name]")[0].setHtml("Caricato da: <a href='#user/"+uploaded_by+"'>"+uploaded_by_name+"</a> in data "+uploaded_at);

                    // popolo la preview
                    CL.app.getController("C_preview").getPreviewPanel(event_file.get("file_id"),function (preview_panel) {
                        Ext.ComponentQuery.query("event_file_single_list panel[name=preview]")[0].add(preview_panel);
                    });
                }
            }
        });

    },


    /////////////////////////////////////////////////
    init: function () {
        this.control({
            'event_file_edit button[action=do_edit]':{
                click: this.doEdit
            }
        }, this);
    },
    /////////////////////////////////////////////////

    //ON EDIT
    onEdit: function(record){
        var win = Ext.widget("event_file_edit"),
            form = win.down("form").getForm();

        form.loadRecord(record);
    },

    //DO EDIT
    doEdit: function(btn){
        var window = btn.up('window'),
            form = window.down("form").getForm(),
            record = form.getRecord(),
            values = form.getValues();

        Ext.Msg.confirm('Attenzione!', "Modificare il documento?",function(btn){
            if (btn === 'yes'){
                record.set(values);
                window.close();
            }
        });
    },

    // SHARE 
    share: function(btn,rec_event_file){

        var event_id = rec_event_file.get("event_id"),
            title = rec_event_file.get("title"),
        file_id = rec_event_file.get("file_id");

        var url_to_share = window.location.origin+window.location.pathname+"#event/"+event_id+"/file/"+file_id;

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
                                var event_id = CL.app.getController("C_event").event_id,
                                    rec = Ext.StoreManager.lookup("S_event").getById(event_id);
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
                                window.open("https://twitter.com/share?url="+escape(window.location.href)+"&text=SITAR - Guarda il documento '"+title+"'!", '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                            }
                        }
                    ]
                }

            ]

        });

    }

});
