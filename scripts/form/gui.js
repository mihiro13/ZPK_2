import { Player } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
import { settingForm } from './settings';

const labelName = {
    'loc': 'Position',
    'pitch': 'Pitch',
    'yaw': 'facing',
    'ja': 'Jump Angle',
    'ha': 'Hit Angle',
    'secondTurn': 'Second Turn',
    'preturn': 'Preturn',
    'lastTurning': 'Last Turning',
    'lastLanding': 'Last Landing',
    'hit': 'Hit',
    'jump': 'Jump',
    'speed': 'Speed',
    'speedVector': 'Speed Vector',
    'tier': 'Tier',
    'airtime': 'Airtime',
    'offset': 'Offset',
    'pb': 'PB',
    'lastInput': 'Last Input',
    'lastSidestep': 'Last Sidestep',
    'lastTiming': 'Last Timing'
};

const defaultConfig = {
    'loc': true,
    'pitch': true,
    'yaw': true,
    'ja': false,
    'ha': false,
    'secondTurn': false,
    'preturn': false,
    'lastTurning': true,
    'lastLanding': true,
    'hit': false,
    'jump': false,
    'speed': false,
    'speedVector': false,
    'tier': false,
    'airtime': false,
    'offset': true,
    'pb': true,
    'lastInput': false,
    'lastSidestep': false,
    'lastTiming': false
};

/**
 * @param {Player} player 
 */
export function guiForm(player) {
    const form = new ModalFormData()
        .title('GUi')
        .textField('Color1', '0-9|a-u', { defaultValue: player.getDynamicProperty('color1') ?? '6', tooltip: '§00§11§22§33§44§55§66§77§88§99§aa§bb§cc§dd§ee§ff§gg§hh§ii§jj§r§kk§r§ll§r§mm§nn§r§oo§r§pp§qq§rr§ss§tt§uu\n§r0: §0abc§rk:§kabc§r l:§labc §ro:§oabc §rr:clear' })
        .textField('Color2', '0-9|a-u', { defaultValue: player.getDynamicProperty('color2') ?? 'f', tooltip: '§00§11§22§33§44§55§66§77§88§99§aa§bb§cc§dd§ee§ff§gg§hh§ii§jj§r§kk§r§ll§r§mm§nn§r§oo§r§pp§qq§rr§ss§tt§uu\n§r0: §0abc§rk:§kabc§r l:§labc §ro:§oabc §rr:clear' })
        .textField('Prefix', '<MPK>', { defaultValue: player.getDynamicProperty('prefix') ?? '<MPK>' });
    const guiConfig = _safeParse(player.getDynamicProperty('guiConfig'), defaultConfig);
    const keys = Object.keys(labelName);
    keys.forEach(k => {
        form.toggle(labelName[k] + '\n§7(hide/show)', { defaultValue: guiConfig[k] });
    });
    form.show(player).then((res) => {
        if (res.canceled === true) return settingForm(player);
        const keys = Object.keys(defaultConfig);
        player.setDynamicProperties({
            'color1': res.formValues[0],
            'color2': res.formValues[1],
            'prefix': res.formValues[2]
        });

        const updatedConfig = {};
        keys.forEach((key, i) => {
            updatedConfig[key] = res.formValues[i + 3];
        });

        player.setDynamicProperty('guiConfig', JSON.stringify(updatedConfig));
        return settingForm(player);
    })
};

function _safeParse(str, obj) {
    try {
        return JSON.parse(str);
    } catch {
        return obj;
    }
};