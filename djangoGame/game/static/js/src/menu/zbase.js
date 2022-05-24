class MainGameMenu{
    constructor(root){
        this.root = root;
        // for an html object, we usually add $ before its name in jQuery
        this.$menu = $(`
            <div class="game_menu"></div>
            `);
        this.root.$game.append(this.$menu);
    }
}
