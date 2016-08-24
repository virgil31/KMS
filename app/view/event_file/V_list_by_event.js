Ext.define('CL.view.event_file.V_list_by_event', {
    extend: 'Ext.panel.Panel',
    xtype: 'event_file_list_by_event',
    itemId: 'event_file_list_by_event_id',
    alias: 'widget.event_file_list_by_event',

    title: 'Documenti',
    icon: 'images/icons/icon_file.png',
    bodyStyle: 'background: #484848',
    padding: 1,


    listeners: {
        activate: function(){
            Ext.StoreManager.lookup("S_event_file").load({
                params:{
                    event_id: (window.location.hash.split("/"))[1]
                }
            });

            /*var event_id = (window.location.hash.split("/"))[1];
            CL.app.getController("C_event").redirectTo("event/"+event_id+"/files");*/
        }
    },


    layout: 'fit',


    items: [
        {
            xtype: 'grid',
            name:'event_file',
            store: 'S_event_file',
            //hideHeaders: true,
            tbar: [
                {
                    xtype: 'panel',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Carica nuovi Documenti',
                            iconCls: 'x-fa fa-upload',
                            action: 'carica_documenti',
                            listeners: {
                                click: function (btn) {
                                    var event_id = (window.location.hash.split("/"))[1];

                                    CL.app.getController("C_permessi").canWriteEvent(event_id, true,function(){
                                        CL.app.getController("C_uploader").showEventUploader(btn.getEl(),event_id,function(){
                                            Ext.StoreManager.lookup("S_event_file").load({
                                                params: {
                                                    event_id: event_id
                                                }
                                            });
                                            console.log("ricarico lo store dei event_files perchè probabilmente ne ho uppato dei nuovi");
                                        });
                                    });

                                }
                            }
                        }
                    ]
                }
            ],
            columns: [
                {
                    text: 'Tipo',
                    dataIndex: 'type',
                    flex: 1,
                    renderer: function(tipo){
                        var url = "";
                        switch(tipo){
                            case 'immagine':
                                url = "images/icons/icon_image.png";
                                break;
                            case 'pdf':
                                url = "images/icons/icon_pdf.png";
                                break;
                            case 'word':
                                url = "images/icons/icon_word.png";
                                break;
                            case "testuale":
                                url = "images/icons/icon_text.png";
                                break;
                            case "archivio":
                                url = "images/icons/icon_archive.png";
                                break;


                        }

                        return '<img src="'+url+'" alt=" " height="20" width="20">';
                    }
                },
                { 
                    text: 'Nome',
                    dataIndex: 'title', 
                    flex: 10,
                    renderer: function (value, metaData, record) {
                        return value+"."+record.get("extension");
                    }
                },
                {
                    text: 'Caricato da',
                    dataIndex: 'uploaded_by_name',
                    flex: 3,
                    renderer: function (value, metaData, record) {
                        var user_id = record.get("uploaded_by");
                        return '<a style="color: #963232 !important;" target="_blank" href="#user/'+user_id+'"><u>'+value+'</u></a>';
                    }
                },
                {
                    xtype: 'datecolumn',
                    format:'d/m/Y',
                    text: 'Caricato il',
                    dataIndex: 'uploaded_at',
                    flex: 2
                },
                {
                    xtype: 'actioncolumn',
                    width: 150,
                    items: [
                        {
                            iconCls: 'x-fa fa-search',
                            tooltip: 'Anteprima',
                            handler: function(grid, rowIndex) {
                                var rec = grid.getStore().getAt(rowIndex),
                                    file_id = rec.get('file_id'),
                                    btnEl = this.el;

                                CL.app.getController("C_preview").showWindowPreview(btnEl,file_id,rec.get("title"));
                            }
                        },
                        {
                            iconCls: 'x-fa fa-download',
                            tooltip: 'Scarica',
                            handler: function(grid, rowIndex) {
                                var rec = grid.getStore().getAt(rowIndex);

                                Ext.create('Ext.Component', {
                                    renderTo: Ext.getBody(),
                                    cls: 'x-hidden',
                                    autoEl: {
                                        tag: 'iframe',
                                        src: 'data/event_file/download_single.php?file_id='+rec.get("file_id")+'&event_id='+rec.get("event_id")
                                    }
                                });
                            }
                        },
                        {
                            iconCls: 'x-fa fa-share',
                            tooltip: 'Condividi',
                            handler: function(grid, rowIndex) {
                                var rec = grid.getStore().getAt(rowIndex);

                                CL.app.getController("C_event_file").share(this.el,rec);
                            }
                        },
                        {
                            iconCls: 'x-fa fa-edit',
                            tooltip: 'Modifica',
                            handler: function(grid, rowIndex) {
                                var event_id = (window.location.hash.split("/"))[1];

                                CL.app.getController("C_permessi").canWriteEvent(event_id, true,function(){
                                    var rec = grid.getStore().getAt(rowIndex);

                                    CL.app.getController("C_event_file").onEdit(rec);
                                });

                            }
                        },
                        {
                            iconCls: 'x-fa fa-trash',
                            tooltip: 'Elimina',
                            handler: function(grid, rowIndex) {
                                var event_id = (window.location.hash.split("/"))[1];

                                CL.app.getController("C_permessi").canWriteEvent(event_id, true,function(){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    
                                    Ext.Msg.confirm('Attenzione!', 'Eliminare <b>'+rec.get("title")+"</b>?",function(btn){
                                        if (btn === 'yes')
                                            Ext.StoreManager.lookup("S_event_file").remove(rec);
                                    });
                                });

                            }
                        }
                    ]
                }
            ]
        }
    ]

});
