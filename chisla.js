const OJS = require('owop-js');
const { Worker, isMainThread,  workerData } = require('worker_threads');
const Client = new OJS.Client({
    reconnect: true,
    controller: true,
    world: "main"
});
let settingColor = [255, 0, 0]
let position = {
    x: 80,
    y: 15
}
let positionMax = {
    x: 159,
    y: 95
}

Client.on("join", async () => {
   await sleep(Client.net.bucket.time * 10);
   if(isMainThread) {
    console.log("this is the main thread")
    for(let i = 0; i < 4; i++) {
        let w = new Worker(__filename, {workerData: i});
    }

    setInterval((a) => currentVal = ananas(), 100, "MainThread");
    } else {

    console.log("this isn't")

    setInterval((a) => currentVal = ananas(), 100, workerData);

    }
});
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function ananas(){
    for(let x = Math.floor(position.x/16); x < Math.ceil(positionMax.x/16); x++) {
        for(let y = Math.floor(position.y/16); y < Math.ceil(positionMax.y/16); y++) {
            await Client.world.requestChunk(x, y);
        }
    }
    for(let x = position.x; x < positionMax.x; x++) {
        for(let y = position.y; y < positionMax.y; y++) {
            let color = await Client.world.getPixel(x, y);
            if(color[0] === settingColor[0] && color[1] === settingColor[1] && color[2] === settingColor[2]) continue;
            if(!Client.world.setPixel(x, y, settingColor)) await sleep(Math.floor(Client.net.bucket.time * 1000 / Client.net.bucket.rate));
        }
    }
}
