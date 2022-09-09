const yauzl = require("yauzl");

function zipToJson(zipFilePath) {
  const files = {};

  yauzl.open(zipFilePath, { lazyEntries: true }, (error, zipFile) => {
    if (error) {
      throw error;
    }

    zipFile.readEntry();

    zipFile.on("entry", (entry) => {
      if (/\/$/.test(entry.fileName)) {
        zipFile.readEntry();
      } else {
        zipFile.openReadStream(entry, (err, readStream) => {
          if (err) {
            throw err;
          }

          const chunks = [];

          readStream.on("data", function (chunk) {
            chunks.push(Buffer.from(chunk));
          });

          readStream.on("end", () => {
            files[entry.fileName] = Buffer.concat(chunks).toString("utf8");
            zipFile.readEntry();
          });
        });
      }
    });

    zipFile.on("close", () => {
      console.log(JSON.stringify(files, null, 2));
    });
  });
}

module.exports = {
  zipToJson,
};
