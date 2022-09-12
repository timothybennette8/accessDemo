// import functions
const {
  getSettings,
  createSettingsFile,
  setWorkingFolder,
} = require("/lib/settings");
const { exportActiveDocument } = require("/lib/export");

// ui elements
const label = document.querySelector("#labelWorkingFolder");
const btnDefine = document.querySelector("#btnDefine");
const btnSave = document.querySelector("#btnSave");

const init = async () => {
  const settings = (await getSettings())
    ? await getSettings()
    : await createSettingsFile({ workingFolder: {} }, `settings`);

  label.innerHTML = settings.workingFolder.path;

  // listeners
  btnDefine.addEventListener("click", setWorkingFolder);
  btnSave.addEventListener("click", exportActiveDocument);
};

init();
