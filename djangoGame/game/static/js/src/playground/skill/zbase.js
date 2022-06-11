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
