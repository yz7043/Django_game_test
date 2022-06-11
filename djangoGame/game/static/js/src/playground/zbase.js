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
