import { CommandPermissionLevel, CustomCommandParamType, Player, system } from '@minecraft/server';
import { setlbForm } from '../form/setlb';

export const lbCommand = {
    name: 'mpk:lb',
    description: 'open lb setting form',
    permissionLevel: CommandPermissionLevel.Any
};

export function lbCommandHandle(origin) {
    if (!origin.sourceEntity || origin.sourceEntity.typeId !== 'minecraft:player') return undefined;
    /** @type { Player } */
    const player = origin.sourceEntity;
    system.run(() => setlbForm(player, false));
    return undefined;
}