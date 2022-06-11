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
        this.ctx.fillStyle = "rgba(0,0,0)";
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
const FIRE_BALL = "fireball";
class PlayerBall extends Player{
    constructor(playground, x, y, radius, color, speed, is_me){
        super(playground, x, y, is_me);
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.eps = 0.01;
        // player control movement
        this.vx = 0;
        this.vy = 0;
        // under attack movement
        this.dmg_speed = this.speed * 4;
        this.friction = 0.9;
        this.is_atk_move = false;
        this.atk_dist = this.playground.height * 0.15;
        this.move_length = 0;

        this.cur_skill = null;
    }

    start(){
        super.start();
        if(this.is_me){
            this.add_listening_events();
        }else{
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }

    update(){
        if(this.move_length < this.eps){
            this.vx = this.vy = 0;
            this.move_length = 0;
            if(this.is_atk_move) this.is_atk_move = false;
            if(!this.is_me){
                let tx = Math.random() * this.playground.width;
                let ty = Math.random() * this.playground.height;
                this.move_to(tx, ty);
            }
        }else{
            let moved = 0;
            if(this.is_atk_move){
                let damp_speed = Math.max(this.move_length * this.dmg_speed / this.atk_dist, 0.2 * this.dmg_speed);
                moved = Math.min(this.move_length, damp_speed * this.deltaTime / 1000);
            }else
                moved = Math.min(this.move_length, this.speed * this.deltaTime / 1000);
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
            if(e.which === 3){
                // right click is 3
                if(!this.is_atk_move)
                outer.move_to(e.clientX, e.clientY);
            }else if(e.which === 1){
                if(outer.cur_skill === FIRE_BALL){
                    outer.shoot_fireball(e.clientX, e.clientY);
                }
                outer.cur_skill = null;
            }
        });
        $(window).keydown(function(e){
            if(e.which === 81){
                // q
                outer.cur_skill = FIRE_BALL;
                return false;
            }
        });
    }

    move_to(tx, ty){
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    get_dist(x1, y1, x2, y2){
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    shoot_fireball(tx, ty){
        let x = this.x; let y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle);
        let vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let range = Math.min(this.playground.height * 1, this.get_dist(this.x, this.y, tx, ty));
        new FireBall(this.playground, this, this.x, this.y, radius, vx, vy, color, speed, range, this.playground.height * 0.01);
    }

    is_attacked(angle, dmg){
        this.radius -= dmg;
        if(this.radius < 10){ // If less than 10 px, the player dies
            this.destroy();
            return;
        }
        //this.atk_dist = this.playground.height * 0.2;
        let dmg_x = this.x + Math.cos(angle) * this.atk_dist;
        let dmg_y = this.y + Math.sin(angle) * this.atk_dist;
        this.is_atk_move = true;
        this.move_to(dmg_x, dmg_y);
    }
}
class FireBall extends GameObject{
    constructor(playground, player, x, y, radius, vx, vy, color, speed, range, dmg){
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.range = range;
        this.dmg = dmg;
        this.eps = 0.01;
    }

    start(){
        super.start();
    }

    update(){
        if(this.range < this.eps){
            this.destroy();
            return false;
        }
        let moved = Math.min(this.range, this.speed * this.deltaTime / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.range -= moved;

        for(let i = 0; i < this.playground.players.length; i++){
            let player = this.playground.players[i];
            if(this.player !== player && this.is_collision(player)){
                this.attack(player);
            }
        }
        this.render();
    }

    attack(player){
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.dmg);
        this.destroy();
    }

    is_collision(player){
        let dis = this.get_dist(this.x, this.y, player.x, player.y);
        if(dis < this.radius + player.radius) return true;
        else return false;
    }

    get_dist(x1, y1, x2, y2){
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }


    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
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
        // create ai enenies
        for(let i = 0; i < 5; i++){
            this.players.push(new PlayerBall(this, this.width/2, this.height/2, this.height*0.05, "blue", this.height * 0.15, false));
        }
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
