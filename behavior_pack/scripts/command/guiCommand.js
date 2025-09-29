import { CommandPermissionLevel, CustomCommandParamType, Player, system } from '@minecraft/server';
import { guiForm } from '../form/gui';

export const guiCommand = {
    name: 'mpk:gui',
    description: 'open gui setting form',
    permissionLevel: CommandPermissionLevel.Any
};

export function guiCommandHandle(origin) {
    if (!origin.sourceEntity || origin.sourceEntity.typeId !== 'minecraft:player') return undefined;
    /** @type { Player } */
    const player = origin.sourceEntity;
    system.run(() => guiForm(player));
    return undefined;
}