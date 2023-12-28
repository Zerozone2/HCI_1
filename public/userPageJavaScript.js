const App = Vue.createApp({
    data(){
        return{
            chatSwitch: false,
            featuresSwitch: false,
            optionsSwitch: false,
            notsSwitch: false,
            librarySwitch: false,
            notes:"",
            hr: 0,
            min: 0,
            sec: 0,
            clock: String(this.hr + " : " + this.min + " : " + this.sec),
            theme: "night",
            
        }
    },
    
    methods:{
        switchChat(){
            if (this.chatSwitch){ 
                this.chatSwitch = false;
                document.getElementById('ch1').style.backgroundColor="aliceblue";
            }
            else {
                this.chatSwitch = true;
                document.getElementById('ch1').style.backgroundColor="aqua";
            }
        },
        switchFeatures(){
            if (this.featuresSwitch) this.featuresSwitch = false;
            else this.featuresSwitch = true;
        },
        switchOptions(){
            if(this.optionsSwitch) this.optionsSwitch = false;
            else this.optionsSwitch = true;
        },
        switchLibrary(){
            if(this.librarySwitch) this.librarySwitch = false;
            else this.librarySwitch = true;
        },
        switchNotes(){
            if(this.notsSwitch) this.notsSwitch = false;
            else this.notsSwitch = true;
        },
        addNote(){
            var data = document.getElementById('noteText').value;
            this.notes+='\n';
            this.notes+= data;

            document.getElementById('noteText').value = null;
        },
        clearNotes(){
            this.notes = "";
        },

        timer(){
            
        },

        ticking(hr, min, sec){
            while(hr==0 && min==0 && sec==0){
                while(sec > 0){
                    setTimeout(function() {
                        --sec;
                    }, 1000);
                }
                if (min > 0) {
                    --min;
                    sec = 59;
                }
                if (hr > 0) {
                    --hr;
                    min = 59;
                    sec = 59;
                }
            }
            var beepsound = new Audio(   
                'https://www.soundjay.com/button/sounds/beep-01a.mp3');   
            beepsound.play();   
        },
        changeTheme(){
            if (this.theme === "day"){
                this.theme = "night";
                document.querySelector("body").classList.replace("bg-light", "bg-dark");
                document.querySelector("#themeButton").classList.replace("fa-moon", "fa-sun");
            }
            else {
                this.theme = "day";
                document.querySelector("body").classList.replace("bg-dark", "bg-light");
                document.querySelector("#themeButton").classList.replace("fa-sun", "fa-moon");
            }
        },
        
    }
});

App.mount('body');