let GAME_OBJECTS = []; // global game object storage
class GameObject{
    constructor(){
        GAME_OBJECTS.push(this);
        this.isStart = false; // Has start function been called
        this.deltaTime = 0; // in ms
    }

    start(){
        // only called at the first frame
        this.isStart = true;
    }

    update(){
        // called every frame
    }

    destroy(){
        this.onDestroy();
        for(let i = 0; i < GAME_OBJECTS.length; i++){
            if(GAME_OBJECTS[i] === this){
                GAME_OBJECTS.splice(i);
                break;
            }
        }
    }

    onDestroy(){
        // called before destroy
    }
}
let last_timestamp;
let GAME_ANIMATION = function(timestamp){
    for(let i = 0; i < GAME_OBJECTS.length; i++){
        let obj = GAME_OBJECTS[i];
        if(!obj.isStart){
            obj.start();
        }else{
            obj.deltaTime = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(GAME_ANIMATION);
}
requestAnimationFrame(GAME_ANIMATION);
