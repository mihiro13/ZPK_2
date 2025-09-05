import { CommandPermissionLevel, CustomCommandParamType, Player } from '@minecraft/server';
import { sendMessage } from '../util/message';

export const dfCommand = {
    name: 'mpk:df',
    description: 'set df',
    permissionLevel: CommandPermissionLevel.Any,
    mandatoryParameters: [
        { type: CustomCommandParamType.Integer, name: 'digit' }
    ]
};

export function dfCommandHandle(origin, arg) {
    if (!origin.sourceEntity || origin.sourceEntity.typeId !== 'minecraft:player') return undefined;
    /** @type { Player } */
    const player = origin.sourceEntity;
    if (0 <= arg && arg <= 8) {
        player.setDynamicProperty('digit', Math.floor(arg));
        sendMessage(player, 'Set DF to ' + Math.floor(arg));
        return undefined;
    } else {
        sendMessage(player, 'Invalid Number');
        return undefined;
    }
};