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
            console.log("click solo mode");
        });

        this.$multi_mode.click(function(){
            // inner function's this is different from the class this
            console.log("click multi mode");
        });

        this.$setting.click(function(){
            console.log("click setting button");
        });
    }
}
class MainGame {
    constructor(id){
        this.id = id;
        this.$game = $('#' + id);
        this.menu = new MainGameMenu(this);
    }
}
