import { createApp } from 'vue'
import Chat from './Chat.vue'
import Library from './components/Library.vue'
import Notifications from './Notifications.vue'

localStorage.clear()

// let result = prompt("Enter Username ")
localStorage.setItem('admin', "samer")
localStorage.setItem('name', "samer")


while( localStorage.getItem('name') === "null" || localStorage.getItem('name') === "" ){
    let result = prompt("Please Enter Username ")
    localStorage.setItem('name', result)
}



createApp(Chat).mount('#chat');
createApp(Notifications).mount('#notifications');
createApp(Library).mount('#library');
