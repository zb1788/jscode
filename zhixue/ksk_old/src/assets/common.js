function onAudioPlayStatus(status) {
  alert(status);
  alert(mp3count);
  if (status == 0) {
    mp3count++;
    if (mp3count < mp3arr.length) {
      // UXinJSInterfaceSpeech.playAudio(mp3arr[mp3count] + ".mp3");
      UXinJSInterfaceSpeech.playAudio(
        domain + "nan/" + mp3arr[mp3count] + ".mp3"
      );
    } else {
      mp3count = 0;
    }
  } else {
  }
}
