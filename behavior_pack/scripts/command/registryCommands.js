import { system } from '@minecraft/server';
import { setlbCommand, setlbCommandHandle } from './setlbCommand';
import { dfCommand, dfCommandHandle } from './dfCommand';
import { color1Command, color1CommandHandle } from './color1Command';
import { color2Command, color2CommandHandle } from './color2Command';
import { lbCommand, lbCommandHandle } from './lbCommand';
import { guiCommand, guiCommandHandle } from './guiCommand';
import { configCommand, configCommandHandle } from './configCommand';
import { clearPbCommand, clearPbCommandHandle } from './clearPbCommand';
import { clearLbCommand, clearLbCommandHandle } from './clearLbCommand';
import { setMMCommand, setMMCommandHandle } from './setmmCommand';
import { clearMMCommand, clearMMCommandHandle } from './clearmmCommand';
import { setCPCommand, setCPCommandHandle } from './setcpCommand';

const colors = [
    'black', 'dark_blue', 'dark_green', 'dark_aqua', 'dark_red',
    'dark_purple', 'gold', 'gray', 'dark_gray', 'blue',
    'green', 'aqua', 'red', 'light_purple', 'yellow',
    'white', 'minecoin_gold', 'material_quartz', 'material_iron',
    'material_netherite', 'obfuscated', 'bold', 'material_redstone', 'material_copper',
    'italic', 'material_gold', 'material_emerald', 'reset', 'material_diamond',
    'material_lapis', 'material_amethyst', 'material_resin'
];

const lbTypes = [
    'target', 'both', 'x', 'z', 'zneo', 'stand'
];

system.beforeEvents.startup.subscribe((init) => {
    const commandList = [
        [setlbCommand, setlbCommandHandle],
        [dfCommand, dfCommandHandle],
        [color1Command, color1CommandHandle],
        [color2Command, color2CommandHandle],
        [lbCommand, lbCommandHandle],
        [guiCommand, guiCommandHandle],
        [configCommand, configCommandHandle],
        [clearPbCommand, clearPbCommandHandle],
        [clearLbCommand, clearLbCommandHandle],
        [setMMCommand, setMMCommandHandle],
        [clearMMCommand, clearMMCommandHandle],
        [setCPCommand, setCPCommandHandle]
    ];

    init.customCommandRegistry.registerEnum('mpk:colors', colors);
    init.customCommandRegistry.registerEnum('mpk:lbtypes', lbTypes);

    for (const [cmd, handler] of commandList) {
        init.customCommandRegistry.registerCommand(cmd, handler);
    }
})