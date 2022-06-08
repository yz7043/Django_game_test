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
        this.playground.$playground.append(this.$canvas);
    }

    start(){
        super.start();
    }

    update(){
        this.render();
    }

    render(){
        this.ctx.fillStyle = "rgba(0,0,0,0.2)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
class Player extends GameObject{
    constructor(playground, x, y, is_me){
        super();
        this.playground = playground;
        this.x = x;
        this.y = y;
        this.ctx = this.playground.game_map.ctx;
        this.is_me = is_me;
    }

}

class PlayerBall extends Player{
    constructor(playground, x, y, radius, color, speed, is_me){
        super(playground, x, y, is_me);
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.eps = 0.01;

        this.vx = 0;
        this.vy = 0;
        this.move_length = 0;
    }

    start(){
        super.start();
        console.log(this.is_me);
        if(this.is_me){
            this.add_listening_events();
        }
    }

    update(){
        if(this.move_length < this.eps){
            this.vx = this.vy = 0;
            this.move_length = 0;
        }else{
            let moved = Math.min(this.move_length, this.speed * this.deltaTime / 1000);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }
        this.render();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    add_listening_events(){
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function(){ return false;});
        this.playground.game_map.$canvas.mousedown(function(e){
            if(e.which == 3){
                // right click is 3
                outer.move_to(e.clientX, e.clientY);
            }
        });
    }

    move_to(tx, ty){
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
        console.log("Move to ", this.vx, this.vy);
    }

    get_dist(x1, y1, x2, y2){
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
class GamePlayGround{
    constructor(root){
        this.root = root;
        this.$playground = $(`
        <div class="main_game_playground"></div>
        `);
        // this.hide();
        this.root.$game.append(this.$playground);

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new PlayerBall(this, this.width/2, this.height/2, this.height*0.05, "white", this.height * 0.15, true));
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
        // this.menu = new MainGameMenu(this);
        this.playground = new GamePlayGround(this);
    }

    start(){}
}
