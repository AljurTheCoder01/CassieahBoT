import axios from "axios";

export const meta = {
  name: "www",
  otherNames: ["whowouldwin"],
  author: "Aljur Pogoy",
  version: "5.0.0",
  description: "Determine who would win between two users",
  usage: "{prefix}www",
  category: "fun",
  noPrefix: false,
  permissions: [0],
  botAdmin: false,
  supported: "^1.0.0"
};
export async function entry({ api, event, args, output }) {
  const { threadID, messageID, senderID } = event;
  if (!threadID || !messageID) {
    return output.reply("❌ Missing threadID or messageID in event");
  }
  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const participants = threadInfo.participantIDs;
    let id2;
    do {
      id2 = participants[Math.floor(Math.random() * participants.length)];
    } while (id2 === senderID);
    const [data1, data2] = await Promise.all([
      api.getUserInfo([senderID]),
      api.getUserInfo([id2]),
    ]);
    const name1 = data1[senderID]?.name || "Unknown";
    const name2 = data2[id2]?.name || "Unknown";
    const arraytag = [
      { id: senderID, tag: name1 },
      { id: id2, tag: name2 },
    ];
    const messageBody = `🥊 Who would win? ${name1} vs ${name2}!`;
    const url = `https://api.popcat.xyz/whowouldwin?image1=https://api-canvass.vercel.app/profile?uid=${senderID}&image2=https://api-canvass.vercel.app/profile?uid=${id2}`;
    const response = await axios.get(url, { responseType: "stream" });

    await api.sendMessage(
      {
        body: messageBody,
        mentions: arraytag,
        attachment: response.data,
      },
      threadID,
      messageID
    );
  } catch (error) {
    console.error("WhoWouldWin command error:", error.stack || error.message);
    await output.reply(`❌ Error: ${error.message || "Unknown error"}`);
  }
}
