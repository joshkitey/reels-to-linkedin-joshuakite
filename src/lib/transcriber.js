// Browser-based transcription using Web Speech API
// Falls back to manual transcript input if not supported

export function isTranscriptionSupported() {
  return !!(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );
}

export function transcribeFromAudio(videoElement) {
  return new Promise((resolve, reject) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      reject(
        new Error(
          "Speech recognition not supported in this browser. Please use Chrome or paste transcript manually."
        )
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    let fullTranscript = "";

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          fullTranscript += event.results[i][0].transcript + " ";
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        resolve(fullTranscript.trim() || "");
      } else {
        reject(new Error(`Speech recognition error: ${event.error}`));
      }
    };

    recognition.onend = () => {
      resolve(fullTranscript.trim());
    };

    // Play the video and start recognition
    videoElement.currentTime = 0;
    videoElement.muted = false;
    videoElement.volume = 1;
    videoElement.play();
    recognition.start();

    // Stop when video ends
    videoElement.onended = () => {
      recognition.stop();
    };

    // Safety timeout at 5 minutes
    setTimeout(() => {
      recognition.stop();
      videoElement.pause();
    }, 300000);
  });
}

export function createMediaStreamFromVideo(videoElement) {
  if (videoElement.captureStream) {
    return videoElement.captureStream();
  }
  if (videoElement.mozCaptureStream) {
    return videoElement.mozCaptureStream();
  }
  return null;
}
