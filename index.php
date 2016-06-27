<!DOCTYPE HTML>
<html manifest="">
<head>

    <!-- per modificare i colori del tema, i file si trovano in .\build\development\Test\classic\resources -->

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <title>KMS</title>

    <link rel="shortcut icon" href="images/logos/favicon.png" type="image/ico">

    <script type="text/javascript">
        var Ext = Ext || {};
                Ext.beforeLoad = function (tags) {
            var s = location.search,
                profile;

            if (s.match(/\bclassic\b/)) {
                profile = 'classic';
            }
            else if (s.match(/\bmodern\b/)) {
                profile = 'modern';
            }
            else {
                profile = tags.desktop ? 'classic' : 'modern';
            }

            Ext.manifest = "classic";      //profile  
        };
    </script>


    <!-- The line below must be kept intact for Sencha Cmd to build your application -->
    <script id="microloader" data-app="725d0f42-6968-46dc-8f34-6e5c54c1d970" type="text/javascript" src="bootstrap.js"></script>


    <!-- spacing actioncolumn -->
    <style type="text/css">
        .x-action-col-icon {
            height: 16px;
            width: 16px;
            margin-right: 8px;
        }
    </style>


    <!-- Fine Uploader -->
    <link href="lib/fine-uploader/fine-uploader-new.css" rel="stylesheet">
    <script src="lib/fine-uploader/fine-uploader.js"></script>


</head>





<body bgcolor="#963232">
    <link href="my_style.css" rel="stylesheet" type="text/css">


    <!-- jquery -->
   <!-- <script src="//code.jquery.com/jquery-2.1.4.min.js"></script> -->
    <script src="lib/jquery/jquery-2.1.4.min.js"></script>

    <!-- unslider -->
    <link href="lib/unslider/unslider.css" rel="stylesheet" type="text/css">
    <script src="lib/unslider/unslider.min.js"></script>


    <!-- HoverDir -->
    <link rel="stylesheet" type="text/css" href="lib/hoverdir/css/demo.css" />
    <link rel="stylesheet" type="text/css" href="lib/hoverdir/css/style.css" />
    <script src="lib/hoverdir/js/modernizr.custom.97074.js"></script>
    <noscript><link rel="stylesheet" type="text/css" href="lib/hoverdir/css/noJS.css"/></noscript>
    <script type="text/javascript" src="lib/hoverdir/js/jquery.hoverdir.js"></script>



    <img id="img_loader_id" src="images/loading.gif" alt=" " height="42" width="42" style="position: absolute;top: 50%;left: 50%;margin-left: -(200/2);margin-top: -(200/2)px;">

</body>
</html>
