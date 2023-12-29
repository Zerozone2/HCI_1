<template>
    
</template>

<script>

export default {
    name: "VoiceChat",
    data() {
        return {
            currentRoom: []
        }
    },
    methods: {
        //  Getting all information of a specific room from firebase
        async fetchRoom() {
            const jsonFile = await fetch(`https://studiando-a6bec-default-rtdb.firebaseio.com/rooms/room1.json`)
            
            let room = await jsonFile.json();
            
            let users = []
            
            for( let code in room )
                users[ room[code]['index']-1] = chat[code]

            return users
        },
        // Sending user information to the firebase
        async sendInformation(newUser) {
            const newUser =  await fetch(`https://textchat-159f4-default-rtdb.firebaseio.com/rooms/room1.json`, {
                method: "post",
                headers: {
                'Content-type': "application/json; charset=UTF-8"
                },
                body: JSON.stringify(newUser),
            })
            
            this.users = [ ...this.users,  newUser]

        }
    }
}

</script>

<style>

</style>