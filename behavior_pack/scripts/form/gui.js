import { Player } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
import { settingForm } from './settings';

const labelName = {
    'x': 'X',
    'y': 'Y',
    'z': 'Z',
    'pitch': 'Pitch',
    'yaw': 'Facing',
    'ja': 'Jump Angle',
    'ha': 'Hit Angle',
    'secondTurn': 'Second Turn',
    'preturn': 'Preturn',
    'lastTurning': 'Last Turning',
    'landx': 'Last Landing X',
    'landy': 'Last Landing Y',
    'landz': 'Last Landing Z',
    'hitx': 'Hit X',
    'hity': 'Hit Y',
    'hitz': 'Hit Z',
    'jumpx': 'Jump X',
    'jumpy': 'Jump Y',
    'jumpz': 'Jump Z',
    'speedx': 'X Speed',
    'speedy': 'Y Speed',
    'speedz': 'Z Speed',
    'speedVector': 'Speed Vector',
    'tier': 'Tier',
    'airtime': 'Airtime',
    'grind': 'Grind',
    'mmx': 'MM X Offset',
    'mmz': 'MM Z Offset',
    'offset': 'Offset',
    'offsetx': 'X Offset',
    'offsetz': 'Z Offset',
    'pb': 'PB',
    'pbx': 'X PB',
    'pbz': 'Z PB',
    'lastInput': 'Last Input',
    'lastSidestep': 'Last Sidestep',
    'lastTiming': 'Last Timing',
    'time': 'Time'
};

const defaultConfig = {
    'x': true,
    'y': true,
    'z': true,
    'pitch': true,
    'yaw': true,
    'ja': false,
    'ha': false,
    'secondTurn': false,
    'preturn': false,
    'lastTurning': true,
    'landx': true,
    'landy': true,
    'landz': true,
    'hitx': false,
    'hity': false,
    'hitz': false,
    'jumpx': false,
    'jumpy': false,
    'jumpz': false,
    'speedx': false,
    'speedy': false,
    'speedz': false,
    'speedVector': false,
    'tier': false,
    'airtime': false,
    'grind': false,
    'mmx': false,
    'mmz': false,
    'offset': true,
    'offsetx': true,
    'offsetz': true,
    'pb': true,
    'pbx': true,
    'pbz': true,
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
};

function _safeParse(str, obj) {
    try {
        return JSON.parse(str);
    } catch {
        return obj;
    }
};