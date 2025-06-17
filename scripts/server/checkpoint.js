import { system, world } from '@minecraft/server';

const item = 'minecraft:red_dye';

system.afterEvents.scriptEventReceive.subscribe((ev) => {
    const { sourceEntity, sourceBlock, message, id } = ev;

    let player;

    if (!sourceEntity) {
        player = sourceBlock.dimension.getPlayers({ location: sourceBlock.location, closest: 1 })[0];
    } else player = sourceEntity;

    if (player.typeId !== 'minecraft:player') return;

    const args = splitStr(message).map(Number);
    if (id === 'zpk:cp') {
        if (args.includes(NaN)) return;
        player.setDynamicProperty('cp_location', { x: args[0], y: args[1], z: args[2] });
        player.setDynamicProperty('cp_rotation', { x: args[4], y: args[3], z: 0 });
    }
});

function splitStr(str) {
    const regex = /"([^"]+)"|\S+/g;
    return Array.from(str.matchAll(regex), m => m[1] ? m[1] : m[0]);
};

world.afterEvents.itemUse.subscribe((ev) => {
    const { source: player, itemStack } = ev;

    if (itemStack.typeId === item) {
        const location = player.getDynamicProperty('cp_location') ?? { x: 0, y: 0, z: 0 };
        const vec3Rot = player.getDynamicProperty('cp_rotation');
        const rotation = { x: vec3Rot.x, y: vec3Rot.y } ?? { x: 0, y: 0 };
        player.teleport(location, { rotation: rotation });
    }
});