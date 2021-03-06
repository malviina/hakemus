var textData = [["otsikko","Yle Plus-desk - Koodaava toimittaja%1300 Työhakemus"],
                
                ["nimike", "Malviina Hallamaa%0100 ***-*******%0150 malviina.hallamaa@gmail.com%0400 "],
                
                ["kotisivu", "malviinahallamaa.net"],
                
                ["tekstikenttä", "Olen 30-vuotias helsinkiläinen journalismin opiskelija.#800 Koodaaminen on kuitenkin intohimoni. #800 Olen viime vuodet tehnyt töitä sen eteen,#100 että voisin yhdistää journalismin ja koodauksen.#800 Miksi?#800 Koska koodaminen on parasta ikinä!#800 Ja tiedon välittäminen.#600 Ja tarinankerronta.#999 Ja tietenkin myös uuden oppiminen."]];

var cursor = ["cursor1", "cursor2", "cursor3", "cursor4"];

var delays = [1800, 0, 1800, 0];


var printing = false;
var done = true;
var k = 0;
var init = false;



window.addEventListener("scroll", function() {initPrint()}, {once: true});


var trigger0_fade = new Waypoint({
    element: document.getElementById("trigger0"),
    handler: function(direction) {
        document.getElementById("header").classList.toggle("fade"),
        document.getElementById("first-section").classList.toggle("fade"),
        document.getElementById("bouncer").classList.toggle("fade")
        document.getElementById("whole").classList.toggle("blackBG");
    },
    offset: "80%"
});


var i = 0;

var audio = document.getElementById("type-sound");


// Typing the text

function delay(delay) {
    setTimeout(function(){startPrint(text, id)},delay);
}


function initPrint() {
    var teksti = textData[k];
    i = 0;
    
    k++;
    if (k > textData.length) {
        k = textData.length;
        return;
    };
    
    
    print(teksti[1], teksti[0]);
    
}


function print(text, id) {
    done = false;
    printing = true;
    if (printing) {
        playAudio(audio);
    };
    
    if (text.charAt(i) == "#") {
        audio.pause();
        var timeStamp = "";
        i++;
        for (j=0; j < 3; j++) {
            timeStamp += text.charAt(i);
            i++;
        }
        var time = parseInt(timeStamp);
        setTimeout(function() {
            print(text, id);
        }, time);
        
    } else if (text.charAt(i) == "%") {
        
        audio.pause();
        var elem = document.getElementById(id);
        var timeStamp = "";
        i++;
        for (j=0; j < 4; j++) {
            console.log(text.charAt(i));
            timeStamp += text.charAt(i);
            i++;
        }
        var time = parseInt(timeStamp);
        elem.innerHTML = elem.innerHTML + "<br>";
        setTimeout(function() {
            i++;
            print(text, id);
        }, time);
        
    } else {
        
        setTimeout(function () {
            if (i < text.length) {
                writeText(text, i, id);
                i++;
                if (i < text.length) {
                    print(text, id);
                } else {
                    printing = false;
                    audio.pause();
                }
            };
            if (i == text.length) {
                if (k == textData.length) {
                    document.getElementById("first-section").classList.remove("invisible");
                    setTimeout(function () {document.getElementById("bouncer").classList.toggle("fade");}, 700);
                };
                done = true;
                if (k < textData.length) {
                    document.getElementById(cursor[k-1]).classList.toggle("invisible");
                    document.getElementById(cursor[k]).classList.toggle("invisible");
                    };
                var time = delays[k-1];
                setTimeout(function () {
                    initPrint();
                }, time);
            }
        }, 50);
       
        }
    }



function playAudio(audio) {
    audio.play();
    audio.addEventListener('ended', function () {
        alert("ended");
        alert(audio.loop);
        audio.currentTime = 0;
        audio.play();
    });
}

function writeText(text, i, id) {
    var char = text.charAt(i);
    var elmnt = document.getElementById(id);
    elmnt.innerHTML =  elmnt.innerHTML + char;
}
