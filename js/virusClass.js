"use strict";

class Virus {
    constructor(xPos, yPos, color) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.color = color;
    }
}
function spawnVirus(quantity) {
    let j = 0;
    for (let i = 0; i < quantity; i++) {
        let virus = new Virus(Math.floor(Math.random() * 8 + 1), Math.floor(Math.random() * (16 - 5) + 6), colorArray[j]);
        while (chunkArray[virus.yPos][virus.xPos].content == "virus") {
            virus = new Virus(Math.floor(Math.random() * 8 + 1), Math.floor(Math.random() * (16 - 5) + 6), colorArray[j]);
        }
        chunkArray[virus.yPos][virus.xPos].content = "virus";
        chunkArray[virus.yPos][virus.xPos].contentId = "";
        chunkArray[virus.yPos][virus.xPos].color = virus.color;
        (j == 2) ? j = 0 : j++;
        virusArray.push(virus);
        virusNumber++;
    }
}