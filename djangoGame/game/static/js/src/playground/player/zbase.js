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
