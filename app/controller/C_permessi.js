Ext.define('CL.controller.C_permessi', {
    extend: 'Ext.app.Controller',

    //
    canWriteCollection: function(collection_id, puo_mostrare_errore ,fn_success){
        var user_id = Ext.util.Cookies.get("user_id");

        if(user_id === null){
            Ext.Msg.alert("Attenzione","Per proseguire bisogna essere <b>loggati</b>.");
        }
        else{

            Ext.Ajax.request({
                url: 'data/permessi/canWriteCollection.php',
                params: {
                    user_id: user_id,
                    collection_id: collection_id
                },
                success: function(response){
                    var risposta = Ext.JSON.decode(response.responseText);
                    if(risposta["can_write"])
                        fn_success();
                    else if (puo_mostrare_errore)
                        Ext.Msg.alert("Attenzione","<b>Impossibile modificare la Collezione:</b>  non si hanno i permessi<br> necessari oppure è stata superata la data di chiusura modifiche.");
                }
            });

        }
    },


    //
    canWriteCollaboratoriCollection: function (collection_id,puo_mostrare_errore, fn_success){
        var user_id = Ext.util.Cookies.get("user_id");

        if(user_id === null){
            Ext.Msg.alert("Attenzione","Per proseguire bisogna essere <b>loggati</b>.");
        }
        else{

            Ext.Ajax.request({
                url: 'data/permessi/canWriteCollaborazioniCollection.php',
                params: {
                    user_id: user_id,
                    collection_id: collection_id
                },
                success: function(response){
                    var risposta = Ext.JSON.decode(response.responseText);
                    if(risposta["can_write"])
                        fn_success();
                    else if (puo_mostrare_errore)
                        Ext.Msg.alert("Attenzione","<b>Impossibile modificare la lista dei Collaboratori:</b>  non si hanno i permessi<br> necessari oppure è stata superata la data di chiusura modifiche.");
                }
            });
        }
    }

    

});
