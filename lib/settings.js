const fs = require("uxp").storage.localFileSystem;
const { version } = require("../manifest.json");

/**
 * Reads json settings files in plugin data folder
 * @returns {Object} the settings file data
 * @throws throws error if settings file not found
 */
const getSettings = async () => {
  try {
    const dataFolder = await fs.getDataFolder();
    const getSettingsFile = await dataFolder.getEntry(
      `settings_${version}.json`
    );
    const fileContent = await getSettingsFile.read();
    return JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
};

/**
 * Generates a new pipelines.json file in plugin data folder
 * @returns {Object} settings data object
 */
const createSettingsFile = async (data, name) => {
  const stringifiedData = JSON.stringify(data);
  const dataFolder = await fs.getDataFolder();
  const dataFile = await dataFolder.createFile(`${name}_${version}.json`);
  await dataFile.write(stringifiedData, { overwrite: true });
  return data;
};

/**
 *
 * @param {String} key the settings object key to be written
 * @param {*} value the value to be written
 */
const setSetting = async (key, value) => {
  const settings = await getSettings();
  settings[key] = value;

  const dataFolder = await fs.getDataFolder();
  const dataFile = await dataFolder.getEntry(`settings_${version}.json`);
  await dataFile.write(JSON.stringify(settings));
};

const setWorkingFolder = async () => {
  const label = document.querySelector("#labelWorkingFolder");

  const saveFolder = await fs.getFolder();
  if (!saveFolder) {
    console.error("User exited without selecting a folder");
    throw error;
  }

  const token = await fs.createPersistentToken(saveFolder);

  await setSetting("workingFolder", {
    path: saveFolder.nativePath,
    token: token,
  });

  label.innerHTML = "";
  label.innerHTML = saveFolder.nativePath;
};

module.exports = {
  getSettings,
  createSettingsFile,
  setWorkingFolder,
};
