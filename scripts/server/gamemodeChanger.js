import { world, PlayerPermissionLevel } from '@minecraft/server';
import { sendMessage } from '../util/message';

world.afterEvents.itemUse.subscribe((ev) => {
    const { source: player, itemStack } = ev;

    const gamemodeChanger = player.getDynamicProperty('gmChangerItem') ?? 'minecraft:iron_nugget';

    if (itemStack.typeId === gamemodeChanger) {
        if (player.playerPermissionLevel !== PlayerPermissionLevel.Operator) {
            sendMessage(player, 'you tarinai permission!');
            return;
        }
        const gamemode = player.getGameMode();
        switch (gamemode) {
            case 'Creative':
                player.setGameMode('Adventure');
                break;
            case 'Adventure':
                player.setGameMode('Creative');
                break;
            default:
                player.setGameMode('Creative');
                break;
        }
        return;
    }
});