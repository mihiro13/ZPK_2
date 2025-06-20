import { CommandPermissionLevel, CustomCommandParamType, Player } from '@minecraft/server';
import { sendMessage } from '../util/message';
import { setProperties } from '../util/property';

export const clearLbCommand = {
    name: 'mpk:clearlb',
    description: 'Clear lb and pb',
    permissionLevel: CommandPermissionLevel.Any
};

export function clearLbCommandHandle(origin) {
    if (!origin.sourceEntity || origin.sourceEntity.typeId !== 'minecraft:player') return undefined;
    /** @type { Player } */
    const player = origin.sourceEntity;
    player.setDynamicProperties({
        lb: false,
        boxStart: { x: 0, y: 500, z: 0 },
        boxEnd: { x: 0, y: 500, z: 0 }
    });
    setProperties(player, 'lb', {
        'offset': -1,
        'offset_x': -1,
        'offset_z': -1,
        'pb': -1,
        'pb_x': -1,
        'pb_z': -1
    });
    sendMessage(player, 'Successfully clear landing block and pb.');
    return undefined;
};