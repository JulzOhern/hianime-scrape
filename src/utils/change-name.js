function changeName(serverName) {
  let editedName = { serverName: "", prefferedName: "" };

  switch (serverName) {
    case "hd-1":
      editedName.serverName = "vidstreaming";
      break;
    case "hd-2":
      editedName.serverName = "vidcloud";
      break;
    default:
      editedName.serverName = serverName;
  }

  switch (serverName) {
    case "hd-1":
      editedName.prefferedName = "mochi";
      break;
    case "hd-2":
      editedName.prefferedName = "mochiya";
      break;
    case "streamsb":
      editedName.prefferedName = "mochimono";
      break;
    case "streamtape":
      editedName.prefferedName = "mochikobo";
  }

  return editedName;
}

module.exports = { changeName };
