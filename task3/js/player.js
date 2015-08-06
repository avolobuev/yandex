$(document).ready(
function()
{
    try
    {
        /*
         * declarations
         */
        
        var ctx = (new window.AudioContext() || new window.webkitAudioContex()); // web audio api context
        
        if(!ctx.createGain)
            ctx.createGain = ctx.createGainNode;//for + - sound
        if(!ctx.createDelay)
            ctx.createDelay = ctx.createDelayNode;
        if(!ctx.createScriptProcessor)
            ctx.createScriptProcessor = ctx.creatJavaScriptNode;
        
        window.requestAnimFrame = (function() //for visualization
        {
            return window.requestAnimationFrame || 
                   window.webkitRequestAnimationFrame || 
                   window.mozRequestAnimationFrame ||
                   window.oRequestAnimationFrame ||
                   window.msRequestAnimationFrame ||
            function(callback)
            {
                setTimeout(callback, 1000 / 60);
            };
        })();

        var isPlaying = 0,  bVisual = 0, currentButton = 0, maxSizeMenu = 2/*3*/, startTime = 0, startOffset = 0;
        
        var currentVolume = 100;
        var maxVolume = 200;
        
        var WIDTH = 200;
        var HEIGHT = 150;

        var SMOOTHING = 0.7;//how fast
        var FFT_SIZE = 2048;

        
        var buffer = null, source, destination, gainNode, analyser;

        var currentFileName = 'n/a';
        var meta = null;


        //possible states
        var menu = [
            'img/play.png',//0 - to play -> not playing now
            'img/pause.png'//1 - to pause -> is playing
            //'img/info.png',//2 - maybe playing or not, show addition info
        ];

        /*
         * ctrl btn events section
         */

        //Menu

        $('#btnPlayPause').mouseover(function (btn) {
            switch (currentButton) {
                case 0:
                    btn.toElement.src = 'img/play_hover.png';
                    break;
                case 1:
                    btn.toElement.src = 'img/pause_hover.png';
                    break;
                case 2:
                    btn.toElement.src = 'img/info_hover.png';
                    break;
            }
        });
        $('#btnPlayPause').mouseout(function (btn) {
            switch (currentButton) {
                case 0:
                    btn.currentTarget.src = 'img/play.png';
                    break;
                case 1:
                    btn.currentTarget.src = 'img/pause.png';
                    break;
                case 2:
                    btn.currentTarget.src = 'img/info.png';
                    break;
            }
        });
        $('#btnPlayPause').click(function (btn)
        {
            switch(currentButton)
            {
                case 0:
                {
                    if (isPlaying === 0)
                    {
                        //play logic
                        if(buffer !== null)
                        {    
                            play();
                            isPlaying = 1;
                        }
                    }
                    break;
                }
                case 1:
                {
                    //pause logic
                    if(isPlaying)
                    {
                        stop();
                        isPlaying = 0;
                    }
                    
                    break;
                }
                case 2:
                {
                    if(meta !== null)
                    {

                        //$('#line_toolbar').removeClass('hidden');
                        document.getElementById('file_name').innerHTML = currentFileName;
                        $('#file_name').fadeIn(1500);
                        $('#toolbar_volume').fadeIn(1500);

                        //$('#line_meta').removeClass('hidden');
                        document.getElementById('meta').innerHTML = '<marquee id="marquee" style="display:none;" width="' + document.getElementById('meta').clientWidth +'px">' +
                                meta.artist + ' ' + meta.title + ' ' + meta.album +
                            '</marquee>';
                        $('#marquee').fadeIn(1500);
                    }
                    break;
                }
            }
        });

        //btnRight events

        $('#btnRight').mouseover(function (btn) {
            btn.toElement.src = 'img/right_hover.png';
        });
        $('#btnRight').mouseout(function (btn) {
            btn.currentTarget.src = 'img/right.png';
        });
        $('#btnRight').click(function (btn) {
            if (currentButton < maxSizeMenu - 1) {
                $('#btnPlayPause')[0].src = menu[++currentButton];
            }
        });

        $('#btnLeft').mouseover(function (btn) {
            btn.toElement.src = 'img/left_hover.png';
        });
        $('#btnLeft').mouseout(function (btn) {
            btn.currentTarget.src = 'img/left.png';
        });
        $('#btnLeft').click(function (btn) {
            if (currentButton > 0) {
                $('#btnPlayPause')[0].src = menu[--currentButton];
            }
        });

        $('#btnVolumeUp').mouseover(function (btn) {
            btn.toElement.src = 'img/volume_increase_hover.png';
        });
        $('#btnVolumeUp').mouseout(function (btn) {
            btn.currentTarget.src = 'img/volume_increase.png';
        });
        $('#btnVolumeUp').click(function(btn)
        {
            if(isPlaying)
            {
                if(currentVolume <= maxVolume - 20)
                {
                    currentVolume = currentVolume + 20;
                    var fraction = currentVolume / maxVolume;
                    document.getElementById('volume_perc').innerHTML = (fraction * 100) + '%';
                    gainNode.gain.value = fraction*fraction;
                }
            }
        });

        $('#btnVolumeDown').mouseover(function (btn) {
            btn.toElement.src = 'img/volume_decrease_hover.png';
        });
        $('#btnVolumeDown').mouseout(function (btn) {
            btn.currentTarget.src = 'img/volume_decrease.png';
        });
        $('#btnVolumeDown').click(function(btn)
        {
            if(isPlaying)
            {
                if(currentVolume > 20)
                {
                    currentVolume = currentVolume - 20;
                    var fraction = currentVolume / maxVolume;
                    document.getElementById('volume_perc').innerHTML = (fraction * 100) + '%';
                    gainNode.gain.value = fraction*fraction;
                }
            }
        });

        $('#visual_place').click(function(btn)
        {
            if(isPlaying)
            {
                bVisual = bVisual ? 0 : 1;
            }
        });
        
        
        /*
         * Drag&Drop
         */
        
        var dropZone = $('#dropzone');
        var maxFileSize = 15 * 1000000;//15mb
        if (typeof(window.FileReader) === 'undefined') 
        {
            dropZone.text('Не поддерживается браузером');
            dropZone.addClass('error');
        }
        
        dropZone[0].ondragover = function ()
        {
            dropZone.addClass('hover');
            $('#wallpaper').attr('src', 'img/down.png');

            return false;
        };
        
        dropZone[0].ondragleave = function ()
        {
            dropZone.removeClass('hover');
            $('#wallpaper').attr('src', 'img/file.png');
            return false;
        };
        
        dropZone[0].ondrop = function (event)
        {
            try
            {
                event.preventDefault();
                if(!isPlaying)
                {
                    dropZone.removeClass('hover');
                    dropZone.addClass('drop');

                    //$('#wallpaper').attr('src', 'img/ok.png');

                    var file = event.dataTransfer.files[0];
                    if(/.+(mp3|ogg|wav)$/.test(file.name))
                    {
                        if (file.size > maxFileSize) 
                        {
                            dropZone.text('Файл слишком большой!');
                            dropZone.removeClass('drop');
                            dropZone.addClass('error');
                            return false;
                        }

                        var fileReader = new FileReader();
                        fileReader.onload = function (e)
                        {
                            var arrayBuffer = fileReader.result;
                            var dv = new jDataView(arrayBuffer);
                            if (dv.getString(3, dv.byteLength - 128) === 'TAG')
                            {
                                meta = {
                                    title: dv.getString(30, dv.tell()),
                                    artist: dv.getString(30, dv.tell()),
                                    album: dv.getString(30, dv.tell())
                                };
                            }
                            else
                            {
                                console.log("no ID3v1 data found");
                            }
                            document.getElementById('visual_place').innerHTML = '<span>Подождите...</span>';
                            ctx.decodeAudioData(arrayBuffer, function(buf)
                            {
                                buffer = buf;
                                document.getElementById('visual_place').innerHTML = '<canvas id="spectrum" width="200px" height="150px"></canvas>';
                                if(meta !== null)
                                {
                                    document.getElementById('file_name').innerHTML = currentFileName;
                                    $('#file_name').fadeIn(1500);
                                    $('#toolbar_volume').fadeIn(1500);

                                    document.getElementById('meta').innerHTML = '<marquee id="marquee" style="display:none;" width="' + (document.getElementById('meta').clientWidth - 40) +'px">' +
                                            meta.artist + ' ' + meta.title + ' ' + meta.album +
                                        '</marquee>';
                                    $('#marquee').fadeIn(1500);
                                }
                                play();
                            });
                        };
                        fileReader.readAsArrayBuffer(file);
                        currentFileName = file.name;
                    }
                    else
                    {
                        document.getElementById('visual_place').innerHTML = '<span>Поддерживаемые форматы: .mp3, .wav или .ogg</span>';
                        dropZone.removeClass('drop');
                        dropZone.addClass('error');
                        return false;
                    }
                }
                else
                {
                    source.stop(0);
                    isPlaying = 0;
                    startOffset = 0;

                    $('#toolbar_volume').fadeOut(500);
                    $('#spectrum').fadeOut(500);
                    $('#marquee').fadeOut(500);

                    document.getElementById('file_name').innerHTML = '';
                    document.getElementById('volume_perc').innerHTML = '';

                    dropZone[0].ondrop(event);
                }
            }
            catch(ex)
            {
                console.log(ex.message);
            }
        };
        
        var play = function()
        {
            if(isPlaying !== 1)
            {
                source = ctx.createBufferSource();
                source.buffer = buffer;
                destination = ctx.destination;
                gainNode = ctx.createGain();
                gainNode.gain.value = currentVolume / 100;
                source.connect(gainNode);
                gainNode.connect(destination);

                analyser = ctx.createAnalyser();
                source.connect(analyser);

                analyser.minDecibels = -140;
                analyser.maxDecibels = 0;

                freqs = new Uint8Array(analyser.frequencyBinCount);
                times = new Uint8Array(analyser.frequencyBinCount);

                analyser.connect(destination);

                startTime = ctx.currentTime;
                source.loop = true;
                
                source.start(0, startOffset % source.buffer.duration);

                window.requestAnimFrame(draw);

                isPlaying = 1;
            }
        };
        
        var stop = function()
        {
            startOffset += ctx.currentTime - startTime;
            source.stop(0);
            isPlaying = 0;
        };
        
        //functionts for visualization
        var draw = function() 
        {
            analyser.smoothingTimeConstant = SMOOTHING;
            analyser.fftSize = FFT_SIZE;
            
            analyser.getByteFrequencyData(freqs);// get the frequency data from the currently playing music
            analyser.getByteTimeDomainData(times);

            var canvas = document.querySelector('canvas');
            var drawContext = canvas.getContext('2d');

            canvas.width = WIDTH;
            canvas.height = HEIGHT;
           

            if(bVisual) // draw the frequency domain chart
            {
                for (var i = 0; i < analyser.frequencyBinCount; i++) 
                {
                  var value = freqs[i];
                  var percent = value / 256;
                  var height = HEIGHT * percent;
                  var offset = HEIGHT - height - 1;
                  var barWidth = WIDTH/analyser.frequencyBinCount;
                  var hue = i/analyser.frequencyBinCount * 360;//360
                  drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
                  drawContext.fillRect(i * barWidth, offset, barWidth, height);
                }
            }
            else // draw the time domain chart
            {
                for (var i = 0; i < analyser.frequencyBinCount; i++) 
                {
                  var value = times[i];
                  var percent = value / 256;
                  var height = WIDTH * percent;
                  var offset = HEIGHT - height - 1;
                  var barWidth = WIDTH/analyser.frequencyBinCount;
                  drawContext.fillStyle = 'black';
                  drawContext.fillRect(i * barWidth, offset,  1, 2);
                }
            }

            if(isPlaying)
            {
                window.requestAnimFrame(draw);
            }

          };
    
    }
    catch(e)
    {
        console.log(e.message);
    }
});