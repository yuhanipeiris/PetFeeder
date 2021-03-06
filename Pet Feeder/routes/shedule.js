const express = require("express");
// const { Router } = require("express");
const mysqlConnection = require("../connection");
const Router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
Router.get("/:device", urlencodedParser, (req, res) => {

     console.log(req.params.id);
    device = req.params.device;
   
console.log("SELECT `id`, `device`,DATE (`date`) AS `date`, `time`, `status` FROM `shedule` WHERE `device`='" + device + "'");
    mysqlConnection.query("SELECT `id`, `device`,concat(date, ' ', time) AS `date`, `status` FROM `shedule` WHERE `device`='" + device + "' ORDER BY `id` DESC", (err, rows, fields) => {
       // console.log(rows);
        if (!err) res.send(rows);
        else console.log(err)
    })
})

Router.delete("/:device", urlencodedParser, (req, res) => {

    console.log(req.params.id);
   device = req.params.device;
   console.log(device);
//console.log("SELECT `id`, `device`,DATE (`date`) AS `date`, `time`, `status` FROM `shedule` WHERE `device`='" + device + "'");
   mysqlConnection.query("DELETE FROM `shedule` WHERE `shedule`.`id` ='" + device + "' ;", (err, rows, fields) => {
      // console.log(rows);
       if (!err) res.send(rows);
       else console.log(err)
   })
})

Router.get("/upcomming/:device", urlencodedParser, (req, res) => {

    console.log(req.params.id);
   device = req.params.device;
  
console.log("SELECT `id`, `device`,DATE (`date`) AS `date`, (HOUR(`time`)*60)+MINUTE(`time`) AS `time`, `status` FROM`shedule` WHERE `status`='WAITING' AND DATE (`date`)=  CURDATE() AND `device`='" + device + "' ORDER BY `time` ASC ");
   mysqlConnection.query("SELECT `id`, `device`,DATE (`date`) AS `date`, (HOUR(`time`)*60)+MINUTE(`time`) AS `time`,slot1Value,slot2Value,slot3Value, `status` FROM `shedule` WHERE `status`='WAITING' AND DATE (`date`)=  CURDATE() AND `device`='" + device + "' ORDER BY `time` ASC  LIMIT 1", (err, rows, fields) => {
       if (!err) res.send(rows);
       else console.log(err)
   })
})

Router.post("/", urlencodedParser, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    device = req.body.device;
    date = req.body.date;
    time = req.body.time;
    slot1Value = req.body.slot1Value;
    slot2Value = req.body.slot2Value;
    slot3Value = req.body.slot3Value;

    mysqlConnection.query("INSERT INTO `shedule` (`id`, `device`, `date`, `time`, `slot1Value`, `slot2Value`, `slot3Value`, `status`) VALUES(NULL, '" + device + "', '" + date + "', '" + time + "', '" + slot1Value + "', '" + slot2Value + "', '" + slot3Value + "', 'WAITING');", (err, rows, fields) => {
        if (!err) {
            response = {
                success: true,
            };
            console.log(response);
            res.end(JSON.stringify(response));
        } else {
            response = {
                success: false,
            };
            console.log(response);
            res.end(JSON.stringify(response));
        };
    })

})

Router.put("/", urlencodedParser, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    shedule = req.body.shedule;
    deviceId = req.body.deviceId;
    password = req.body.password;

    mysqlConnection.query("SELECT * FROM `device` WHERE `deviceId`='" + deviceId + "' AND `password`='" + password + "' ", (err1, rows, fields) => {

        if (rows) {
            if (rows[0].id != undefined) {
                mysqlConnection.query("UPDATE `shedule` SET `status` = 'COMPLEATED' WHERE `shedule`.`id` = " + shedule + ";", (err, rows, fields) => {
                    if (!err) {
                        response = {
                            success: true,
                        };
                        console.log(response);
                        res.end(JSON.stringify(response));
                    } else {
                        response = {
                            success: false,
                        };
                        console.log(response);
                        res.end(JSON.stringify(response));
                    };
                })
            } else {
                console.log("Response Unavailable...");
            }
        }
        // response = {
        //     success: true,
        //     data: rows[0].id
        // };
        // console.log(response);

        // res.end(JSON.stringify(response));
        else console.log(err1)
    })
})
module.exports = Router;