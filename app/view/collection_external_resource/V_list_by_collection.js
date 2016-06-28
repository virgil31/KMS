Ext.define('CL.view.collection_external_resource.V_list_by_collection', {
    extend: 'Ext.panel.Panel',
    xtype: 'collection_external_resource_list_by_collection',
    itemId: 'collection_external_resource_list_by_collection_id',
    alias: 'widget.collection_external_resource_list_by_collection',

    title: 'Links',
    icon: 'images/icons/icon_link.png',
    bodyStyle: 'background: #484848',
    padding: 1,


    listeners: {
        activate: function(){
            Ext.StoreManager.lookup("S_collection_external_resource").load({
                params:{
                    collection_id: (window.location.hash.split("/"))[1]
                }
            });
        }
    },


    layout: 'fit',
    

    items: [
        {
            xtype: 'grid',
            name:'collection_external_resource',
            store: 'S_collection_external_resource',
            //hideHeaders: true,
            tbar: [
                {
                    xtype: 'panel',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Aggiungi Risorsa Esterna (URL)',
                            iconCls: 'x-fa fa-plus',
                            action: 'on_create'/*,
                            listeners: {
                                click: function (btn) {
                                    var collection_id = (window.location.hash.split("/"))[1];

                                    CL.app.getController("C_permessi").canWriteCollection(collection_id, true,function(){
                                        CL.app.getController("C_uploader").showCollectionUploader(btn.getEl(),collection_id,function(){
                                            Ext.StoreManager.lookup("S_collection_external_resource").load({
                                                params: {
                                                    collection_id: collection_id
                                                }
                                            });
                                            console.log("ricarico lo store dei collection_external_resources perchè probabilmente ne ho uppato dei nuovi");
                                        });
                                    });

                                }
                            }*/
                        }
                    ]
                }
            ],
            columns: [
                {
                    text: 'Tipo',
                    dataIndex: 'type_name',
                    flex: 0.7,
                    renderer: function(value){

                        var icon_url = "images/icon_other_file.png";

                        if(value == "Immagine")
                            icon_url = "images/icons/icon_image.png";
                        else if(value == "PDF")
                            icon_url = "images/icons/icon_pdf.png";
                        else if(value == "Word")
                            icon_url = "images/icons/icon_word.png";
                        else if(value == "Excel")
                            icon_url = "images/icons/icon_excel.png";
                        else if(value == "Testuale")
                            icon_url = "images/icons/icon_text.png";
                        else if(value == "Video")
                            icon_url = "images/icons/icon_video.png";
                        else if(value == "Archivio")
                            icon_url = "images/icons/icon_archivio.png";

                        return '<img title="'+value+'" src="'+icon_url+'" alt=" " height="20" width="20">';
                    }
                },
                { 
                    text: 'Nome',
                    dataIndex: 'title', 
                    flex: 10
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

                                window.open(rec.get("url"), '_blank');

                                /*CL.app.getController("C_preview").showWindowPreview(btnEl,file_id,rec.get("title"));*/
                            }
                        },
                        {
                            iconCls: 'x-fa fa-edit',
                            tooltip: 'Modifica',
                            handler: function(grid, rowIndex) {
                                var collection_id = (window.location.hash.split("/"))[1];
                                var animateTarget = this.el;

                                CL.app.getController("C_permessi").canWriteCollection(collection_id, true,function(){
                                    var rec = grid.getStore().getAt(rowIndex);

                                    CL.app.getController("C_collection_external_resource").onEdit(rec,animateTarget);
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
                                        if (btn === 'yes'){
                                            Ext.StoreManager.lookup("S_collection_external_resource").remove(rec);
                                            Ext.StoreManager.lookup("S_collection_external_resource").sync();
                                        }
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
