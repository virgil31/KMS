Ext.define('CL.view.event.V_create', {
    extend: 'Ext.window.Window',
    xtype: 'event_create',
    itemId: 'colection_create_id',
    alias: 'widget.event_create',



    bodyStyle: {
        background: "transparent"
    },

    autoShow: true,
    modal: true,
    constrain: true,
    resizable: false,

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


    title: 'Nuovo Evento',

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
                    allowBlank: false,
                    minLength: 15,
                    maxLength: 80
                },
                {
                    xtype: 'textareafield',
                    name: 'description',
                    fieldLabel: 'Descrizione',
                    labelAlign: 'top',
                    emptyText: "Descrizione dell'Evento",
                    width: '100%',
                    height: 175,
                    allowBlank: false,
		            maxLength: 270
                },
                {
                    xtype: 'combobox',
                    name: 'license_id',
                    fieldLabel: 'Licenza',
                    width: '100%',
                    allowBlank: false,
                    labelAlign: 'top',
                    editable: false,
                    store: 'S_license',
                    valueField: 'id',
                    displayField: 'name',
                    tpl: Ext.create('Ext.XTemplate',
                        '<ul class="x-list-plain" ><tpl for=".">',
                        '<li role="option" class="x-boundlist-item" data-qtip="{description}">' +
                        '{name}' +
                        '</li>',
                        '</tpl></ul>'
                    )
                },
                {
                    xtype: 'tagfield',
                    name: 'tags',
                    store: Ext.create('CL.store.S_quick_search'),
                    fieldLabel: 'TAGS',
                    labelAlign: 'top',
                    width: '100%',
                    displayField: 'to_display',
                    valueField: 'composed_id',//'id',
                    filterPickList: true,
                    allowBlank: false,
                    hideTrigger: true,
                    minChars: 3,

                    tpl: Ext.create('Ext.XTemplate',
                        '<ul class="x-list-plain" ><tpl for=".">',
                        '<li role="option" class="x-boundlist-item" data-qtip="{tooltip}">' +
                        '{to_display}' +
                        '</li>',
                        '</tpl></ul>'
                    )/*
                    tpl: Ext.create('Ext.XTemplate',
                        '<ul class="x-list-plain" ><tpl for=".">',
                        '<li role="option" class="x-boundlist-item" data-qtip="{tooltip}">' +
                        '<table border="0" style="height:60px;width:100%;"><tr>' +
                        '<td width="60px" align="center"><img  width="50px" height="50px" style="vertical-align: top" src="images/icons/icon_{type}.png"></td>' +
                        '<td align="center">{description}</td>' +
                        '</tr></table>' +
                        '</li>',
                        '</tpl></ul>'
                    )*/
                }
            ],
            buttonAlign: 'center',
            buttons:[
                {
                    text: 'Conferma e Avanti >',
                    action: 'do_create',
                    formBind: true
                }
            ]
        }
    ]

});
