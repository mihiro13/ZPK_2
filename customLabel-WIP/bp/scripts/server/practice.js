import { world, ItemStack } from '@minecraft/server';
import { sendMessage } from '../util/message';

const itemData = {
    practice_enable: {
        typeId: 'minecraft:slime_ball',
        nameTag: '§r§aEnable Practice Mode'
    },
    practice_disable: {
        typeId: 'minecraft:magma_cream',
        nameTag: '§r§cDisable Practice Mode'
    },
    practice_checkpoint: {
        typeId: 'minecraft:prismarine_shard',
        nameTag: '§r§bCheckpoint Returner'
    },
    lobby: {
        typeId: 'minecraft:nether_star',
        nameTag: '§r§bReturn to Lobby'
    }
};

export const prohibitedItem = [
    itemData.practice_enable.typeId, itemData.practice_disable.typeId, itemData.practice_checkpoint.typeId, itemData.lobby.typeId
];

world.afterEvents.itemUse.subscribe(ev => {
    const { source: player, itemStack } = ev;
    if (itemStack.typeId === itemData.practice_checkpoint.typeId) {
        teleportCheckPoint(player, 'practice');
        return;
    }
    if (itemStack.typeId === itemData.practice_enable.typeId || itemStack.typeId === itemData.practice_disable.typeId) {
        practice(player);
        return;
    }
});

function initItem(itemData) {
    const item = new ItemStack(itemData.typeId);
    item.nameTag = itemData.nameTag;
    item.lockMode = 'inventory';
    return item;
};

function practice(player) {
    const isPracticing = player.getDynamicProperty('practice') || false;
    const container = player.getComponent('inventory').container || false;
    if (!container) return;
    if (isPracticing) {
        player.setDynamicProperty('practice', false);
        player.removeTag('practice');
        const checkpointSlot = getItemFirstSlot(container, itemData.practice_checkpoint.typeId);
        const disableSlot = getItemFirstSlot(container, itemData.practice_disable.typeId);
        container.setItem(checkpointSlot, initItem(itemData.lobby));
        container.setItem(disableSlot, initItem(itemData.practice_enable));
        teleportCheckPoint(player, 'practice');
        sendMessage(player, 'Practice mode disabled');
    } else {
        if (!player.isOnGround) return;
        player.setDynamicProperty('practice', true);
        player.addTag('practice');
        const checkpointSlot = getItemFirstSlot(container, itemData.lobby.typeId);
        const enableSlot = getItemFirstSlot(container, itemData.practice_enable.typeId);
        container.setItem(checkpointSlot, initItem(itemData.practice_checkpoint));
        container.setItem(enableSlot, initItem(itemData.practice_disable));
        player.setDynamicProperty('practiceLocation', player.location);
        player.setDynamicProperty('practiceRotation', { x: player.getRotation().x, y: player.getRotation().y, z: 0 });
        sendMessage(player, 'Practice mode enabled');
    }
    player.playSound('random.click');
};

function teleportCheckPoint(player, cause = 'normal') {
    if (cause === 'normal' || cause === 'death') {
        const location = player.getDynamicProperty('cpCoord');
        const rotation = player.getDynamicProperty('cpRotation');
        if (rotation) {
            player.teleport(location, { rotation: rotation });
        } else player.teleport(location);
        if (cause === 'death') player.sendMessage('§cチェックポイントにテレポートしました');
    } else if (cause === 'practice') {
        const location = player.getDynamicProperty('practiceLocation');
        const rotation = player.getDynamicProperty('practiceRotation');
        player.teleport(location, { rotation: rotation });
    }
};

function getItemFirstSlot(container, itemId) {
    for (let i = 0; i < container.size; i++) {
        if (container.getItem(i)?.typeId === itemId) return i;
    }
    return 4;
};