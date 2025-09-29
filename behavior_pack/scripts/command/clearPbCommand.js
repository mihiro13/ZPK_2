import { CommandPermissionLevel, CustomCommandParamType, Player } from '@minecraft/server';
import { sendMessage } from '../util/message';
import { setProperties } from '../util/property';

export const clearPbCommand = {
    name: 'mpk:clearpb',
    description: 'Clear pb',
    permissionLevel: CommandPermissionLevel.Any
};

export function clearPbCommandHandle(origin) {
    if (!origin.sourceEntity || origin.sourceEntity.typeId !== 'minecraft:player') return undefined;
    /** @type { Player } */
    const player = origin.sourceEntity;
    setProperties(player, 'lb', {
        'offset': -1,
        'offset_x': -1,
        'offset_z': -1,
        'pb': -1,
        'pb_x': -1,
        'pb_z': -1
    })
    sendMessage(player, 'Successfully clear pb.');
    return undefined;
}