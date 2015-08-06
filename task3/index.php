<!DOCTYPE html>
<html>
    <head>
        <meta charset='UTF-8'>
        <link href="css/style.css" rel="stylesheet" type="text/css"/>
        <script lang="javascript" src="js/jquery-2.1.4.js"></script>
        <!--<script lang="javascript" src="js/id3-minimized.js"></script>-->
        <script lang="javascript" src="js/jdataview.js"></script> 
        <script lang="javascript" src="js/player.js"></script>  
        <title>Player</title>
    </head>
    <body>
        <div id="layer">
            <table width="100%" height="100%">
                <tr>
                    <td width="5%"></td>
                    <td width="90%">
                        <table width="100%" height="100%">
                            <tr height="5%">
                                <td colspan="3">
                                    <span style="font-family:Euphemia;font-weight: bold; color: #ff0600; ">Y</span><span style="font-family:Narkisim;font-weight: bold; ">andex</span>
                                </td> 
                            </tr>
                            <tr class="display" height="50%">
                                <td colspan="3">
                                    <table id="dropzone" width="100%" height="100%">
                                        <tr id="line_toolbar" height="24px" >
                                            <td align="left">
                                                <span id="file_name" style="display: none; font-size: 10px; padding-left: 5px;"></span>
                                            </td>
                                            <td align="right">
                                                <span style="font-size: 10px;" id="volume_perc"></span>
                                            </td>
                                            <td width="24px" align="right" valign="center">
                                                <img id="toolbar_volume" style="display: none;" src="img/toolbar_sound.png" />
                                            </td>
                                        </tr>
                                        <tr id="line_img" height="70%" >
                                            <td id="visual_place" colspan="3">
                                                <img id="wallpaper" src="img/file.png" />
                                            </td>
                                        </tr>
                                        <tr id="line_meta" height="20%">
                                            <td colspan="3" id="meta" align="center" valign="middle"></td>
                                        </tr>
                                    </table>
                                </td> 
                            </tr>
                            <tr height="10%" >
                                <td colspan="3"><img id="btnVolumeUp" src="img/volume_increase.png"/></td> 
                            </tr>
                            <tr class="control" height="20%">
                                <td width="30%"><img id="btnLeft" src="img/left.png" /></td>
                                <td class="control_center" width="40%">
                                    <img id="btnPlayPause" src="img/play.png" />
                                </td>
                                <td width="30%"><img id="btnRight" src="img/right.png" /></td>
                            </tr>
                            <tr height="15%">
                                <td colspan="3"><img id="btnVolumeDown" src="img/volume_decrease.png" style="padding-bottom: 10px;padding-left: 10px;"/></td> 
                            </tr>
                        </table>
                    </td>
                    <td width="5%"></td>
                </tr>
            </table>
        </div>
    </body>
</html>