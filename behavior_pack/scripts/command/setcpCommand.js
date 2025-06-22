import { CommandPermissionLevel, CustomCommandParamType, Player } from '@minecraft/server';
import { setCP } from '../server/checkpoint';

export const setCPCommand = {
    name: 'mpk:setcp',
    description: 'Set checkpoint.',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { type: CustomCommandParamType.PlayerSelector, name: 'victim' },
        { type: CustomCommandParamType.Location, name: 'destination' },
        { type: CustomCommandParamType.Float, name: 'facing' },
        { type: CustomCommandParamType.Float, name: 'pitch' }
    ]
};

export function setCPCommandHandle(origin, victim, destination, facing, pitch) {
    for (const player of victim) {
        setCP(player, destination, { x: pitch, y: facing });
    }
    return undefined;
};