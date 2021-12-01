<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <h2>M3U Editor</h2>
    </v-app-bar>
    <v-main>
      <div class="mt-5 ml-5 flex">
        <v-btn color="primary" @click="askForFileInput">
          <v-icon left>mdi-file-document</v-icon>
          <span>Choose a file</span>
        </v-btn>
        <input type="file" name="file-input" id="hidden-fileinput">
        <h4 class="mt-2 ml-2">File selected : {{ fileName }}</h4>
      </div>
      <div class="mt-5 ml-5">
        <h1>Categories</h1>
        <h3>Select what you want to export</h3>
        <v-card v-for="(group, index) in groups" :key="index" class="mb-2">
          <div class="flex">
            <v-checkbox v-model="selectedGroups" :value="group" class="ml-2"></v-checkbox>
            <v-card-title>{{ group }}</v-card-title>
          </div>
        </v-card>
      </div>
      <div id="export-div">
        <v-btn color="light-green" :disabled="!readyToSave" @click="saveBuild(playlist, selectedGroups)">
          <v-icon left>mdi-content-save</v-icon>
          <span>Export</span>
        </v-btn>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { askForFileInput, getGroups, parseFileContent, parseM3U, saveBuild } from './web';

export default {
  name: 'App',

  data: () => ({
    fileName: "none",
    playlist: null,
    groups: [],
    selectedGroups: [],
    readyToSave: false
  }),

  methods: {
    askForFileInput,

    init() {
      document.getElementById('hidden-fileinput').addEventListener('change', async event => {
        if(event.target.files[0].type === 'audio/x-mpegurl') {
          this.fileName = event.target.files[0].name;
          const fileContent = await parseFileContent(event.target.files[0]);
          this.playlist = parseM3U(fileContent);
          this.groups = getGroups(this.playlist);
          this.readyToSave = true;
        }
      });
    },

    saveBuild
  },

  mounted() {
    this.init();
  }
};
</script>

<style>
.flex {
  display: flex;
}

#hidden-fileinput {
  display: none;
}

#export-div {
  position: fixed;
  bottom: 50px;
  right: 50px;
}
</style>