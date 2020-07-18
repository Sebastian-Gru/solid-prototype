
<!--   The starting point of the chat page was achieved with a YouTube tutorial for a Quasar chat app-->
<!--   The tutorial can be found here: https://www.youtube.com/watch?v=Kfg789g_UTg -->

<template>
  <q-page class="flex q-pa-md">
    <q-list class="full-width" separator>
      <q-item
        v-for="value  in friends"
        :key="value.webID"
        @mousedown="changePeer(value.webID)"
        to="/chat"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            <img :src="value.img" aria-label="Profil Picture">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label><b>{{ getPeerName(value.webID) }}</b> {{value.webID }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge color="light-green-5">
            {{ "Online" }}
          </q-badge>
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn push color="primary" label="Open Solid Panel" class="my-card fixed-bottom-right q-ma-md q-pa-md">
      <q-menu
        transition-show="flip-right"
        transition-hide="flip-left"
      >
        <q-card flat bordered >
          <q-card-section>
            <div class="text-h6">Solid User Name:</div>
            {{ myName }}
          </q-card-section>
          <q-card-section>
            <div class="text-h6">Your Web ID:</div>
            {{ solidID }}
          </q-card-section>

          <q-separator inset />

          <q-card-section class="q-pt-none">
            <q-avatar size="100px" v-if="img">
              <q-img :src="img" />
            </q-avatar>
            <div class="text-h6">Your name:</div>
            Solid Name: {{ name }}<br />
            Role: {{ role }}<br />
            Organization: {{ organization }}<br />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-btn size="22px" label="Logout / Login" @click="logout" />
          </q-card-section>
        </q-card>

      </q-menu>
    </q-btn>

  </q-page>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
const auth = require("solid-auth-client");
import Utils from "../js/utils";

export default {
  data() {
    return {
        utils: new Utils()
    };
  },
  computed: {
    ...mapGetters({
      myName: "DataStore/myNameGetter",
      myComputedName: "DataStore/myNameGetter",
      name: "DataStore/nameGetter",
      solidID: "DataStore/solidIDGetter",
      role: "DataStore/roleGetter",
      organization: "DataStore/organizationGetter",
      session: "DataStore/sessionGetter",
      store: "DataStore/storeGetter",
      fetcher: "DataStore/fetcherGetter",
      friends: "DataStore/friendsGetter",
      getFriendsImg: "DataStore/friendsImgGetter",
      loginState: "DataStore/loginStateGetter",
      img: "DataStore/imgGetter",
    }),
  },
  methods: {
    ...mapActions({
      instantiateSolid: "DataStore/instantiateSolid",
      logout: "DataStore/logout",
      loadChatMessages: "DataStore/loadChatMessages",
    }),
    ...mapMutations({
      changeSelectedPeer: "DataStore/changeSelectedPeer",
      solidIDChange: "DataStore/solidIDChange",
      roleChange: "DataStore/roleChange",
      organizationChange: "DataStore/organizationChange",
      sessionChange: "DataStore/sessionChange",
      storeChange: "DataStore/storeChange",
      fetcherChange: "DataStore/fetcherChange",
      friendsChange: "DataStore/friendsChange",
      loginStateChange: "DataStore/loginStateChange",
      imgChange: "DataStore/imgChange",
    }),

    changePeer(x) {
      console.log("User: " + x);
      this.changeSelectedPeer(x);
      this.loadChatMessages(x);
    },
      getPeerName(webID){
        return this.utils.getUsername(webID)
      }
  },
  created() {
    if (!this.session) {
      this.instantiateSolid();
    }
  },
};
</script>
