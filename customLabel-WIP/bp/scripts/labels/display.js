import { getProperties } from '../util/property';

const labelCharacters = {
    'x': 30,
    'y': 30,
    'z': 30,
    'pitch': 34,
    'facing': 30,
    'ja': 39,
    'ha': 38,
    'secondTurn': 40,
    'preturn': 34,
    'lastTurning': 41,
    'landx': 43,
    'landz': 43,
    'hitx': 34,
    'hitz': 34,
    'jumpx': 35,
    'jumpz': 35,
    'speedx': 36,
    'speedz': 36,
    'speedVector': 70,
    'tier': 20,
    'grind': 20,
    'mmx': 41,
    'mmz': 41,
    'offset': 36,
    'offsetx': 38,
    'offsetz': 38,
    'pb': 33,
    'pbx': 33,
    'pbz': 33,
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
    display.landz = formatNumberLabel('Last Landing Z', labels.land.z, labelCharacters.landz);
    display.hitx = formatNumberLabel('Hit X', labels.hit.x, labelCharacters.hitx);
    display.hitz = formatNumberLabel('Hit Z', labels.hit.z, labelCharacters.hitz);
    display.jumpx = formatNumberLabel('Jump X', labels.jump.x, labelCharacters.jumpx);
    display.jumpz = formatNumberLabel('Jump Z', labels.jump.z, labelCharacters.jumpz);
    display.speedx = formatNumberLabel('X Speed', labels.speed.x, labelCharacters.speedx);
    display.speedz = formatNumberLabel('Z Speed', labels.speed.z, labelCharacters.speedz);
    display.speedVector = formatVectorLabel(labels.speedVector.speed, labels.speedVector.facing, labelCharacters.speedVector);
    display.tier = formatNumberLabel('Tier', labels.tier, labelCharacters.tier);
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
    'landz': true,
    'hitx': false,
    'hitz': false,
    'jumpx': false,
    'jumpz': false,
    'speedx': false,
    'speedz': false,
    'speedVector': false,
    'tier': false,
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