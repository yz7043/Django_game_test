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
