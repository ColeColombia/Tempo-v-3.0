const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { resolve } = require('bluebird')
const sqlite3 = require('sqlite3')

let mainWindow;

async function createWindow() {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 580,
    webPreferences: {
    nodeIntegration: false, // is default value after Electron v5
    contextIsolation: true, // protect against prototype pollution
    enableRemoteModule: false, // turn off remote
    preload: path.join(__dirname, "preload.js") // use a preload script
    }
  });

  mainWindow.setResizable(false)
  mainWindow.loadFile(path.join(__dirname, "index.html"))
  // rest of code..
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
  console.log("Table created");
});

ipcMain.handle("addcourses", async (event, course)=>{
  function confirmMessage(course){
    let confirmation = query.insert(course).then(()=>{
    console.log("course added");
  }).catch((result)=>{
    console.log(result)
  })

  return confirmation;
  }
  result = await confirmMessage(course)
})

ipcMain.on("toMain", (event, data)=>{
  query.getAll().then((rows)=>{
    rows.forEach((item) => {
      mainWindow.webContents.send("fromMain", item.id, item.name);
    });
    console.log(rows)
  });
})
