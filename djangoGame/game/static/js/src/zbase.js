export class MainGame {
    constructor(id){
        this.id = id;
        this.$game = $('#' + id);
        this.menu = new MainGameMenu(this);
        this.playground = new GamePlayGround(this);
    }

    start(){}
}
