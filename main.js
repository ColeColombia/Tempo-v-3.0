const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { resolve } = require('bluebird')
const sqlite3 = require('sqlite3')

let mainWindow;

async function createWindow() {

  mainWindow = new BrowserWindow({
    width: 800,
    height: 580,
    webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.setResizable(false)
  mainWindow.loadFile(path.join(__dirname, "index.html"))
}

app.on("ready", createWindow);

class AppDAO {

    constructor(dbFilePath) {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.log('Could not connect to database', err)
        } else {
          console.log('Connected to database')
        }
      })
    }

    run(sql, params = []) {
      return new Promise((resolve, reject) => {
        this.db.run(sql, params, function (err) {
          if (err) {
            console.log('Error running sql ' + sql)
            console.log(err)
            reject(err)
          } else {
            resolve({ id: this.lastID })
          }
        })
      })
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.get(sql, params, (err, result) => {
            if (err) {
              console.log('Error running sql: ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve(result)
            }
          })
        })
      }

      all(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.all(sql, params, (err, rows) => {
            if (err) {
              console.log('Error running sql: ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve(rows)
            }
          })
        })
      }
  }

class ProjectRepository {
  constructor(dao) {
    this.dao = dao
  }

  createTableCourses() {
    const sql = `
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT)`
    return this.dao.run(sql)
  }

  createTableTasks(){
    const sql = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      task TEXT,
      date TEXT,
      FOREIGN KEY(name) REFERENCES courses(name))`
    return this.dao.run(sql)
  }

  insertTask(name, task, date){
    const sql = `
    INSERT INTO tasks (name, task, date) VALUES (?,?,?)`
    return this.dao.run(sql, [name, task, date])
  }

  dropTable(){
    const sql = `DROP TABLE tasks`
    return this.dao.run(sql)
  }

  checkTask(name){
    const sql = `SELECT * FROM tasks WHERE name = ?`
    return this.dao.all(sql, [name])
  }

  insert(name) {
      return this.dao.run(
        'INSERT INTO courses (name) VALUES (?)',
        [name])
         }

         getAll() {
           return this.dao.all(`SELECT * FROM courses`)
         }
}

const crud = new AppDAO('./courses.sqlite3')
const query = new ProjectRepository(crud)

query.createTableCourses().then(()=>{
  console.log("courses table created");
});

query.createTableTasks().then(()=>{
  console.log("task table created")
})

ipcMain.handle("addcourses", async (event, course)=>{
  function confirmMessage(course){
    let confirmation = query.insert(course).then(()=>{
    console.log("course added");
  }).catch((result)=>{
    console.log(result)
  })

  return confirmation;
  }

await confirmMessage(course)

})

ipcMain.on("toMain", (event, data)=>{
  query.getAll().then((rows)=>{
    rows.forEach((item) => {
      mainWindow.webContents.send("fromMain", item.id, item.name);
    });
    console.log(rows)
  });
})

let course;

ipcMain.on("openReminder", (event, arg) => {
  let child = new BrowserWindow({ parent: mainWindow,
    modal: true,
    show: false,
    width: 500,
    height: 300,
    icon: '',
    webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, "preload.js")
  }
  })

  child.loadFile(path.join(__dirname, "app/html/set_reminder.html"))
  //child.setMenu(null)
  child.setResizable(false)
  child.once('ready-to-show', () => {
    child.show()
  })
  course = arg;
})

ipcMain.on("sentCourse", (event, args)=>{
  event.reply("chosenCourse", course)
})

ipcMain.on("data", (event, name, task, date)=>{
  query.insertTask(name, task, date).then(()=>{
    event.reply("task_added", "task added")
    console.log("Reminder added")
    console.log(`${name}  ${task}  ${date}`)
  })
})

ipcMain.on("checkReminder", (event, arg)=>{
 query.checkTask(arg).then((rows)=>{
   if(rows.length == 0){
     mainWindow.webContents.send("courseReminders", "1785cfc3bc6ac7738e8b38cdccd1af12563c2b9070e07af336a1bf8c0f772b6a", "nothing");
   }

   else if(rows.length > 0){
     rows.forEach((item) => {
       mainWindow.webContents.send("courseReminders", item.task, item.date);
       console.log(rows)
     });
   }

 })
})

ipcMain.on("deleteReminder", ()=>{
  let child2 = new BrowserWindow({ parent: mainWindow,
    modal: true,
    show: false,
    width: 500,
    height: 300,
    icon: '',
    webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, "preload.js")
  }
  })

  child2.loadFile(path.join(__dirname, "app/html/delete_reminder.html"))
  //child.setMenu(null)
  child2.setResizable(false)
  child2.once('ready-to-show', () => {
    child2.show()
  })

})
