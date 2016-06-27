Ext.define('CL.view.collection_file.V_list_by_collection', {
    extend: 'Ext.panel.Panel',
    xtype: 'collection_file_list_by_collection',
    itemId: 'collection_file_list_by_collection_id',
    alias: 'widget.collection_file_list_by_collection',

    title: 'Documenti',
    icon: 'images/icons/icon_file.png',
    bodyStyle: 'background: #484848',
    padding: 1,
    items: [
        {
            xtype: 'grid',
            name:'collection_file',
            store: 'S_collection_file',
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
                                    var collection_id = (window.location.hash.split("/"))[1];

                                    CL.app.getController("C_permessi").canWriteCollection(collection_id, true,function(){
                                        CL.app.getController("C_uploader").showCollectionUploader(btn.getEl(),collection_id,function(){
                                            Ext.StoreManager.lookup("S_collection_file").load({
                                                params: {
                                                    collection_id: collection_id
                                                }
                                            });
                                            console.log("ricarico lo store dei collection_files perchè probabilmente ne ho uppato dei nuovi");
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
                    flex: 0.7,
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
                    xtype: 'actioncolumn',
                    width: 110,
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
                                        src: 'data/collection_file/download_single.php?file_id='+rec.get("file_id")+'&collection_id='+rec.get("collection_id")
                                    }
                                });
                            }
                        },
                        {
                            iconCls: 'x-fa fa-edit',
                            tooltip: 'Modifica',
                            handler: function(grid, rowIndex) {
                                var collection_id = (window.location.hash.split("/"))[1];

                                CL.app.getController("C_permessi").canWriteCollection(collection_id, true,function(){
                                    var rec = grid.getStore().getAt(rowIndex);

                                    CL.app.getController("C_collection_file").onEdit(rec);
                                });

                            }
                        },
                        {
                            iconCls: 'x-fa fa-trash',
                            tooltip: 'Elimina',
                            handler: function(grid, rowIndex) {
                                var collection_id = (window.location.hash.split("/"))[1];

                                CL.app.getController("C_permessi").canWriteCollection(collection_id, true,function(){
                                    var rec = grid.getStore().getAt(rowIndex);

                                    Ext.Msg.confirm('Attenzione!', 'Eliminare <b>'+rec.get("title")+"</b>?",function(btn){
                                        if (btn === 'yes')
                                            Ext.StoreManager.lookup("S_collection_file").remove(rec);
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
