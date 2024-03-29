
var game = {
    score: 0,
    totalScore: 0,
    totalClicks: 0,
    clickValue: 1,
    version: 0.000,

    addToScore: function(amount) {
        
        this.score += amount;
        this.totalScore += amount;
        display.updateScore();
    },

    getScorePerSecond: function() {
        var scorepersecond = 0;
        for (i = 0; i < building.name.length; i++) {
            scorepersecond += building.income[i] * building.count[i];
        }
        return scorepersecond;
    }
};

var building = {
    name: [
        "Cursor",
        "Controller",
        "Disc",
        "Vr"
    ],
    image: [
        "cursor.png",
        "controller.png",
        "cd.png",
        "vr.png"
    ],
    count: [0, 0, 0, 0],
    income: [
        1,
        15,
        155,
        1555
    ],
    cost: [
        100,
        1000,
        10000,
        100000
    ],

    purchase: function(index) {
        if (game.score >= this.cost[index]) {
            game.score -= this.cost[index];
            this.count[index]++;
            this.cost[index] = Math.ceil(this.cost[index] * 1.10);
            display.updateScore();
            display.updateShop();
            display.updateUpgrades();
        }
    }
};

var upgrade = {
    name: [
        "Stone Fingers",
        "Iron Fingers",
        "Stone Clicker"
    ],
    description: [
        "Cursors are twice as efficent",
        "Cursors are twice as efficent",
        "The mouse is twice as efficient"
    ],
    image: [
        "cursor.png",
        "cursor.png",
        "cursor.png"
    ],
    type: [
        "building",
        "building",
        "click"
    ],
    cost: [
        300,
        500,
        300
    ],
    buildingIndex: [
        0,
        0,
        -1,
    ],
    requirement: [
        1,
        5,
        1
    ],
    bonus: [
        2,
        2,
        2
    ],
    purchased: [false, false, false],

    purchase: function(index) {
        if (!this.purchased[index] && game.score >= this.cost[index]) {
            if (this.type[index] == "building" && building.count[this.buildingIndex[index]] >= this.requirement[index]) {
                game.score -= this.cost[index];
                building.income[this.buildingIndex[index]] *= this.bonus[index];
                this.purchased[index] = true;

                display.updateUpgrades();
                display.updateScore();
            } else if (this.type[index] == "click" && game.totalClicks >= this.requirement[index]) {
                game.score -= this.cost[index];
                game.clickValue *= this.bonus[index];
                this.purchased[index] = true;

                display.updateUpgrades();
                display.updateScore();
            }
        }
    }
};

var achievement = {
    name: [
        "Stone Fingers",
        "A Humble Start",
        "Fingertastic"
    ],
    description: [
        "Buy 1 cursor",
        "Gather 1 PS4",
        "Click the PS4 1 time"
    ],
    image: [
        "cursor.png",
        "ps4.png",
        "cursor.png"
    ],
    type: [
        "building",
        "score",
        "click"
    ],
    requirement: [
        1,
        1,
        1
    ],
    objectIndex: [
        0,
        -1,
        -1
    ],

    awarded: [false, false, false],

    earn: function(index) {
        this.awarded[index] = true;
    }
}

var display = {
    updateScore: function() {
        document.getElementById("score").innerHTML= game.score;
        document.getElementById("scorepersecond").innerHTML= game.getScorePerSecond();
        document.title = game.score + " PS4 - PS4 Clicker";
    },

    updateShop: function() {
        document.getElementById("shopContainer").innerHTML = "";
        for (i = 0; i < building.name.length; i++) {
            document.getElementById("shopContainer").innerHTML += '<table class="shopButton unselectable" onclick="building.purchase('+i+')"><tr><td id="image"><img src=kuvat/'+building.image[i]+'></td><td id="nameAndCost"><p>'+building.name[i]+'</p><p><span>'+building.cost[i]+'</span> PS4 </p></td><td id="amount"><span>'+building.count[i]+'</span>  </td></tr></table>';
        }
    },

    updateUpgrades: function() {
        document.getElementById("upgradeContainer").innerHTML = "";
        for (i = 0; i < upgrade.name.length; i++) {
            if (!upgrade.purchased[i]) {
                if (upgrade.type[i] == "building" && building.count[upgrade.buildingIndex[i]] >= upgrade.requirement[i]) {
                    // document.getElementById("upgradeContainer").innerHTML += '<img src="kuvat/' + upgrade.image[i] + '" title="'+upgrade.name[i]+' &#10'; '+upgrade.description[i]+' &#10; '+upgrade.cost[i]' PS4) " onclick="upgrade.purchase('+i+')">';
                    document.getElementById("upgradeContainer").innerHTML += `<img src="kuvat/${upgrade.image[i]}" title="${upgrade.name[i]}&#10'; ${upgrade.description[i]}' &#10; ${upgrade.cost[i]} PS4) " onclick="upgrade.purchase(${i})">`;
                } else if (upgrade.type[i] == "click" && game.totalClicks >= upgrade.requirement[i]) {
                    document.getElementById("upgradeContainer").innerHTML += `<img src="kuvat/${upgrade.image[i]}" title="${upgrade.name[i]}&#10'; ${upgrade.description[i]}' &#10; ${upgrade.cost[i]} PS4) " onclick="upgrade.purchase(${i})">`;
                }
            }
        }
    },

    updateAchievements: function() {
    document.getElementById("achievementContainer").innerHTML = "";
    for (i = 0; i < achievement.name.length; i++) {
        if (achievement.awarded[i]) {
            document.getElementById("achievementContainer").innerHTML += `<img src="kuvat/${achievement.image[i]}" title="${achievement.name[i]}&#10'; ${achievement.description[i]}'">`;
         }
        }
    }
};

function saveGame() {
    var gameSave = {
        score: game.score,
        totalScore: game.totalScore,
        totalClicks: game.totalClicks,
        clickValue: game.clickValue,
        version: game.version,
        buildingCount: building.count,
        buildingIncome: building.income,
        buildingCost: building.cost,
        upgradePurchased: upgrade.purchased,
        achievementAwarded: achievement.awarded
    };
    localStorage.setItem("gameSave", JSON.stringify(gameSave));
}

function loadGame() {
    var savedGame = JSON.parse(localStorage.getItem("gameSave"));
    if (localStorage.getItem("gameSave") !==null) {
        if (typeof savedGame.score !== "undefined") game.score = savedGame.score;
        if (typeof savedGame.totalScore !== "undefined") game.totalScore = savedGame.totalScore;
        if (typeof savedGame.totalClicks !== "undefined") game.totalClicks = savedGame.totalClicks;
        if (typeof savedGame.clickValue !== "undefined") game.clickValue = savedGame.clickValue;
        if (typeof savedGame.buildingCount !== "undefined") {
            for (i = 0; i < savedGame.buildingCount.length; i++) {
                building.count[i] = savedGame.buildingCount[i];
            }
        }

        if (typeof savedGame.buildingIncome !== "undefined") {
            for (i = 0; i < savedGame.buildingIncome.length; i++) {
                building.income[i] = savedGame.buildingIncome[i];
            }
        }
        if (typeof savedGame.buildingCost !== "undefined") {
            for (i = 0; i < savedGame.buildingCost.length; i++) {
                building.cost[i] = savedGame.buildingCost[i];
            }
        }
        if (typeof savedGame.upgradePurchased !== "undefined") {
            for (i = 0; i < savedGame.upgradePurchased.length; i++) {
                upgrade.purchased[i] = savedGame.upgradePurchased[i];
            }
        }
        if (typeof savedGame.achievementAwarded !== "undefined") {
            for (i = 0; i < savedGame.achievementAwarded.length; i++) {
                achievement.awarded[i] = savedGame.achievementAwarded[i];
            }
        }
    }
}

function resetGame() {
        if (confirm("Are you sure you want reset your game?")) {
            var gameSave = {};
            localStorage.setItem("gameSave", JSON.stringify(gameSave));
            location.reload();
        }
    }

    function fadeOut(element, duration, finalOpacity, callback) {
        let opacity = 1;

        let elementFadingInterval = window.setInterval(function() {
            opacity -= 50 / duration;

            if (opacity <= finalOpacity) {
                clearInterval(elementFadingInterval);

                callback();
            }

            element.style.opacity = opacity;
        }, 50);
    }

    function createNumberOnClicker(event) {
        let clicker = document.getElementById("clicker");

        let clickerOffset = clicker.getBoundingClientRect();
        let position = {
            x: event.pageX - clickerOffset.left,
            y: event.pageY - clickerOffset.top
        };

        let element = document.createElement("div");
        element.textContent = "+" + game.clickValue;
        element.classList.add("number", "unselectable");
        element.style.left = position.x + "px";
        element.style.top = position.y + "px";
        
        clicker.appendChild(element);

        let movementInterval = window.setInterval(function() {
            if (typeof element == "undefined" && element == null) clearInterval(movementInterval);

            position.y--;
            element.style.top = position.y + "px";
        }, 10);

        fadeOut(element, 3000, 0.5, function() {
            element.remove();
        });

    }

document.getElementById("clicker").addEventListener("click", function(event) {
    game.totalClicks++;
    game.addToScore(game.clickValue);

    createNumberOnClicker(event);
}, false); 

window.onload = function(){
    loadGame();
    display.updateScore();
    display.updateUpgrades();
    display.updateAchievements();
    display.updateShop();
};

    setInterval(function() {
        for (i = 0; i < achievement.name.length; i++) {
            if (achievement.type[i] == "score" && game.totalScore >= achievement.requirement[i]) achievement.earn(i);
            else if (achievement.type[i] == "click" && game.totalClicks >= achievement.requirement[i]) achievement.earn(i);
            else if (achievement.type[i] == "building" && building.count[achievement.objectIndex[i]] >= achievement.requirement[i]) achievement.earn(i);
        }

        game.score += game.getScorePerSecond();
        game.totalScore += game.getScorePerSecond();
        display.updateScore();
        display.updateAchievements();
    }, 1000); // 1000ms = 1 sec :0)

    setInterval(function() {
        display.updateScore();
        display.updateUpgrades();

    }, 1000);

    setInterval (function() {
        saveGame();
    }, 30000); // 30000 = 30sec >:)

    document.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.which == 83) {   // ctrl + s
            event.preventDefault();
            saveGame();
        }
    }, false);
