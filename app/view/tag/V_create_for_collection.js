Ext.define('CL.view.tag.V_create_for_collection', {
    extend: 'Ext.window.Window',
    xtype: 'tag_create_for_collection',
    itemId: 'tag_create_for_collection_id',
    alias: 'widget.tag_create_for_collection',

    autoShow: true,
    modal: true,

    title: 'Scegli Collezione alla quale aggiungere il Tag',

    width: 400,

    padding: 10,

    layout: {
        type: 'vbox',
        align: 'center'
    },

    items: [
        {
            xtype: 'image',
            src: 'images/icons/icon_collection_black.png',
            alt: " ",
            width: 40,
            height: 40
        },
        {
            xtype: 'label',
            html: '<div style="text-align: center">Qui di seguito sono riportate tutte le Collezioni<br><u>ancora aperte</u> delle quali o sei il <i><b>creatore</b></i> o un <i><b>collaboratore</b></i>.<br><br>Per aggiungere il TAG basta un semplice click sulla Collezione.</div>',
            margin: '10 0 10 0'
        },
        {
            xtype: 'grid',
            style: {
                border: '1px solid black'
            },
            store: "S_collection",
            hideHeaders: true,
            listeners:{
                itemclick: function ( me, record) {
                    Ext.Msg.confirm("Attenzione!","Sei sicuro di aggiungere il Tag alla collezione <br><b>"+record.get("title")+"</b>",function (btnId) {
                        if(btnId == "yes"){
                            Ext.ComponentQuery.query("tag_create_for_collection")[0].mask("Tagging...");
                            Ext.Ajax.request({
                                url: 'data/tag/create_for_collection.php',
                                method: 'POST',
                                params: {
                                    data: Ext.JSON.encode({
                                        collection_id: record.get("id"),
                                        tag_type: Ext.ComponentQuery.query("tag_create_for_collection")[0].tag_type,
                                        tag_target_id: Ext.ComponentQuery.query("tag_create_for_collection")[0].tag_target_id
                                    })
                                },
                                success: function(response){
                                    var risposta = Ext.JSON.decode(response.responseText);

                                    if(risposta["success"]){
                                        Ext.Msg.show({
                                            title: "Aggiunto!",
                                            msg: "TAG aggiundo correttamente alla Collezione:<br> <b>"+record.get("title")+"</b>",
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.Msg.INFO
                                        });
                                    }
                                    else{
                                        Ext.Msg.show({
                                            title: "Attenzione!",
                                            msg: "TAG già collegato alla Collezione:<br> <b>"+record.get("title")+"</b>",
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.Msg.WARNING
                                        });
                                    }

                                    Ext.ComponentQuery.query("tag_create_for_collection")[0].unmask();
                                },
                                failure: function(response){
                                    Ext.ComponentQuery.query("tag_create_for_collection")[0].unmask();
                                }
                            });
                        }
                    });
                }
            },
            columns: [
                {
                    dataIndex: 'title',
                    flex: 1
                }
            ],
            width: '100%',
            height: 300
        }

    ]

});