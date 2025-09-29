import { CommandPermissionLevel, CustomCommandParamType, Player } from '@minecraft/server';
import { sendMessage } from '../util/message';

const colors = [
    'black', 'dark_blue', 'dark_green', 'dark_aqua', 'dark_red',
    'dark_purple', 'gold', 'gray', 'dark_gray', 'blue',
    'green', 'aqua', 'red', 'light_purple', 'yellow',
    'white', 'minecoin_gold', 'material_quartz', 'material_iron',
    'material_netherite', 'obfuscated', 'bold', 'material_redstone', 'material_copper',
    'italic', 'material_gold', 'material_emerald', 'reset', 'material_diamond',
    'material_lapis', 'material_amethyst', 'material_resin'
];

export const color2Command = {
    name: 'mpk:color2',
    description: 'set color2',
    permissionLevel: CommandPermissionLevel.Any,
    mandatoryParameters: [
        { type: CustomCommandParamType.Enum, name: 'mpk:colors' }
    ]
};

export function color2CommandHandle(origin, arg) {
    if (!origin.sourceEntity || origin.sourceEntity.typeId !== 'minecraft:player') return undefined;
    /** @type { Player } */
    const player = origin.sourceEntity;
    const colorIndex = colors.indexOf(arg);
    if (colorIndex === -1) return undefined;
    const sectionColor = colorIndex.toString(36);
    player.setDynamicProperty('color2', sectionColor);
    sendMessage(player, 'Set color1 to §' + sectionColor + arg);
    return undefined;
}