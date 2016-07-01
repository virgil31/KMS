Ext.define('CL.controller.C_collection_file', {
    extend: 'Ext.app.Controller',

    routes: {
        'collection/:aaa/file/:bbb' : 'showView'
    },

    stores: [
        'S_collection_file'
    ],
    models: [
        'M_collection_file'
    ],
    views: [
        'collection_file.V_list_by_collection',
        'collection_file.V_edit',
        'collection_file.V_single_list'
    ],

    //SHOW VIEW
    showView: function(collection_id,file_id){


        if(Ext.ComponentQuery.query('collection_file_single_list').length == 0)
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].add({xtype: 'collection_file_single_list'});


        Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('collection_file_single_list_id');

        // ^^

        this.collection_id = collection_id;
        this.file_id = file_id;


        //resetto campi
        /*try{
            Ext.ComponentQuery.query("collection_single_list label[name=data_chiusura]")[0].setHtml('');
            Ext.ComponentQuery.query("collection_single_list label[name=title]")[0].setText("");
            Ext.ComponentQuery.query("collection_single_list label[name=description]")[0].setText("");
            Ext.ComponentQuery.query("collection_single_list label[name=created_by_name]")[0].setHtml("");
        }catch(e){}*/

        Ext.getBody().mask("Attendere...");
        Ext.getStore("S_collection_file").load({
            params:{
                collection_id: collection_id,
                file_id: file_id
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
                    var collection_file = this.getAt(0),
                        title = collection_file.get("title"),
                        collection_id = collection_file.get("collection_id"),
                        collection_name = collection_file.get("collection_name"),
                        uploaded_by = collection_file.get("uploaded_by"),
                        uploaded_by_name = collection_file.get("uploaded_by_name"),
                        uploaded_at = collection_file.get("uploaded_at"),
                        collection_created_at = collection_file.get("collection_created_at");


                    uploaded_at = new Date(uploaded_at);

                    var giorno = uploaded_at.getDate(),
                        mese = uploaded_at.getMonth()+1,
                        anno =  uploaded_at.getFullYear(),
                        ore = uploaded_at.getHours(),
                        minuti = uploaded_at.getMinutes();

                    uploaded_at = giorno+"/"+mese+"/"+anno+" ("+ore+":"+minuti+")";

                    var data_scadenza_collection = new Date(collection_created_at);
                    data_scadenza_collection.setDate(data_scadenza_collection.getDate() + 2);

                    giorno = data_scadenza_collection.getDate();
                    mese = data_scadenza_collection.getMonth()+1;
                    anno =  data_scadenza_collection.getFullYear();
                    ore = data_scadenza_collection.getHours();
                    minuti = data_scadenza_collection.getMinutes();

                    data_scadenza_collection = giorno+"/"+mese+"/"+anno+" ("+ore+":"+minuti+")";

                    Ext.ComponentQuery.query("collection_file_single_list label[name=title]")[0].setHtml(title);
                    Ext.ComponentQuery.query("collection_file_single_list label[name=description]")[0].setHtml("Collezione di riferimento: <a href='#collection/"+collection_id+"'><b><u> \""+collection_name+"\"</u></b></a>");
                    Ext.ComponentQuery.query("collection_file_single_list label[name=created_by_name]")[0].setHtml("Caricato da: <a href='#user/"+uploaded_by+"'>"+uploaded_by_name+"</a> in data "+uploaded_at);
                    Ext.ComponentQuery.query("collection_file_single_list label[name=data_chiusura]")[0].setHtml("Data di chiusura modifiche: <b>"+data_scadenza_collection+"</b>");


                }
            }
        });

    },


    /////////////////////////////////////////////////
    init: function () {
        this.control({
            'collection_file_edit button[action=do_edit]':{
                click: this.doEdit
            }
        }, this);
    },
    /////////////////////////////////////////////////

    //ON EDIT
    onEdit: function(record){
        var win = Ext.widget("collection_file_edit"),
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
    share: function(btn,rec_collection_file){

        var collection_id = rec_collection_file.get("collection_id"),
            title = rec_collection_file.get("title"),
        file_id = rec_collection_file.get("file_id");

        var url_to_share = window.location.origin+window.location.pathname+"#collection/"+collection_id+"/file/"+file_id;

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
                                var collection_id = CL.app.getController("C_collection").collection_id,
                                    rec = Ext.StoreManager.lookup("S_collection").getById(collection_id);
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
                                var collection_id = CL.app.getController("C_collection").collection_id,
                                    rec = Ext.StoreManager.lookup("S_collection").getById(collection_id);
                                window.open("https://twitter.com/share?url="+escape(window.location.href)+"&text=SITAR - Guarda il documento '"+title+"'!", '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                            }
                        }
                    ]
                }

            ]

        });

    }

});
