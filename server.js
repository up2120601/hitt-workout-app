//  Importing all required modules
const path = require("path");
const express = require("express");
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const workoutData = require("./workout-details");

const app = express();
const port = 8080;


// Server code for getting user data
var userId;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Server code for login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index/login-page.html"));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    let db = new sqlite3.Database("data/userdatabase.db", sqlite3.OPEN_READWRITE, (error) => {
        if (error) {
            console.log("Database error: ", error);
        }
    })

    db.get("SELECT userId FROM users WHERE username == ? AND password == ?", [username, password], (error, row) => {
        if (error) {

        } else if (row == undefined) {
            res.status(204);
            res.end();
        } else {
            userId = row.userId;
            console.log("User logged in: ", userId);

            res.redirect('/mainpage');
        }
    })

});


// Server code for the signup page
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "index/signup-page.html"));
})

app.post("/create-account", (req, res) => {
    let db = new sqlite3.Database("data/userdatabase.db", sqlite3.OPEN_READWRITE, (error) => {
        if (error) {
            console.log("Database error: ", error);
        }
    })

    const { username, password, fname, lname } = req.body;
    db.get("SELECT Count(*) FROM users", (err, row) => {
        var newId = row['Count(*)'];


        db.run("INSERT INTO users (userId, username, password, fname, lname) VALUES (?, ?, ?, ?, ?)", [newId, username, password, fname, lname], (err) => {
            if (err) {
                return console.log(err.message); 
            } 
        });
    });

    db.close();
    res.sendFile(path.join(__dirname, "index/login-page.html"));
})


// Serer code for homepage

app.get("/mainpage", (req, res) => {
    res.sendFile(path.join(__dirname, "index/mainpage.html"));
})

app.get("user-workouts", (req, res) => {
    toSend = [];

    let db = new sqlite3.Database("data/userdatabase.db", sqlite3.OPEN_READWRITE, (err));
    db.all("SELECT workoutid, name FROM workouts WHERE userId = ?", [userId], (err, rows) =>{
        if (rows) {
            rows.forEach(item => {
                toadd = {name: rows.name, id: rows.workoutid}
                toSend.push(toAdd);
            })

            res.json(toSend);
            db.close();
        }
    })
})

function isWithinPastWeek(inputDate) {
    var parts = inputDate.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; 
    var year = parseInt(parts[2], 10);
    var date = new Date(year, month, day);

    var now = new Date();
    var weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    return date <= now && date >= weekAgo;
}

app.get("/user-r-time", (req, res) => {
    let db = new sqlite3.Database("data/userdatabase.db", sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.log(err);
        }
    });
    db.all("SELECT time, date FROM recents WHERE userId = ?", [userId], (err, rows) =>{
        var total = 0;

        if (rows) {
            rows.forEach(wk => {
                var newD1 = wk.date.split("    ");
                var newDate = newD1[1];
                if (isWithinPastWeek(newDate)) {
                    total += parseInt(wk.time);
                }

            })
        }
        res.json({totalT: total});
    })
})


// Server code for workout page

var pageRequested = false;

app.get("/workout-page", (req, res) => {
    pageRequested = req.query.workout;
    res.sendFile(path.join(__dirname, "index/workout-page.html"));
})

app.get("/workout-details", (req, res) => {

    var mode = parseInt(req.query.mode);

    if (mode == 1) {
        var toSend = workoutData.getData(1, req.query.workout);
        pageRequested = false;
        res.json(toSend);
        
    } else if (mode == 2) {
        var toSend = workoutData.getData(2, 0);
        res.json(toSend);

    }  else if (mode == 3) {
        var toSend = [];

        let db = new sqlite3.Database("data/userdatabase.db", sqlite3.OPEN_READWRITE, (error) => {});

        db.all("SELECT name, data, workoutId FROM workouts WHERE userId == ?", [userId], (err, row) => {

            row.forEach(item => {
                var id = item.workoutid;
                var name = item.name;
                var firstW = parseInt(item.data[1]);
                var piclink = workoutData.getData(3, firstW);
                toSend.push([id, name, piclink]);
            })


            res.json(toSend);
            

        }) 
    } else if (mode == 4) {
        let db = new sqlite3.Database("data/userdatabase.db", sqlite3.OPEN_READWRITE, (error) => {});
        db.get("SELECT name, data FROM workouts WHERE workoutid = ?", [pageRequested], (err, rows) => {

            if (err) {
                console.log(err)
            } else {

                var allData = rows.data;
                allData = allData.split("!");
                allData.shift();

                var newData = [];
                
                allData.forEach(item => {
                    var l1 = item.split("/");
                    var wk = parseInt(l1[0]);
                    var time1 = parseInt(l1[1]);

                    var all = workoutData.getData(1, wk);
                    var toAdd = {name: all.name, info: all.description, link: all.piclink, time: time1};
                    newData.push(toAdd);
                })

                var wkData = {name: rows.name, id: pageRequested, data: newData};

                res.json(wkData);

                db.close()
            }
        })
    }
})

app.post("/add-recent", (req, res) => {
    const {name, id, time, date} = req.body;

    let db = new sqlite3.Database("data/userdatabase.db", sqlite3.OPEN_READWRITE, (error) => {});
    db.run("INSERT INTO recents (workoutId, name, time, userId, date) VALUES (?, ?, ?, ?, ?)", [id, name, time, userId, date]);
    db.close();
    
})


//Server code for creating a workout page

app.get("/create-workout", (req, res) => {
    res.sendFile(path.join(__dirname, "index/create-workout.html"))
})

app.get("/user-workouts", (req, res) => {
    let db = new sqlite3.Database("data/userdatabase.db", sqlite3.OPEN_READWRITE, (error) => {});
    db.all("SELECT name, workoutid FROM workouts WHERE userId = ?", [userId], (err, rows) => {

        if (rows != null) {
            toSend = [];

            rows.forEach(item => {
                toAdd = {name: item.name, id: item.workoutid};
                toSend.push(toAdd);

            })

            res.json(toSend);
        }
    })

})

app.get("/import-wk-show", (req, res) => {
    var index = req.query.workout;
    

    let db = new sqlite3.Database("data/userdatabase.db", sqlite3.OPEN_READWRITE, (error) => {});
    db.get("SELECT data FROM workouts WHERE workoutId = ?", [index], (err, row) => {
        var toSend = [];

        var cut1 = row.data.split("!");

        cut1.shift();
        

        cut1.forEach(item => {
            var split2 = item.split("/")
            var name = workoutData.getData(6, parseInt(split2[0]))
            toSend.push(name);
        })

        res.json(toSend);
        db.close();

    })
})

app.get("/import-workout", (req, res) => {
    var id = req.query.workout;

    let db = new sqlite3.Database("data/userdatabase.db", sqlite3.OPEN_READWRITE, (error) => {});
    db.get("SELECT name, data FROM workouts WHERE workoutid = ?", [id], (err, row) => {

        allData = row.data.split("!");
        allData.shift();

        var newData = [];
        
        allData.forEach(item => {
            var l1 = item.split("/");
            var wk = parseInt(l1[0]);
            var time1 = parseInt(l1[1]);

            var all = workoutData.getData(1, wk);
            var toAdd = {name: all.name, time: time1};
            newData.push(toAdd);
        })

        toSend = {name: row.name, data: newData, raw: row.data};
        res.json(toSend);
    })
})

var asked = false;

app.post("/set-workout", (req, res) => {
    const {name, data} = req.body;
    const parsedData = JSON.parse(data);

    
    var toAdd = "";
    for (let key in parsedData) {
        var value = parsedData[key].value;

        toAdd += "!" + value;
    }


    let db = new sqlite3.Database("data/userdatabase.db", sqlite3.OPEN_READWRITE, (error) => {
        if (error) {
            console.log("Database error: ", error);
        }
    })

    db.get("SELECT name FROM workouts WHERE userId = ? AND name = ?", [userId, name], (err, row) => {

        if (row) {
            if (asked == true) {
                db.run("UPDATE workouts SET data = ? WHERE userId = ? AND name = ?", [toAdd, userId, name])
            } else {

                asked = true;
                res.end("false");

                var count = 0
                var timer = setInterval(function() {
                    count += 1

                    if (count == 8) {
                        clearInterval(timer);
                        asked = false;
                    }
                }, 1000)

            }
        } else {
            
            db.get("SELECT Count(*) FROM workouts", (err, row) => {
                var newId = row['Count(*)'];

                db.run("INSERT INTO workouts (userid, name, data, workoutid) VALUES (?, ?, ?, ?)", [userId, name, toAdd, newId], (err) => {});
            
                db.get("SELECT workIds FROM users WHERE userId = ?", [userId], (err, row) => {

                    if (row != undefined) {
                        var content = row.workIds + newId;
                    } else {
                        var content = newId;
                    }

                    db.run('UPDATE users SET workIds = ? WHERE userId = ?', [content, userId], (err) => {});
                    res.end("true");
                })
            })
        }
    })

    db.close();
})


//Server code for recent workouts
app.get("/recent-workouts", (req, res) => {
    res.sendFile(path.join(__dirname, "index/recent-wks.html"))
})

app.get("/user-recents", (req, res) => {
    var toSend = [];

    let db = new sqlite3.Database("data/userdatabase.db", sqlite3.OPEN_READWRITE, (error) => {});
    db.all("SELECT workoutId, name, time, date FROM recents WHERE userId == ?", [userId], (err, rows) => {
        rows.forEach(recent => {
            
            var toAdd = {name: recent.name, toSend: recent.workoutId, time: recent.time, date: recent.date}
            toSend.push(toAdd);
        })

        res.json(toSend);
    });
})

app.get("/itin-show", (req, res) => {
    var workout = req.query.wk; 

    let db = new sqlite3.Database("data/userdatabase.db", sqlite3.OPEN_READWRITE, (error) => {});
    db.get("SELECT name, data FROM workouts WHERE workoutid = ?", [workout], (err, rows) => {

        if (err) {
            console.log(err)
        } else {

            var allData = rows.data;
            allData = allData.split("!");
            allData.shift();

            var newData = [];
            
            allData.forEach(item => {
                var l1 = item.split("/");
                var wk = parseInt(l1[0]);
                var time1 = parseInt(l1[1]);

                var all = workoutData.getData(1, wk);
                var toAdd = {name: all.name, time: time1};
                newData.push(toAdd);
            })

            var wkData = {name: rows.name, data: newData};

            res.json(wkData);

            db.close()
        }
    })
})


// Code for activites page
app.get("/activities", (req, res) => {
    res.sendFile(path.join(__dirname, "index/activities.html"))
})

app.get("/all-activ", (req, res) => {
    var toSend = workoutData.getData(4, 0);
    res.json(toSend);
})


// Server code for the activites workout page
app.get("/activity-workout", (req, res) => {
    pageRequested = req.query.workout;
    res.sendFile(path.join(__dirname, "index/activity-workout.html"));
})

app.get("/activity-get", (req, res) => {
    var toSend = workoutData.getData(5, pageRequested);
    pageRequested = false;
    res.json(toSend);
})


// Server code for the guide page
app.get("/guide", (req,res) => {
    res.sendFile(path.join(__dirname, "index/guide-page.html"));
})

//Running server code
app.use('/images', express.static(path.join(__dirname, 'data/workout-data')));


app.listen(port, () => { 
    console.log(":: Server started on port", port);
});





