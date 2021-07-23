const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld(
  'addToCourses',
  {
    addCourse: (channel, data) => ipcRenderer.invoke(channel, data)
  }
)

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {

            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["fromMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        remove: (channel)=>{
          ipcRenderer.removeAllListeners(channel)
        }
    }
);

contextBridge.exposeInMainWorld(
  "reminder", {
    openReminder: (channel, data)=>{
      let validChannel = ["openReminder"]
      if(validChannel.includes(channel)){
      ipcRenderer.send(channel, data)
    }
  },
  removeReminder:(channel)=>{
    let validChannel = ["deleteReminder"]
    if(validChannel.includes(channel)){
    ipcRenderer.send(channel)
  }
}
})

contextBridge.exposeInMainWorld(
  "courseName",
   {
    sendCourse:(channel, data) => {
        let validChannels = ["sentCourse"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receiveCourseName:(channel, func) => {
        let validChannels = ["chosenCourse"];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
})

contextBridge.exposeInMainWorld(
  "insertData",
  {
    insert:(channel, ...data) => {
        let validChannel = ["data"];
        if (validChannel.includes(channel)) {
            ipcRenderer.send(channel, ...data);
        }
    }
  }
)

contextBridge.exposeInMainWorld(
  "loadReminders",
  {
    checkReminders: (channel, data) => {
        let validChannel = ["checkReminder"];
        if (validChannel.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    getReminders:(channel, func) => {
        let validChannel = ["courseReminders"];
        if (validChannel.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
    remove: (channel)=>{
      ipcRenderer.removeAllListeners("courseReminders")
    }
  }
)
