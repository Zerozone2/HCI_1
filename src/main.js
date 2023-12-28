import { createApp } from 'vue'
import Chat from './Chat.vue'
import Library from './components/Library.vue'

localStorage.clear()

// let result = prompt("Enter Username ")
localStorage.setItem('name', "ali")

while( localStorage.getItem('name') === "null" || localStorage.getItem('name') === "" ){
    let result = prompt("Please Enter Username ")
    localStorage.setItem('name', result)
}

createApp(Chat).mount('#chat');
createApp(Library).mount('#library');
