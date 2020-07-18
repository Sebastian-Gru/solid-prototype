import auth from "solid-auth-client";
import SolidInstance from "src/js/SolidSession";
import Utils from "src/js/utils";
const utils = new Utils();

export async function instantiateSolid({ commit }) {
  console.log("logging in ...");
  let friendsImg;
  let friends = [];

  const SolidSession = await new SolidInstance();

  const solidID = await SolidSession.solidID();

  const name = await SolidSession.getProfileInfoFOAF("name").catch((err) =>
    console.log("Name does not exist in Solid profile!", err)
  );
  const organization = await SolidSession.getProfileInfoVCARD(
    "organization-name"
  ).catch((err) =>
    console.log("organization-name does not exist in Solid profile!", err)
  );
  const role = await SolidSession.getProfileInfoVCARD("role").catch((err) =>
    console.log("role does not exist in Solid profile!", err)
  );
  const img = await SolidSession.getProfileInfoVCARD("hasPhoto").catch((err) =>
    console.log("image does not exist in Solid profile!", err)
  );
  await SolidSession.getFriendsFOAF("knows")
    .then((x) => {
      friends = x.map((z) => {
        return z["value"];
      });
    })
    .catch((err) => console.log("knows does not exist in Solid profile!", err));
  const myName = utils.getUsername(solidID);
  friendsImg = await SolidSession.getFriendsImage(friends).catch((err) => {
    friendsImg.push(null);
    console.log(err);
  });

  commit("SolidSessionChange", SolidSession);

  commit("profileDataChange", {
    solidID: solidID,
    name: name ? name["value"] : "",
    organization: organization ? organization["value"] : "",
    role: role ? role["value"] : "",
    img: img ? img["value"] : "",
    friends: friends ? friends : "",
    myName: myName ? myName : "",
    friendsImg: friendsImg ? friendsImg : "",
  });
}

export async function logout({ commit, state, dispatch }) {
  console.log("logout");
  console.log(state.session);
  commit("SolidSessionChange", await auth.logout());
  commit("loginStateChange");
  commit("removeAllStateData");
  dispatch("instantiateSolid");
}

export async function loadChatMessages({ commit, state }, selected) {
  let data;
  let oldData = null;

  data = await state.session.loadMessagesFromChat(selected);

  if (oldData !== data) commit("solidMessageCommiter", data);

  setInterval(async () => {
    data = await state.session.loadMessagesFromChat(selected);

    if (oldData !== data) commit("solidMessageCommiter", data);

    oldData = data;
  }, 10000);
}

export async function sendSolidMessage({ commit, state }, msg) {
  let data;

  setTimeout(await state.session.establishCom(state.selectedPeer), 5000);
  data = await state.session.loadMessagesFromChat(
    state.selectedPeer,
    await state.session.sendNewSolidMsg(msg, state.selectedPeer)
  );

  commit("solidMessageCommiter", data);
}
