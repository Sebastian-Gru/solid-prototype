function Utils() {
  function orderAndShow(messages) {
    //Now order the messages
    messages.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return a.date - b.date;
    });
    return messages;
  }

  function getUsername(text) {
    let array = text.split(".");
    let another = array[0].split("/");
    let username = another[another.length - 1];
    return username;
  }

  return {
    orderAndShow,
    getUsername,
  };
}

export default Utils;
