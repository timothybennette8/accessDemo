# Photoshop Access Demo

A plugin to demostrate UXP persistent tokens.

## Load into Photoshop

Make sure Photoshop is up and running first. First, add the plugin to the "Developer Workspace" in the UXP Developer Tools (UDT) application.
Click "Add Plugin" and select the `manifest.json` file in the corresponding plugin folder.

Click the ••• button next to the corresponding workspace entry, and click "Load". Switch over to Photoshop, and the plugin's panel will be running.

## Usage

After installing the plugin use the first button to select a working folder in your filesystem - this will be stored in the plugin settings and will persist between Photoshop sessions.
Clicking save will create a subfolder in the workign folder with the same name as the active document and will then create subfolders for each export format and save relevant files. The export formats are defined in /lib/exports.js.
