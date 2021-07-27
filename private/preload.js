const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld(
  'add',
  {
    open:(channel, data) =>{
      let validChannel = ["openAddcourseMenu"]
      if(validChannel.includes(channel)){
      ipcRenderer.send(channel, data)
     }
    },
    addCourse:(channel, data) =>{
      let validChannel = ["addcourses"]
      if(validChannel.includes(channel)){
      ipcRenderer.send(channel, data)
     }
   },
   feedback: (channel, func) => {
       let validChannel = ["added"]
       if (validChannel.includes(channel)) {
           ipcRenderer.on(channel, (event, ...status) => func(...status));
      }
  }

  }
)

contextBridge.exposeInMainWorld(
    "requestCourses", {
      send: (channel) => {

            let validChannel = ["loadCourses"]
            if (validChannel.includes(channel)) {
                ipcRenderer.send(channel);
            }
        },
        receive: (channel, func) => {
            let validChannel = ["receiveCourses"]
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
  }
})

contextBridge.exposeInMainWorld(
  "courseName",
   {
    sendCourse:(channel, data) => {
        let validChannels = ["sentCourse"]
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    },
    receiveCourseName:(channel, func) => {
        let validChannels = ["chosenCourse"]
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args))
        }
    }
})

contextBridge.exposeInMainWorld(
  "insertData",
  {
    insert: (channel, ...data) => {
        let validChannel = ["data"];
        if (validChannel.includes(channel)) {
        ipcRenderer.send(channel, ...data)
        }
    },
    status: (channel, func) => {
        let validChannel = ["success"];
        if (validChannel.includes(channel)) {
            ipcRenderer.on(channel, (event, ...status) => func(...status));
        }
    }
})

contextBridge.exposeInMainWorld(
  "loadReminders",
  {
    checkReminders: (channel, data) => {
        let validChannel = ["checkReminder"]
        if (validChannel.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    getReminders:(channel, func) => {
        let validChannel = ["courseReminders"]
        if (validChannel.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
    remove: (channel)=>{
      ipcRenderer.removeAllListeners("courseReminders")
    }
  }
)

contextBridge.exposeInMainWorld(
  "removeReminder",
  {
    send:(channel, ...data) => {
        let validChannel = ["remove_reminder"]
        if (validChannel.includes(channel)) {
            ipcRenderer.send(channel, ...data)
        }
    },
    receive:(channel, func) => {
        let validChannel = ["removed"]
        if (validChannel.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args))
        }
    },
    removeListener: (channel)=>{
        ipcRenderer.removeAllListeners("removed")
      }
  }
)

contextBridge.exposeInMainWorld(
  "closeParent",
  {
    send:(channel) => {
        let validChannel = ["close"]
        if (validChannel.includes(channel)) {
            ipcRenderer.send(channel)
        }
    },
    minimizeWin:(channel) => {
        let validChannel = ["minimize"]
        if (validChannel.includes(channel)) {
            ipcRenderer.send(channel)
        }
    }
  })

  contextBridge.exposeInMainWorld(
    "deleteCourse",
    {
      send:(channel, course) => {
          let validChannel = ["deleteCourse"]
          if (validChannel.includes(channel)) {
              ipcRenderer.send(channel, course)
          }
      }
    })
