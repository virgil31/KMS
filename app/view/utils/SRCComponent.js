Ext.define('CL.view.utils.SRCComponent', {
    extend: 'Ext.Component',
    alias: 'widget.srccomponent',

    src: null,
    loaded_fn: null,

    initComponent: function() {
        var me = this;

        me.loader = {
            url: me.src,
            type: "html",
            scripts: true,
            autoLoad:true,
            success: me.loaded_fn
        };

        me.callParent(arguments);
    }

});
