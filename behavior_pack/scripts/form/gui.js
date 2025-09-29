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
    'grind': 'Grind',
    'mm': 'MM',
    'offset': 'Offset',
    'pb': 'PB',
    'lastInput': 'Last Input',
    'lastSidestep': 'Last Sidestep',
    'lastTiming': 'Last Timing',
    'time': 'Time'
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
    'grind': false,
    'mm': false,
    'offset': true,
    'pb': true,
    'lastInput': false,
    'lastSidestep': false,
    'lastTiming': false,
    'time': false
};

/**
 * @param {Player} player 
 */
export function guiForm(player) {
    const form = new ModalFormData()
        .title('GUi');
    const guiConfig = _safeParse(player.getDynamicProperty('guiConfig'), defaultConfig);
    const keys = Object.keys(labelName);
    keys.forEach(k => {
        form.toggle(labelName[k] + '\n§7(hide/show)', { defaultValue: guiConfig[k] });
    });
    form.show(player).then((res) => {
        if (res.canceled === true && res.cancelationReason !== 'UserBudy') {
            return;
        } else if (res.canceled === true) {
            guiForm(player);
        };
        const keys = Object.keys(defaultConfig);

        const updatedConfig = {};
        keys.forEach((key, i) => {
            updatedConfig[key] = res.formValues[i];
        });

        player.setDynamicProperty('guiConfig', JSON.stringify(updatedConfig));
        return;
    })
}

function _safeParse(str, obj) {
    try {
        return JSON.parse(str);
    } catch {
        return obj;
    }
}