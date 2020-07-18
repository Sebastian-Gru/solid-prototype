<template>
  <q-page ref="pageChat" class="page-chat flex column">

    <div class="q-pa-md column col justify-end" id="Messages">
      <q-chat-message
        v-for="message in allMessages[selectedPeer]"
        :key="message.data + Math.random()"
        :name="message.from"
        :stamp="message.date ? message.date.toUTCString() : 'just now'"
        :text="[message.data]"
        :sent="message.from === myName"
      />
    </div>

    <q-footer elevated>
      <q-toolbar>
        <q-form @submit="sendMessage" class="full-width">
          <q-input
            v-model="newMessage"
            @blur="scrollToBottom"
            ref="newMessage"
            :bg-color="this.$q.dark.isActive ? 'dark grey' : 'white'"
            outlined
            rounded
            label="Message"
            dense
          >
            <template v-slot:after>
              <q-btn
                @click="sendMessage"
                round
                dense
                flat
                type="submit"
                color="white"
                icon="send"
              />
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Utils from "../js/utils";
export default {
  data() {
    return {
      newMessage: "",
      model: null,
      showMessages: false,
      utils: new Utils()
    };
  },
  computed: {
    ...mapGetters({
      allMessages: "DataStore/messageGetter",
      peers: "DataStore/peerGetter",
      myID: "DataStore/myIDGetter",
      myName: "DataStore/myNameGetter",
      currentMsg: "DataStore/currentMsgGetter",
      selectedPeer: "DataStore/selectedPeerGetter",
    }),
  },
  methods: {
    ...mapActions({
      sendSolidMessage: "DataStore/sendSolidMessage",
    }),

    open(position) {
      this.position = position;
      this.dialog = true;
    },

    async sendMessage() {
      if (this.newMessage !== "") {
        console.log("selectedPeer: " + this.selectedPeer);
        console.log(this.newMessage);
        this.sendSolidMessage(this.newMessage);
        this.newMessage = "";
        this.$refs.newMessage.focus();
        this.scrollToBottom();
      }
    },
    scrollToBottom() {
      let pageChat = this.$refs.pageChat.$el;
      setTimeout(() => {
        window.scrollTo(0, pageChat.scrollHeight);
      }, 20);
    },
  },

  watch: {
    allMessages: function (val) {
      if (Object.keys(val).length) {
        this.scrollToBottom();
      }
    },
  },
};
</script>
