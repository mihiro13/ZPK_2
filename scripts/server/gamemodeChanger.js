import { world } from '@minecraft/server';
import { sendMessage } from '../util/message';

world.afterEvents.itemUse.subscribe((ev) => {
    const { source: player, itemStack } = ev;

    const gamemodeChanger = player.getDynamicProperty('gmChangerItem') ?? 'minecraft:iron_nugget';

    if (itemStack.typeId === gamemodeChanger) {
        if (player.isOp() === false) {
            sendMessage(player, 'you tarinai permission!');
            return;
        }
        const gamemode = player.getGameMode();
        switch (gamemode) {
            case 'creative':
                player.setGameMode('adventure');
                break;
            case 'adventure':
                player.setGameMode('creative');
                break;
            default:
                player.setGameMode('creative');
                break;
        }
        return;
    }
});