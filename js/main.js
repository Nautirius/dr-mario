"use strict";

const gameClockTickDuration = 1000 / 60;
const gameContainer = document.getElementById("game-container");
const gameSideField = document.getElementById("game-side-field");
const gameMainField = document.getElementById("game-main-field");
const colorArray = ["brown", "blue", "yellow"];
const gameChunkSize = "2.5vw";
const sideChunkArray = [[], [], [], [], [], [], [], [], []];
const chunkArray = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
const pillArray = [];
const virusArray = [];
const dancingClasses = [];
for (let i = 1; i < 19; i++) {
    dancingClasses.push(`v${i}`);
}
dancingClasses.unshift(dancingClasses.pop());

const backgroundArray = [
    './img/title_screen.png',
    './img/pf.png',
]
gameContainer.style.backgroundImage = `url(${backgroundArray[0]})`;
if (localStorage.getItem('highscore') == null) {
    localStorage.setItem("highscore", 0);
}

let tick = 0;
let doSpawnPill = "spawnPill";
let movingPill1 = false;
let movingPill2 = false;
let speedrun = false;
let win = 0;
let stage = 0;
let gameInterval;
let moveInterval;
let pillId = 1;
let virusNumber;
let gravityOn = false;
let checkedLines = [];
let fallingPills = [];
let playerScore = 0;
let dancingStage = 0;
let gameEnded = false;

let init = document.body.addEventListener("keydown", function (e) {
    if (e.code != "F12" && !gameInterval) {
        e.preventDefault;
        startGame();
    }
});

function startGame() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 13; j++) {
            let chunk = new Chunk(j, i, "black", "empty", "");
            sideChunkArray[i].push(chunk);
            let div = document.createElement("div");
            div.setAttribute("id", `Sx${j}y${i}`);
            div.style.left = `${(j - 1) * parseFloat(gameChunkSize.slice(0, 3))}vw`;
            div.style.top = `${(i - 1) * parseFloat(gameChunkSize.slice(0, 3))}vw`;
            gameSideField.appendChild(div);
        }
    }
    gameContainer.style.backgroundImage = `url(${backgroundArray[1]})`;
    tick = 0;
    gameMainField.innerHTML = "";
    stage += 1;
    virusNumber = 0;
    for (let i = 0; i < chunkArray.length; i++) {   // sprzątanie po poprzedniej grze
        while (chunkArray[i].length > 0)
            chunkArray[i].pop();
    }
    while (pillArray.length > 0)
        pillArray.pop();
    while (virusArray.length > 0)
        virusArray.pop();
    movingPill1 = false;
    movingPill2 = false;
    doSpawnPill = "spawnPill";
    gravityOn = false;
    checkedLines = [];
    fallingPills = [];
    pillId = 1;
    playerScore = 0;
    for (let i = 0; i < 16 + 2; i++) {
        for (let j = 0; j < 8 + 2; j++) {
            if (i == 0 || i == 17 || j == 0 || j == 9) {
                let chunk = new Chunk(j, i, "black", "border", "");
                chunkArray[i].push(chunk);
            } else {
                let chunk = new Chunk(j, i, "black", "empty", "");
                chunkArray[i].push(chunk);
                let div = document.createElement("div");
                div.setAttribute("id", `x${j}y${i}`);
                div.style.left = `${(j - 1) * parseFloat(gameChunkSize.slice(0, 3))}vw`;
                div.style.top = `${(i - 1) * parseFloat(gameChunkSize.slice(0, 3))}vw`;
                gameMainField.appendChild(div);
            }
        }
    }
    spawnVirus(3 + stage);
    document.getElementById("mario-loser").style.opacity = 0;
    document.getElementById("stage-completed").style.opacity = 0;
    document.getElementById("game-over").style.opacity = 0;
    document.getElementById("highscore").style.backgroundImage = `url("./img/cyfry/${localStorage.getItem('highscore').toString().slice(0, 1)}.png")`;
    document.getElementById("virus-counter").style.opacity = 100;
    document.getElementById("virus-counter").style.backgroundImage = `url("./img/cyfry/${virusNumber}.png")`;
    gameInterval = setInterval(gameRefresh, gameClockTickDuration);
}
function gameRefresh() {
    render(sideChunkArray, "pillAnimationField");
    render(chunkArray, "mainField");
    if (tick % 10 == 0) {
        dancingViruses();
    }
    if (doSpawnPill == "spawnPill" && !gameEnded) {
        spawnPill();
    } else if (!doSpawnPill && !gameEnded) {
        if ((tick % 40 == 0 || (speedrun && tick % 2 == 0)) && !gravityOn) {
            movingPill1.moveDown("fullPill");
        }
    }
    if (tick % 5 == 0 && gravityOn) {
        gravity();
    }
    if (tick == Number.MAX_SAFE_INTEGER) { tick = 0; }
    tick++;
}
document.body.addEventListener("keydown", function (e) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyA", "KeyD", "KeyS", "KeyW", "ShiftLeft", "ShiftRight"].includes(e.code) && !doSpawnPill && gameInterval) {
        e.preventDefault();
        if (!moveInterval) {
            if ((e.code == "ArrowLeft" || e.code == "KeyA") && !speedrun && !gravityOn) {
                movingPill1.moveLeft();
                moveInterval = setInterval(() => { movingPill1.moveLeft(); }, 150);
            } else if ((e.code == "ArrowRight" || e.code == "KeyD") && !speedrun && !gravityOn) {
                movingPill1.moveRight();
                moveInterval = setInterval(() => { movingPill1.moveRight(); }, 150);
            } else if ((e.code == "ArrowDown" || e.code == "KeyS") && !gravityOn) {
                speedrun = true;
            } else if ((e.code == "ArrowUp" || e.code == "KeyW") && !speedrun && !gravityOn) {
                movingPill1.rotateLeft();
                moveInterval = setInterval(() => { movingPill1.rotateLeft(); }, 200);
            } else if ((e.code == "ShiftLeft" || e.code == "ShiftRight") && !speedrun && !gravityOn) {
                movingPill1.rotateRight();
                moveInterval = setInterval(() => { movingPill1.rotateRight(); }, 200);
            }
        }
    }
});
document.body.addEventListener("keyup", function (e) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyA", "KeyD", "KeyS", "KeyW", "ShiftLeft", "ShiftRight"].includes(e.code)) {
        e.preventDefault();
        clearInterval(moveInterval);
        moveInterval = false;
    }
});
function endGame() {
    gameEnded = true;
    setTimeout(() => {
        if (win > stage - 1) {
            document.getElementById("stage-completed").style.opacity = "100";
        } else {
            stage = 0;
            document.getElementById("mario-loser").style.opacity = "100";
            document.getElementById("game-over").style.opacity = "100";
        }
        if (playerScore > localStorage.getItem("highscore")) {
            localStorage.setItem("highscore", playerScore);
        }
    }, 500);
    setTimeout(document.body.addEventListener("keydown", (e) => e.code != "F12" ? window.location.reload() : false), 1000);
}
function deleting(elementsToCheck) {
    checkedLines = [];
    elementsToCheck.forEach(element => { element.forEach(line => { checkedLines.push(line); }); });
    checkedLines.forEach(checkedLine => {
        if (checkedLine.length >= 4) {
            checkedLine.forEach(deletedElement => {
                if (deletedElement.content == "virus") {
                    virusNumber--;
                    playerScore += 100;
                    document.getElementById("virus-counter").style.backgroundImage = `url("./img/cyfry/${virusNumber}.png")`;
                    document.getElementById("score").style.backgroundImage = `url("./img/cyfry/${playerScore / 100}.png")`;
                }
                let dataArray = (deletedElement.content == "pill" || deletedElement.content == "deletingEffect") ? pillArray : virusArray;
                for (let i = 0; i < dataArray.length; i++) {
                    if (dataArray[i].xPos == deletedElement.xPos && dataArray[i].yPos == deletedElement.yPos) {
                        dataArray.splice(i, 1);
                        break;
                    }
                }
                let div = document.getElementById(`x${deletedElement.xPos}y${deletedElement.yPos}`);
                if (deletedElement.content != "deletingEffect") {
                    div.style.backgroundImage = `url(./img/gameField/${deletedElement.color.slice(0, 2)}_${deletedElement.content == "pill" ? "o" : "x"}.png)`;
                }
                deletedElement.content = "deletingEffect";
                deletedElement.contentId = "";
                deletedElement.color = "black";
                setTimeout(function () { (deletedElement.content != "pill") ? deletedElement.content = "empty" : false; }, 100);
            });
            movingPill1 = false;
            movingPill2 = false;
            doSpawnPill = false;
            speedrun = false;
            gravityOn = true;
        }
    });
    if (virusNumber == 0) {
        win += 1;
        endGame();
    }
}
function checkPill(pill) {
    let potentiallyDeletedX = [chunkArray[pill.yPos][pill.xPos]];   // sprawdzanie w poziomie
    let itr = 1;
    while (true) {   // w lewo
        let checkedChunk = chunkArray[pill.yPos][pill.xPos + itr];
        if (checkedChunk.color != pill.color || pill.isMoving == true) { break; }
        potentiallyDeletedX.push(checkedChunk);
        itr++;
    }
    itr = -1;
    while (true) {   // w prawo
        let checkedChunk = chunkArray[pill.yPos][pill.xPos + itr];
        if (checkedChunk.color != pill.color || pill.isMoving == true) { break; }
        potentiallyDeletedX.push(checkedChunk);
        itr--;
    }
    let potentiallyDeletedY = [chunkArray[pill.yPos][pill.xPos]];   // sprawdzanie w pionie
    itr = 1;
    while (true) {   // w dół
        let checkedChunk = chunkArray[pill.yPos + itr][pill.xPos];
        if (checkedChunk.color != pill.color || pill.isMoving == true) { break; }
        potentiallyDeletedY.push(checkedChunk);
        itr++;
    }
    itr = -1;
    while (true) {   // w górę
        let checkedChunk = chunkArray[pill.yPos + itr][pill.xPos];
        if (checkedChunk.color != pill.color || pill.isMoving == true) { break; }
        potentiallyDeletedY.push(checkedChunk);
        itr--;
    }
    return [potentiallyDeletedX, potentiallyDeletedY];
}
function gravity() {
    fallingPills = [];
    let helpArray = [];
    pillArray.forEach(pill => {
        helpArray.push(pill);
    });
    for (let y = chunkArray.length - 2; y > 0; y--) {
        for (let x = 1; x < chunkArray[0].length - 1; x++) {
            let checkedPill;
            if (chunkArray[y][x].content == "pill") {
                checkedPill = helpArray.filter(pill => pill.id == chunkArray[y][x].contentId);
                if (fallingPills.find(double => { return double[0].id == checkedPill[0].id }) != undefined) { continue; } // sprawdza powtórkę
                let isPillFalling = true;
                let fallingPillBelow = false;
                if (checkedPill.length == 1) { checkedPill[0].connected = "dot"; }
                checkedPill.forEach(pill => {
                    for (let i = 0; i < fallingPills.length; i++) {
                        if (fallingPills[i].find(pillBelow => { return pillBelow.yPos == pill.yPos + 1 && pillBelow.xPos == pill.xPos }) != undefined) {
                            fallingPillBelow = true;
                            break;
                        }
                    }
                    if (["pill", "border", "virus"].includes(chunkArray[pill.yPos + 1][pill.xPos].content)
                        && !(fallingPillBelow) // tabletka pod spodem spada
                        && !(chunkArray[pill.yPos + 1][pill.xPos].contentId == pill.id)
                    ) {
                        isPillFalling = false;
                        pill.isMoving = false;
                    } else {
                        pill.isMoving = true;
                    }
                });
                if (isPillFalling) {
                    fallingPills.push(checkedPill);
                } else {
                    let pillsToCheck = [];
                    checkedPill.forEach(particle => {
                        pillsToCheck.push(checkPill(particle));
                    });
                    deleting(pillsToCheck);
                }
            }
        }
    }
    if (fallingPills.length == 0) {
        gravityOn = false;
        doSpawnPill = "spawnPill";
    } else {
        fallingPills.forEach(pill => {
            pill.forEach(particle => {
                particle.moveDown("pillParticle");
            });
        });
    }
}
function render(array, mode) {
    array.forEach(row => {
        row.forEach(chunk => {
            if (mode == "mainField") {
                if (chunk.content == "pill" || chunk.content == "virus") {
                    let dataArray = (chunk.content == "pill") ? pillArray : virusArray;
                    for (let i = 0; i < dataArray.length; i++) {
                        if (dataArray[i].xPos == chunk.xPos && dataArray[i].yPos == chunk.yPos) {
                            let div = document.getElementById(`x${chunk.xPos}y${chunk.yPos}`);
                            if (chunk.content == "pill") {
                                div.style.backgroundImage = `url(./img/gameField/${chunk.color.slice(0, 2)}_${dataArray[i].connected}.png)`;
                            } else {
                                div.style.backgroundImage = `url(./img/gameField/covid_${dataArray[i].color}.png)`;
                            }
                            break;
                        } else if (i == dataArray.length - 1) {
                            chunk.content = "empty";
                            chunk.contentId = "";
                        }
                    }
                } else if (chunk.content == "empty") {
                    document.getElementById(`x${chunk.xPos}y${chunk.yPos}`).style.background = "black";
                }
            } else if (mode == "pillAnimationField") {
                if (chunk.content == "pill" || chunk.content == "virus") {
                    let dataArray = (chunk.content == "pill") ? pillArray : virusArray;
                    for (let i = 0; i < dataArray.length; i++) {
                        if (dataArray[i].xPos == chunk.xPos && dataArray[i].yPos == chunk.yPos) {
                            let div = document.getElementById(`Sx${chunk.xPos}y${chunk.yPos}`);
                            if (chunk.content == "pill") {
                                div.style.backgroundImage = `url(./img/gameField/${chunk.color.slice(0, 2)}_${dataArray[i].connected}.png)`;
                            } else {
                                div.style.backgroundImage = `url(./img/gameField/covid_${dataArray[i].color}.png)`;
                            }
                            break;
                        }
                    }
                } else if (chunk.content == "empty") {
                    let div = document.getElementById(`Sx${chunk.xPos}y${chunk.yPos}`);
                    div.style.background = "rgba(0,0,0,0)";
                    div.innerText = "";
                }
            }
        });
    });
}
function dancingViruses() {
    if (!gameEnded) {
        if (dancingStage == 0) {
            colorArray.forEach(color => {
                let div = document.getElementById(`${color}-virus-div`);
                div.style.backgroundImage = `url(./img/lupa/${color.slice(0, 2)}/2.png`;
            });
        }
        if (dancingStage == 1) {
            let classIndex = 1;
            colorArray.forEach(color => {
                let div = document.getElementById(`${color}-virus-div`);
                div.classList.remove(dancingClasses[classIndex - 1]);
                div.classList.add(dancingClasses[classIndex]);
                classIndex += 6;
            });
            dancingClasses.push(dancingClasses.shift());
        }
        if (dancingStage == 2) {
            colorArray.forEach(color => {
                let div = document.getElementById(`${color}-virus-div`);
                div.style.backgroundImage = `url(./img/lupa/${color.slice(0, 2)}/1.png`;
            });
        }
        if (dancingStage == 3) {
            colorArray.forEach(color => {
                let div = document.getElementById(`${color}-virus-div`);
                div.style.backgroundImage = `url(./img/lupa/${color.slice(0, 2)}/3.png`;
            });
        }
    } else {
        if (virusNumber != 0) {
            colorArray.forEach(color => {
                let div = document.getElementById(`${color}-virus-div`);
                div.style.backgroundImage = `url(./img/lupa/${color.slice(0, 2)}/${([0, 1].includes(dancingStage)) ? "4" : "2"}.png`;
            });
        }
    }
    (dancingStage < 4) ? dancingStage++ : dancingStage = 0;
}