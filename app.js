Ext.application({
    extend: 'Ext.app.Application',

    name: 'CL',

    requires: [
        'CL.view.utils.SRCComponent',
        'CL.view.utils.imageviewer.ImageViewer'
    ],


    models: [
        "M_generic",
        "M_user_activity"
    ],

    stores: [
        "S_external_resource_type",
        "S_license",
        "S_user_activity",
        "S_user_interested_activity"
    ],

    controllers: [
        'C_js_css_loader',

        'C_permessi',

        'C_not_found',
        'C_user',
        'C_sign_up',
        'C_home',
        'C_second',

        'C_bbar',
        'C_tbar',

        'C_quick_search',
        'C_search',
        'C_uploader',

        'C_collection',
        'C_collection_file',
        'C_collection_user',
        'C_collection_external_resource',

        'C_preview',

        'C_ente',
        'C_user_pool',

        'C_collection_thread',
        'C_collection_thread_message',
        'C_collection_tag',

        'C_tag'
    ],

    // vv ROUTING

    defaultToken : 'home', //se arrivo www.miosito.it ==> www.miosito.it/#home

    // Quando nessuna route è stata trovata
    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute'
            }
        }
    },
    // ^^

    onUnmatchedRoute: function(hash) {        
        //this.redirectTo('not_found');
        if(Ext.ComponentQuery.query('not_found').length == 0)
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].add({xtype: 'not_found'});

        Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('not_found_id'); 
    },

    launch: function () {

        //rimuovo la gif di caricamento
        var item = document.getElementById("img_loader_id");
        item.parentNode.removeChild(item);
                
        this.applyOverrides();

        //previene la creazione dei context menu del browser
        //Ext.getDoc().on('contextmenu', function(ev) {
        //     ev.preventDefault();
        //});

        // per prevenire alcuni warning dell'ARIA
        Ext.enableAriaButtons = false;

        Ext.create('Ext.container.Viewport',{
            layout: 'fit',
            items:[
                {
                    xtype: 'panel',
                    name: 'scrollable',
                    //scrollable: 'y',
                    overflowY : "scroll",
                    bodyStyle: "background: url(images/background.png)",//"background: url(http://www.psdgraphics.com/file/red-grunge-background.jpg); background-size: cover",// 963232
                    tbar: Ext.widget('tbar'),
                    width: '100%',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'panel',
                            name: 'card',
                            layout: 'card',
                            width: 960,
                            minHeight: window.innerHeight-88-264,
                            bodyStyle: 'backgroundColor: transparent'
                        },
                        Ext.widget('bbar')
                    ]                 
                }                
            ]            
        });   

        window.onresize = function(){
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].minHeight = window.innerHeight-88-264;
        }
    },


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    applyOverrides: function () {

        Ext.Loader.loadScript({
                url: "ext/classic/locale/overrides/it/ext-locale-it.js",
                scope: this
            }
        );

        Ext.override(Ext.form.field.Text, {
            msgTarget: 'side'
        });

        /*
        Ext.override(Ext.form.field.Text,{
            msgTarget: 'side',
            blankText: 'Questo campo è obbligatorio',
            minLengthText: 'Minimo {0} caratteri',
            maxLengthText: 'Massimo {0} caratteri'
        });

        Ext.override(Ext.window.MessageBox,{
            buttonText: {
                yes: "Sì"
            }
        });
        */

        /*
        checkbox allowBlankabili
        */
        Ext.define('Override', {
            override : 'Ext.form.field.Checkbox',

            allowBlank : true,

            blankText: 'Questo campo è obbligatorio',

            getErrors : function(value) {
                var me     = this,
                    errors = me.callParent([value]);

                if (!me.checked && !me.allowBlank) {
                    errors.push(me.blankText);
                }

                return errors;
            }
        });

        

        /*
         fade animation card layout
         */
        Ext.override(Ext.layout.container.Card, {
            setActiveItem: function (newCard) {

                var me = this,
                    owner = me.owner,
                    oldCard = me.activeItem,
                    rendered = owner.rendered,
                    newIndex;

                newCard = me.parseActiveItem(newCard);
                newIndex = owner.items.indexOf(newCard);

                // If the card is not a child of the owner, then add it.
                // Without doing a layout!
                if (newIndex === -1) {
                    newIndex = owner.items.items.length;
                    Ext.suspendLayouts();
                    newCard = owner.add(newCard);
                    Ext.resumeLayouts();
                }

                // Is this a valid, different card?
                if (newCard && oldCard !== newCard) {
                    // Fire the beforeactivate and beforedeactivate events on the cards
                    if (newCard.fireEvent('beforeactivate', newCard, oldCard) === false) {
                        return false;
                    }
                    if (oldCard && oldCard.fireEvent('beforedeactivate', oldCard, newCard) === false) {
                        return false;
                    }

                    if (rendered) {
                        Ext.suspendLayouts();

                        // If the card has not been rendered yet, now is the time to do so.
                        if (!newCard.rendered) {
                            me.renderItem(newCard, me.getRenderTarget(), owner.items.length);
                        }

                        var handleNewCard = function () {
                            // Make sure the new card is shown
                            if (newCard.hidden) {
                                newCard.show();
                            }

                            if (!newCard.tab) {
                                var newCardEl = newCard.getEl();
                                newCardEl.dom.style.opacity = 1;
                                if (newCardEl.isStyle('display', 'none')) {
                                    newCardEl.setDisplayed('');
                                } else {
                                    newCardEl.show();
                                }
                            }

                            // Layout needs activeItem to be correct, so set it if the show has not been vetoed
                            if (!newCard.hidden) {
                                me.activeItem = newCard;
                            }
                            Ext.resumeLayouts(true);
                        };

                        var handleOldCard = function () {
                            if (me.hideInactive) {
                                oldCard.hide();
                                oldCard.hiddenByLayout = true;
                            }
                            oldCard.fireEvent('deactivate', oldCard, newCard);
                        };

                        if (oldCard && !newCard.tab) {
                            var oldCardEl = oldCard.getEl();
                            oldCardEl.fadeOut({
                                callback: function () {
                                    handleOldCard();
                                    handleNewCard();    
                                    Ext.ComponentQuery.query('viewport panel')[0].body.scrollTo('top',0);                    //AGGIUNTA PER LO SCROLL TOP
                                }
                            });

                        } else if (oldCard) {
                            handleOldCard();
                            handleNewCard();
                        } else {
                            handleNewCard();
                        }

                    } else {
                        me.activeItem = newCard;
                    }

                    newCard.fireEvent('activate', newCard, oldCard);                    

                    return me.activeItem;
                }
                return false;
            }
        });
        //^^ fade animation card layout
    }
});


