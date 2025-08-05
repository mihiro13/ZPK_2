import { getProperties } from '../util/property';

export function displayLabels(player) {
    const labels = getProperties(player, 'label');
    const guiConfig = _safeParse(player.getDynamicProperty('guiConfig'), defaultConfig);
    const digit = player.getDynamicProperty('digit') ?? 4;
    const separate = ': §r';
    const color1 = player.getDynamicProperty('color1') ?? '6';
    const color2 = player.getDynamicProperty('color2') ?? 'f';
    const angleLine = guiConfig.pitch || guiConfig.yaw || guiConfig.ja || guiConfig.ha ? '\n' : '';
    const display = initializeDisplay(labels, { digit: digit, separate: separate, color1: color1, color2: color2 }, angleLine, player);
    const result = Object.keys(display).filter(key => guiConfig[key] === true).map(key => display[key]).join('');
    player.onScreenDisplay.setActionBar(result);
    return;
}

function _isNumeric(value) {
    if (typeof value === 'number') return !isNaN(value);
    if (typeof value !== 'string') return false;
    if (value.trim() === '') return false;
    return !isNaN(Number(value));
};

function initializeDisplay(labels, decorateOptions, angleLine, player) {
    if (!labels) return;
    const { digit, separate, color1, color2 } = decorateOptions;
    const display = {};

    function formatVec3(label, value) {
        return label === '' ? `§r§${color1}${label}X${separate}§${color2}${value.x.toFixed(digit)} ` +
            `§r§${color1}Y${separate}§${color2}${value.y.toFixed(digit)} ` +
            `§r§${color1}Z${separate}§${color2}${value.z?.toFixed(digit) ?? value.y.toFixed(digit)}${angleLine}` :
            `\n§r§${color1}${label}X${separate}§${color2}${value.x.toFixed(digit)} ` +
            `§r§${color1}Y${separate}§${color2}${value.y.toFixed(digit)} ` +
            `§r§${color1}Z${separate}§${color2}${value.z?.toFixed(digit) ?? value.y.toFixed(digit)}`;
    };

    function formatScalar(label, value, suffix = '') {
        return `§r§${color1}${label}${separate}§${color2}${value.toFixed(digit)}${suffix} `;
    };

    function formatValue(label, value, suffix = '') {
        return _isNumeric(value) ? `\n§r§${color1}${label}${separate}§${color2}${value.toFixed(digit)}${suffix}` : `\n§r§${color1}${label}${separate}§${color2}${value}${suffix}`;
    };

    function formatVector(label, value) {
        return `\n§r§${color1}${label}${separate}§${color2}${value.speed.toFixed(digit)}§r§${color1}/§r§${color2}${value.facing.toFixed(digit)}°`;
    };

    function formatMM(label, value) {
        return `\n§r§${color1}${label} X${separate}§${color2}${value.x.toFixed(digit)} §r§${color1}Z${separate}§${color2}${value.z.toFixed(digit)}`;
    };

    function formatOffset(label, value) {
        const lb_type = player.getDynamicProperty('lb_type');
        if (lb_type === 'both' || lb_type === 'zneo') {
            return `\n§r§${color1}${label}${separate}§${color2}${value.total.toFixed(digit)} §r§${color1}X${separate}§${color2}${value.x.toFixed(digit)} §r§${color1}Z${separate}§${color2}${value.z.toFixed(digit)}`;
        } else if (lb_type === 'x') {
            return `\n§r§${color1}${label} X${separate}§${color2}${value.x.toFixed(digit)}`;
        } else if (lb_type === 'z') {
            return `\n§r§${color1}${label} Z${separate}§${color2}${value.z.toFixed(digit)}`;
        }
    };

    display.loc = formatVec3('', labels.loc);
    display.pitch = formatScalar('P', labels.pitch, '°');
    display.yaw = formatScalar('F', labels.yaw, `° §${color1}${(labels.yaw < 45 && labels.yaw > -45) || (labels.yaw > 135 || labels.yaw < -135) ? 'Z' : 'X'}`);
    display.ja = formatScalar('Jump Angle', labels.ja, '°');
    display.ha = formatScalar('Hit Angle', labels.ha, '°');
    display.secondTurn = formatValue('Second Turn', labels.secondTurn);
    display.preturn = formatValue('Preturn', labels.preturn);
    display.lastTurning = formatValue('Last Turning', labels.lastTurning);
    display.lastLanding = formatVec3('Last Landing ', labels.lastLanding);
    display.hit = formatVec3('Hit ', labels.hit);
    display.jump = formatVec3('Jump ', labels.jump);
    display.speed = formatVec3('Speed (b/t) ', labels.speed);
    display.speedVector = formatVector('Speed Vector', labels.speedVector);
    display.tier = formatValue('Tier', labels.tier);
    display.airtime = formatValue('Airtime', labels.airtime);
    display.grind = formatValue('Grind', labels.grind);
    display.mm = formatMM('MM', labels.mm);
    display.offset = formatOffset('Offset', labels.offset);
    display.pb = formatOffset('PB', labels.pb);
    display.lastInput = formatValue('Last Input', labels.lastInput);
    display.lastSidestep = formatValue('Last Sidestep', labels.lastSidestep);
    display.lastTiming = formatValue('Last Timing', labels.lastTiming);

    return display;
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
    'lastTiming': false
};

function _safeParse(str, obj) {
    try {
        return JSON.parse(str);
    } catch {
        return obj;
    }
};