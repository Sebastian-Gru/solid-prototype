<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="row">
        <q-btn
          v-if="$route.meta.back"
          v-go-back.single
          flat
          dense
          label="Back"
        />
        <q-space />
        <q-toolbar-title class="absolute-center">
          {{ title }}
        </q-toolbar-title>

        <q-space />
        <b>
          <q-toggle
            color="yellow"
            toggle-indeterminate
            v-model="darkmode"
            :label="
              this.darkmode == null ? 'Auto' : this.darkmode ? 'On' : 'Off'
            "
            left-label
          />
        </b>
      </q-toolbar>

      <q-tabs
        inline-label
        class="text-yellow"
        align="justify"
        dense
        animated
        v-if="$route.meta.tabs"
      >
        <q-route-tab to="/" label="Chat" icon="chat" />
        <q-route-tab to="/profile" label="Profile" icon="person" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";
import Utils from "../js/utils";


export default {
  data() {
    return {
      darkmode: null,
      utils: new Utils()
    };
  },

  computed: {
    ...mapGetters({
      selectedPeer: "DataStore/selectedPeerGetter",
      peers: "DataStore/peerGetter",
      myID: "DataStore/myIDGetter",
    }),
    title() {
      let currentPath = this.$route.fullPath;
      if (currentPath === "/") return "Solid - Contacts";
      else if (currentPath === "/chat")
        return this.selectedPeer === "global"
          ? "Global Chat"
          : `Chat with ${this.utils.getUsername(this.selectedPeer)}`;
      else if (currentPath === "/peers") return "Peers to Chat with";
      else if (currentPath === "/profile") return "Your Profile";
      else if (currentPath === "/login") return "Login";
      return "Fehler";
    },
  },
  methods: {

  },
    created() {
        this.$q.dark.set(this.darkmode == null? 'auto' : this.darkmode) // or false or "auto"
    },
    beforeUpdate() {
        this.$q.dark.set(this.darkmode == null? 'auto' : this.darkmode) // or false or "auto"
    }
};
</script>
