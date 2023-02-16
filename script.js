let btn1=document.getElementById("btn1")
let canvas=document.getElementById("canvas1")
let container=document.getElementById("container")
let ctx=canvas.getContext('2d')
canvas.width=window.innerWidth
canvas.height=window.innerHeight
let audio1=document.getElementById("audio1");
let file= document.getElementById("fileUpload")
let analyser;
let audioSources;
btn1.addEventListener('click', function() {
    if (file.style.display === 'block') {
        file.style.display = 'none';
    } else {
        file.style.display = 'block';

    }
});

function visualizeAudio() {
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx= new AudioContext();
    audioSources=audioCtx.createMediaElementSource(audio1)
    analyser=audioCtx.createAnalyser()
    audioSources.connect(analyser)
    analyser.connect(audioCtx.destination)
    analyser.fftSize=512
    let bufferLength=analyser.frequencyBinCount
    const dataArray= new Uint8Array(bufferLength)
    const barWidth= canvas.width/bufferLength
    let barHeight;
    let x;
    function animate(){
        x=0;
        ctx.clearRect(0,0,canvas.width,canvas.height)
        analyser.getByteFrequencyData(dataArray)
        for (let i=0;i<bufferLength;i++){
            barHeight=dataArray[i]*2
           let hue=i*5
            ctx.fillStyle='hsl('+hue+',100%,50%)'
            ctx.fillRect(x,canvas.height-barHeight,barWidth,barHeight)
            x +=barWidth
            hue++
        }
        requestAnimationFrame(animate)
    }
    audioCtx.resume().then(() => {
        console.log("Audio context started");
        animate();
    }).catch(error => {
        console.error("Error starting audio context: ", error);
    });
}

container.addEventListener('click',function(){
    audio1.play();
    visualizeAudio();
});

file.addEventListener("change",function(){
    let files=this.files
    audio1.src= URL.createObjectURL(files[0])
    audio1.load()
    audio1.play()
    visualizeAudio();
});

let micBtn = document.getElementById('btn1');
micBtn.addEventListener('click', function() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        let audioCtx = new AudioContext();
        let source = audioCtx.createMediaStreamSource(stream);
        let analyser = audioCtx.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 128;
        let bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const barWidth = canvas.width / bufferLength;
        let barHeight;
        let x;
        function animate() {
            x = 0;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            analyser.getByteFrequencyData(dataArray);
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                ctx.fillStyle = 'pink';
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth;
            }
            requestAnimationFrame(animate);
        }
        audioCtx.resume().then(() => {
            console.log('Audio context started');
            animate();
        }).catch(error => {
            console.error('Error starting audio context: ', error);
        });
    })
    .catch(function(error) {
        console.error('Error accessing microphone: ', error);
    });
});

