const { resolve } = require('bluebird')
const sqlite3 = require('sqlite3')

class AppDAO
{
  constructor(dbFilePath)
  {
    this.db = new sqlite3.Database(dbFilePath, (err) =>
    {
      if (err)
      {
        throw err
      }
    })
  }

  run(sql, params = [])
  {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          throw err
          reject(err)
          } else
          {
            resolve({ id: this.lastID })
          }
        })
      })
    }//end of run method

  get(sql, params = []){
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          throw err
          reject(err)
          } else
          {
            resolve(result)
          }
        })
      })
    }//end of get method

    all(sql, params = []){
      return new Promise((resolve, reject) => {
        this.db.all(sql, params, (err, rows) => {
          if (err) {
            throw err
            reject(err)
            } else
            {
              resolve(rows)
            }
          })
        })
      }//end of all method

}//enf of AppDAO class

class DatabaseQuery
{
  constructor(dao)
  {
    this.dao = dao
  }//end of constructor

  createTableCourses()
  {
    const sql = `
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT)`
      return this.dao.run(sql)
  }

  insertCourse(course)
  {
    const sql = 'INSERT INTO courses (name) VALUES (?)'
    return this.dao.run(sql, [course])
  }

  deleteCourse(course)
  {
    const sql = `DELETE FROM courses WHERE name = ?`
    return this.dao.run(sql, [course])
  }

  dropTableCourses()
  {
    const sql = `DROP TABLE courses`
    return this.dao.run(sql)
  }

  createTableTasks()
  {
    const sql = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      task TEXT,
      date TEXT,
      FOREIGN KEY(name) REFERENCES courses(name))`
      return this.dao.run(sql)
  }

  verifyTask(course, task)
  {
    const sql = `
    SELECT * FROM tasks WHERE name = ? AND task = ?`
    return this.dao.all(sql, [course, task])
  }

  insertTask(course, task, date)
  {
    const sql = `
    INSERT INTO tasks (name, task, date) VALUES (?,?,?)`
    return this.dao.run(sql, [course, task, date])
  }

  deleteTask(course, task)
  {
    const sql = `DELETE FROM tasks WHERE name = ? AND task = ?`
    return this.dao.run(sql, [course, task])
  }

  deleteCourseTasks(course)
  {
    const sql = `DELETE FROM tasks WHERE name = ?`
    return this.dao.run(sql, [course])    
  }

  dropTableTask()
  {
    const sql = `DROP TABLE tasks`
    return this.dao.run(sql)
  }

  checkTask(course)
  {
    const sql = `SELECT * FROM tasks WHERE name = ?`
    return this.dao.all(sql, [course])
  }

  checkCourse(course){
    const sql = `SELECT * FROM courses WHERE name = ?`
    return this.dao.all(sql, [course])
  }

  getAllTasks(){
   return this.dao.all(`SELECT * FROM tasks`)
  }

  getAllCourses() {
    return this.dao.all(`SELECT * FROM courses`)
  }

}//end of class ProjectRepository

module.exports.AppDAO = AppDAO
module.exports.DatabaseQuery = DatabaseQuery
