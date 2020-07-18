const auth = require("solid-auth-client");
const FC = require("solid-file-client");
import Utils from "src/js/utils";
const fc = new FC(auth, { enableLogging: true });
const $rdf = require("rdflib");
const FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = $rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const { default: data } = require("@solid/query-ldflex");

/**
 *  Some prinicples and functions in this file are inspired by the Solid Chat Application DeChat4
 *  The project can be found here: https://github.com/Arquisoft/dechat_es4b
 */

let session = null;

async function SolidSession() {
  session = await auth.currentSession();
  let popupUri = "https://solid.community/common/popup.html";
  if (!session) session = await auth.popupLogin({ popupUri });

  let store = $rdf.graph();
  let fetcher = new $rdf.Fetcher(store);
  await fetcher.load(session.webId);

  async function solidID() {
    return `${session.webId}`;
  }

  async function getProfileInfoFOAF(name) {
    return store.any($rdf.sym(session.webId), FOAF(name));
  }

  async function getProfileInfoVCARD(name) {
    return store.any($rdf.sym(session.webId), VCARD(name));
  }
  async function getFriendsFOAF(name) {
    return store.each($rdf.sym(session.webId), FOAF(name));
  }

  async function getFriendsImage(friend) {
    let helper = friend.map(
      (x) => data[`${x}`]["http://www.w3.org/2006/vcard/ns#hasPhoto"].value
    );
    return await Promise.all(helper);
  }

  const utils = new Utils();

  async function loadMessagesFromChat(selectedPeer, messageToAdd) {
    const data = await loadMessages(selectedPeer, messageToAdd);

    return { data: data, conversationPartner: selectedPeer };
  }

  async function loadMessages(other, messageToAdd) {
    let messages = []; //here will be stored all messages loaded
    // Let's read each message file

    let fileWithMessagesSentByMe =
      getInbox(`${session.webId}`) + getUsername(other) + ".ttl";
    let fileWithMessagesSentByTheOtherUSer =
      getInbox(other) + getUsername(`${session.webId}`) + ".ttl";

    let me = getUsername(`${session.webId}`);

    await fc
      .readFile(fileWithMessagesSentByMe)
      .then(
        (body) => {
          let res = body.split("\n\n\n");
          let chat = res[1];
          let dateRead = chat.split('"')[1];
          for (var i = 2; i < res.length; i++) {
            let lines = res[i].split("\n");
            //Get ID
            let temp = lines[0].split(" a ")[0];
            temp = temp.replace(":", "");
            //Get Time
            let dateTime = lines[1].split('"')[1];
            //Get Sender
            let sender = lines[2].split('"')[1];
            me = sender;
            //Get Message
            let aux = lines[3].split('\t"')[1];
            let message = aux.replace('"\t.', "");
            messages.push({
              from: sender,
              date: new Date(dateTime),
              data: message,
            });
          }

          let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
          let t = new Date(Date.now() - tzoffset);
          t.setSeconds(t.getSeconds() + 6);
          let time = t.toISOString().slice(0, -1);
          let newBody = body.replace(dateRead, time);
          if (messageToAdd)
            fc.putFile(
              fileWithMessagesSentByMe,
              newBody + messageToAdd,
              "Message"
            ).then(
              () => {
                console.log("Message should be added");
              },
              () => {
                console.log("Likely an error occured");
              }
            );
        },
        (err) => {
          console.log(err);
        }
      )
      .catch((err) =>
        console.log(
          "You need to give the caht application rights in your pod to establish comunication first",
          err
        )
      );

    return await fc
      .readFile(fileWithMessagesSentByTheOtherUSer)
      .then(
        (body) => {
          let res = body.split("\n\n\n");
          //res[>=2] => MENSAJES (MXXXX)
          for (let i = 2; i < res.length; i++) {
            let lines = res[i].split("\n");
            //Get ID
            let temp = lines[0].split(" a ")[0];
            temp = temp.replace(":", "");
            //Get Time
            let dateTime = lines[1].split('"')[1];
            //Get Sender
            let sender = lines[2].split('"')[1];
            //Get Message
            let aux = lines[3].split('\t"')[1];
            let message = aux.replace('"\t.', "");
            messages.push({
              from: sender,
              date: new Date(dateTime),
              data: message,
            });
          }
          return utils.orderAndShow(messages);
        },
        (err) => {
          console.log("Error Reading Messages!: " + err);
        }
      )
      .catch((err) =>
        console.log("The peer needs to establish comunication first", err)
      );
  }

  function getUsername(text) {
    let array = text.split(".");
    let another = array[0].split("/");
    return another[another.length - 1];
  }

  function getInbox(userWebId) {
    let company = "";
    if (userWebId.includes("solid.community")) {
      company = "solid.community";
    } else if (userWebId.includes("inrupt.net")) {
      company = "inrupt.net";
    }
    return "https://" + getUsername(userWebId) + "." + company + "/inbox/";
  }

  async function establishCom(receiver) {
    if ((await communicationEstablished(receiver)) === false)
      await sendFirstMessage(receiver, "msg");
    return true;
  }

  async function sendNewSolidMsg(msg, receiver) {
    if (await communicationEstablished(receiver)) {
      return sendMessageToPod(receiver, msg);
    } else {
      try {
        sendFirstMessage(receiver, msg);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function communicationEstablished(receiver) {
    let exists = true;

    await fc
      .readFile(getInbox(`${session.webId}`) + getUsername(receiver) + ".ttl")
      .then(
        () => {},
        () => {
          exists = false;
        }
      );
    await fc
      .readFile(getInbox(receiver) + getUsername(`${session.webId}`) + ".ttl")
      .then(
        () => {},
        () => {
          exists = false;
        }
      );
    return exists;
  }

  function sendMessageToPod(receiver, message) {
    const messageUrl = "M" + randomString(6); //RANDOM ID (alphanumeric)
    const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    const time = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);

    const messageToAdd =
      "\n\n\n:" +
      messageUrl +
      " a \t\tschem:Message;\n" +
      '\tschem:dateSent\t"' +
      time +
      '";\n' +
      '\tschem:givenName\t"' +
      getUsername(`${session.webId}`) +
      '";\n' +
      '\tschem:text\t"' +
      message +
      '"\t.';

    return messageToAdd;
  }

  function sendFirstMessage(receiver) {
    console.log("Send first message!");
    const myUrlFile =
      getInbox(`${session.webId}`) + getUsername(receiver) + ".ttl";
    const otherUrlFile =
      getInbox(receiver) + getUsername(`${session.webId}`) + ".ttl";
    const dateTimeZero = "2002-05-30T09:00:00";

    const header =
      "@prefix : <#>.\n@prefix stor: <http://example.org/storage/>.\n@prefix schem: <http://schema.org/>.\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .";

    const myBody =
      ":CHAT\n\tstor:storeIn <" +
      otherUrlFile +
      '>;\n\tschem:dateRead "' +
      dateTimeZero +
      '"^^xsd:dateTime .';
    const otherBody =
      ":CHAT\n\tstor:storeIn <" +
      myUrlFile +
      '>;\n\tschem:dateRead "' +
      dateTimeZero +
      '"^^xsd:dateTime .';

    fc.readFile(otherUrlFile).then(
      () => {
        console.log("Communication is allready established");
      },
      (err) => {
        fc.createFile(otherUrlFile, header + "\n\n\n" + otherBody).then(
          () => {
            console.log("Create conversation file in other POD");
          },
          (err) => console.log(err)
        );
      }
    );

    fc.readFile(myUrlFile).then(
      () => {
        console.log("Communication is allready established");
      },
      (err) => {
        //if(err.includes("404")){ //Not found = Not created
        fc.createFile(myUrlFile, header + "\n\n\n" + myBody).then(
          (success) => {
            console.log("Create conversation file in my POD");
          },
          (err) => console.log(err)
        );
      }
    );

    fc.createFile(
      myUrlFile + ".acl",
      templatePermission(receiver, getUsername(receiver) + ".ttl"),
      "text/turtle"
    ).then(
      (success) => {
        return true;
      },
      (err) => console.log(err)
    );
  }

  function templatePermission(other, file) {
    const textPer =
      "@prefix : <#>.\n" +
      "@prefix n0: <http://www.w3.org/ns/auth/acl#>.\n" +
      "@prefix n1: <http://xmlns.com/foaf/0.1/>.\n" +
      "@prefix c: </profile/card#>.\n" +
      "@prefix c0: <" +
      cardButNotMe(other) +
      ">.\n\n" +
      ":ControlReadWrite\n" +
      "\ta n0:Authorization;\n" +
      "\tn0:accessTo <" +
      file +
      ">;\n" +
      "\tn0:agent c:me, c0:me;\n" +
      "\tn0:mode n0:Control, n0:Read, n0:Write.\n" +
      ":Read\n" +
      "\ta n0:Authorization;\n" +
      "\tn0:accessTo <" +
      file +
      ">;\n" +
      "\tn0:agentClass n1:Agent;\n" +
      "\tn0:mode n0:Read.\n";
    return textPer;
  }

  function cardButNotMe(other) {
    return other.split("#")[0] + "#";
  }

  function randomString(length) {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  return {
    solidID,
    getProfileInfoFOAF,
    getProfileInfoVCARD,
    getFriendsFOAF,
    loadMessagesFromChat,
    sendNewSolidMsg,
    establishCom,
    getFriendsImage,
  };
}

export default SolidSession;
