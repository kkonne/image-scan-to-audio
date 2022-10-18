const video = document.querySelector('video');
const outputDiv = document.querySelector('[data-text]');

let onInit = async () => {
    const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
    });
    video.srcObject = videoStream;

    video.addEventListener('playing', async () => {
        const worker = Tesseract.createWorker();
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        const canvas = document.createElement('canvas');
        canvas.width = video.width;
        canvas.height = video.height;

        const scanButton = document.getElementById('scan-button');
        scanButton.addEventListener('click', async (event) => {
            canvas
                .getContext('2d')
                .drawImage(video, 0, 0, video.width, video.height);

            const { data: { text } }  = await worker.recognize(canvas);

            console.log("outputText");
            console.log(text);

            outputDiv.textContent = text;

            speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/\s/g, " ")))
        });
    });
};

onInit();
