import path from "path";
import Contact from "../models/contacts";
require("dotenv").config();

const {
  Worker,
} = require("worker_threads");

export const uploadCsv = async (req, res) => {
  try {
    const file = req.files.file;
    file.mv(`./uploads/${file.name}`, async (err) => {
      if (err) {
        console.log("ERROR : ", err);
        return res.status(500).send({
          status: "failure",
          message: "Problem with file upload",
        });
      } else {
        let reqPath = path.join(__dirname , "../middleware/csvWorker.js")
        const worker = new Worker(reqPath, {
          workerData: {
            file: `./uploads/${file.name}`,
          },
        });
  
        await worker.on("message", async (msg) => {
          if (msg?.type === "done") {
            console.log(`File encrypted to ${JSON.stringify(msg.output)}`);
            await Contact.insertMany(msg.output, (err, data) => {
              if (err) {
                console.log('ERR ', err);
                return res.status(500).send({
                  status: "failure",
                  message: "Internal Error",
                  body : err
                });
              } else {
               return  res.send({ status: "success", body: data });
              }
            });
          }
        });
      }
    });
  } catch (err) {
    console.log('ERROR FROM MAIN SERVICE ',err);
    res.status(500).send({
      status: "failure",
      message: "Internal Error",
     
    })
  }
};

