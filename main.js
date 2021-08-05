const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const {AppDAO, DatabaseQuery} = require('./dataBase/index.js')

let mainWindow

async function createWindow()
{
  mainWindow = new BrowserWindow({
    width: 800,
    frame:false,
    height: 515,
    webPreferences: {
    devTools: false,
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, "preload.js")
    }
  })

  mainWindow.setResizable(false)
  mainWindow.setOpacity(0.9)
  mainWindow.loadFile(path.join(__dirname, "index.html"))
}

app.on("ready", createWindow)
app.setPath('userData', path.join(process.resourcesPath, 'userdata/'))


let database =  path.join(process.resourcesPath, "userdata/courses.db")
const crud = new AppDAO(database)
const query = new DatabaseQuery(crud)

query.createTableCourses()
query.createTableTasks()


let addCourseWindow
ipcMain.on("openAddcourseMenu", (event, data)=>
{
    addCourseWindow = new BrowserWindow({ parent: mainWindow,
    modal: true,
    show: false,
    width: 500,
    icon: path.join(__dirname, "build/timer.png"),
    height: 400,
    webPreferences: {
    devTools: false,
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, "preload.js")
  }
  })

  addCourseWindow.loadFile(path.join(__dirname, "app/html/add_course.html"))
  addCourseWindow.setMenu(null)
  addCourseWindow.movable = false
  addCourseWindow.removeMenu()
  addCourseWindow.setHasShadow(false)
  addCourseWindow.setResizable(false)
  addCourseWindow.once('ready-to-show', () => {
  addCourseWindow.show()
  })
})

ipcMain.on("addcourses", (event, courseName)=>
{
    query.checkCourse(courseName).then((rows)=>
    {
      if(rows.length == 0){
        query.insertCourse(courseName)
        event.reply("added", `${courseName} added successfully`, "#76BA1B")
      }
      else if(rows.length > 0)
      {
        event.reply("added", `${courseName} already exists`, "#B32134")
        return
      }
    })
})

ipcMain.on("loadCourses", async (event, data)=>
{
  let courses = await query.getAllCourses().then((rows)=>
  {
    if(rows.length == 0)
    {
      mainWindow.webContents.send("receiveCourses",
      "1785cfc3bc6ac7738e8b38cdccd1af12563c2b9070e07af336a1bf8c0f772b6a");
    }
    else if(rows.length > 0)
    {
      rows.forEach((item) =>
      {
        mainWindow.webContents.send("receiveCourses", item.name);
      })
    }
  })
})

let course//keep course public, pass it from parent window to child window

ipcMain.on("openReminder", (event, courseName) =>
{

  let setReminder = new BrowserWindow({ parent: mainWindow,
    modal: true,
    show: false,
    width: 500,
    height: 300,
    icon: path.join(__dirname, "build/timer.png"),
    webPreferences:
    {
    devTools: false,
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, "preload.js")
  }
  })

  setReminder.loadFile(path.join(__dirname, "app/html/set_reminder.html"))
  setReminder.movable = false
  setReminder.setMenu(null)
  setReminder.setHasShadow(false)
  setReminder.setResizable(false)
  setReminder.once('ready-to-show', () =>
  {
    setReminder.show()
  })
  course = courseName;
})

ipcMain.on("sentCourse", (event, args)=>
{
  event.reply("chosenCourse", course)
})

ipcMain.on("data", (event, courseName, task, date)=>
{
  query.verifyTask(courseName, task).then((rows)=>
  {
  if(rows.length == 0)
  {
    query.insertTask(courseName, task, date).then(()=>
    {
    event.reply("success", "Reminder added successfully", "#76BA1B")
  })
  }
  else if(rows.length > 0)
  {
    event.reply("success", `${task} already exsts in<br> ${courseName}`, "#B32134")
  }
  })

})

ipcMain.on("checkReminder",async (event, arg)=>
{
 let reminders = await query.checkTask(arg).then((rows)=>
 {
   if(rows.length == 0){
     mainWindow.webContents.send("courseReminders",
     "1785cfc3bc6ac7738e8b38cdccd1af12563c2b9070e07af336a1bf8c0f772b6a",
      "nothing")
   }

   else if(rows.length > 0)
   {
     rows.forEach((item) =>
     {
       mainWindow.webContents.send("courseReminders", item.task, item.date);
     })
   }

 })
})

ipcMain.on("remove_reminder", (event, courseName, task)=>
{
  if(task == null)
  {
    return
  }
  else{
    query.deleteTask(courseName, task).then(()=>
    {
    event.reply("removed", `${task} successfully removed from ${courseName}`)
  })
 }
})

ipcMain.on("close", ()=>
{
  mainWindow.destroy()
})

ipcMain.on("minimizeWin", ()=>{
  let theWindow = BrowserWindow.getFocusedWindow();
  theWindow.minimize();
})

ipcMain.on("deleteCourse", (event, course)=>{
  query.deleteCourseTasks(course).then(()=>{
    query.deleteCourse(course).then(()=>{
    event.reply("courseIsRemoved", `${course} successfully removed`)
    })
  })
})

ipcMain.on("fetch",async ()=>{
  let alltasks = await query.getAllTasks().then((rows)=>{
    if(rows.length == 0){
      mainWindow.webContents.send("all_tasks", "nothing",
      "1785cfc3bc6ac7738e8b38cdccd1af12563c2b9070e07af336a1bf8c0f772b6a",
       "nothing")
    }

    else if(rows.length > 0)
    {
      rows.forEach((item) =>
      {
        mainWindow.webContents.send("all_tasks", item.name, item.task, item.date)
      })
    }
  })
})

ipcMain.on("refreshed", (event, course)=>{
  event.reply("reloaded")
})
