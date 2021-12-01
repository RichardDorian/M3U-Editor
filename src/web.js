import { parse as parseFileAsM3U } from 'iptv-playlist-parser';
import { saveAs } from 'file-saver';


export function askForFileInput() {
  document.getElementById('hidden-fileinput').click();
}

export function parseFileContent(file) {
  return new Promise((resolve) => {
    const readFile = new FileReader();

    readFile.onload = function(event) {
      resolve(event.target.result);      
    }

    readFile.readAsText(file);
  });
}

export function parseM3U(fileContent) {
  return parseFileAsM3U(fileContent);
}

export function getGroups(playlist) {
  const groups = [];
  playlist.items.forEach(item => {
    if(item.group.title) {
      if(!groups.includes(item.group.title)) {
        groups.push(item.group.title);
      }
    }
  });
  return groups;
}

export function saveBuild(playlist, selectedGroups) {
  let newFile = playlist.header.raw;
  playlist.items.forEach(item => {
    if(selectedGroups.includes(item.group.title)) {
      newFile = newFile + '\n' + item.raw;
    }
  });
  const blob = new Blob([newFile], { type: 'audio/x-mpegurl' });
  saveAs(blob, `exported-playlist-${new Date().toUTCString()}.m3u`);
}