Ext.define('CL.view.home.V_home', {
    extend: 'Ext.panel.Panel',
    xtype: 'home',
    itemId: 'home_id',
    alias: 'widget.home',

    bodyStyle: 'backgroundColor: transparent',  //per rendere il corpo invisibile

    layout: {
        type: 'vbox',
        align: 'center'
    },
            
    initComponent: function() {
        var this_view = this;

        this_view.tbar = {
            xtype: 'toolbar',
            padding: 0,
            items: [
                {
                    xtype: 'srccomponent',
                    src: 'app/view/home/html/unslider.html',
                    height: 470,
                    loaded_fn: function(){
                        $('.banner').unslider({
                            speed: 500,               
                            delay: 3500,             
                            keys: true,               
                            dots: true,               
                            fluid: false
                        });
                    }
                }
            ]
        };      

        this_view.items = [
            {
                xtype: 'panel',
                //title: 'Ricerca nel SITAR',
                bodyCls: 'mypanel',
                titleAlign: 'center',
                height: 100,
                width: '100%',
                margin: '10 0 0 0',
                style: {
                    borderRadius: "5px"
                },
                //bodyStyle: 'backgroundColor: #333333',
                layout: {
                    type: 'hbox',
                    align: 'center',
                    pack: 'center'
                },
                items: [
                    /*{
                        xtype: 'combobox',
                        store: 'S_quick_search',

                        minChars: 3,

                        displayField: 'description',
                        valueField: 'id',

                        tpl: Ext.create('Ext.XTemplate',
                            '<ul class="x-list-plain"><tpl for=".">',
                                '<li role="option" class="x-boundlist-item">' +
                                    '<table border="0" style="height:60px;width:100%;"><tr>' +
                                        '<td width="60px" align="center"><img  width="50px" height="50px" style="vertical-align: top" src="images/icons/icon_{type}.png"></td>' +
                                        '<td align="center">{description}</td>' +
                                    '</tr></table>' +
                                '</li>',
                            '</tpl></ul>'
                        ),

                        emptyText: 'Colosseo, SITAR, inaugurazione museo...',
                        name: 'query_quick_search',
                        hideTrigger: true,
                        width: 500,
                        margin: '0 10 0 0',
                        listeners: {
                            specialkey: function(me,e){
                                if (e.getKey() === e.ENTER)
                                    Ext.ComponentQuery.query('home button[action=go_to_search]')[0].fireEvent("click");
                            },
                            select: function(combo, record){
                                combo.reset();
                                CL.app.getController('C_home').redirectTo(record.get("type")+"/"+record.get("id"));
                            }
                        }
                    },*/
                    {
                        xtype: 'textfield',
                        minChars: 3,
                        emptyText: 'Cerca in KMS: Colosseo, SITAR, inaugurazione museo...',
                        name: 'query_quick_search',
                        width: 500,
                        margin: '0 10 0 0',
                        listeners: {
                            specialkey: function(me,e){
                                if (e.getKey() === e.ENTER)
                                    Ext.ComponentQuery.query('home button[action=go_to_search]')[0].fireEvent("click");
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        action: 'go_to_search',
                        text: 'Passa a Ricerca Avanzata',
                        listeners:{
                            click: function(){
                                var query = Ext.ComponentQuery.query("home textfield[name=query_quick_search]")[0].getValue();
                                if(query == null) query = "";
                                CL.app.getController('C_home').redirectTo('search/'+query);
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'panel',
                width: '100%',
                height: 600,
                margin: '10 0 10 0',
                bodyStyle: 'backgroundColor: #333333',//#732828',

                style:{
                    borderRadius: "5px"
                },

                defaults: {
                    bodyStyle: 'padding:15px'
                },
                layout: {
                    type: 'accordion',
                    titleCollapse: true,
                    animate: true,
                    activeOnTop: false
                },
                items: [

                    {
                        title: 'Approfondisci Tematiche SITAR',
                        items: [
                            {
                                xtype: 'srccomponent',
                                src: 'app/view/home/html/approfondisci.html',
                                margin: '-20 0 0 0',
                                height: 470,
                                loaded_fn: function(){
                                    $(' #da-thumbs > li ').each( function() { $(this).hoverdir(); } );
                                }
                            }
                        ]
                    },
                    {
                        title: 'Contribuisci al completamento del SITAR',
                        items: [
                            {
                                xtype: 'srccomponent',
                                src: 'app/view/home/html/contribuisci.html',
                                margin: '-20 0 0 0',
                                height: 470,
                                loaded_fn: function(){
                                    $(' #da-thumbs > li ').each( function() { $(this).hoverdir(); } );
                                }
                            }
                        ]
                    }
                ]
            }
            
        ];

        this.callParent(arguments);
    }


});
