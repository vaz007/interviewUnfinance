const fs = require("fs");
const csvtojsonV2 = require("csvtojson");

const { parentPort, workerData } = require("worker_threads");

const { file } = workerData;

const uploadFile = async () => {
  try {
    csvtojsonV2()
          .fromFile(file)
          .then(async (jsonObj) => {
            fs.unlinkSync(file);
            return parentPort.postMessage({output: jsonObj, type: "done"})
          })
          .catch((err) => {
            return ({
              status: "failure",
              message: "Problem with file conversion"
            });
          });
  } catch (error) {
    if (error.message) {
      return({ status: "failure", message: error.message, body: [] });
    } else {
      return({ status: "failure", message: "Internal Error", body: [] });
    }
  }
};

uploadFile();
