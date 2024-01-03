import gridfs from 'gridfs-stream';
import mongoose
 from 'mongoose';
let gfs;

export const initializeGridFS = (connection) => {
  gfs = gridfs(connection.db, mongoose.mongo);
  gfs.collection('uploads');
};

export const saveFile = async (buffer, filename) => {
  const writeStream = gfs.createWriteStream({
    filename: filename,
  });

  writeStream.write(buffer);
  writeStream.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve('File saved successfully'));
    writeStream.on('error', (error) => reject(error));
  });
};

// export const getFile = async (filename) => {
//   // Implement logic to retrieve a file by filename
// };
