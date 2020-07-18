export default function () {
  return {
    allMessages: {
      global: [
        {
          from: "Solid - Chat",
          data: "Hello User, write a message to everyone!",
        },
      ],
    },
    peers: [],
    name: "Test",
    solidID: "Test",
    role: "",
    organization: "",
    session: null,
    store: null,
    fetcher: null,
    friends: {},
    loginState: false,
    img: "",
    selectedPeer: "global",
    myName: "",
  };
}
