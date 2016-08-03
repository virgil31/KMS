Ext.define('CL.controller.C_collection_thread_message', {
    extend: 'Ext.app.Controller',

    routes: {
        'collection_thread/:aaa' : 'showView'
    },

    stores: [
        'S_collection_thread_message'
    ],
    models: [
        'M_collection_thread_message'
    ],
    views: [
        'collection_thread_message.V_list_by_thread',
        'collection_thread_message.V_create'
    ],

    thread_record: null,

    //SHOW VIEW
    showView: function(thread_id){

        var store = Ext.create("CL.store.S_collection_thread"),
            this_controller = this;

        //per avere i dettagli del THREAD ed aggiornare il pannello superiore
        store.load({
            params: {
                thread_id: thread_id
            },
            callback: function () {
                this_controller.thread_record = this.getAt(0);
                //se non esiste la discussione mostro il warning e torno indietro
                if(this_controller.thread_record == null){
                    Ext.Msg.alert("Attenzione!","Questa discussione è stata eliminata!");
                    window.history.back();
                }
                else{
                    //vv spostata qui nella callback per evitare di mostrare la vista vuota se non esiste la discussione
                    if(Ext.ComponentQuery.query('collection_thread_message_list_by_thread').length == 0)
                        Ext.ComponentQuery.query('viewport panel[name=card]')[0].add({xtype: 'collection_thread_message_list_by_thread'});


                    Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('collection_thread_message_list_by_thread_id');


                    this.collection_id = thread_id;

                    //resetto campi
                    try{
                        Ext.ComponentQuery.query("collection_thread_message_list_by_thread label[name=title]")[0].setHtml("");
                        Ext.ComponentQuery.query("collection_thread_message_list_by_thread label[name=collection]")[0].setHtml("");
                        Ext.ComponentQuery.query("collection_thread_message_list_by_thread label[name=created_by_name]")[0].setHtml("");
                        Ext.ComponentQuery.query("collection_thread_message_list_by_thread label[name=data_chiusura]")[0].setHtml("");
                    }catch(e){}
                    // ^^


                    var thread_title = this_controller.thread_record.get("title"),
                        thread_prefix = this_controller.thread_record.get("prefix"),
                        collection_id = this_controller.thread_record.get("collection_id"),
                        collection_name = this_controller.thread_record.get("collection_name"),
                        created_by = this_controller.thread_record.get("created_by"),
                        created_by_name = this_controller.thread_record.get("created_by_name"),
                        created_at = this_controller.thread_record.get("created_at");

                    var d = new Date(created_at);
                    created_at = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " - " +
                        d.getHours() + ":" + ((d.getMinutes()<10?'0':'') + d.getMinutes());

                    //aggiusto il colore del prefisso
                    if(thread_prefix==null)
                        thread_prefix = '<div style="color: #404040;display:inline;">'+thread_prefix+'</div>';
                    else if(thread_prefix=="[DOMANDA]")
                        thread_prefix = '<div style="color: #076eb7;display:inline;">'+thread_prefix+'</div>';
                    else if(thread_prefix=="[GUIDA]")
                        thread_prefix = '<div style="color: green;display:inline;">'+thread_prefix+'</div>';
                    else if(thread_prefix=="[RICHIESTA MODIFICHE]")
                        thread_prefix = '<div style="color: #c47614;display:inline;">'+thread_prefix+'</div>';
                    else
                        thread_prefix = '<div style="color: #d90000;display:inline;">'+thread_prefix+'</div>';


                    Ext.ComponentQuery.query("collection_thread_message_list_by_thread label[name=title]")[0].setHtml(thread_prefix+" "+thread_title);
                    Ext.ComponentQuery.query("collection_thread_message_list_by_thread label[name=collection]")[0].setHtml('Collezione: <a href="#collection/'+collection_id+'"><b><u>"'+collection_name+'"</u></b></a>');
                    Ext.ComponentQuery.query("collection_thread_message_list_by_thread label[name=created_by_name]")[0].setHtml('Iniziata da <a href="#user/'+created_by+'"><u>'+created_by_name+'</u></a> il '+created_at);


                    //Infine carico lo la prima pagina di messaggi della discussione

                    var store_thread_message = Ext.StoreManager.lookup("S_collection_thread_message");
                    store_thread_message.proxy.extraParams.thread_id = thread_id;
                    setTimeout(function(){
                        store_thread_message.loadPage(1);
                    }, 250);
                }



            }
        });

    },

    /////////////////////////////////////////////////
    init: function () {
        this.control({


            //ON CREATE
            'collection_thread_message_list_by_thread button[action=on_create]':{
                click: this.onCreate
            },


            //DO CREATE
            "collection_thread_message_create button[action=do_create]":{
                click: this.doCreate
            }



        }, this);
    },
    /////////////////////////////////////////////////


    // ON CREATE
    onCreate: function (btn) {
        if(Ext.util.Cookies.get("user_id") === null)
            Ext.Msg.alert("Attenzione","Per proseguire bisogna essere <b>loggati</b>.");

        else if(this.thread_record.get("closed_at") != null)
            Ext.Msg.alert("Attenzione","<b>La discussione è stata <u>chiusa</u></b>!<br>Non posso essere inviati ulteriori messaggi!");

        else{
            Ext.widget("collection_thread_message_create",{
                animateTarget: btn.el
            });
        }
    },

    // DO CREATE
    doCreate: function (btn) {
        var win = btn.up("window"),
            form = win.down("form"),
            values = form.getValues(),
            thread_id =(window.location.hash.split("/"))[1],
            sent_by = Ext.util.Cookies.get("user_id");

        values.thread_id = thread_id;
        values.sent_by = sent_by;

        var regex = /(<([^>]+)>)/ig,
            message_without_tags = values.message.replace(regex , "");
        message_without_tags = message_without_tags.split("&nbsp;").join("").trim();

        if(message_without_tags.length<10) {
            Ext.Msg.alert("Attenzione", "Il testo del messaggio deve essere di <b>almeno 10 caratteri</b>!");
        }
        else{
            var store = Ext.StoreManager.lookup("S_collection_thread_message");
            store.add(values);
            win.mask("Attendere...");
            store.sync({
                callback: function () {
                    win.unmask();
                    win.close();
                    Ext.StoreManager.lookup("S_collection_thread_message").reload();
                }
            });
        }
    }

});
