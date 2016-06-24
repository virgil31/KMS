Ext.define('CL.view.search.V_search', {
    extend: 'Ext.panel.Panel',
    xtype: 'search',
    itemId: 'search_id',
    alias: 'widget.search',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    bodyStyle: {
        background: "transparent"
    },

    items: [
        {
            xtype: 'panel',
            title: 'Ricerca Avanzata nel SITAR',
            titleAlign: 'center',
            height: 100,
            width: '100%',
            margin: '10 0 0 0',
            bodyStyle: 'backgroundColor: #333333',
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'textfield',
                    emptyText: 'Colosseo, SITAR, inaugurazione museo...',
                    name: 'query_search',
                    width: 700,
                    margin: '0 10 0 0',
                    listeners: {
                        specialkey: function (me, e) {
                            if (e.getKey() === e.ENTER)
                                Ext.ComponentQuery.query('search button[action=go_to_search]')[0].fireEvent("click");
                        }
                    }
                },
                {
                    xtype: 'button',
                    action: 'go_to_search',
                    text: 'Cerca',
                    listeners:{
                        click: function(){
                            var query = Ext.ComponentQuery.query("search textfield[name=query_search]")[0].getValue();
                            if(query.length != 0){
                                var store = Ext.StoreManager.lookup("S_search");
                                store.proxy.extraParams.query = query;
                                store.loadPage(1);
                            }
                            else{
                                Ext.Msg.alert("Attenzione","Non sono stati esplicitati parametri di ricerca.");
                            }

                        }
                    }
                }
            ]
        },

        {
            xtype: 'panel',
            height: 1000,
            width: '100%',
            margin: '10 0 10 0',
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'center'
            },

            bodyStyle: {
                background: "transparent"
            },
            items:[
                {
                    xtype: 'panel',
                    flex: 0.5,
                    height: '100%',
                    bodyStyle: {
                        background: "transparent"
                    },
                    margin: '0 5 0 0',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'panel',
                            title: 'Tipo di Risultato',
                            width: '100%',
                            margin: '0 0 5 0',
                            flex: 3.5,
                            bodyStyle: {
                                background: "#484848"
                            },
                            items: [
                                {
                                    xtype: 'radiogroup',
                                    margin: '10 0 5 10',
                                    style: {
                                        color: "white"
                                    },
                                    items: [
                                        {
                                            xtype: 'radiogroup',
                                            columns: 1,
                                            vertical: true,
                                            listeners: {
                                                change: function (me, newValue) {
                                                    var query = Ext.ComponentQuery.query("search textfield[name=query_search]")[0].getValue();
                                                    if(query.length != 0){

                                                        var array = $.map(newValue, function(value) {
                                                            return [value];
                                                        });
                                                        var store = Ext.StoreManager.lookup("S_search");
                                                        store.proxy.extraParams.query = query;
                                                        store.proxy.extraParams.search_type = array[0];
                                                        store.loadPage(1);
                                                    }
                                                }
                                            },
                                            items: [
                                                {boxLabel: 'Tutti',                     inputValue: 'all', checked: true},
                                                {boxLabel: 'Origini Informazione',      inputValue: 'information_source'},
                                                {boxLabel: 'Partizioni Archeologiche',  inputValue: 'archaeo_part'},
                                                {boxLabel: 'Collezioni',                inputValue: 'collection'},
                                                {boxLabel: 'Eventi',                    inputValue: 'event'},
                                                {boxLabel: 'Utenti',                    inputValue: 'user'}
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            title: 'Filtri',
                            width: '100%',
                            margin: '5 0 0 0',
                            flex: 10,
                            bodyStyle: {
                                background: "#484848"
                            }
                        }
                    ]
                },

                {
                    xtype: 'grid',
                    store: 'S_search',
                    hideHeaders: true,
                    disableSelection: true,
                    flex: 1,
                    title: 'Risultati',
                    height: '100%',
                    bodyStyle: {
                        background: "#484848"
                    },
                    margin: '0 0 0 5',
                    listeners: {
                        itemclick: function (grid, record) {
                            var id = record.get("id"),
                                type = record.get("type");
                            CL.app.getController("C_search").redirectTo(type+"/"+id);
                        },
                        //tooltip
                        itemmouseenter: function (view,record,item,index,e,options) {
                            //chiudo i precedenti
                            Ext.ComponentQuery.query("tooltip").forEach(function (tooltip) {
                                tooltip.disable();
                            });
                            //creo il nuovo tooltip
                            Ext.create("Ext.tip.ToolTip",{
                                target: view.el,
                                delegate: view.itemSelector,
                                trackMouse: true,
                                dismissDelay: 30000,
                                html: record.get("tooltip")
                            });
                        }
                    },
                    columns: [
                        {
                            text: 'type',
                            dataIndex: 'type',
                            flex: 1,
                            renderer: function (type,metaData,record) {
                                //return  "<img src='images/icons/icon_"+type+".png' alt=' ' height='60' width='60'> </td>";
                                return record.get("tooltip");
                            }
                        }/*,
                        {
                            text: 'description',
                            dataIndex: 'description',
                            flex: 7
                        }*/
                    ],
                    dockedItems: [  
                        {
                            xtype: 'pagingtoolbar',
                            store: 'S_search',
                            dock: 'bottom',
                            displayInfo: true
                        }
                    ]
                }
            ]
        }
    ]

});
