Ext.define('CL.view.collection.V_create', {
    extend: 'Ext.window.Window',
    xtype: 'collection_create',
    itemId: 'colection_create_id',
    alias: 'widget.collection_create',



    bodyStyle: {
        background: "transparent"
    },

    autoShow: true,
    modal: true,
    constrain: true,

    listeners: {
        //fadein on show
        show : function(window) {
            window.getEl().setOpacity(0);
            window.getEl().fadeIn({duration: 500});
        },
        //fadeout on close
        beforeclose : function(window) {
            if(!window.shouldClose) {
                window.getEl().fadeOut({duration: 500, callback: function() {
                    window.shouldClose = true;
                    window.close();
                }});
            }
            return window.shouldClose ? true : false; //window.shouldClose ? true : false;
        }
    },

    buttonAlign: 'center',

    title: 'Nuova Collezione',

    width: 500,
    padding: 15,

    items: [
        {
            xtype: 'form',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'title',
                    fieldLabel: 'Titolo',
                    labelAlign: 'top',
                    emptyText: 'Foto Anniversario Colosseo 2015',
                    width: '100%',
                    allowBlank: false
                },
                {
                    xtype: 'textareafield',
                    name: 'description',
                    fieldLabel: 'Descrizione',
                    labelAlign: 'top',
                    emptyText: "Descrizione/Motivazione della Collezione",
                    width: '100%',
                    height: 175,
                    allowBlank: false,
		    maxLength: 270
                },
                {
                    xtype: 'tagfield',
                    name: 'tags',
                    store: 'S_search',
                    fieldLabel: 'TAGS',
                    labelAlign: 'top',
                    width: '100%',
                    displayField: 'to_display',
                    valueField: 'id',
                    filterPickList: true,
                    allowBlank: false,
                    hideTrigger: true,
                    minChars: 3,
                    tpl: Ext.create('Ext.XTemplate',
                        '<ul class="x-list-plain" ><tpl for=".">',
                        '<li role="option" class="x-boundlist-item" data-qtip="{tooltip}">' +
                        '<table border="0" style="height:60px;width:100%;"><tr>' +
                        '<td width="60px" align="center"><img  width="50px" height="50px" style="vertical-align: top" src="images/icons/icon_{type}.png"></td>' +
                        '<td align="center">{description}</td>' +
                        '</tr></table>' +
                        '</li>',
                        '</tpl></ul>'
                    )
                }
            ]
        }
    ],
    buttons:[
        {
            text: 'Salva e Conferma',
            action: 'do_create'
        }
    ]

});
