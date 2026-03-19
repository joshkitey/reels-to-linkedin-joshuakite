// Browser-based transcription using Web Speech API
// The video stays muted — Speech API uses the device microphone.
// User plays the video near their mic, or pastes transcript manually.

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
      videoElement.pause();
      if (event.error === "no-speech") {
        resolve(fullTranscript.trim() || "");
      } else {
        reject(new Error(`Speech recognition error: ${event.error}`));
      }
    };

    recognition.onend = () => {
      videoElement.pause();
      resolve(fullTranscript.trim());
    };

    // Play video MUTED — the Speech API listens via the device microphone.
    // The user should have their device speaker playing the video near the mic,
    // or they can use "Paste Transcript" for a better experience.
    videoElement.currentTime = 0;
    videoElement.muted = true;
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
