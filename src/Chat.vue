<template>
  <div class="chatOptions">
    <div class="chatOptionButton" id="textCh" @click="openChannelSelection">
      <i class="fa-brands fa-rocketchat"></i>
    </div>
    <div class="chatOptionButton" id="voiceCh" @click="openVoiceChat">
      <i class="fa-solid fa-microphone"></i>
    </div>
  </div>

  <div class="textChatCanvas" v-show="this.textChatSwitch">
    <Messages :messages="messages"/>
    <TextInput @submitText="submitText" :noOfMessages="messages.length" />

  </div>
  
  <div class="voiceChatCanvas" v-show="this.voiceChatSwitch">

  </div>

<div id="channelsLayout">

    <div id="channelSelectionLayout">
      <label for="channelSelection">Channels</label>
      <br>
      <select @change="changeChannel" name="" id="channelSelection" >
        <option :value="channel" v-for="(channel,index) in channels" :key="index">{{ channel }}</option>
      </select>
      <button @click="enterChannel(); closeChannelSelection();">Go to Channel</button>
    </div>

    <div id="newChannelLayout">      
      <label for="channelTextInput">New Channel Name</label>
      <br>
      <input type="text" v-model="newChannel" id="channelTextInput">
      <br>
      <button @click="createChannel();">Create Channel</button>
    </div>

    <div id="privateChatLayout">      
      <label for="privateChatInput">Private Chat</label>
      <br>
      <input type="text" v-model="privateChat" id="privateChatInput">
      <br>
      <button @click="openPrivateChat">Open Chat</button>
    </div>
  </div>

  
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
      textChatSwitch: false,
      voiceChatSwitch: false,
      currentChannel: "",
      newChannel: "",
      privateChat: ""
    }
  },
  async created(){
    this.fetchData()
    // setInterval(() => this.fetchData(), 5000)
    this.channels = await this.fetchChannels()
  },
  methods:{
    // Create and channel and send it to Firebase
    async createChannel(){

      if( this.newChannel ) {
        
        this.channels = [ ...this.channels,  this.newChannel]

        this.newChannel = ""
      }

    },
    // Getting channels from firebase
    async fetchChannels() {
      
      // const jsonFile = await fetch(`https://studiando-a6bec-default-rtdb.firebaseio.com/chats.json`)
      const jsonFile = await fetch(`https://textchat-159f4-default-rtdb.firebaseio.com/chats/channels.json`)
      
      let channels = await jsonFile.json();
      
      let channelNames = []
      for( let name in channels )
        channelNames[ channelNames.length ] = name
        console.log(channelNames)

      return channelNames
    },
    // Sending new messages to Database
    async submitText(newMessage){

      if( this.privateChat ) {  
        // const newMess =  await fetch(`https://studiando-a6bec-default-rtdb.firebaseio.com/chats/${this.currentChannel}.json`, {
        const newMess =  await fetch(`https://textchat-159f4-default-rtdb.firebaseio.com/chats/private/${this.privateChat}.json`, {
              method: "post",
              referrer: this.messages.length,
              headers: {
                'Content-type': "application/json; charset=UTF-8"
              },
              body: JSON.stringify(newMessage),

          })
      } else {  
        // const newMess =  await fetch(`https://studiando-a6bec-default-rtdb.firebaseio.com/chats/${this.currentChannel}.json`, {
        const newMess =  await fetch(`https://textchat-159f4-default-rtdb.firebaseio.com/chats/channels/${this.currentChannel}.json`, {
              method: "post",
              referrer: this.messages.length,
              headers: {
                'Content-type': "application/json; charset=UTF-8"
              },
              body: [JSON.stringify(newMessage)],

          })
      }
      this.messages = [ ...this.messages,  newMessage]
    },
    // Getting Messages from firebase Database
    async fetchData(){
      let chat;
      if( this.privateChat ) {  
        // const newMess =  await fetch(`https://studiando-a6bec-default-rtdb.firebaseio.com/chats/${this.currentChannel}.json`, {
        const jsonFile =  await fetch(`https://textchat-159f4-default-rtdb.firebaseio.com/chats/private/${this.privateChat}.json`)
        chat = await jsonFile.json();
      } else {  
        // const newMess =  await fetch(`https://studiando-a6bec-default-rtdb.firebaseio.com/chats/${this.currentChannel}.json`, {
        const jsonFile =  await fetch(`https://textchat-159f4-default-rtdb.firebaseio.com/chats/channels/${this.currentChannel}.json`)
        chat = await jsonFile.json();
      }
      console.log(chat)
      let arrayChat = []

      for( let message in chat )
        arrayChat[chat[message]['index']-1] = chat[message]

      this.messages = arrayChat
      // return arrayChat
    },
    async fetchPrivateChats(selectedUser, onlineUser) {

      // const jsonFile = await fetch(`https://studiando-a6bec-default-rtdb.firebaseio.com/chats/private.json`)
      const jsonFile1 = await fetch(`https://textchat-159f4-default-rtdb.firebaseio.com/chats/private.json`)
      
      let channels = await jsonFile1.json();
      
      let chatName = ""

      for( let name in channels )
        if( name.includes(selectedUser) && name.includes(onlineUser) )
          chatName = name

      if( chatName ){ 

        this.privateChat = chatName
        const jsonFile2 = await fetch(`https://textchat-159f4-default-rtdb.firebaseio.com/chats/private/${chatName}.json`)      
        this.messages = await jsonFile2.json();

      } else {
        
        this.privateChat = `${selectedUser}_${onlineUser}`
        // const jsonFile2 = await fetch(`https://textchat-159f4-default-rtdb.firebaseio.com/chats/private/${this.privateChat}.json`)      
        this.messages = [];

      }

    },
    openTextChat() {
        this.textChatSwitch = true;
        this.voiceChatSwitch = false;
    },
    openVoiceChat() {
        this.textChatSwitch = false;
        this.voiceChatSwitch = true;
        document.getElementById('textCh').style.backgroundColor="rgba(98, 140, 180, 0.34)";
        document.getElementById('voiceCh').style.backgroundColor="rgb(26, 130, 220)";
        const channelsLayout = document.getElementById("channelsLayout")
        channelsLayout.style.display = "none"
    },
    changeChannel() {
        const channelDropdown = document.getElementById('channelSelection')
        const selectedChannel = channelDropdown.value;
        this.currentChannel = selectedChannel

        this.closeChannelSelection
        clearInterval(this.fetchData)
        this.fetchData()
        setInterval(() => this.fetchData(), 5000)
    },
    async openPrivateChat() {

      let selectedUser = this.privateChat
      let onlineUser = localStorage.getItem('name');

      this.fetchPrivateChats(selectedUser, onlineUser)

      this.closeChannelSelection()
      clearInterval(this.fetchData)
      this.fetchData()
      setInterval(() => this.fetchData(), 5000)
    },
    closeChannelSelection() {
      const channelsLayout = document.getElementById("channelsLayout")
      channelsLayout.style.display = "none"
      this.openTextChat()
    },
    openChannelSelection() {
      if( !this.textChatSwitch ) {        
        const channelsLayout = document.getElementById("channelsLayout")
        channelsLayout.style.display = "block"
      }
      document.getElementById('textCh').style.backgroundColor="rgb(26, 130, 220)";
      document.getElementById('voiceCh').style.backgroundColor="rgba(98, 140, 180, 0.34)";
    },
    enterChannel() {
      
      const channelDropdown = document.getElementById('channelSelection')
      const selectedChannel = channelDropdown.value;
      
      if( selectedChannel != this.currentChannel || this.privateChat ) {
        this.privateChat = ""  
        const channelDropdown = document.getElementById('channelSelection')
        const selectedChannel = channelDropdown.value;
        this.currentChannel = selectedChannel
        this.openTextChat()
      }
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

#channelsLayout {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

#channelsLayout *{
  margin: 2% 0;
}

#textInputLayout {
  position: absolute;
  bottom: 0;
  left: 0;
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
  height: 114%;
  margin: 0%;
}

.voiceChatCanvas{
  height: 50%;
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
