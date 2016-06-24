Ext.define('CL.controller.C_uploader', {
    extend: 'Ext.app.Controller',

    stores: [
        //
    ],
    models: [
        //
    ],
    views: [
        //
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({

        }, this);
    },
    /////////////////////////////////////////////////

    showCollectionUploader: function(animateTargetEl,collection_id,callback_on_close){
        Ext.create('Ext.window.Window',{
            animateTarget: animateTargetEl,
            autoShow: true,
            modal: true,
            title: 'Carica Files',
            width: 800,
            height: 532,
            layout: 'fit',
            listeners: {
                close: callback_on_close
            },
            items: [
                {
                    xtype: 'srccomponent',
                    src: 'app/view/home/html/uploader.html',
                    padding: 5,
                    loaded_fn: function(){
                        var manualUploader = new qq.FineUploader({
                            element: document.getElementById('fine-uploader-manual-trigger'),
                            template: 'qq-template-manual-trigger',

                            autoUpload: false,
                            debug: false,

                            retry: {
                                enableAuto: false
                            },

                            request: {
                                endpoint: 'data/collection/single_upload.php?collection_id='+collection_id
                            },
                            /*deleteFile: {
                                enabled: true,
                                method: "POST",
                                endpoint: "/server/uploads/delete.php"
                            },*/
                            resume: {
                                enabled: true
                            },
                            thumbnails: {
                                placeholders: {
                                    waitingPath: 'lib/fine-uploader/placeholders/waiting-generic.png',
                                    notAvailablePath: 'lib/fine-uploader/placeholders/not_available-generic.png'
                                }
                            },

                            callbacks: {
                                onSubmitted: function (id, name) {
                                    //Ext.Msg.alert('TEST', 'onSubmitted');
                                    console.log("onSubmitted ("+id+","+name+")");
                                },
                                onUpload: function (id, name) {
                                    //Ext.Msg.alert('TEST', 'onUpload');
                                    console.log("onUpload ("+id+","+name+")");

                                }
                            }
                        });

                        qq(document.getElementById("trigger-upload")).attach("click", function() {
                            //Ext.Msg.alert('TEST', 'onUpload');
                            manualUploader.uploadStoredFiles();
                        });
                    }
                }
            ]
        });
    }

});
