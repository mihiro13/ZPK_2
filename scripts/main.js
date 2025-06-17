import { world, system } from "@minecraft/server";
import { ActionFormData, ActionFormResponse, ModalFormData, ModalFormResponse } from '@minecraft/server-ui';
import * as ui from "@minecraft/server-ui";

/*
    original mod author: @Zetaser_jtz
*/

/*
 tbf = 1tickBefore
 ttbf = 2ticksBefore
 tt = totel
 rTF = rotToFixed
 pTF= posToFixed
 ja为tier9
 cp = checkpoint
 gm = gamemode
 音效：cp：note.bit note.pling note.harp
       错误：note.base
       tp: 末影人传送 末影之眼破碎
 tc = text color
 lb_x_fac/lb_z_fac false - true +
 ttspeed = speed vector
*/

let soundpack = 2;//起跳0曼波1
//info
let prohibitedBlocks = [
    "minecraft:cherry_trapdoor"
]

world.afterEvents.playerSpawn.subscribe(ev => {
    const { initialSpawn, player } = ev;

    if (initialSpawn) {
        player.runCommand("hud @s hide status_effects");
        player.runCommand("hud @s hide armor");
        player.runCommand("title @s times 0 100 100");
        player.runCommand("effect @s clear");
    }
})
world.beforeEvents.playerInteractWithBlock.subscribe(ev => {
    const { player, block } = ev;
    const tc1 = player.getDynamicProperty('tc1') ?? 'd';
    const tc2 = player.getDynamicProperty('tc2') ?? 'f';
    const prefix = player.getDynamicProperty('prefix') ?? '<ZPK>';
    const offset_limit = player.getDynamicProperty('offset_limit') ?? 0.5;
    const sign = block.getComponent("minecraft:sign")?.getText();

    if (prohibitedBlocks.includes(block.typeId)) return ev.cancel = true;
    if (!sign) return;
    if (sign && !ev.isFirstEvent) return ev.cancel = true;
    if (sign.startsWith("!setlb") && !player.isSneaking) {
        ev.cancel = true;
        let type = sign.split(" ")[4];
        world.sendMessage(type);
        let inverseLB = sign.split(" ")[5];
        if (!["both", "x", "z", "zneo"].includes(type)) return player.sendMessage(`§${tc1}§l${prefix}§r§${tc2} Invalid Landing Box Type.`);
        let coord = {
            x: Number(sign.split(" ")[1]),
            y: Number(sign.split(" ")[2]),
            z: Number(sign.split(" ")[3]),
        }
        if (inverseLB !== undefined) {
            switch (inverseLB) {
                case "both":
                    player.setDynamicProperty('inv_x', true);
                    player.setDynamicProperty('inv_z', true);
                    break;
                case "x":
                    player.setDynamicProperty('inv_x', true);
                    player.setDynamicProperty('inv_z', false);
                    break;
                case "z":
                    player.setDynamicProperty('inv_x', false);
                    player.setDynamicProperty('inv_z', true);
                    break;
                default:
                    player.setDynamicProperty('inv_x', false);
                    player.setDynamicProperty('inv_z', false);
                    break;
            }
        } else {
            player.setDynamicProperty('inv_x', false);
            player.setDynamicProperty('inv_z', false);
        }
        player.setDynamicProperty('lb_x', coord.x);
        player.setDynamicProperty('lb_y', coord.y);
        player.setDynamicProperty('lb_z', coord.z);
        player.setDynamicProperty('lb_type', type);
        player.setDynamicProperty('pb', (offset_limit * -2));
        player.setDynamicProperty('pb_x', (offset_limit * -1));
        player.setDynamicProperty('pb_z', (offset_limit * -1));
        player.sendMessage(`§${tc1}§l${prefix}§r§${tc2} Clear PB and Set landing block successfully!`);
        return;
    }
    if (sign.includes("setlb") && !player.isSneaking) {
        ev.cancel = true;
        let coord = sign.split("\n")[1];
        let type = sign.split("\n")[2];
        let inverseLB = sign.split("\n")[3];
        if (!["both", "x", "z", "zneo"].includes(type)) return player.sendMessage(`§${tc1}§l${prefix}§r§${tc2} Invalid Landing Box Type.`);
        coord = {
            x: Number(coord.split(" ")[0]),
            y: Number(coord.split(" ")[1]),
            z: Number(coord.split(" ")[2]),
        }
        if (inverseLB !== undefined) {
            switch (inverseLB) {
                case "both":
                    player.setDynamicProperty('inv_x', true);
                    player.setDynamicProperty('inv_z', true);
                    break;
                case "x":
                    player.setDynamicProperty('inv_x', true);
                    player.setDynamicProperty('inv_z', false);
                    break;
                case "z":
                    player.setDynamicProperty('inv_x', false);
                    player.setDynamicProperty('inv_z', true);
                    break;
                default:
                    player.setDynamicProperty('inv_x', false);
                    player.setDynamicProperty('inv_z', false);
                    break;
            }
        } else {
            player.setDynamicProperty('inv_x', false);
            player.setDynamicProperty('inv_z', false);
        }
        player.setDynamicProperty('lb_x', coord.x);
        player.setDynamicProperty('lb_y', coord.y);
        player.setDynamicProperty('lb_z', coord.z);
        player.setDynamicProperty('lb_type', type);
        player.setDynamicProperty('pb', (offset_limit * -2));
        player.setDynamicProperty('pb_x', (offset_limit * -1));
        player.setDynamicProperty('pb_z', (offset_limit * -1));
        player.sendMessage(`§${tc1}§l${prefix}§r§${tc2} Clear PB and Set landing block successfully!`);
    }
})

/*world.beforeEvents.itemUse.subscribe(data => {
    const item = data.itemStack;
    const pl = data.source;
    if (item.typeId === 'minecraft:nether_star') {
        system.run(() => {
            pl.runCommand(`tellraw @s {"rawtext":[{"text":"§l§6------------ZPK Mod V7.0.5 Info------------
§d-Author: §fZetaser_jtz(zsccjtz9136)
§b-If you can't see the full text, plaese
change Setting-Video-GUI_Scale_Modifier
to a smaller number
§4-You can modify this Addon, but please 
indicate the original author!
-Only for Singleplayer
§a-Send "!setlb" to set lb (stand on the
edge of the landingblock)
§r§7(!setlb [both/x/z/zneo])
§l§a-Send "!clearpb" to clear pb and offset
-Use red_dey/emerald(default) to TP/set check point
-TurnUp + Sneak to open setting"}]}`)
        });
    };
});*/

//chat commands
world.beforeEvents.chatSend.subscribe((eventData) => {
    const sender = eventData.sender;
    let tc1 = sender.getDynamicProperty('tc1') ?? 'd';
    let tc2 = sender.getDynamicProperty('tc2') ?? 'f';
    let prefix = sender.getDynamicProperty('prefix') ?? '<ZPK>';
    let pTF = sender.getDynamicProperty('pTF') ?? 6;
    let rTF = sender.getDynamicProperty('rTF') ?? 4;
    let offset_limit = sender.getDynamicProperty('offset_limit') ?? 0.5;
    switch (eventData.message) {
        case '!setlb':
            eventData.cancel = true;
            sender.setDynamicProperty('lb_x', sender.location.x);
            sender.setDynamicProperty('lb_y', sender.location.y);
            sender.setDynamicProperty('lb_z', sender.location.z);
            sender.setDynamicProperty('lb_type', 'both');
            system.run(() => { sender.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§${tc2} Set landing block(both) successfully!"}]}`); });
            break;
        case '!setlb both':
            eventData.cancel = true;
            sender.setDynamicProperty('lb_x', sender.location.x);
            sender.setDynamicProperty('lb_y', sender.location.y);
            sender.setDynamicProperty('lb_z', sender.location.z);
            sender.setDynamicProperty('lb_type', 'both');
            system.run(() => { sender.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§${tc2} Set landing block(both) successfully!"}]}`); });
            break;
        case '!setlb x':
            eventData.cancel = true;
            sender.setDynamicProperty('lb_x', sender.location.x);
            sender.setDynamicProperty('lb_y', sender.location.y);
            sender.setDynamicProperty('lb_z', sender.location.z);
            sender.setDynamicProperty('lb_type', 'x');
            system.run(() => { sender.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§${tc2} Set landing block(x) successfully!"}]}`); });
            break;
        case '!setlb z':
            eventData.cancel = true;
            sender.setDynamicProperty('lb_x', sender.location.x);
            sender.setDynamicProperty('lb_y', sender.location.y);
            sender.setDynamicProperty('lb_z', sender.location.z);
            sender.setDynamicProperty('lb_type', 'z');
            system.run(() => { sender.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§${tc2} Set landing block(z) successfully!"}]}`); });
            break;
        case '!setlb zneo':
            eventData.cancel = true;
            sender.setDynamicProperty('lb_x', sender.location.x);
            sender.setDynamicProperty('lb_y', sender.location.y);
            sender.setDynamicProperty('lb_z', sender.location.z);
            sender.setDynamicProperty('lb_type', 'zneo');
            system.run(() => { sender.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§${tc2} Set landing block(zneo) successfully!"}]}`); });
            break;
        case '!clearpb':
            eventData.cancel = true;
            sender.setDynamicProperty('offset', 0);
            sender.setDynamicProperty('offset_x', 0);
            sender.setDynamicProperty('offset_z', 0);
            sender.setDynamicProperty('pb', (offset_limit * -2));
            sender.setDynamicProperty('pb_x', (offset_limit * -1));
            sender.setDynamicProperty('pb_z', (offset_limit * -1));
            system.run(() => { sender.runCommand(`tellraw @s {"rawtext":[{"text":"§${tc1}§l${prefix}§r§${tc2} Clear PB successfully!"}]}`); });
            break;
        case '!help':
            eventData.cancel = true;
            sender.runCommand(`tellraw @s --Chat Commands--§7
-- !help
 Show this form.
-- !setlb [both/x/z/zneo]
 Set a landingblock.
-- !clearpb
 Clear your PB and offset.
`)
            break;
        case '!inv x':
            eventData.cancel = true;
            sender.setDynamicProperty('inv_x', true);
            system.run(() => { sender.runCommand(`tellraw @s {"rawtext":[{"text":"§${tc1}§l${prefix}§r§${tc2} Inverse X Offset!"}]}`); });
            break;
        case '!inv z':
            eventData.cancel = true;
            sender.setDynamicProperty('inv_z', true);
            system.run(() => { sender.runCommand(`tellraw @s {"rawtext":[{"text":"§${tc1}§l${prefix}§r§${tc2} Inverse Z Offset!"}]}`); });
        default: break;
    };
});

//三大物品
world.beforeEvents.itemUse.subscribe(data => {
    const item = data.itemStack;
    const player = data.source;
    let cpitem = player.getDynamicProperty('cpitem') ?? 'minecraft:emerald';
    let tc1 = player.getDynamicProperty('tc1') ?? 'd';
    let tc2 = player.getDynamicProperty('tc2') ?? 'f';
    let prefix = player.getDynamicProperty('prefix') ?? '<ZPK>';
    if (item.typeId === cpitem) {
        system.run(() => {
            data.cancel = true;
            player.setDynamicProperty('cp_x', player.location.x.toFixed(10));
            player.setDynamicProperty('cp_y', player.location.y.toFixed(10));
            player.setDynamicProperty('cp_z', player.location.z.toFixed(10));
            player.setDynamicProperty('cp_f', player.getRotation().y.toFixed(4));
            player.setDynamicProperty('cp_p', player.getRotation().x.toFixed(4));
            player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§${tc2} Set check point successfully!"}]}`);
        });
    };
});
world.beforeEvents.itemUse.subscribe(data => {
    const item = data.itemStack;
    const player = data.source;
    let tpitem = player.getDynamicProperty('tpitem') ?? 'minecraft:red_dye';
    if (item.typeId === tpitem) {
        data.cancel = true;
        let cp_x = player.getDynamicProperty('cp_x');
        let cp_y = player.getDynamicProperty('cp_y');
        let cp_z = player.getDynamicProperty('cp_z');
        let cp_f = player.getDynamicProperty('cp_f');
        let cp_p = player.getDynamicProperty('cp_p');
        system.run(() => {
            player.runCommand(`tp @s ${cp_x} ${cp_y} ${cp_z} ${cp_f} ${cp_p}`)
            //        player.teleport({ x: cpx, y: cpy, z: cpz }, { rotation: { x: cpp, y: cpf } });
        });
    };
});
world.beforeEvents.itemUse.subscribe(data => {
    const item = data.itemStack;
    const player = data.source;
    let gmchanger = player.getDynamicProperty('gmchanger') ?? 'minecraft:cyan_dye';
    if (item.typeId === gmchanger) {
        data.cancel = true
        system.run(() => {
            if (player.getGameMode() == 'adventure') {
                player.setGameMode('creative')
            } else {
                player.setGameMode('adventure')
            };
        });
    };
});
function getPlayerControlMovement(player) {
    var movement = player.inputInfo.getMovementVector();
    // Threshold to classify directions
    var threshold = 0.5;
    // Determine the normalized direction
    var normalizedX =
        Math.abs(movement.x) >= threshold ? (movement.x > 0 ? 1 : -1) : 0;
    var normalizedY =
        Math.abs(movement.y) >= threshold ? (movement.y > 0 ? 1 : -1) : 0;
    // Define direction based on normalized x and y
    if (normalizedX === 0 && normalizedY === 1) return "W";
    if (normalizedX === 0 && normalizedY === -1) return "S";
    if (normalizedX === 1 && normalizedY === 0) return "A";
    if (normalizedX === -1 && normalizedY === 0) return "D";
    if (normalizedX === 1 && normalizedY === 1) return "WA";
    if (normalizedX === -1 && normalizedY === 1) return "WD";
    if (normalizedX === 1 && normalizedY === -1) return "SA";
    if (normalizedX === -1 && normalizedY === -1) return "SD";
    if (normalizedX === 0 && normalizedY === 0) return "";
    // Handle unexpected cases
    return "Unknown";
}

//MAIN
let dimension = world.getDimension("overworld");
let zpkmodon = 1;

system.runInterval(function displayPosition() {
    if (zpkmodon == 1) {
        for (let player of world.getPlayers()) {
            //position
            player.setDynamicProperty('ttbf_pos', player.getDynamicProperty('tbf_pos') ?? player.loacation);
            player.setDynamicProperty('tbf_pos', player.getDynamicProperty('pos') ?? player.loacation);
            player.setDynamicProperty('pos', player.location);
            //fac&pitch rotation
            player.setDynamicProperty('ttbf_fac', player.getDynamicProperty('tbf_fac') ?? player.getRotation().y);
            player.setDynamicProperty('tbf_fac', player.getDynamicProperty('fac') ?? player.getRotation().y);
            player.setDynamicProperty('fac', player.getRotation().y);
            player.setDynamicProperty('pitch', player.getRotation().x);
            //velocity
            player.setDynamicProperty('tbf_vel', player.getDynamicProperty('vel') && player.getVelocity());
            player.setDynamicProperty('vel', player.getVelocity());
            player.setDynamicProperty('ttbf_tt_vel', player.getDynamicProperty('tbf_tt_vel') ?? Math.sqrt(player.getDynamicProperty('vel').x ** 2 + player.getDynamicProperty('vel').y ** 2));
            player.setDynamicProperty('tbf_tt_vel', player.getDynamicProperty('tt_vel') ?? Math.sqrt(player.getDynamicProperty('vel').x ** 2 + player.getDynamicProperty('vel').y ** 2));
            player.setDynamicProperty('tt_vel', Math.sqrt(player.getDynamicProperty('vel').x ** 2 + player.getDynamicProperty('vel').z ** 2));
            //isOnGround
            player.setDynamicProperty('tttbf_isOnGround', player.getDynamicProperty('ttbf_isOnGround') ?? player.isOnGround);
            player.setDynamicProperty('ttbf_isOnGround', player.getDynamicProperty('tbf_isOnGround') ?? player.isOnGround);
            player.setDynamicProperty('tbf_isOnGround', player.getDynamicProperty('isOnGround') ?? player.isOnGround);
            player.setDynamicProperty('isOnGround', player.isOnGround);
            player.setDynamicProperty('tbf_isSprinting', player.getDynamicProperty('isSprinting') ?? player.isSprintng);
            player.setDynamicProperty('isSprinting', player.isSprinting);
            //last turning
            if (player.getDynamicProperty('fac') != player.getDynamicProperty('tbf_fac')) { player.setDynamicProperty('lastTurning', player.getDynamicProperty('fac') - player.getDynamicProperty('tbf_fac')) }
            //isJumping
            player.setDynamicProperty('tbf_isJumping', player.getDynamicProperty('isJumping') ?? player.isJumping)
            player.setDynamicProperty('isJumping', player.isJumping)
            //last input
            player.setDynamicProperty('input', getPlayerControlMovement(player));
            //loading
            let pos = player.getDynamicProperty('pos');
            let tbf_pos = player.getDynamicProperty('tbf_pos');
            let ttbf_pos = player.getDynamicProperty('ttbf_pos');
            let fac = player.getDynamicProperty('fac');
            let tbf_fac = player.getDynamicProperty('tbf_fac');
            let ttbf_fac = player.getDynamicProperty('ttbf_fac');
            let pitch = player.getDynamicProperty('pitch');
            let lastTurning = player.getDynamicProperty('lastTurning') ?? 0;
            let input = player.getDynamicProperty('input');
            let vel = player.getDynamicProperty('vel');
            let tbf_vel = player.getDynamicProperty('tbf_vel');
            let tt_vel = player.getDynamicProperty('tt_vel');
            let tbf_tt_vel = player.getDynamicProperty('tbf_tt_vel');
            let ttbf_tt_vel = player.getDynamicProperty('ttbf_tt_vel');
            let vel_fac;
            if (vel.z >= 0) { vel_fac = Math.atan(vel.x / vel.z) * -180 / Math.PI } else { if (vel.x >= 0) { vel_fac = (Math.atan(vel.x / vel.z) * -180 / Math.PI) - 180 } else { vel_fac = (Math.atan(vel.x / vel.z) * -180 / Math.PI) + 180 }; };
            if (vel_fac != vel_fac) { vel_fac = 0 };
            let isSprinting = player.getDynamicProperty('isSprinting');
            let tbf_isSprinting = player.getDynamicProperty('tbf_isSprinting');
            let isOnGround = player.getDynamicProperty('isOnGround');
            let tbf_isOnGround = player.getDynamicProperty('tbf_isOnGround');
            let ttbf_isOnGround = player.getDynamicProperty('ttbf_isOnGround');
            let tttbf_isOnGround = player.getDynamicProperty('tttbf_isOnGround');
            let isJumping = player.getDynamicProperty('isJumping');
            let tbf_isJumping = player.getDynamicProperty('tbf_isJumping');
            let lb_x = player.getDynamicProperty('lb_x') ?? 0;
            let lb_y = player.getDynamicProperty('lb_y') ?? 0;
            let lb_z = player.getDynamicProperty('lb_z') ?? 0;
            let lb_type = player.getDynamicProperty('lb_type') ?? 0;
            let pTF = player.getDynamicProperty('pTF') ?? 6;
            let rTF = player.getDynamicProperty('rTF') ?? 4;
            let tc1 = player.getDynamicProperty('tc1') ?? 'd';
            let tc2 = player.getDynamicProperty('tc2') ?? 'f';
            let prefix = player.getDynamicProperty('prefix') ?? '<ZPK>';
            let lb_x_fac = player.getDynamicProperty('lb_x_fac') ?? true;
            let lb_z_fac = player.getDynamicProperty('lb_z_fac') ?? true;
            let offset_limit = player.getDynamicProperty('offset_limit') ?? 0.5;
            let sendpb = player.getDynamicProperty('sendpb') ?? true;
            let sendpb_z = player.getDynamicProperty('sendpb_z') ?? false;
            let sendpb_x = player.getDynamicProperty('sendpb_x') ?? false;
            let sendoffset = player.getDynamicProperty('sendoffset') ?? false;
            let sendoffset_z = player.getDynamicProperty('sendoffset_z') ?? false;
            let sendoffset_x = player.getDynamicProperty('sendoffset_x') ?? false;
            let ui_symbol;
            let text_pos;
            let text_fac;
            let text_pitch;
            let text_jumpAngle;
            let text_hitAngle;
            let text_land;
            let text_hit;
            let text_speed;
            let text_ttspeed;
            let text_tier;
            let text_offset;
            let text_pb;
            let text_turn;
            let text_strat;
            let text_input;
            let text_sidestep;
            let text_preturn;
            let text_secondturn;
            let switch_pos = player.getDynamicProperty('switch_pos') ?? true;
            let switch_fac = player.getDynamicProperty('switch_fac') ?? true;
            let switch_pitch = player.getDynamicProperty('switch_pitch') ?? false;
            let switch_jumpAngle = player.getDynamicProperty('switch_jumpAngle') ?? true;
            let switch_hitAngle = player.getDynamicProperty('switch_hitAngle') ?? true;
            let switch_land = player.getDynamicProperty('switch_land') ?? true;
            let switch_hit = player.getDynamicProperty('switch_hit') ?? false;
            let switch_offset = player.getDynamicProperty('switch_offset') ?? true;
            let switch_speed = player.getDynamicProperty('switch_speed') ?? false;
            let switch_ttspeed = player.getDynamicProperty('switch_ttspeed') ?? false;
            let switch_tier = player.getDynamicProperty('switch_tier') ?? false;
            let switch_pb = player.getDynamicProperty('switch_pb') ?? true;
            let switch_turn = player.getDynamicProperty('switch_turn') ?? false;
            let switch_input = player.getDynamicProperty('switch_input') ?? false;
            let switch_preturn = player.getDynamicProperty('switch_preturn') ?? false;
            let switch_sidestep = player.getDynamicProperty('switch_sidestep') ?? false;
            let switch_secondturn = player.getDynamicProperty('switch_secondturn') ?? true;
            let isN;
            let switch_strat = player.getDynamicProperty('switch_strat') ?? true;
            let customText = player.getDynamicProperty('customText') ?? '§l§o§7ZPK Mod V7.0.5';
            let isa7Full = player.getDynamicProperty('isa7Full') ?? false;
            let isJaFull = player.getDynamicProperty('isJaFull') ?? false;
            let isStratFull = player.getDynamicProperty('isStratFull') ?? false;
            let cpitem = player.getDynamicProperty('cpitem') ?? 'minecraft:emerald';
            let tpitem = player.getDynamicProperty('tpitem') ?? 'minecraft:red_dye';
            let text_strat_full;
            let text_jumpAngle_full;
            if (isJaFull) { text_jumpAngle_full = "Jump Angle" } else { text_jumpAngle_full = "JA" };
            if (isStratFull) { text_strat_full = "Last Timing" } else { text_strat_full = "Strat" };
            let tier = player.getDynamicProperty('tier') ?? 0;
            let gmchanger = player.getDynamicProperty('gmchanger') ?? 'minecraft:cyan_dye';
            let ui_symbol_number = player.getDynamicProperty('ui_symbol_number') ?? 0;
            if (ui_symbol_number == 0) { ui_symbol = ':' } else
                if (ui_symbol_number == 1) { ui_symbol = ': ' } else
                    if (ui_symbol_number == 2) { ui_symbol = '> ' } else
                        if (ui_symbol_number == 3) { ui_symbol = ' ' };
            let facXZ;
            if ((fac < 45 && fac > -45) || (fac > 135 || fac < -135)) { facXZ = 'Z' } else (facXZ = 'X');
            let cp_x = player.getDynamicProperty('cp_x');
            let cp_y = player.getDynamicProperty('cp_y');
            let cp_z = player.getDynamicProperty('cp_z');
            let cp_f = player.getDynamicProperty('cp_f');
            let cp_p = player.getDynamicProperty('cp_p');
            let date = new Date(1970, 0, 1, 0, 0, 0, Date.now());
            let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

            //land&hit
            if (isOnGround == true && tbf_isOnGround == false) {
                player.setDynamicProperty('land_pos', tbf_pos)
                player.setDynamicProperty('hit_pos', pos)
            };
            let land_pos = player.getDynamicProperty('land_pos') ?? player.location;
            let hit_pos = player.getDynamicProperty('hit_pos') ?? player.location;

            //jumpAngle
            if (ttbf_isOnGround == true && isOnGround == false && player.isJumping) {
                player.setDynamicProperty('jumpAngle', player.getRotation().y);
            };
            let jumpAngle = player.getDynamicProperty('jumpAngle') ?? 0;

            //hitAngle
            if (ttbf_isOnGround == false && tbf_isOnGround == true) {
                player.setDynamicProperty('hitAngle', fac)
            };
            let hitAngle = player.getDynamicProperty('hitAngle') ?? 0;

            //preturn
            if (ttbf_isOnGround == true && isOnGround == false && player.isJumping) {
                player.setDynamicProperty('preturn', player.getDynamicProperty('tbf_fac') - player.getDynamicProperty('ttbf_fac'));
            }
            /*
            if (delayed_preturn == false && ttbf_isOnGround == false && tbf_isOnGround == true) {
                player.setDynamicProperty('preturn', player.getDynamicProperty('fac') - player.getDynamicProperty('tbf_fac'))
            } else if (delayed_preturn == true && tttbf_isOnGround == false && ttbf_isOnGround == true && tbf_isOnGround == true) {
                player.setDynamicProperty('preturn', player.getDynamicProperty('fac') - player.getDynamicProperty('tbf_fac'))
            }*/
            let preturn = player.getDynamicProperty('preturn') ?? 0;

            //secondturn
            if (player.getDynamicProperty('airtime') == 2) {
                player.setDynamicProperty('secondturn', fac - tbf_fac);
            };
            let secondturn = player.getDynamicProperty('secondturn') ?? 0;

            //tier
            if (tbf_isOnGround == true && isOnGround == false) {
                player.setDynamicProperty('tier', 10);
            } else if (tbf_isOnGround == false && isOnGround == false) {
                player.setDynamicProperty('tier', ((player.getDynamicProperty('tier') ?? 0) - 1) ?? 0);
            };

            //LANDING BLOCKS
            if (pos.y.toFixed(4) <= lb_y && tbf_pos.y.toFixed(4) > lb_y) {
                let offset_x;
                let offset_z;
                let offset;
                let pb = player.getDynamicProperty('pb') ?? (offset_limit * -2);
                let pb_x = player.getDynamicProperty('pb_x') ?? (offset_limit * -1);
                let pb_z = player.getDynamicProperty('pb_z') ?? (offset_limit * -1);
                if (lb_type == 'zneo' && lb_z_fac == true) {
                    offset_z = (ttbf_pos.z - lb_z);
                } else if (lb_type == 'zneo' && lb_z_fac == false) {
                    offset_z = (lb_z - ttbf_pos.z);
                } else if (lb_type != 'zneo' && lb_z_fac == true) {
                    offset_z = (tbf_pos.z - lb_z);
                } else if (lb_type != 'zneo' && lb_z_fac == false) {
                    offset_z = (lb_z - tbf_pos.z);
                };
                if (lb_x_fac == true) {
                    offset_x = (tbf_pos.x - lb_x);
                } else if (lb_x_fac == false) {
                    offset_x = (lb_x - tbf_pos.x);
                };
                if (player.getDynamicProperty('inv_x')) offset_x *= -1;
                if (player.getDynamicProperty('inv_z')) offset_z *= -1;
                if (offset_z >= 0 && offset_x <= 0) {
                    offset = offset_x;
                } else if (offset_z <= 0 && offset_x >= 0) {
                    offset = offset_z;
                } else if (offset_z >= 0 && offset_x >= 0) {
                    offset = Math.sqrt(offset_x ** 2 + offset_z ** 2);
                } else if (offset_z < 0 && offset_x < 0) {
                    offset = (Math.sqrt(offset_x ** 2 + offset_z ** 2) * -1);
                };
                if (((lb_type == 'both' || lb_type == 'zneo') && (offset_z >= (offset_limit * -1)) && (offset_z <= offset_limit) && (offset_x >= (offset_limit * -1)) && (offset_x <= offset_limit)) || ((lb_type == 'x') && (offset_x >= (offset_limit * -1)) && (offset_x <= offset_limit)) || ((lb_type == 'z') && (offset_z >= (offset_limit * -1)) && (offset_z <= offset_limit))) {
                    player.setDynamicProperty('offset', offset);
                    player.setDynamicProperty('offset_x', offset_x);
                    player.setDynamicProperty('offset_z', offset_z);
                    if (offset > pb) {
                        player.setDynamicProperty('pb', offset);
                        if (sendpb == true && (lb_type == 'zneo' || lb_type == 'both')) {
                            player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§${tc2}New pb! : ${player.getDynamicProperty('pb').toFixed(pTF)}"}]}`);
                        };
                    };
                    if (offset_z > pb_z) {
                        player.setDynamicProperty('pb_z', offset_z);
                        if ((sendpb_z == true && (lb_type != 'x')) || (sendpb == true && (lb_type == 'z'))) {
                            player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§${tc2}New pb Z! : ${player.getDynamicProperty('pb_z').toFixed(pTF)}"}]}`);
                        };
                    };
                    if (offset_x > pb_x) {
                        player.setDynamicProperty('pb_x', offset_x);
                        if ((sendpb_x == true && (lb_type != 'z')) || (sendpb == true && (lb_type == 'x'))) {
                            player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§${tc2}New pb X! : ${player.getDynamicProperty('pb_x').toFixed(pTF)}"}]}`);
                        };
                    };
                    if ((lb_type == 'both' || lb_type == 'zneo') && sendoffset == true) {
                        player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§l§${tc2}Offset: ${offset.toFixed(pTF)}"}]}`);
                    };
                    if ((lb_type == 'z' && (sendoffset == true || sendoffset_z == true)) || ((lb_type == 'both' || lb_type == 'zneo') && sendoffset_z == true)) {
                        player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§l§${tc2}Offset Z: ${offset_z.toFixed(pTF)}"}]}`);
                    };
                    if ((lb_type == 'x' && (sendoffset == true || sendoffset_x == true)) || ((lb_type == 'both' || lb_type == 'zneo') && sendoffset_x == true)) {
                        player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§l§${tc2}Offset X: ${offset_x.toFixed(pTF)}"}]}`);
                    };
                };
            };
            let pb = player.getDynamicProperty('pb') ?? (offset_limit * -2);
            let pb_x = player.getDynamicProperty('pb_x') ?? (offset_limit * -1);
            let pb_z = player.getDynamicProperty('pb_z') ?? (offset_limit * -1);
            let offset = player.getDynamicProperty('offset') ?? 0;
            let offset_x = player.getDynamicProperty('offset_x') ?? 0;
            let offset_z = player.getDynamicProperty('offset_z') ?? 0;

            //setting

            if (pitch.toFixed(4) == '-89.9000' && player.isSneaking == true) {
                player.teleport({ x: pos.x, y: pos.y, z: pos.z }, { rotation: { x: 0, y: fac } });
                settingMain()
            };
            function settingUI() {
                const settingUI = new ui.ModalFormData()
                settingUI.title("§lZPK Mod UI Setting")
                settingUI.toggle("Position\n§7(hide/show)", switch_pos)
                settingUI.toggle("Pitch\n§7(hide/show)", switch_pitch)
                settingUI.toggle("Facing\n§7(hide/show)", switch_fac)
                settingUI.toggle("Jump Angle\n§7(hide/show)", switch_jumpAngle)
                settingUI.toggle("Hit Angle\n§7(hide/show)", switch_hitAngle)
                settingUI.toggle("Speed\n§7(hide/show)", switch_speed)
                settingUI.toggle("Speed Vector\n§7(hide/show)", switch_ttspeed)
                settingUI.toggle("Tier\n§7(hide/show)", switch_tier)
                settingUI.toggle("Last Landing\n§7(hide/show)", switch_land)
                settingUI.toggle("Hit\n§7(hide/show)", switch_hit)
                settingUI.toggle("Offset\n§7(hide/show)", switch_offset)
                settingUI.toggle("PB\n§7(hide/show)", switch_pb)
                settingUI.toggle("Last Turning\n§7(hide/show)", switch_turn)
                settingUI.toggle("Last Input\n§7(hide/show)", switch_input);
                settingUI.toggle("Preturn\n§7(hide/show)", switch_preturn)
                settingUI.toggle("Last Sidestep\n§7(hide/show)", switch_sidestep)
                settingUI.toggle("Second turn\n§7(hide/show)", switch_secondturn)
                settingUI.toggle("Strat(WIP)\n§7(hide/show)", switch_strat)
                settingUI.show(player).then((settingUI) => {
                    player.setDynamicProperty('switch_pos', settingUI.formValues[0]);
                    player.setDynamicProperty('switch_pitch', settingUI.formValues[1]);
                    player.setDynamicProperty('switch_fac', settingUI.formValues[2]);
                    player.setDynamicProperty('switch_jumpAngle', settingUI.formValues[3]);
                    player.setDynamicProperty('switch_hitAngle', settingUI.formValues[4]);
                    player.setDynamicProperty('switch_speed', settingUI.formValues[5]);
                    player.setDynamicProperty('switch_ttspeed', settingUI.formValues[6]);
                    player.setDynamicProperty('switch_tier', settingUI.formValues[7]);
                    player.setDynamicProperty('switch_land', settingUI.formValues[8]);
                    player.setDynamicProperty('switch_hit', settingUI.formValues[9]);
                    player.setDynamicProperty('switch_offset', settingUI.formValues[10]);
                    player.setDynamicProperty('switch_pb', settingUI.formValues[11]);
                    player.setDynamicProperty('switch_turn', settingUI.formValues[12]);
                    player.setDynamicProperty('switch_input', settingUI.formValues[13]);
                    player.setDynamicProperty('switch_preturn', settingUI.formValues[14]);
                    player.setDynamicProperty('switch_sidestep', settingUI.formValues[15]);
                    player.setDynamicProperty('switch_secondturn', settingUI.formValues[16]);
                    player.setDynamicProperty('switch_strat', settingUI.formValues[17]);
                })
            };
            function settingCustom() {
                const settingCustom = new ui.ModalFormData()
                settingCustom.title("§lZPK Mod Custom Setting")
                settingCustom.textField("--Colors:\n§00§11§22§33§44§55§66§77§88§99§aa§bb§cc§dd§ee§ff§gg§hh§ii§jj§r§kk§r§ll§r§mm§nn§r§oo§r§pp§qq§rr§ss§tt§uu\n§r0: §0abc§rk:§kabc§r l:§labc §ro:§oabc §rr:clear\nTextColor 1(0-9/a-u)", "0-9/a-u", tc1)
                settingCustom.textField("Text Color 2(0-9/a-u)", "0-9/a-u", tc2)
                settingCustom.textField("Prefix", "<ZPK>", prefix)
                settingCustom.textField("Custom Text", "text", customText)
                settingCustom.textField("Teleport Item", "id", tpitem)
                settingCustom.textField("Check Point Item", "id", cpitem)
                settingCustom.textField("Game Mode Changer", "id", gmchanger)
                settingCustom.toggle("Jump Angle Text\n§7(JA/Jump Angle)", isJaFull)
                settingCustom.toggle("Strat Text\n§7(Strat/Last Timing)", isStratFull)
                settingCustom.toggle("a7 Text\n§7(a7/pessi)", isa7Full)
                settingCustom.dropdown('UI Symbol', [':', ': +blankSpace', '> +blankSpace', 'None'], ui_symbol_number)
                settingCustom.show(player).then((settingCustom) => {
                    player.setDynamicProperty('tc1', settingCustom.formValues[0]);
                    player.setDynamicProperty('tc2', settingCustom.formValues[1]);
                    player.setDynamicProperty('prefix', settingCustom.formValues[2]);
                    player.setDynamicProperty('customText', settingCustom.formValues[3]);
                    player.setDynamicProperty('tpitem', settingCustom.formValues[4]);
                    player.setDynamicProperty('cpitem', settingCustom.formValues[5]);
                    player.setDynamicProperty('gmchanger', settingCustom.formValues[6]);
                    player.setDynamicProperty('isJaFull', settingCustom.formValues[7]);
                    player.setDynamicProperty('isStratFull', settingCustom.formValues[8]);
                    player.setDynamicProperty('isa7Full', settingCustom.formValues[9]);
                    player.setDynamicProperty('ui_symbol_number', settingCustom.formValues[10]);
                })
            };
            function settingOthers() {
                const settingOthers = new ui.ModalFormData()
                settingOthers.title("§lZPK Mod Others Setting")
                settingOthers.slider("Pos Precition§o§7(plz reset lb after setting this)§r", 2, 20, 1, pTF)
                settingOthers.slider("Rot Precision", 0, 20, 1, rTF)
                settingOthers.toggle("Send Total offset in chat", sendoffset)
                settingOthers.toggle("Send offset x in chat", sendoffset_x)
                settingOthers.toggle("Send offset z in chat", sendoffset_z)
                settingOthers.toggle("Send Total PB in chat", sendpb)
                settingOthers.toggle("Send PB x in chat", sendpb_x)
                settingOthers.toggle("Send PB z in chat", sendpb_z)
                settingOthers.show(player).then((settingOthers) => {
                    player.setDynamicProperty('pTF', settingOthers.formValues[0]);
                    player.setDynamicProperty('rTF', settingOthers.formValues[1]);
                    player.setDynamicProperty('sendoffset', settingOthers.formValues[2]);
                    player.setDynamicProperty('sendoffset_x', settingOthers.formValues[3]);
                    player.setDynamicProperty('sendoffset_z', settingOthers.formValues[4]);
                    player.setDynamicProperty('sendpb', settingOthers.formValues[5]);
                    player.setDynamicProperty('sendpb_x', settingOthers.formValues[6]);
                    player.setDynamicProperty('sendpb_z', settingOthers.formValues[7]);
                })
            };
            function settingLB() {
                const settingLB = new ui.ModalFormData()
                settingLB.title("§lZPK Mod Landing Block Setting")
                settingLB.slider("Offset limit(x0.1)", 1, 15, 1, offset_limit * 10)
                settingLB.toggle("LB x facing\n§7(-/+)", lb_x_fac)
                settingLB.toggle("LB z facing\n§7(-/+)", lb_z_fac);
                settingLB.show(player).then((settingLB) => {
                    player.setDynamicProperty('offset_limit', settingLB.formValues[0] / 10);
                    player.setDynamicProperty('lb_x_fac', settingLB.formValues[1]);
                    player.setDynamicProperty('lb_z_fac', settingLB.formValues[2]);
                })
            };
            function setLBUIAuto() {
                const setLBUIAuto = new ui.ActionFormData()
                setLBUIAuto.title("§lLanding Block Type")
                setLBUIAuto.button("§lBoth")
                setLBUIAuto.button("§lX")
                setLBUIAuto.button("§lZ")
                setLBUIAuto.button("§lZneo")
                setLBUIAuto.show(player).then((setLBUIAuto) => {
                    if (setLBUIAuto.selection === 0) {
                        player.setDynamicProperty('lb_x', player.location.x);
                        player.setDynamicProperty('lb_y', player.location.y);
                        player.setDynamicProperty('lb_z', player.location.z);
                        player.setDynamicProperty('lb_type', 'both');
                        system.run(() => { player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§${tc2}Set landing block(both) successfully!"}]}`); });
                    } else if (setLBUIAuto.selection === 1) {
                        player.setDynamicProperty('lb_x', player.location.x);
                        player.setDynamicProperty('lb_y', player.location.y);
                        player.setDynamicProperty('lb_z', player.location.z);
                        player.setDynamicProperty('lb_type', 'x');
                        system.run(() => { player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§${tc2}Set landing block(x) successfully!"}]}`); });
                    } else if (setLBUIAuto.selection === 2) {
                        player.setDynamicProperty('lb_x', player.location.x);
                        player.setDynamicProperty('lb_y', player.location.y);
                        player.setDynamicProperty('lb_z', player.location.z);
                        player.setDynamicProperty('lb_type', 'z');
                        system.run(() => { player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§${tc2}Set landing block(z) successfully!"}]}`); });
                    } else if (setLBUIAuto.selection === 3) {
                        player.setDynamicProperty('lb_x', player.location.x);
                        player.setDynamicProperty('lb_y', player.location.y);
                        player.setDynamicProperty('lb_z', player.location.z);
                        player.setDynamicProperty('lb_type', 'zneo');
                        system.run(() => { player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§${tc1}${prefix}§r§${tc2}Set landing block(zneo) successfully!"}]}`); });
                    };
                });
            };
            function setLBUIManu() {
                let lbtypeNum;
                if (lb_type == 'both') { lbtypeNum = 0 } else
                    if (lb_type == 'x') { lbtypeNum = 1 } else
                        if (lb_type == 'z') { lbtypeNum = 2 } else
                            if (lb_type == 'zneo') { lbtypeNum = 3 };
                const setLBUIManu = new ui.ModalFormData()
                setLBUIManu.title("§lLanding Block")
                setLBUIManu.textField("LB x", `${lb_x}`, `${lb_x}`)
                setLBUIManu.textField("LB y", `${lb_y}`, `${lb_y}`)
                setLBUIManu.textField("LB z", `${lb_z}`, `${lb_z}`)
                setLBUIManu.dropdown('Type', ['Both', 'X', 'Z', 'Zneo'], lbtypeNum)
                setLBUIManu.show(player).then((setLBUIManu) => {
                    player.setDynamicProperty('lb_x', parseFloat(setLBUIManu.formValues[0]));
                    player.setDynamicProperty('lb_y', parseFloat(setLBUIManu.formValues[1]));
                    player.setDynamicProperty('lb_z', parseFloat(setLBUIManu.formValues[2]));
                    lbtypeNum = setLBUIManu.formValues[3];
                    if (lbtypeNum == 0) { player.setDynamicProperty('lb_type', 'both') } else
                        if (lbtypeNum == 1) { player.setDynamicProperty('lb_type', 'x') } else
                            if (lbtypeNum == 2) { player.setDynamicProperty('lb_type', 'z') } else
                                if (lbtypeNum == 3) { player.setDynamicProperty('lb_type', 'zneo') };
                })
            };
            function setCPUI() {
                const setCPUI = new ui.ModalFormData()
                setCPUI.title("§lCheck Point")
                setCPUI.textField("CP x", `${cp_x}`, `${cp_x}`)
                setCPUI.textField("CP y", `${cp_y}`, `${cp_y}`)
                setCPUI.textField("CP z", `${cp_z}`, `${cp_z}`)
                setCPUI.textField("CP f", `${cp_f}`, `${cp_f}`)
                setCPUI.textField("CP p", `${cp_p}`, `${cp_p}`)
                setCPUI.show(player).then((setCPUI) => {
                    player.setDynamicProperty('cp_x', parseFloat(setCPUI.formValues[0]));
                    player.setDynamicProperty('cp_y', parseFloat(setCPUI.formValues[1]));
                    player.setDynamicProperty('cp_z', parseFloat(setCPUI.formValues[2]));
                    player.setDynamicProperty('cp_f', parseFloat(setCPUI.formValues[3]));
                    player.setDynamicProperty('cp_p', parseFloat(setCPUI.formValues[4]));
                })
            };
            function PBUI() {
                const PBUI = new ui.ModalFormData()
                PBUI.title("§lPB")
                PBUI.textField("PB", `${pb}`, `${pb}`)
                PBUI.textField("PB x", `${pb_x}`, `${pb_x}`)
                PBUI.textField("PB z", `${pb_z}`, `${pb_z}`)
                PBUI.show(player).then((PBUI) => {
                    player.setDynamicProperty('pb', parseFloat(PBUI.formValues[0]));
                    player.setDynamicProperty('pb_x', parseFloat(PBUI.formValues[1]));
                    player.setDynamicProperty('pb_z', parseFloat(PBUI.formValues[2]));
                })
            };
            function setLBUI() {
                const setLBUI = new ui.ActionFormData()
                setLBUI.title("§lLanding Block")
                setLBUI.button("§lAuto Mode\n(On your position)")
                setLBUI.button("§lManual Mode")
                setLBUI.show(player).then((setLBUI) => {
                    if (setLBUI.selection === 0) {
                        setLBUIAuto()
                    } else if (setLBUI.selection === 1) {
                        setLBUIManu()
                    };
                });
            };
            function settingTools() {
                const settingTools = new ui.ActionFormData()
                settingTools.title("§lZPK Mod Tools")
                settingTools.button(`§lGive Teleport Item\n(${tpitem})`)
                settingTools.button(`§lGive Check Point Item\n(${cpitem})`)
                settingTools.button(`§lGive Game Mode Changer\n(${gmchanger})`)
                settingTools.button("§lClear level")
                settingTools.button("§lClear PB")
                settingTools.button("§lSet Landing Block")
                settingTools.button("§lChange Check Point")
                settingTools.button("§lChange PB")
                settingTools.show(player).then((settingTools) => {
                    if (settingTools.selection === 0) {
                        player.runCommand(`give @s ${tpitem}`)
                    } else if (settingTools.selection === 1) {
                        player.runCommand(`give @s ${cpitem}`)
                    } else if (settingTools.selection === 2) {
                        player.runCommand(`give @s ${gmchanger}`)
                    } else if (settingTools.selection === 3) {
                        player.resetLevel()
                    } else if (settingTools.selection === 4) {
                        player.setDynamicProperty('offset', 0);
                        player.setDynamicProperty('offset_x', 0);
                        player.setDynamicProperty('offset_z', 0);
                        player.setDynamicProperty('pb', (offset_limit * -2));
                        player.setDynamicProperty('pb_x', (offset_limit * -1));
                        player.setDynamicProperty('pb_z', (offset_limit * -1));
                        system.run(() => { player.runCommand(`tellraw @s {"rawtext":[{"text":"§${tc1}§l${prefix}§r§${tc2}Clear PB successfully!"}]}`); });
                    } else if (settingTools.selection === 5) {
                        setLBUI()
                    } else if (settingTools.selection === 6) {
                        setCPUI()
                    } else if (settingTools.selection === 7) {
                        PBUI()
                    };
                });
            };
            function settingMain() {
                const settingMain = new ui.ActionFormData()
                settingMain.title("§lZPK Mod Setting")
                settingMain.button("§lUI")
                settingMain.button("§lCustom")
                settingMain.button("§lOthers")
                settingMain.button("§lLanding block")
                settingMain.button("§lTools")
                settingMain.show(player).then((settingMain) => {
                    if (settingMain.selection === 0) {
                        settingUI()
                    } else if (settingMain.selection === 1) {
                        settingCustom()
                    } else if (settingMain.selection === 2) {
                        settingOthers()
                    } else if (settingMain.selection === 3) {
                        settingLB()
                    } else if (settingMain.selection === 4) {
                        settingTools()
                    };
                });
            };
            //strat
            if (isOnGround) {
                player.setDynamicProperty('airtime', 0);
            } else {
                player.setDynamicProperty('airtime', (player.getDynamicProperty('airtime') + 1));
            };
            if ((tt_vel == 0) || (tbf_isOnGround == false && isOnGround == true)) {
                player.setDynamicProperty('walktime', 0);
            } else if (isOnGround == true && tt_vel != 0) {
                player.setDynamicProperty('walktime', (player.getDynamicProperty('walktime') + 1));
            };
            let airtime = player.getDynamicProperty('airtime');
            let walktime = player.getDynamicProperty('walktime');
            let hhTicks;
            let fmmTicks;
            let pessiTicks;
            if ((ttbf_isOnGround == true || tbf_tt_vel == 0) && tbf_isOnGround == true && isOnGround == false && tt_vel != 0 && isJumping == true && vel.y > 0) {
                hhTicks = walktime;
                player.setDynamicProperty('strat', `HH ${hhTicks}t`);
                if (player.getDynamicProperty('strat') == 'HH 0t') {
                    player.setDynamicProperty('strat', 'Jam');
                }
            } else if (tbf_isOnGround == false && isOnGround == false && tbf_tt_vel == 0 && tt_vel != 0) {
                pessiTicks = -1 * airtime + 1;
                player.setDynamicProperty('strat', `Pessi ${pessiTicks}t`);
                if (player.getDynamicProperty('strat') == 'Pessi -1t') { player.setDynamicProperty('strat', 'Max pessi') };
            } else if (tbf_isOnGround == false && isOnGround == true && tbf_tt_vel == 0 && tt_vel != 0) {
                if (isa7Full) {
                    pessiTicks = -1 * airtime + 1;
                    player.setDynamicProperty('strat', `Pessi -${pessiTicks}t`);
                } else {
                    player.setDynamicProperty('strat', `a7`);
                };
            } else if (tbf_isOnGround == false && isOnGround == false && tbf_tt_vel != 0 && player.getDynamicProperty('strat') == 'Jam' && tbf_isSprinting == false && isSprinting == true) {
                fmmTicks = airtime - 1;
                player.setDynamicProperty('strat', `FMM ${fmmTicks}t`);
                if (player.getDynamicProperty('strat') == 'FMM 1t') {
                    player.setDynamicProperty('strat', `Max FMM`);
                };
            };
            let strat = player.getDynamicProperty('strat');

            //jump sound
            let sound_pitch = Math.random() * (1.25 - 0.75) + 0.76;
            if (isJumping == true && vel.y > 0 && tbf_isOnGround == true) {
                if (soundpack == 0) {
                    player.runCommand(`playsound random.chestopen @s ~ ~ ~ 0.5 ${sound_pitch}`);
                } else if (soundpack == 1) {
                    player.runCommand(`playsound random.anvil_land @s ~ ~ ~ 0.5 1`);
                };
            };

            //sidestep
            let jinput;
            if (isJumping == true && vel.y > 0 && tbf_isOnGround == true) {
                player.setDynamicProperty('j_airtime', 0);
                jinput = player.getDynamicProperty('input');
                if (jinput.includes("A") || jinput.includes("D")) {
                    player.setDynamicProperty("sidestep", "WDWA");
                } else player.setDynamicProperty("sidestep", "None");
            } else if (tbf_isOnGround == false) {
                player.setDynamicProperty('j_airtime', player.getDynamicProperty('j_airtime') + 1);
                if (player.getDynamicProperty('sidestep') == "None" && (player.getDynamicProperty('input').includes("A") || player.getDynamicProperty('input').includes("D"))) player.setDynamicProperty('sidestep', `WAD ${player.getDynamicProperty('j_airtime')}t`);
            }

            let sidestep = player.getDynamicProperty('sidestep');

            //加速度
            let acceleration_z;
            let drag;
            if (ttbf_isOnGround) { drag = 0.546 } else { drag = 0.91 };
            acceleration_z = (vel.z - tbf_vel.z * drag);

            //texts
            if (switch_pos) { text_pos = `\n§r§${tc1}X${ui_symbol}§r§${tc2}${pos.x.toFixed(pTF)} §r§${tc1}Y${ui_symbol}§r§${tc2}${pos.y.toFixed(pTF)} §r§${tc1}Z${ui_symbol}§r§${tc2}${pos.z.toFixed(pTF)}` }
            else { text_pos = "" };
            if (switch_pitch) { text_pitch = `§r§${tc1}P${ui_symbol}§r§${tc2}${pitch.toFixed(rTF)}゜ ` }
            else { text_pitch = "" };
            if (switch_fac) { text_fac = `§r§${tc1}F${ui_symbol}§r§${tc2}${fac.toFixed(rTF)}゜ ` } //°
            else { text_fac = "" };
            let text_fac2 = `§r§${tc1}F${ui_symbol}§r§${tc2}${player.getRotation().y.toFixed(rTF)}° `
            if (switch_jumpAngle) { text_jumpAngle = `§r§${tc1}${text_jumpAngle_full}${ui_symbol}§r§${tc2}${jumpAngle.toFixed(rTF)}゜ ` }
            else { text_jumpAngle = "" };
            let text_ja2 = `§r§${tc1}${text_jumpAngle_full}${ui_symbol}§r§${tc2}${jumpAngle.toFixed(rTF)}° `
            if (switch_hitAngle) { text_hitAngle = `§r§${tc1}Hit Angle${ui_symbol}§r§${tc2}${hitAngle.toFixed(rTF)}°` }
            else { text_hitAngle = "" };
            if (switch_pitch || switch_fac || switch_jumpAngle || switch_hitAngle) { isN = `\n` }
            else { isN = "" };
            if (switch_speed) { text_speed = `\n§r§${tc1}Speed (b/t) X${ui_symbol}§r§${tc2}${vel.x.toFixed(pTF)} §r§${tc1}Y${ui_symbol}§r§${tc2}${vel.y.toFixed(pTF)} §r§${tc1}Z${ui_symbol}§r§${tc2}${vel.z.toFixed(pTF)}` }
            else { text_speed = "" };
            if (switch_ttspeed) { text_ttspeed = `\n§r§${tc1}Speed Vector${ui_symbol}§r§${tc2}${tt_vel.toFixed(pTF)}§r§${tc1}/§r§${tc2}${vel_fac.toFixed(rTF)}°` }
            else { text_ttspeed = "" };
            if (switch_tier == true && switch_ttspeed == true) { text_tier = ` §r§${tc1}Tier${ui_symbol}§r§${tc2}${tier}` }
            else if (switch_tier == true && switch_ttspeed == false) { text_tier = `\n§r§${tc1}Tier${ui_symbol}§r§${tc2}${tier}` }
            else { text_tier = "" };
            if (switch_land) { text_land = `\n§r§${tc1}Last landing X${ui_symbol}§r§${tc2}${land_pos.x.toFixed(pTF)} §r§${tc1}Y${ui_symbol}§r§${tc2}${land_pos.y.toFixed(pTF)} §r§${tc1} Z${ui_symbol}§r§${tc2}${land_pos.z.toFixed(pTF)}` }
            else { text_land = "" };
            if (switch_hit) { text_hit = `\n§r§${tc1}Hit X${ui_symbol}§r§${tc2}${hit_pos.x.toFixed(pTF)} §r§${tc1}Y${ui_symbol}§r§${tc2}${hit_pos.y.toFixed(pTF)}§r§${tc1} Z${ui_symbol}§r§${tc2}${hit_pos.z.toFixed(pTF)}` }
            else { text_hit = "" };
            let text_hitx2 = `\n§r§${tc1}Hit X${ui_symbol}§r§${tc2}${hit_pos.x.toFixed(pTF)}`;
            if (switch_offset == true && lb_type == "z") { text_offset = `\n§r§${tc1}Offset Z${ui_symbol}§r§${tc2}${offset_z.toFixed(pTF)}` }
            else if (switch_offset == true && lb_type == "x") { text_offset = `\n§r§${tc1}Offset X${ui_symbol}§r§${tc2}${offset_x.toFixed(pTF)}` }
            else if (switch_offset == true && lb_type == "both") { text_offset = `\n§r§${tc1}Offset${ui_symbol}§r§${tc2}${offset.toFixed(pTF)} §r§${tc1}X${ui_symbol}§r§${tc2}${offset_x.toFixed(pTF)} §r§${tc1}Z${ui_symbol}§r§${tc2}${offset_z.toFixed(pTF)}` }
            else if (switch_offset == true && lb_type == "zneo" && lb_type != "z") { text_offset = `\n§r§${tc1}Offset${ui_symbol}§r§${tc2}${offset.toFixed(pTF)} §r§${tc1}X${ui_symbol}§r§${tc2}${offset_x.toFixed(pTF)} §r§${tc1}Z${ui_symbol}§r§${tc2}${offset_z.toFixed(pTF)}` }
            else { text_offset = "" };
            if (switch_pb == true && lb_type == "z") { text_pb = `\n§r§${tc1}PB Z${ui_symbol}§r§${tc2}${pb_z.toFixed(pTF)}` }
            else if (switch_pb == true && lb_type == "x") { text_pb = `\n§r§${tc1}PB X${ui_symbol}§r§${tc2}${pb_x.toFixed(pTF)}` }
            else if (switch_pb == true && lb_type != "x" && lb_type != "z") { text_pb = `\n§r§${tc1}PB${ui_symbol}§r§${tc2}${pb.toFixed(pTF)} §r§${tc1}X${ui_symbol}§r§${tc2}${pb_x.toFixed(pTF)} §r§${tc1}Z${ui_symbol}§r§${tc2}${pb_z.toFixed(pTF)}` }
            else { text_pb = "" };
            let text_pb2 = `§r§${tc1}PB${ui_symbol}§r§${tc2}${pb.toFixed(pTF)}`
            if (switch_turn) { text_turn = `\n§r§${tc1}Last Turning${ui_symbol}§r§${tc2}${lastTurning.toFixed(rTF)}` }
            else { text_turn = "" };
            if (switch_input) { text_input = `\n§r§${tc1}Last Input${ui_symbol}§r§${tc2}${input}` }
            else { text_input = "" };
            if (switch_preturn) { text_preturn = `\n§r§${tc1}Preturn${ui_symbol}§r§${tc2}${preturn.toFixed(rTF)}` }
            else { text_preturn = "" };
            if (switch_secondturn) { text_secondturn = `\n§r§${tc1}Second turn${ui_symbol}§r§${tc2}${secondturn.toFixed(rTF)}` }
            else { text_secondturn = "" };
            let text_preturn2 = `§r§${tc1}Preturn${ui_symbol}§r§${tc2}${preturn.toFixed(rTF)}`;
            if (switch_sidestep) { text_sidestep = `\n§r§${tc1}Last Sidestep${ui_symbol}§r§${tc2}${sidestep}` }
            else { text_sidestep = "" };
            let text_sidestep2 = `\n§r§${tc1}Last Sidestep${ui_symbol}§r§${tc2}${sidestep}`
            if (switch_strat) { text_strat = `\n§r§${tc1}${text_strat_full}${ui_symbol}§r§${tc2}${strat}` }
            else { text_strat = "" };
            let text_strat2 = `§r§${tc1}${text_strat_full}${ui_symbol}§r§${tc2}${strat}`
            // showing
            //\n§r§${tc1}Acceleration Z${ui_symbol}§r§${tc2}${acceleration_z.toFixed(pTF)}
            player.runCommand(`title @s title §`);
            //player.runCommand(`title @s subtitle \n\n${text_sidestep2}                                              \n${text_strat2}                                                        \n${text_pb2}                                                      \n\n\n             ${text_fac2}            \n             ${text_ja2}            \n             ${text_preturn2}               \n\n\n`)
            player.runCommand(`title @s actionbar ${text_pos}${isN}${text_pitch}${text_fac}${text_jumpAngle}${text_hitAngle}${text_speed}${text_ttspeed}${text_tier}${text_land}${text_hit}${text_offset}${text_pb}${text_turn}${text_preturn}${text_secondturn}${text_input}${text_sidestep}${text_strat}\n${customText}`);
            //§r§${tc1}§lUser${ui_symbol}§6${player.name}   §r§${tc1}Mod Author${ui_symbol}§gZetaser_jtz§r
        };
    };
});
