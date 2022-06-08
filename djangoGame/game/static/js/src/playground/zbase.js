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
        this.game_map = new GameMap(this);
        
    }

    start(){}

    show(){
        this.$playground.show();
    }

    hide(){
        this.$playground.hide();
    }

}
