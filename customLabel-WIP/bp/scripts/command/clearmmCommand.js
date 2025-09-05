import { CommandPermissionLevel, CustomCommandParamType, Player } from '@minecraft/server';
import { sendMessage } from '../util/message';
import { setProperties } from '../util/property';

export const clearMMCommand = {
    name: 'mpk:clearmm',
    description: 'Clear MM',
    permissionLevel: CommandPermissionLevel.Any
};

export function clearMMCommandHandle(origin) {
    if (!origin.sourceEntity || origin.sourceEntity.typeId !== 'minecraft:player') return undefined;
    /** @type { Player } */
    const player = origin.sourceEntity;
    player.setDynamicProperties({
        'mmStart': { x: 0, y: 500, z: 0 },
        'mmEnd': { x: 0, y: 500, z: 0 }
    });
    setProperties(player, 'lb', {
        'mm_x': -1,
        'mm_z': -1,
    });
    sendMessage(player, 'Successfully clear MM');
    return undefined;
};