Ext.define('CL.controller.C_tag', {
    extend: 'Ext.app.Controller',

    views:[
        'tag.V_create_for_collection'
    ],

    //
    onTag: function (targetEl,tag_type,tag_target_id){

        if(Ext.util.Cookies.get("user_id")===null)
            Ext.Msg.alert("Attenzione","Per proseguire bisogna essere <b>loggati</b>.");
        else {
            Ext.create("Ext.window.Window",{
                autoShow: true,
                modal: true,
                animateTarget: targetEl,
                title: 'Aggiungi Tag',
                width: 400,
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                padding: 10,
                items:[
                    {
                        xtype: 'image',
                        src: 'images/icons/icon_info.png',
                        alt: " ",
                        width: 60,
                        height: 60
                    },
                    {
                        xtype: 'label',
                        html: '<div style="text-align: center">Nella prossima schermata sarà possibile<br>taggare tale entità ad una delle tue Collezioni o Eventi.</div>',
                        margin: '10 0 10 0'
                    }
                ],
                buttonAlign: 'center',
                buttons:[
                    {
                        text: 'Aggiungi a Collezione',
                        handler: function () {
                            this.up("window").close();

                            Ext.StoreManager.lookup("S_collection").load({
                                params: {
                                    user_id: Ext.util.Cookies.get("user_id"),
                                    flag_solo_aperte: true
                                }
                            });

                            Ext.widget("tag_create_for_collection",{
                                animateTarget: targetEl,
                                tag_type: tag_type,
                                tag_target_id: tag_target_id
                            });
                        }
                    },
                    {
                        text: 'Aggiungi a Evento',
                        handler: function(){
                            alert("TODO");
                        }
                    }

                ]
            });
        }


        
    }

    

});
