class MainGameMenu{
    constructor(root){
        this.root = root;
        // for an html object, we usually add $ before its name in jQuery
        this.$menu = $(`
            <div class="game_menu">
            <div class="game_menu_field">
                <div class="game_menu_field_item game_menu_field_item_solo_mode">
                    Solo Mode
                </div>
                <br/>
                <div class="game_menu_field_item game_menu_field_item_multi_mode">
                    Party Mode
                </div>
                <br/>
                <div class="game_menu_field_item game_menu_field_item_setting_mode">
                    Settings
                </div>
            </div>
            </div>
            `);
        this.root.$game.append(this.$menu);
        this.$single_mode = this.$menu.find('.game_menu_field_item_solo_mode');
        this.$multi_mode = this.$menu.find('.game_menu_field_item_multi_mode');
        this.$setting = this.$menu.find('.game_menu_field_item_setting_mode');

        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$single_mode.click(function(){
            // inner function's this is different from the class this
            outer.hide();
            outer.root.playground.show();
        });

        this.$multi_mode.click(function(){
            // inner function's this is different from the class this
            console.log("click multi mode");
        });

        this.$setting.click(function(){
            console.log("click setting button");
        });
    }

    show(){
        // show menu
        this.$menu.show();
    }

    hide(){
        // close menu and show playground
       this.$menu.hide();
    }
}
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
class GameMap extends GameObject{
    constructor(playground){
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        console.log("ground width: " + this.playground.width);
        console.log("ground height: " + this.playground.height);
        this.playground.$playground.append(this.$canvas);
    }

    start(){}

    update(){}
}
class GamePlayGround{
    constructor(root){
        this.root = root;
        this.$playground = $(`
        <div class="main_game_playground"></div>
        `);
        this.hide();
        this.root.$game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        console.log("ground width before: " + this.$playground.width());
        console.log("ground height before: " + this.$playground.width());
        this.game_map = new GameMap(this);
        console.log("root width: " + this.root.$game.width());
        console.log("root height: " + this.root.$game.height());
        
    }

    start(){}

    show(){
        this.$playground.show();
    }

    hide(){
        this.$playground.hide();
    }

}
export class MainGame {
    constructor(id){
        this.id = id;
        this.$game = $('#' + id);
        this.menu = new MainGameMenu(this);
        this.playground = new GamePlayGround(this);
    }

    start(){}
}
