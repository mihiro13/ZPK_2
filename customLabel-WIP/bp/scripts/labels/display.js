import { getProperties } from '../util/property';

const labelCharacters = {
    'x': 38,
    'y': 38,
    'z': 38,
    'pitch': 42,
    'facing': 38,
    'ja': 47,
    'ha': 46,
    'secondTurn': 48,
    'preturn': 42,
    'lastTurning': 49,
    'landx': 51,
    'landy': 51,
    'landz': 51,
    'hitx': 42,
    'hity': 42,
    'hitz': 42,
    'jumpx': 43,
    'jumpy': 43,
    'jumpz': 43,
    'speedx': 44,
    'speedy': 44,
    'speedz': 44,
    'speedVector': 86,
    'tier': 28,
    'airtime': 28,
    'grind': 28,
    'mmx': 49,
    'mmz': 49,
    'offset': 44,
    'offsetx': 46,
    'offsetz': 46,
    'pb': 41,
    'pbx': 41,
    'pbz': 41,
    'lastInput': 26,
    'lastSidestep': 45,
    'lastTiming': 45,
    'time': 26
};

export function displayLabels(player) {
    const labels = getProperties(player, 'label');
    const guiConfig = _safeParse(player.getDynamicProperty('guiConfig'), defaultConfig);
    const digit = player.getDynamicProperty('digit') ?? 4;
    const separate = ': §r';
    const color1 = player.getDynamicProperty('color1') ?? '6';
    const color2 = player.getDynamicProperty('color2') ?? 'f';
    const angleLine = guiConfig.pitch || guiConfig.yaw || guiConfig.ja || guiConfig.ha ? '\n' : '';
    const display = initializeDisplay(labels, { digit: digit, separate: separate, color1: color1, color2: color2 }, angleLine, player);
    const result = Object.keys(display).map(key => {
        if (guiConfig[key] === true) {
            return display[key];
        }
        else {
            return ' '.repeat(labelCharacters[key]);
        }
    }).join('');
    //player.onScreenDisplay.setActionBar(result);
    return;
}

const getTextLength = (text) => {
    let all_count = 0;
    for (let char of [...text.split("")]) {
        const code_point_num = char.codePointAt(0);
        if (!code_point_num) continue;
        let now_count = 1;
        if (code_point_num >= 128) now_count += 1;
        if (code_point_num >= 2048) now_count += 1;
        if (code_point_num >= 65536) now_count += 1;
        all_count += now_count
    }
    return all_count;
}

function initializeDisplay(labels, decorateOptions, angleLine, player) {
    if (!labels) return;
    const { digit, separate, color1, color2 } = decorateOptions;
    const display = {};

    function formatNumberLabel(labelName, value, characters) {
        const originalText = `§r§${color1}${labelName}${separate}§${color2}${parseFloat(value.toFixed(digit))}`;
        const addSpaceCount = characters - getTextLength(originalText);
        const result = addSpaceCount >= 0 ? originalText + ' '.repeat(addSpaceCount) : originalText.slice(0, addSpaceCount);
        //console.warn(labelName, getTextLength(result), getTextLength(originalText))
        return result;
    }

    function formatStringLabel(labelName, value, characters) {
        const originalText = `§r§${color1}${labelName}${separate}§${color2}${value}`;
        const addSpaceCount = characters - getTextLength(originalText);
        const result = addSpaceCount >= 0 ? originalText + ' '.repeat(addSpaceCount) : originalText.slice(0, addSpaceCount);
        return result;
    }

    function formatVectorLabel(speed, facing, characters) {
        const originalText = `§r§${color1}Speed Vector${separate}§${color2}${parseFloat(speed.toFixed(digit))}§r§${color1}/§r§${color2}${parseFloat(facing.toFixed(digit))}°`;
        const addSpaceCount = characters - getTextLength(originalText);
        const result = addSpaceCount >= 0 ? originalText + ' '.repeat(addSpaceCount) : originalText.slice(0, addSpaceCount);
        return result;
    }

    display.x = formatNumberLabel('X', labels.loc.x, labelCharacters.x);
    display.y = formatNumberLabel('Y', labels.loc.y, labelCharacters.y);
    display.z = formatNumberLabel('Z', labels.loc.z, labelCharacters.z);
    display.pitch = formatNumberLabel('Pitch', labels.pitch, labelCharacters.pitch);
    display.yaw = formatNumberLabel('F', labels.yaw, labelCharacters.facing);
    display.ja = formatNumberLabel('Jump Angle', labels.ja, labelCharacters.ja);
    display.ha = formatNumberLabel('Hit Angle', labels.ha, labelCharacters.ha);
    display.secondTurn = formatNumberLabel('Second Turn', labels.secondTurn, labelCharacters.secondTurn);
    display.preturn = formatNumberLabel('Preturn', labels.preturn, labelCharacters.preturn);
    display.lastTurning = formatNumberLabel('Last Turning', labels.lastTurning, labelCharacters.lastTurning);
    display.landx = formatNumberLabel('Last Landing X', labels.land.x, labelCharacters.landx);
    display.landy = formatNumberLabel('Last Landing Y', labels.land.y, labelCharacters.landy);
    display.landz = formatNumberLabel('Last Landing Z', labels.land.z, labelCharacters.landz);
    display.hitx = formatNumberLabel('Hit X', labels.hit.x, labelCharacters.hitx);
    display.hity = formatNumberLabel('Hit Y', labels.hit.y, labelCharacters.hity);
    display.hitz = formatNumberLabel('Hit Z', labels.hit.z, labelCharacters.hitz);
    display.jumpx = formatNumberLabel('Jump X', labels.jump.x, labelCharacters.jumpx);
    display.jumpy = formatNumberLabel('Jump Y', labels.jump.y, labelCharacters.jumpy);
    display.jumpz = formatNumberLabel('Jump Z', labels.jump.z, labelCharacters.jumpz);
    display.speedx = formatNumberLabel('X Speed', labels.speed.x, labelCharacters.speedx);
    display.speedy = formatNumberLabel('Y Speed', labels.speed.y, labelCharacters.speedy);
    display.speedz = formatNumberLabel('Z Speed', labels.speed.z, labelCharacters.speedz);
    display.speedVector = formatVectorLabel(labels.speedVector.speed, labels.speedVector.facing, labelCharacters.speedVector);
    display.tier = formatNumberLabel('Tier', labels.tier, labelCharacters.tier);
    display.airtime = formatNumberLabel('Airtime', labels.airtime, labelCharacters.airtime);
    display.grind = formatNumberLabel('Grind', labels.grind, labelCharacters.grind);
    display.mmx = formatNumberLabel('MM X Offset', labels.mm.x, labelCharacters.mmx);
    display.mmz = formatNumberLabel('MM Z Offset', labels.mm.z, labelCharacters.mmz);
    display.offset = formatNumberLabel('Offset', labels.offset.total, labelCharacters.offset);
    display.offsetx = formatNumberLabel('X Offset', labels.offset.x, labelCharacters.offsetx);
    display.offsetz = formatNumberLabel('Z Offset', labels.offset.z, labelCharacters.offsetz);
    display.pb = formatNumberLabel('PB', labels.pb.total, labelCharacters.pbz);
    display.pbx = formatNumberLabel('X PB', labels.pb.x, labelCharacters.pbx);
    display.pbz = formatNumberLabel('Z PB', labels.pb.z, labelCharacters.pbz);
    display.lastInput = formatStringLabel('Last Input', labels.lastInput, labelCharacters.lastInput);
    display.lastSidestep = formatStringLabel('Last Sidestep', labels.lastSidestep, labelCharacters.lastSidestep);
    display.lastTiming = formatStringLabel('Last Timing', labels.lastTiming, labelCharacters.lastTiming);
    display.time = formatStringLabel('Time', labels.time, labelCharacters.time);

    /*
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
    display.time = formatValue('Time', labels.time);
    */

    return display;
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

function _safeParse(str, obj) {
    try {
        return JSON.parse(str);
    } catch {
        return obj;
    }
};