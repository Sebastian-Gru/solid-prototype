export const updateUserList = (state, newUserList) => {
  state.userList = newUserList;
};

export const peerChange = (state, newPeers) => {
  state.peers = newPeers;
};
export const webIDChange = (state, webID) => {
  state.webID = webID;
};

export const myIDcommit = (state, myID) => {
  state.myID = myID;
};

export const changeSelectedPeer = (state, selected) => {
  console.log(selected);
  state.selectedPeer = selected;
};

export const solidIDChange = (state, name) => {
  state.name = name;
};
export const roleChange = (state, role) => {
  state.role = role;
};
export const organizationChange = (state, organization) => {
  state.organization = organization;
};

export const removeAllStateData = (state) => {
  let newState = {};

  Object.keys(state).forEach((key) => {
    newState[key] = null; // or = initialState[key]
  });
};
export const SolidSessionChange = (state, session) => {
  state.session = session;
};
export const storeChange = (state, store) => {
  state.store = store;
};
export const fetcherChange = (state, fetcher) => {
  state.fetcher = fetcher;
};

export const friendsChange = (state, friends) => {
  state.friends = friends;
};

export const loginStateChange = (state) => {
  state.loginState = !state.loginState;
};

export const imgChange = (state, img) => {
  state.img = img;
};
export const profileDataChange = (state, data) => {
  let friends = [];

  for (let i = 0; i < data.friends.length; i++) {
    friends.push({
      webID: data.friends[i],
      img: data.friendsImg[i],
    });
  }

  state.solidID = data.solidID;
  state.name = data.name;
  state.img = data.img;
  state.friends = friends;

  state.role = data.role;
  state.organization = data.organization;
  state.myName = data.myName;
};

export const solidMessageCommiter = (state, data) => {
  let conversation = data.conversationPartner;

  let existingAllMessags = Object.assign({}, state.allMessages);

  existingAllMessags[conversation] = [];

  if (data.data) {
    data.data.forEach((x) => {
      existingAllMessags[conversation].push(x);
    });
  }

  state.allMessages = existingAllMessags;
};
