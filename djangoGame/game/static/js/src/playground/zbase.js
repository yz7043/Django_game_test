class GamePlayGround{
    constructor(root){
        this.root = root;
        this.$playground = $(`
            <div>Playground Page</div>
        `);
        this.hide();
        this.root.$game.append(this.$playground);
    }

    start(){}

    show(){
        this.$playground.show();
    }

    hide(){
        this.$playground.hide();
    }

}
