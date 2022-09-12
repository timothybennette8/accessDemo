// imports
const { app, core } = require("photoshop");
const batchPlay = require("photoshop").action.batchPlay;
const fs = require("uxp").storage.localFileSystem;

// helper functions
/**
 * Find a folder. If not found, a folder is created
 * @param {Object} folderToSearch
 * @param {Object} folderToFind
 * @returns {Object} the save folder
 */
const findOrCreateFolder = async (folderToSearch, folderToFind) => {
  const entries = await folderToSearch.getEntries();
  const folders = entries.filter((entry) => entry.isFolder);

  const result = folders.find((folder) => folder.name === folderToFind);

  if (result) {
    return result;
  }

  const newFolder = await folderToSearch.createFolder(folderToFind);
  return newFolder;
};

const saveFile = async (doc, saveFolder, format) => {
  doc.flatten();

  // define the batchplay save as action descriptor dynamically
  let saveFormat, filename;

  switch (format) {
    case "tiff":
      saveFormat = {
        _obj: "TIFF",
        byteOrder: {
          _enum: "platform",
          _value: "IBMPC",
        },
        LZWCompression: true,
      };
      filename = "TIFF_FILE";
      break;

    case "jpeg":
      saveFormat = {
        _obj: "JPEG",
        extendedQuality: 12,
        matteColor: {
          _enum: "matteColor",
          _value: "none",
        },
      };
      filename = "JPEG_FILE";
      break;
  }

  const theNewFile = await saveFolder.createFile(filename, {
    overwrite: true,
  });

  const token = await fs.createSessionToken(theNewFile);
  // batchplay save
  await core.executeAsModal(async () => {
    await batchPlay(
      [
        {
          _obj: "save",
          as: saveFormat,
          in: {
            _path: token,
            _kind: "local",
          },
          documentID: doc._id,
          lowerCase: true,
          saveStage: {
            _enum: "saveStageType",
            _value: "saveBegin",
          },
          _options: {
            dialogOptions: "dontDisplay",
          },
        },
      ],
      {}
    );
  });
};

// export functions
const exportActiveDocument = async () => {
  const doc = app.activeDocument;

  // get the settings file and get the persistent token for the working folder
  const settings = await getSettings();
  const workingFolder = await fs.getEntryForPersistentToken(
    settings.workingFolder.token
  );

  const projectFolder = await findOrCreateFolder(workingFolder, doc.title);

  // some arbitary file formats to export
  const saveFormats = ["tiff", "jpeg"];

  // scaffold export folders and save files
  for (const format of saveFormats) {
    const saveFolder = await findOrCreateFolder(projectFolder, format);
    await saveFile(doc, saveFolder, format);
  }
};

module.exports = {
  exportActiveDocument,
};
