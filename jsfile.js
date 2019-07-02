(function() {
    /////////////////////////////////////////////////settings
    var settings = [
        {
            p1name: "Funky Chicken",
            color: "aqua"
        },
        {
            p2name: "Disco Duck",
            color: "aqua"
        }
    ];

    function rgbColors() {
        var rgbArr = [];
        for (var i = 0; i < 3; i++) {
            var r = Math.floor(Math.random() * 256);
            rgbArr.push(r);
        }
        return rgbArr;
    }

    $(".color")
        .eq(0)
        .on("mousedown", function(e) {
            e.preventDefault();
            var rgb = rgbColors();
            settings[0].color =
                "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

            $(".color")
                .eq(0)
                .css("background-color", settings[0].color);
        });

    $(".color")
        .eq(1)
        .on("mousedown", function(e) {
            e.preventDefault();
            var rgb = rgbColors();
            settings[1].color =
                "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

            $(".color")
                .eq(1)
                .css("background-color", settings[1].color);
        });

    var displayname = $(".displayname");
    var playername = $(".playername");
    playername.eq(0).on("focus", function(e) {
        $(".displayname")
            .eq(0)
            .css("visibility", "visible");
        playername.eq(0).on("input", function() {
            settings[0].p1name = playername.eq(0).val();
        });

        displayname.eq(0).on("mouseover", function() {
            displayname.eq(0).css("backgroundColor", "grey");

            displayname.eq(0).on("click", function() {
                playername.eq(0).val(displayname.eq(0).html());
                displayname.eq(0).css("visibility", "hidden");
            });
        });
    });

    playername.eq(1).on("focus", function(e) {
        $(".displayname")
            .eq(1)
            .css("visibility", "visible");
        playername.eq(1).on("input", function() {
            settings[1].p2name = playername.eq(1).val();
        });

        displayname.eq(1).on("mouseover", function() {
            displayname.eq(1).css("backgroundColor", "grey");

            displayname.eq(1).on("click", function() {
                playername.eq(1).val(displayname.eq(1).html());
                displayname.eq(1).css("visibility", "hidden");
            });
        });
    });

    $("button").on("mousedown", function() {
        if (settings[0].color == settings[1].color) {
            alert("invalid color, please pick two different colors");
        } else {
            displayname.eq(0).css("visibility", "hidden");
            displayname.eq(1).css("visibility", "hidden");
            $("#getstarted").css("visibility", "hidden");
            $("#p1name")
                .html(settings[0].p1name)
                .css({
                    textAlign: "center",
                    fontSize: "20px",
                    color: settings[0].color,
                    fontWeight: "bold"
                });
            $("#p1img").css({
                backgroundColor: settings[0].color,
                width: "160px",
                height: "160px"
            });

            $("#p2name")
                .html(settings[1].p2name)
                .css({
                    textAlign: "center",
                    fontSize: "20px",
                    color: settings[1].color,
                    fontWeight: "bold"
                });
            $("#p2img").css({
                backgroundColor: settings[1].color,
                width: "160px",
                height: "160px"
            });
            $(".roller").css("backgroundColor", settings[0].color);
            //$(".player1").css("backgroundColor", settings[0].color); //doesnt affect the newly assigned elements, pointless putting this line here
            normal1();
            normal2();
        }
    });

    //////////////////////////////////////////////////
    var currentPlayer = "player1";
    var transitioning;
    var coin = new sound("Super Mario Bros.-Coin Sound Effect.mp3");
    var win = new sound("Super Mario Bros. - Course Clear Sound Effect.mp3");
    $(".column").on("mouseover", function(e) {
        $(e.currentTarget)
            .find(".slot")
            .css("opacity", 0.8);
        $(".column").on("mouseout", function(e) {
            $(e.currentTarget)
                .find(".slot")
                .css("opacity", 1);
        });
    });

    $(".column").on("click", function colE(e) {
        //Important!Need not to specify the index here, automatically detects which element selected.
        var slots = $(e.currentTarget).find(".slot"); //get all elements in the parent
        //console.log($(e.currentTarget)); //bubbling up and refering to the element that the event listener directly attached to, i.e. .column but e.target refers to .hole or .player1/2 - element once clicked
        // console.log(slots.eq(5).children()); //unlike find(), children() gets one element of child
        var roller = $(e.currentTarget)
            .children()
            .find(".roller");
        if (transitioning == true) {
            return;
        }
        for (var i = 5; i >= 0; i--) {
            if (
                !slots
                    .eq(i)
                    .children()
                    .hasClass("player1") &&
                !slots
                    .eq(i)
                    .children()
                    .hasClass("player2")
            ) {
                break;
            }
        } //this is the reason we use div column to wrap all slots up and retrieve them by making use of their index.
        //console.log(i);
        // console.log($(".row" + i));
        if (i == -1) {
            return;
        }
        transitioning = true;
        roller.addClass("rollerON");
        $(".rollerON").css("transform", "translateY(" + 80 * (i + 1) + "px)");
        roller.on("transitionend", function() {
            coin.play();
            roller.remove();
            slots
                .eq(i)
                .children()
                .addClass(currentPlayer); //newly added class will only follow css stylesheet
            $(".player1").css("backgroundColor", settings[0].color);
            $(".player2").css("backgroundColor", settings[1].color);

            if (checkVictory(slots)) {
                return letsCelebrate();
            } else if (checkVictory($(".row" + i))) {
                //number and string are acceptable for Jquery! cool
                return letsCelebrate();
            } else if (getDiagonalClassNameAndCheck("x")) {
                return letsCelebrate();
            } else if (getDiagonalClassNameAndCheck("y")) {
                return letsCelebrate();
            } else switchPlayer();
            transitioning = false;
        });

        function getDiagonalClassNameAndCheck(n) {
            for (var k = 1; k <= 6; k++) {
                if (slots.eq(i).hasClass(n + k)) {
                    return checkVictory($("." + n + k));
                }
            }
        }

        function checkVictory(n) {
            //checking column & row victory
            var count = 0;
            var bingo = [];
            for (var j = 0; j < n.length; j++) {
                if (
                    n
                        .eq(j)
                        .children()
                        .hasClass(currentPlayer)
                ) {
                    bingo.push(n.eq(j));
                    count++;
                    if (count == 3) {
                        for (var a = 0; a < bingo.length; a++) {
                            bingo[a].children().css({
                                borderRadius: "10px",
                                width: "60px",
                                height: "60px"
                            });
                        }
                    }
                    if (count >= 4) {
                        for (var a = 0; a < bingo.length; a++) {
                            bingo[a].children().css({
                                border: "5px solid yellow",
                                borderRadius: "35px",
                                width: "70px",
                                height: "70px"
                            });
                        }
                        return true;
                        break;
                    }
                } else {
                    bingo = [];
                    count = 0;
                }
            }
        }

        function switchPlayer() {
            $(e.currentTarget)
                .find(".transition")
                .append('<div class="roller"></div>');
            if (currentPlayer == "player1") {
                currentPlayer = "player2";
                $(".roller").css("backgroundColor", settings[1].color);
            } else {
                currentPlayer = "player1";
                $(".roller").css("backgroundColor", settings[0].color);
            }
        }

        function letsCelebrate() {
            clearTimeout(clk1);
            clearTimeout(clk2);
            clearTimeout(clk3);
            clearTimeout(clk4);
            ctx1.clearRect(0, 0, 300, 300);
            ctx2.clearRect(0, 0, 300, 300);
            if (currentPlayer == "player1") {
                happy(ctx1);
                sad(ctx2);
            } else if (currentPlayer == "player2") {
                happy(ctx2);
                sad(ctx1);
            }
            $(".column").off("click", colE);
            win.play();
            console.log("WIN!");
        }
    });
})();
//////////////////////////////////////////////////////////////////sound effect
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function() {
        this.sound.play();
    };
    this.stop = function() {
        this.sound.pause();
    };
}
//////////////////////////////////////////////////Canvas-expressions
var ctx2 = document.getElementById("expressions2").getContext("2d");
var ctx1 = document.getElementById("expressions1").getContext("2d");
var clk1, clk2, clk3, clk4;

function normal1() {
    ctx1.clearRect(0, 0, 300, 100);
    ctx1.beginPath();
    ctx1.lineWidth = 5;
    ctx1.arc(130, 50, 20, 0, 2 * Math.PI);
    ctx1.stroke();
    ctx1.beginPath();
    ctx1.lineWidth = 5;
    ctx1.arc(210, 50, 20, 0, 2 * Math.PI);
    ctx1.stroke();
    ctx1.beginPath();
    ctx1.moveTo(100, 130);
    ctx1.lineTo(180, 130);
    ctx1.stroke();
    clk1 = setTimeout(blink1, 2000);
    return clk1;
}
function normal2() {
    ctx2.clearRect(0, 0, 300, 100);
    ctx2.beginPath();
    ctx2.lineWidth = 5;
    ctx2.arc(80, 50, 20, 0, 2 * Math.PI);
    ctx2.stroke();
    ctx2.beginPath();
    ctx2.lineWidth = 5;
    ctx2.arc(160, 50, 20, 0, 2 * Math.PI);
    ctx2.stroke();
    ctx2.beginPath();
    ctx2.moveTo(100, 130);
    ctx2.lineTo(180, 130);
    ctx2.stroke();
    clk2 = setTimeout(blink2, 3000);
    return clk2;
}

function blink1() {
    ctx1.clearRect(0, 0, 300, 100);
    ctx1.beginPath();
    ctx1.lineWidth = 3;
    ctx1.moveTo(110, 50); //130, 50, 20
    ctx1.lineTo(150, 50);
    ctx1.stroke();
    ctx1.beginPath();
    ctx1.lineWidth = 3;
    ctx1.moveTo(190, 50); //210, 50, 20
    ctx1.lineTo(230, 50);
    ctx1.stroke();
    clk3 = setTimeout(normal1, 200);
    return clk3;
}

function blink2() {
    ctx2.clearRect(0, 0, 300, 100);
    ctx2.beginPath();
    ctx2.lineWidth = 3;
    ctx2.moveTo(70, 50); //80, 50, 20
    ctx2.lineTo(110, 50);
    ctx2.stroke();
    ctx2.beginPath();
    ctx2.lineWidth = 3;
    ctx2.moveTo(140, 50); //160, 50, 20
    ctx2.lineTo(180, 50);
    ctx2.stroke();
    clk4 = setTimeout(normal2, 300);
    return clk4;
}

function sad(ctx) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(60, 50);
    ctx.lineTo(120, 50);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(180, 50);
    ctx.lineTo(240, 50);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(150, 220, 100, 1.35 * Math.PI, 1.65 * Math.PI);
    ctx.stroke();
}

function happy(ctx) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(70, 50);
    ctx.lineTo(120, 80);
    ctx.lineTo(70, 110);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(120, 80);
    ctx.lineTo(50, 80);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(220, 50);
    ctx.lineTo(170, 80);
    ctx.lineTo(220, 110);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(170, 80);
    ctx.lineTo(240, 80);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(120, 130);
    ctx.lineTo(150, 150);
    ctx.lineTo(170, 130);
    ctx.stroke();
}
////////////////////////////////////////////////////////////
