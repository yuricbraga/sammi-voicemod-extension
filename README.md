# Voicemod Extension for SAMMI

This extension was created to cover my needs as a streamer. This extension is able to communicate to Voicemod WebSocket and do some basic interactions. As of now, those are the current features:

- Can set any voice effect
- Toggle hear myself
- Set beep state
- Get current voice

## Requirements

Before you install the .sef provided in the releases page, you need the following

- To know what is the IP Voicemod is running on (likely `localhost`)
- A valid developer client key, which you can get [here](https://control-api.voicemod.net/getting-started) in the "GETTING YOUR API KEY" section.

## How to use

1. Install the .sef provided in the releases page through SAMMI Bridge

   - In SAMMI main page > Bridge > Install an extension

2. bridge.html, go to the "Voicemod for SAMMI" tab and set your IP and Dev client key
   - If you don't have bridge.html as a browser panel in your OBS: In SAMMI main page > Bridge > Open in Browser
   - Right now, you have to click the "set" button every time you want to use this extension. Your credentials will be saved, once you set them the first time.

If SAMMI is able to successfully connect to Voicemod, you will be getting a confirmation message on the bottom left corner. From that point, the commands are registered and you can start using it.

Have fun!
