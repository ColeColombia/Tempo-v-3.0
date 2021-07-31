const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld(
  'addToCourses',
  {
    addCourse: (channel, data) =>{
      let validChannel = ["addcourses"]
      if(validChannel.includes(channel)){
      ipcRenderer.invoke(channel, data)}
    }
  }
)

contextBridge.exposeInMainWorld(
    "requestCourses", {
      send: (channel) => {

            let validChannel = ["loadCourses"];
            if (validChannel.includes(channel)) {
                ipcRenderer.send(channel);
            }
        },
        receive: (channel, func) => {
            let validChannel = ["receiveCourses"];
            if (validChannel.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        remove: (channel)=>{
          let validChannel = ["receiveCourses"]
          if(validChannel.includes(channel)){
          ipcRenderer.removeAllListeners(channel)
         }
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
    },
    confirm:(channel, func) => {
        let validChannel = ["success"];
        if (validChannel.includes(channel)) {
            ipcRenderer.on(channel, (event, args) => func(args));
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