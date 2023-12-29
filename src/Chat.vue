<template>
  <div class="chatOptions">
    <div class="chatOptionButton" id="textCh" @click="openTextChat">
      <i class="fa-brands fa-rocketchat"></i>
    </div>
    <div class="chatOptionButton" id="voiceCh" @click="openVoiceChat">
      <i class="fa-solid fa-microphone"></i>
    </div>
  </div>
  <div>

    <div id="channelSelectionLayout">
      <label for="channelSelection">Channels</label>
      <br>
      <select name="" id="channelSelection" >
        <option @change="changeChannel" :value="channel" v-for="(channel,index) in channels" :key="index">{{ channel }}</option>
      </select>
    </div>
    <div id="newChannelLayout">      
      <label for="channelTextInput">New Channel Name</label>
      <br>
      <input type="text" v-model="newChannel" id="channelTextInput">
      <button @click="createChannel">Create Channel</button>
    </div>
  </div>
    <!-- <TextInput @submitText="submitText" :noOfMessages="messages.length" /> -->
  
</template>

<script>

import TextInput from './components/TextInput.vue'
import Messages from './components/Messages.vue'

export default {
  name: 'Chat',
  components: {
    TextInput,
    Messages
  },
  data() {
    return{
      messages: [],
      channels: [],
      textChatSwitch: true,
      voiceChatSwitch: false,
      currentChannel: "Main Channel",
      newChannel: ""
    }
  },
  async created(){
    // this.messages = await this.fetchData(),
    // this.channels = await this.fetchChannels()
  },
  watch: {
    async messages(){
      this.messages = await this.fetchData()
    },
    async channels() {
      this.channels = await this.fetchChannels()
    }
  },
  methods:{
    // Create and channel and send it to Firebase
    async createChannel(){

      this.channels = [ ...this.channels,  this.newChannel]

      this.newChannel

    },
    // Getting channels from firebase
    async fetchChannels() {
      
      const jsonFile = await fetch(`https://studiando-a6bec-default-rtdb.firebaseio.com/chats.json`)
      
      let channels = await jsonFile.json();
      
      let channelNames = []

      for( let name in chat )
        channelNames[ channelNames.length ] = name

      return channelNames
    },
    // Sending new messages to Database
    async submitText(newMessage){

      const newMess =  await fetch(`https://studiando-a6bec-default-rtdb.firebaseio.com/chats/${this.currentChannel}.json`, {
            method: "post",
            referrer: this.messages.length,
            headers: {
              'Content-type': "application/json; charset=UTF-8"
            },
            body: [JSON.stringify(newMessage)],

        })
      this.messages = [ ...this.messages,  newMessage]
      
    },
    // Getting Messages from firebase Database
    async fetchData(){
      const jsonFile = await fetch(`https://studiando-a6bec-default-rtdb.firebaseio.com/chats/${this.currentChannel}.json`)
      let chat = await jsonFile.json();
      
      let arrayChat = []

      for( let message in chat )
        arrayChat[chat[message]['index']-1] = chat[message]

      return arrayChat
    },
    openTextChat() {
        this.textChatSwitch = true;
        this.voiceChatSwitch = false;
        document.getElementById('textCh').style.backgroundColor="rgb(26, 130, 220)";
        document.getElementById('voiceCh').style.backgroundColor="rgba(98, 140, 180, 0.34)";
    },
    openVoiceChat() {
        this.textChatSwitch = false;
        this.voiceChatSwitch = true;
        document.getElementById('textCh').style.backgroundColor="rgba(98, 140, 180, 0.34)";
        document.getElementById('voiceCh').style.backgroundColor="rgb(26, 130, 220)";
    },
    changeChannel() {
        const channelDropdown = document.getElementById('channelSelection')
        const selectedChannel = channelDropdown.value;
        this.currentChannel = selectedChannel
    }
  },
  computed: {
    // //Scroll always to the bottom
    // scrollUpdate(){
    //     var messageBody = document.querySelector('.allMessages');

    //     messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

    // }
  },

}
</script>

<style>

* {
  margin: 0;
  transition: all 0.5s;
}

#channelSelection {
  max-width: 150px;
  min-width: 100px;
}

#newChannelLayout{
  margin: 10% 0;
}

#channelSelectionLayout *{
  margin: 2% 0;
}


#newChannelLayout *{
  margin: 2% 0;
}

#chat {
  position: absolute;
  top: 0;
  /* left: 5%; */
  height: 98vh;
  width: 25vw;
  border: 1px solid rgb(92, 90, 90);
  box-shadow: 0px 0px 10px rgba(130, 129, 129, 0.582);
  border-radius: 10px;
  box-sizing: border-box;
  /* padding: 20px; */
  background-image: linear-gradient(rgba(0, 0, 255, 0), rgb(0, 179, 255));
  /* display: none; */
  transform: translate(40px, 0px);
  animation-name: entry;
  animation-duration: 0.5s;
  animation-delay: 0.5s;
  animation-fill-mode: both;
  animation-direction: alternate;
}
.chatOptions{
  display: flex;
  font-size: 20px;
  justify-content: flex-start;
}
#textCh{
  background-color: rgb(26, 130, 220);
}
.textChatCanvas{
  height: 96%;
  margin: 0%;
}

.voiceChatCanvas{
  height: 96%;
  margin: 0%;
}
.chatOptionButton{
  color: rgb(255, 255, 255);
  margin: 2%;
  border-radius: 20px;
  background-color: rgba(98, 140, 180, 0.34);
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
}

.chatOptionButton:hover{
  background-color: rgb(26, 130, 220);
}
.hidden {
  animation-name: exit;
  animation-duration: 0.5s;
  animation-delay: 0.5s;
  animation-fill-mode: both;
  animation-direction: alternate;
}
@keyframes entry{
  0% { 
    opacity: 0;
    left: 0%;
  }
  100% { 
    opacity: 1; 
    left: 5%;
  }
}

@keyframes exit{
  0% { 
    opacity: 1;
    left: 5%;
  }
  100% { 
    opacity: 0; 
    left: 0%;
  }
}

</style>
