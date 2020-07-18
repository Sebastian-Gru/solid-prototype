<template>
  <div>
    <q-card flat bordered class="q-ma-md q-pa-md">
      <q-card-section>
        <div class="text-h6">Solid User Name:</div>
        {{ myName }}
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Your Web ID:</div>
        {{ solidID }}
      </q-card-section>

      <q-separator inset class="q-ma-md" />

      <q-card-section class="q-pt-none">
        <q-avatar size="100px" v-if="img">
          <q-img :src="img" />
        </q-avatar>
        <div class="text-h6">Your name:</div>
        Solid Name: {{ name }}<br />
        Role: {{ role }}<br />
        Organization: {{ organization }}<br />
      </q-card-section>

    </q-card>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      addFriend: "",
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
      loginState: "DataStore/loginStateGetter",
      img: "DataStore/imgGetter",
    }),
  },
  methods: {
    ...mapMutations({}),
    ...mapActions({
      addNewSolidFriend: "DataStore/addNewSolidFriend",
    }),
    addFriends() {
      console.log("Test: " + this.addFriend);
      this.$q.notify("Friend added: " + this.addFriend);
      this.addFriend = "";
    },
  },
  created() {},
};
</script>
