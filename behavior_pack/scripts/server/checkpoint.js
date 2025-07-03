import { system, world } from '@minecraft/server';
import { sendMessage } from '../util/message';

system.afterEvents.scriptEventReceive.subscribe((ev) => {
    const { sourceEntity, sourceBlock, message, id } = ev;

    let player;

    if (!sourceEntity) {
        player = sourceBlock.dimension.getPlayers({ location: sourceBlock.location, closest: 1 })[0];
    } else player = sourceEntity;

    if (player.typeId !== 'minecraft:player') return;

    const args = splitStr(message).map(Number);
    if (id === 'zpk:cp') {
        if (args.length < 5 || args.includes(NaN)) return;
        setCP(player, { x: args[0], y: args[1], z: args[2]}, { x: args[4], y: args[3] }, false);
    }
});

function splitStr(str) {
    const regex = /"([^"]+)"|\S+/g;
    return Array.from(str.matchAll(regex), m => m[1] ? m[1] : m[0]);
};

world.afterEvents.itemUse.subscribe((ev) => {
    const { source: player, itemStack } = ev;

    const checkpoint_retuner = player.getDynamicProperty('cpReturnItem') ?? 'minecraft:red_dye';
    const checkpoint_set = player.getDynamicProperty('cpSetItem') ?? 'minecraft:emerald';

    if (itemStack.typeId === checkpoint_retuner) {
        const location = player.getDynamicProperty('cp_location') ?? { x: 0, y: 0, z: 0 };
        const vec3Rot = player.getDynamicProperty('cp_rotation');
        const rotation = { x: vec3Rot.x, y: vec3Rot.y } ?? { x: 0, y: 0 };
        player.teleport(location, { rotation: rotation });
    } else if (itemStack.typeId === checkpoint_set) {
        const rotation = player.getRotation();
        const location = player.location;
        setCP(player, location, rotation);
    }
});

export function setCP(player, coord, rotation, showMessage = true) {
    if (player?.typeId !== 'minecraft:player') return;
    player.setDynamicProperties({
        'cp_location': coord,
        'cp_rotation': { ...rotation, z: 0 }
    });
    if (showMessage) sendMessage(player, 'Set Checkpoint');
}