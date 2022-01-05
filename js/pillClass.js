"use strict";

let pillOrientation = "left";
let checkChunk1;
let checkChunk2;
let pillPreviewColor;

class Pill {
    constructor(id, xPos, yPos, color, isMoving, connected) {
        this.id = id;
        this.xPos = xPos;
        this.yPos = yPos;
        this.color = color;
        this.isMoving = isMoving;
        this.connected = connected;
    }
    moveDown(how) {
        if (how == "fullPill") {
            if (pillOrientation == "left" || pillOrientation == "right") {  // tabletka poziomo
                checkChunk1 = chunkArray[movingPill1.yPos + 1][movingPill1.xPos];
                checkChunk2 = chunkArray[movingPill2.yPos + 1][movingPill2.xPos];
                if ((checkChunk1.content == "empty" || checkChunk1.content == "deletingEffect") && (checkChunk2.content == "empty" || checkChunk2.content == "deletingEffect")) {
                    movingPill1.movePill(0, 1, 0, 1, chunkArray);
                } else {
                    movingPill1.isMoving = false;
                    movingPill2.isMoving = false;
                    deleting([checkPill(movingPill1), checkPill(movingPill2)]);
                    if (!gravityOn) {
                        doSpawnPill = "spawnPill";
                    }
                }
            } else {    // tabletka pionowo
                checkChunk1 = (pillOrientation == "top") ? chunkArray[movingPill2.yPos + 1][movingPill2.xPos] : chunkArray[movingPill1.yPos + 1][movingPill1.xPos];
                if (checkChunk1.content == "empty" || checkChunk1.content == "deletingEffect") {
                    movingPill1.movePill(0, 1, 0, 1, chunkArray);
                } else {
                    movingPill1.isMoving = false;
                    movingPill2.isMoving = false;
                    deleting([checkPill(movingPill1), checkPill(movingPill2)]);
                    if (!gravityOn) {
                        doSpawnPill = "spawnPill";
                    }
                }
            }
        } else if (how == "pillParticle") {
            chunkArray[this.yPos][this.xPos].content = "empty";
            chunkArray[this.yPos][this.xPos].contentId = "";
            chunkArray[this.yPos][this.xPos].color = "black";
            this.yPos++;
            chunkArray[this.yPos][this.xPos].content = "pill";
            chunkArray[this.yPos][this.xPos].contentId = this.id
            chunkArray[this.yPos][this.xPos].color = this.color;
        }
    }
    moveLeft() {
        if (pillOrientation == "left" || pillOrientation == "right") {
            checkChunk1 = (pillOrientation == "left") ? chunkArray[movingPill1.yPos][movingPill1.xPos - 1] : chunkArray[movingPill2.yPos][movingPill2.xPos - 1];
            if (checkChunk1.content == "empty") {
                movingPill1.movePill(-1, 0, -1, 0, chunkArray);
            }
        } else {    //tabletka pionowo
            checkChunk1 = chunkArray[movingPill1.yPos][movingPill1.xPos - 1];
            checkChunk2 = chunkArray[movingPill2.yPos][movingPill2.xPos - 1];
            if (checkChunk1.content == "empty" && checkChunk2.content == "empty") {
                movingPill1.movePill(-1, 0, -1, 0, chunkArray);
            }
        }
    }
    moveRight() {
        if (pillOrientation == "left" || pillOrientation == "right") {
            checkChunk1 = (pillOrientation == "right") ? chunkArray[movingPill1.yPos][movingPill1.xPos + 1] : chunkArray[movingPill2.yPos][movingPill2.xPos + 1];
            if (checkChunk1.content == "empty") {
                movingPill2.movePill(1, 0, 1, 0, chunkArray);
            }
        } else {    //tabletka pionowo
            checkChunk1 = chunkArray[movingPill1.yPos][movingPill1.xPos + 1];
            checkChunk2 = chunkArray[movingPill2.yPos][movingPill2.xPos + 1];
            if (checkChunk1.content == "empty" && checkChunk2.content == "empty") {
                movingPill1.movePill(1, 0, 1, 0, chunkArray);
            }
        }
    }
    rotateLeft() {
        if (pillOrientation == "left" && chunkArray[movingPill1.yPos - 1][movingPill1.xPos].content == "empty") {    // prawy idzie do góry
            movingPill1.movePill(0, 0, -1, -1, chunkArray);
            pillOrientation = "bottom";
            movingPill1.connected = "bottom";
            movingPill2.connected = "top";
        }
        else if (pillOrientation == "bottom" && ["empty", "border"].includes(chunkArray[movingPill1.yPos][movingPill1.xPos + 1].content)) {
            if (chunkArray[movingPill1.yPos][movingPill1.xPos + 1].content == "empty") {
                movingPill1.movePill(1, 0, 0, 1, chunkArray); pillOrientation = "right";
            } else if (chunkArray[movingPill1.yPos][movingPill1.xPos - 1].content == "empty") {
                movingPill1.movePill(0, 0, -1, 1, chunkArray); pillOrientation = "right";
            }
            if (pillOrientation == "right") {
                movingPill1.connected = "right";
                movingPill2.connected = "left";
            }
        }
        else if (pillOrientation == "right" && chunkArray[movingPill2.yPos - 1][movingPill2.xPos].content == "empty") {
            movingPill1.movePill(-1, -1, 0, 0, chunkArray);
            pillOrientation = "top";
            movingPill1.connected = "top";
            movingPill2.connected = "bottom";
        }
        else if (pillOrientation == "top" && ["empty", "border"].includes(chunkArray[movingPill2.yPos][movingPill2.xPos + 1].content)) {
            if (chunkArray[movingPill2.yPos][movingPill2.xPos + 1].content == "empty") {
                movingPill1.movePill(0, 1, 1, 0, chunkArray); pillOrientation = "left";
            } else if (chunkArray[movingPill2.yPos][movingPill2.xPos - 1].content == "empty") {
                movingPill1.movePill(-1, 1, 0, 0, chunkArray); pillOrientation = "left";
            }
            if (pillOrientation == "left") {
                movingPill1.connected = "left";
                movingPill2.connected = "right";
            }
        }
    }
    rotateRight() {
        if (pillOrientation == "left" && chunkArray[movingPill1.yPos - 1][movingPill1.xPos].content == "empty") {    // lewy idzie do góry
            movingPill1.movePill(0, -1, -1, 0, chunkArray);
            pillOrientation = "top";
            movingPill1.connected = "top";
            movingPill2.connected = "bottom";
        }
        else if (pillOrientation == "top" && ["empty", "border"].includes(chunkArray[movingPill2.yPos][movingPill2.xPos + 1].content)) {
            if (chunkArray[movingPill2.yPos][movingPill2.xPos + 1].content == "empty") {
                movingPill1.movePill(1, 1, 0, 0, chunkArray); pillOrientation = "right";
            } else if (chunkArray[movingPill2.yPos][movingPill2.xPos - 1].content == "empty") {
                movingPill1.movePill(0, 1, -1, 0, chunkArray); pillOrientation = "right";
            }
            if (pillOrientation == "right") {
                movingPill1.connected = "right";
                movingPill2.connected = "left";
            }
        }
        else if (pillOrientation == "right" && chunkArray[movingPill2.yPos - 1][movingPill2.xPos].content == "empty") {
            movingPill1.movePill(-1, 0, 0, -1, chunkArray);
            pillOrientation = "bottom";
            movingPill1.connected = "bottom";
            movingPill2.connected = "top";
        }
        else if (pillOrientation == "bottom" && ["empty", "border"].includes(chunkArray[movingPill1.yPos][movingPill1.xPos + 1].content)) {
            if (chunkArray[movingPill1.yPos][movingPill1.xPos + 1].content == "empty") {
                movingPill1.movePill(0, 0, 1, 1, chunkArray); pillOrientation = "left";
            } else if (chunkArray[movingPill1.yPos][movingPill1.xPos - 1].content == "empty") {
                movingPill1.movePill(-1, 0, 0, 1, chunkArray); pillOrientation = "left";
            }
            if (pillOrientation == "left") {
                movingPill1.connected = "left";
                movingPill2.connected = "right";
            }
        }
    }
    movePill(byX1, byY1, byX2, byY2, array) {
        array[movingPill1.yPos][movingPill1.xPos].content = "empty";
        array[movingPill2.yPos][movingPill2.xPos].content = "empty";
        array[movingPill1.yPos][movingPill1.xPos].contentId = "";
        array[movingPill2.yPos][movingPill2.xPos].contentId = "";
        array[movingPill1.yPos][movingPill1.xPos].color = "black";
        array[movingPill2.yPos][movingPill2.xPos].color = "black";
        movingPill1.xPos += byX1;
        movingPill2.xPos += byX2;
        movingPill1.yPos += byY1;
        movingPill2.yPos += byY2;
        array[movingPill1.yPos][movingPill1.xPos].content = "pill";
        array[movingPill2.yPos][movingPill2.xPos].content = "pill";
        array[movingPill1.yPos][movingPill1.xPos].contentId = movingPill1.id
        array[movingPill2.yPos][movingPill2.xPos].contentId = movingPill2.id
        array[movingPill1.yPos][movingPill1.xPos].color = movingPill1.color;
        array[movingPill2.yPos][movingPill2.xPos].color = movingPill2.color;
    }
}
function spawnPill() {
    (pillId == 1) ? pillPreviewColor = [colorArray[Math.floor(Math.random() * (4 - 1))], colorArray[Math.floor(Math.random() * (4 - 1))]] : false;
    clearInterval(moveInterval);
    doSpawnPill = "spawningPill";
    speedrun = false;
    pillOrientation = "left";
    movingPill1 = new Pill(pillId, 11, 4, pillPreviewColor[0], true, "left");
    movingPill2 = new Pill(pillId, 12, 4, pillPreviewColor[1], true, "right");
    pillArray.push(movingPill1, movingPill2);
    if (chunkArray[1][4].content == "pill" || chunkArray[1][5].content == "pill") {
        endGame();
    } else {
        sideChunkArray[movingPill1.yPos][movingPill1.xPos].content = "pill";
        sideChunkArray[movingPill2.yPos][movingPill2.xPos].content = "pill";
        sideChunkArray[movingPill1.yPos][movingPill1.xPos].contentId = movingPill1.id;
        sideChunkArray[movingPill2.yPos][movingPill2.xPos].contentId = movingPill2.id;
        sideChunkArray[movingPill1.yPos][movingPill1.xPos].color = movingPill1.color;
        sideChunkArray[movingPill2.yPos][movingPill2.xPos].color = movingPill2.color;
        pillId++;
        let itr = 1;
        let pillAnimation = setInterval(function () {
            if ([1, 5, 9, 13, 17].includes(itr)) {
                movingPill1.movePill(0, 0, -1, -1, sideChunkArray);
                movingPill1.connected = "bottom";
                movingPill2.connected = "top";
            } else if (itr == 2) {
                movingPill1.movePill(0, -1, -1, 0, sideChunkArray);
                movingPill1.connected = "right";
                movingPill2.connected = "left";
            } else if (itr == 3) {
                movingPill1.movePill(-1, -1, 0, 0, sideChunkArray);
                movingPill1.connected = "top";
                movingPill2.connected = "bottom";
            } else if (itr == 4) {
                movingPill1.movePill(-1, 0, 0, -1, sideChunkArray);
                movingPill1.connected = "left";
                movingPill2.connected = "right";
                document.getElementById(`Sx12y5`).style.background = "black";
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 2; j++) {
                        sideChunkArray[6 + i][11 + j].content = "mario";
                        document.getElementById(`Sx${11 + j}y${6 + i}`).style.backgroundImage = `url('./img/mario/middle${i + 1}${j + 1}.png')`;
                    }
                }
            } else if ([6, 10, 14].includes(itr)) {
                movingPill1.movePill(0, 0, -1, 1, sideChunkArray);
                movingPill1.connected = "right";
                movingPill2.connected = "left";
            } else if ([7, 11, 15, 19].includes(itr)) {
                movingPill1.movePill(-1, -1, 0, 0, sideChunkArray);
                movingPill1.connected = "top";
                movingPill2.connected = "bottom";
            } else if ([8, 12, 16, 20].includes(itr)) {
                movingPill1.movePill(-1, 1, 0, 0, sideChunkArray);
                movingPill1.connected = "left";
                movingPill2.connected = "right";
            } else if (itr == 18) {
                movingPill1.movePill(0, 1, -1, 2, sideChunkArray);
                movingPill1.connected = "right";
                movingPill2.connected = "left";
            } else if ([21, 22, 23].includes(itr)) {
                movingPill1.movePill(0, 1, 0, 1, sideChunkArray);
            }
            if (itr == 1) {
                for (let i = 0; i < 3; i++) {
                    sideChunkArray[7 - i][12].content = "mario";
                    document.getElementById(`Sx12y${7 - i}`).style.backgroundImage = `url('./img/mario/up_${3 - i}.png')`;
                }
                document.getElementById(`Sx12y8`).style.background = "black";
            }
            if (itr == 7) {
                document.getElementById(`Sx11y6`).style.background = "black";
                document.getElementById(`Sx11y7`).style.background = "black";
                sideChunkArray[7][12].content = "mario";
                document.getElementById(`Sx12y7`).style.backgroundImage = `url('./img/mario/down_1.png')`;
                sideChunkArray[8][12].content = "mario";
                document.getElementById(`Sx12y8`).style.backgroundImage = `url('./img/mario/down_2.png')`;
                document.getElementById(`Sx12y5`).style.background = "black";
                document.getElementById(`Sx12y6`).style.background = "black";
            }
            if (itr == 24) {
                sideChunkArray[6][1].content = "empty";
                sideChunkArray[6][2].content = "empty";
                movingPill1.xPos = 4;
                movingPill1.yPos = 1;
                movingPill2.xPos = 5;
                movingPill2.yPos = 1;
                chunkArray[movingPill1.yPos][movingPill1.xPos].content = "pill";
                chunkArray[movingPill2.yPos][movingPill2.xPos].content = "pill";
                chunkArray[movingPill1.yPos][movingPill1.xPos].contentId = movingPill1.id;
                chunkArray[movingPill2.yPos][movingPill2.xPos].contentId = movingPill2.id;
                chunkArray[movingPill1.yPos][movingPill1.xPos].color = movingPill1.color;
                chunkArray[movingPill2.yPos][movingPill2.xPos].color = movingPill2.color;
                doSpawnPill = false;
                tick = 1;
            }
            if (itr == 25) {
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 2; j++) {
                        sideChunkArray[6 + i][11 + j].content = "mario";
                        document.getElementById(`Sx${11 + j}y${6 + i}`).style.backgroundImage = `url('./img/mario/middle${i + 1}${j + 1}.png')`;
                    }
                }
            }
            if (itr == 26) {
                for (let i = 0; i < 3; i++) {
                    sideChunkArray[7 - i][12].content = "mario";
                    document.getElementById(`Sx12y${7 - i}`).style.backgroundImage = `url('./img/mario/up_${3 - i}.png')`;
                }
                pillPreviewColor = [colorArray[Math.floor(Math.random() * (4 - 1))], colorArray[Math.floor(Math.random() * (4 - 1))]]
                document.getElementById(`Sx11y4`).style.backgroundImage = `url(./img/gameField/${pillPreviewColor[0].slice(0, 2)}_left.png)`;
                document.getElementById(`Sx12y4`).style.backgroundImage = `url(./img/gameField/${pillPreviewColor[1].slice(0, 2)}_right.png)`;
                sideChunkArray[4][11].content = "mario";
                sideChunkArray[4][12].content = "mario";
                document.getElementById(`Sx12y8`).style.background = "black";
                document.getElementById(`Sx11y6`).style.background = "black";
                document.getElementById(`Sx11y7`).style.background = "black";
            }
            if (itr < 26) { itr++ }
            else {
                clearInterval(pillAnimation);
            }
        }, 25);
    }
}