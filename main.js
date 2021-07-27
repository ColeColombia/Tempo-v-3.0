const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const {AppDAO, DatabaseQuery} = require('database_query')

let mainWindow;

async function createWindow()
{
  mainWindow = new BrowserWindow({
    width: 800,
    frame:false,
    height: 515,
    webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, "private/preload.js")
    }
  })

  mainWindow.setResizable(false)
  mainWindow.setOpacity(0.9)
  mainWindow.loadFile(path.join(__dirname, "index.html"))
}

app.on("ready", createWindow);

let database =  path.join(__dirname, "private/courses.sqlite3")
const crud = new AppDAO(database)
const query = new DatabaseQuery(crud)

query.createTableCourses()
query.createTableTasks()

ipcMain.on("openAddcourseMenu", (event, data)=>
{
  let addCourseWindow = new BrowserWindow({ parent: mainWindow,
    modal: true,
    show: false,
    width: 500,
    height: 400,
    webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, "private/preload.js")
  }
  })

  addCourseWindow.loadFile(path.join(__dirname, "app/html/add_course.html"))
  addCourseWindow.setMenu(null)
  addCourseWindow.removeMenu()
  addCourseWindow.setOpacity(0.9)
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

ipcMain.on("loadCourses", (event, data)=>
{
  query.getAllCourses().then((rows)=>
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
    webPreferences:
    {
    devTools: false,
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, "private/preload.js")
  }
  })

  setReminder.loadFile(path.join(__dirname, "app/html/set_reminder.html"))
  setReminder.setMenu(null)
  setReminder.setOpacity(0.9)
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

ipcMain.on("checkReminder", (event, arg)=>
{
 query.checkTask(arg).then((rows)=>
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

ipcMain.on("deleteCourse", (event, course)=>{
  query.deleteCourseTasks(course).then(()=>{
    query.deleteCourse(course)
  })
})
