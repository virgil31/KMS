Ext.define('CL.view.event_tag.V_create', {
    extend: 'Ext.window.Window',
    xtype: 'event_tag_create',
    itemId: 'event_tag_create_id',
    alias: 'widget.event_tag_create',

    bodyStyle: {
        background: "transparent"
    },

    autoShow: true,
    modal: true,
    constrain: true,

    buttonAlign: 'center',

    title: 'Aggiungi TAG all\'evento',

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
                    xtype: 'label',
                    html: "<div style='text-align: center'>Cerca tramite parole chiave le entità che vuoi taggare!<br>Ad esempio: <i>Colosseo, SITAR, inaugurazione museo...</i></div>"
                },
                {
                    xtype: 'tagfield',
                    name: 'tags',
                    store: "S_quick_search",
                    labelAlign: 'top',
                    width: '100%',
                    displayField: 'to_display',
                    valueField: 'composed_id',//'id',
                    filterPickList: true,
                    allowBlank: false,
                    hideTrigger: true,
                    minChars: 3,
                    margin: '5 0 5 0',
                    tpl: Ext.create('Ext.XTemplate',
                        '<ul class="x-list-plain" ><tpl for=".">',
                        '<li role="option" class="x-boundlist-item" data-qtip="{tooltip}">' +
                        '{to_display}' +
                        '</li>',
                        '</tpl></ul>'
                    )
                }
            ]
        }
    ],
    buttons:[
        {
            text: 'Conferma TAG',
            icon: 'images/icons/icon_flag_ok.png',
            action: 'do_create'
        }
    ]

});
