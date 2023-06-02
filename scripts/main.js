const setCredentialsButton = document.getElementById("set-credentials");
let voicemod = null;

const saveCredentials = (IP, clientKey) => {
  localStorage.setItem("IP", IP);
  localStorage.setItem("clientKey", clientKey);
};

const registerCommands = (voiceIdList) => {
  SAMMI.extCommand("Set voice effect", 3355443, 52, {
    selectedVoiceId: ["Selected Voice ID", 20, "nofx", null, voiceIdList],
  });

  SAMMI.extCommand("Get current voice", 3355443, 52, {
    button: ["Button ID", 14, ""],
    variableName: ["Save in variable", 14, ""],
  });

  SAMMI.extCommand("Toggle hear myself", 3355443, 52, {
    hearMyself: ["", 30, ""],
  });

  SAMMI.extCommand("Set beep state", 3355443, 52, {
    beepState: ["Beep on?", 2, true],
  });
};

const voicemodConnector = (IP, clientKey) => {
  const socket = new WebSocket(`ws://${IP}:59129/v1`);

  let currentVoiceVariableNameQueue = [];

  socket.sendJSON = (data) => {
    socket.send(JSON.stringify(data));
  };

  socket.registerClient = (clientKey) => {
    socket.sendJSON({
      id: "",
      action: "registerClient",
      payload: {
        clientKey,
      },
    });
  };

  socket.getVoices = () => {
    socket.sendJSON({
      action: "getVoices",
      id: "",
      payload: {},
    });
  };

  socket.setVoice = (voiceID) => {
    socket.sendJSON({
      action: "loadVoice",
      id: "",
      payload: {
        voiceID,
      },
    });
  };

  socket.getCurrentVoice = (buttonId, variableName) => {
    currentVoiceVariableNameQueue.push({ buttonId, variableName });

    socket.sendJSON({
      action: "getCurrentVoice",
      id: "",
      payload: {},
    });
  };

  socket.toggleHearMyself = () => {
    socket.sendJSON({
      action: "toggleHearMyVoice",
      id: "",
      payload: {},
    });
  };

  socket.setBeepState = (state) => {
    socket.sendJSON({
      action: "setBeepSound",
      id: "",
      payload: {
        badLanguage: state ? 1 : 0,
      },
    });
  };

  const mapResponseToAction = {
    registerClient: ({ payload }) => {
      if (payload.status.code !== "200") {
        return;
      }

      SAMMI.alert("Sucessfully registered Voicemod! Getting voices.");

      socket.getVoices();
    },
    getVoices: ({ payload }) => {
      const voiceIdList = payload.voices.map((voice) => voice.id);

      SAMMI.alert("Voices retrieved. Registering commands.");

      registerCommands(voiceIdList);
    },
    loadVoice: ({}) => {
      return;
    },
    getCurrentVoice: ({ payload }) => {
      const { buttonId, variableName } = currentVoiceVariableNameQueue.shift();

      SAMMI.setVariable(variableName, payload, buttonId);
    },
    toggleHearMyVoice: ({}) => {
      return;
    },
    setBeepSound: ({}) => {
      return;
    },
  };

  socket.addEventListener("message", (event) => {
    const { msg, action, ...response } = JSON.parse(event.data);

    if (msg === "Pending authentication") {
      socket.registerClient(clientKey);
    }

    if (action != null) {
      mapResponseToAction[action](response);
    }
  });

  return {
    ...socket,
  };
};

document.addEventListener("DOMContentLoaded", () => {
  const [IP, clientKey] = [
    localStorage.getItem("IP") || null,
    localStorage.getItem("clientKey") || null,
  ];

  if (IP != null && clientKey != null) {
    document.getElementById("voicemod-ip").value = IP;
    document.getElementById("dev-client-key").value = clientKey;
  }
});

setCredentialsButton.addEventListener("click", (event) => {
  const voicemodIP = document.getElementById("voicemod-ip").value;
  const clientKey = document.getElementById("dev-client-key").value;

  saveCredentials(voicemodIP, clientKey);

  voicemod = voicemodConnector(voicemodIP, clientKey);

  sammiclient.on("Set voice effect", (payload) => {
    const { selectedVoiceId } = payload.Data;

    voicemod.setVoice(selectedVoiceId);
  });

  sammiclient.on("Get current voice", (payload) => {
    const { button, variableName } = payload.Data;

    voicemod.getCurrentVoice(button, variableName);
  });

  sammiclient.on("Toggle hear myself", (payload) => {
    voicemod.toggleHearMyself();
  });

  sammiclient.on("Set beep state", (payload) => {
    const { beepState } = payload.Data;

    voicemod.setBeepState(beepState);
  });
});
