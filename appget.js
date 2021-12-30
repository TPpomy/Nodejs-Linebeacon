/*let type = req.body.events.type;
  let hwid = req.body.events.beacon.hwid;
  let users = req.body.events.user;
  let message = req.body.events.message;
  if (!type || !hwid || !users || !message){
    return res.status(500).send({error: true, message:"NO data"});
    }else{
    dbsql.query('INSERT INTO datahook (type, hwid, users, message) VALUES(? , ? ,?,?)',[type, hwid, users, message],( error, results, _fields) => {
        if(error) throw error;
        return res.send({error: false , data: results, message: "data have content"})
    })
  }*/
  