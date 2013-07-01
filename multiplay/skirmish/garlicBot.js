/*************/
/* Constants */
/*************/

const MAX_BUILDERS = 3; // the usual number of trucks that construct base structures
const MAX_OILERS = 4;
const MAX_DBUILDERS=2; // the maximum number of trucks used for oil hunting

const MIN_ATTACKERS=6;


const LOW_POWER = 500; //decrease ambitions when power is below this level

const lab = "A0ResearchFacility";
const factory = "A0LightFactory";
const command = "A0CommandCentre";
const generator = "A0PowerGenerator";
const derrick = "A0ResourceExtractor";
const borgfac = "A0CyborgFactory";
const vtolfac = "A0VTolFactory1";
const vtolpad = "A0VtolPad";
const satlink = "A0Sat-linkCentre";
const lassat = "A0LasSatCommand";
const oilres = "OilResource";

/*PILLBOXES*/
const mGunBunker = "PillBox1"; //_("Machinegun Bunker")
const mGunBunker_twin = "PillBox2"; //_("Twin Machinegun Bunker")
const mGunBunker_heavy = "PillBox3"; //_("Heavy Machinegun Bunker")
const mGunBunker_light = "PillBox4"; //_("Light Cannon Bunker")
const mGunBunker_flame = "PillBox5"; //_("Flamer Bunker")
const mGunBunker_lancer = "PillBox6"; //_("Lancer Bunker")

const truckBodies = [
        "Body4ABT", // bug
    "Body1REC", // viper
];
const truckPropulsions = [
        "hover01", // hover
    "wheeled01", // wheels
];
// thats my Techtree

const researchPath = [
    "R-Wpn-MG1Mk1",
    "R-Vehicle-Prop-Halftracks",
    "R-Wpn-MG3Mk1",
    "R-Struc-PowerModuleMk1",
    "R-Defense-Tower01",
    "R-Defense-Pillbox01",
    "R-Defense-Tower06",
    "R-Vehicle-Body11",
    "R-Vehicle-Prop-Tracks",
    "R-Vehicle-Body08",
    "R-Defense-Pillbox06",
    "R-Struc-Power-Upgrade01c",
    "R-Wpn-MG4",
    "R-Defense-WallTower-TwinAGun",
    "R-Defense-HvyMor",
    "R-Wpn-MG-Damage04",
    "R-Vehicle-Body12",
    "R-Struc-Power-Upgrade03a",
    "R-Wpn-MG-Damage08",
    "R-Cyborg-Armor-Heat03",
    "R-Vehicle-Body09",
    "R-Defense-AASite-QuadRotMg",
    "R-Wpn-AAGun-ROF02",
    "R-Cyborg-Hvywpn-PulseLsr",
    "R-Defense-GuardTower-ATMiss",
    "R-Wpn-AAGun-ROF06",
    "R-Wpn-AAGun-Damage06",
    "R-Vehicle-Body10",
    "R-Defense-AA-Laser",
    "R-Struc-Research-Upgrade09",
    "R-Wpn-Energy-ROF03",
    "R-Wpn-Energy-Damage03",
    "R-Wpn-Missile-Damage03",
    "R-Wpn-Missile-ROF03",
    "R-Wpn-Missile-Accuracy02",
    "R-Cyborg-Metals09",
    "R-Cyborg-Armor-Heat09",
    "R-Vehicle-Body14",
];


const tankBodies = [
    "Body7ABT", // retribution
    "Body8MBT", // scorpion
    "Body5REC", // cobra
    "Body1REC", // viper
];

const tankPropulsions = [
    "tracked01", // tracks
    "HalfTrack", // half-track
    "wheeled01", // wheels
];

const mgWeapons = [
    "MG5TWINROTARY",
    "MG4ROTARYMk1",
    "MG3Mk1",
    "MG2Mk1",
    "MG1Mk1",
];

const cyborgStats = [
    ["CyborgChain1Ground", "CyborgChaingun"], // machinegunner
    ["CybRotMgGrd", "CyborgRotMG"], // assault gunner
    ["CyborgRkt1Ground", "CyborgRocket"], // lancer
    ["Cyb-Bod-Atmiss", "Cyb-Wpn-Atmiss"], // scourge
];

const attackTargets = [
    factory,
    borgfac,
    vtolfac,
];

/*************/
/* Variables */
/*************/

var builderGroup;
var oilerGroup;
var attackerGroup;
var dbuilderGroup;

var oillist = enumFeature(-1, oilres); // consist of all Oil Resorvoirs

/**************/
/* Procedures */
/**************/

function extendMainBase() {
    //Counts how many Builds of a kind already exist
    var labCount = enumStruct(me, lab).length;
    var factoryCount = enumStruct(me, factory).length;
    var commandCount = enumStruct(me, command).length;
    var genCount = enumStruct(me, generator).length;
    var derrickCount = enumStruct(me, derrick).length;
    var borgCount = enumStruct(me, borgfac).length;
    var vtolCount = enumStruct(me, vtolfac).length;
    var padCount = enumStruct(me, vtolpad).length;


    console("extendMainBase called");
    if (genCount < 1 && playerPower(me) < 100 && isStructureAvailable(generator, me))
        buildBasicStructure(generator);
    else if (labCount < 3 && isStructureAvailable(lab, me))
        buildBasicStructure(lab);
    else if (isStructureAvailable(borgfac, me))
        buildBasicStructure(borgfac);
}

function buildBasicStructure(structure) {
    var droidlist = enumGroup(builderGroup);
    if (droidlist.length == 0) 
        return false;
    //buildStructure(droidlist[0],structure,startPositions[me].x,startPositions[me].y,0);

    var loc = pickStructLocation(
        droidlist[0], 
        structure, 
        startPositions[me].x, 
        startPositions[me].y, 
        0
    );
    debug(structure +" wird gebaut von "+ droidlist[0]);
    for (var i=0; i<droidlist.length; ++i)
        if (droidlist[i].order != DORDER_BUILD) 
            if (droidlist[i].order != DORDER_HELPBUILD) 
                if (droidlist[i].order != DORDER_LINEBUILD)
                    orderDroidBuild(droidlist[i], DORDER_BUILD, structure, loc.x, loc.y);             
}

function isIdle(droid) {
    var notIdle = [
        DORDER_BUILD, 
        DORDER_HELPBUILD, 
        DORDER_LINEBUILD,
        DORDER_DEMOLISH];
    return (notIdle.indexOf(droid.order) == -1);
}
function random(max) {
        return Math.floor(Math.random() * max);
}

function buildStructure(droid,structure,x,y){
    if(!isStructureAvailable(structure)){return false;}
    debug("[buildStrucutre droid.id droid.x droidy] " +droid.id+","+x+","+y);
    var loc = pickStructLocation(droid,structure,x+1,y+1,0);
    if (isIdle(droid)){
        return orderDroidStatsLoc(droid,DORDER_BUILD, structure, loc.x, loc.y);
        }
    return false;
}

function huntForOil(truck) {
     //add additonal dictionary entry for if a Oilstation is already used.
     var range1 = 999;
     var k = -1;
     for (var j = 0; j < oillist.length; ++j) if (oillist[j].ordered == 0) {
        var range2 = distBetweenTwoPoints(truck.x, truck.y, oillist[j].x, oillist[j].y);
        if (range2 < range1) {
            range1 = range2;
            k = j;
        }
    }

    if (k != -1) {
            oillist[k].ordered = 1;
            orderDroidStatsLoc(truck, DORDER_BUILD, derrick, oillist[k].x, oillist[k].y); //chosen Droid Build derrick on Oil
            //queue("huntForOil",truck);
        } else {
                //return to base if no oils are available for capturing
            if (distBetweenTwoPoints(truck.x, truck.y, startPositions[me].x, startPositions[me].y) > 15)
                orderDroidLoc(truck, DORDER_MOVE, startPositions[me].x, startPositions[me].y);
        }
}

function partOfGroup(droid,group){
    var x=enumGroup(group)
    for(var i=0;i<x.length;i++){
        if(x[i].id==droid.id){
            return true;
        }
    }
    return false;
}

function isEnemyAlive(enemy) {
    if (allianceExistsBetween(me, enemy)) 
        return false;
    for (var i=0; i<attackTargets.length; ++i) 
        if (enumStruct(enemy, attackTargets[i]).length > 0) 
            return true;
    
    if (enumDroid(enemy).length > 0)
        return true;
    return false;
}

function compareEnemies(a,b){
    return (enumDroid(a).length<enumDroid(b).length);
}

function getEnemies(){
    var enemies=[];
    count=0;
    for (var i=0; i<maxPlayers; ++i)
        if (isEnemyAlive(i))
            enemies[count]=i, ++count;
    return enemies;
}

function findStrongestEnemy() {
    var target;
    var enemies=getEnemies();
    /*
    if(count>1){
        for(var i=1;i<count;i++){
            if()
        }
    }
    */
    var enemy=enemies[random(count)];
    for (var i=0; i<attackTargets.length; ++i) {
        var structs=enumStruct(enemy, attackTargets[i]);
        if (structs.length > 0) 
            target=structs[0];
        var droids=enumDroid(enemy);
        if (droids.length > 0)
            target=droids[0];
    }
    return target;
}

function attackEnemyBase() {
    var attacker=enumGroup(attackerGroup);
    if (attacker.length < MIN_ATTACKERS) 
        return;
    var target=findStrongestEnemy();
    if (typeof(target) != "undefined") 
        for (var i=0; i<attacker.length; ++i) {
            droid=attacker[i];
            if (droid.order != DORDER_SCOUT)
                orderDroidLoc(droid, DORDER_SCOUT, target.x, target.y);
        }
}

function attackKoordinates(group,x,y){
    var attacker=enumGroup(group);
    for (var i=0; i<attackers.length; ++i) {
        orderDroidLoc(attacker[i], DORDER_SCOUT, x,y);
    }
}

// order some factory to build a truck

function produceTrucks() {
    // do we actually need more trucks?
    if (groupSize(oilerGroup) >= MAX_OILERS && groupSize(builderGroup) >= MAX_BUILDERS && groupSize(dbuilderGroup)<=MAX_DBUILDERS)
        return;

    var factories = enumStruct(me, factory);
    for (var i = 0; i < factories.length; ++i) {
        var struct = factories[i];
        if (structureIdle(struct)) {
            buildDroid(struct, "Some Truck", truckBodies, truckPropulsions, "", DROID_CONSTRUCT, "Spade1Mk1");
            return
        }
    }
}

function addTruckToSomeGroup(truck) {
    var n = groupSize(builderGroup);

    enumGroup(builderGroup).forEach(function(obj) {
        debug("[Buildergroup name]:" + obj.name); // automatically removes it from group 7
    });
    if (groupSize(builderGroup) < MAX_BUILDERS) {
        groupAddDroid(builderGroup, truck);
    } else  if(groupSize(oilerGroup)<MAX_OILERS){
        groupAddDroid(oilerGroup, truck);
        huntForOil(truck);
    } else{
        groupAddDroid(dbuilderGroup,truck);
    }
}


function doResearch() {
    debug("[doResarch] called()")
    lablist=enumStruct(me, lab);
    for (var i=0; i<lablist.length; ++i) if (structureIdle(lablist[i])) {
        var ok=pursueResearch(lablist[i],researchPath);
        if(!ok){
            var reslist = enumResearch();
            debug("[doResarch] called()")
            if (reslist.length > 0)
            {
                var idx = random(reslist.length);
                pursueResearch(lablist[i], reslist[idx].name);
            }  
        } 
               
    }
}

function produceTanks() {
    var factories = enumStruct(me, factory);
    for (var i=0; i<factories.length; ++i) {
        var struct=factories[i];
        if (structureIdle(struct)) {
            buildDroid(struct, "Machinegun Tank", tankBodies, tankPropulsions, "", DROID_WEAPON, mgWeapons);
        }
    }
}


/************/
/*  Events  */
/************/

function eventStartLevel() {
    
    //Init oil list
    for (var j = 0; j < oillist.length; ++j)
        oillist[j].ordered = 0;

    //setTimer("buildDefOnOil", 10000);

    builderGroup = newGroup();
    oilerGroup = newGroup();
    dbuilderGroup = newGroup();

    var trucks = enumDroid(me, DROID_CONSTRUCT);
    for (var i = 0; i < trucks.length; ++i) {
        addTruckToSomeGroup(trucks[i]); //Maps his trucks to the previously created Groups
    }
    extendMainBase();
    produceTrucks();
    setTimer("doResearch", 10000);
    setTimer("produceTanks",10000);
    setTimer("attackEnemyBase",20000);
}

function eventResearched(tech, labparam) {
    queue("doResearch");
}

function eventStructureBuilt(struct, droid) {
    debug("[Event]: StructureBuiltby-> "+struct.id);
    if(struct.stattype==RESOURCE_EXTRACTOR && partOfGroup(droid,oilerGroup)){
        debug("Struct was Derrick"+ droid.x +" "+droid.y);
        buildStructure(droid,mGunBunker,droid.x,droid.y);
    }else if(partOfGroup(droid,oilerGroup)){
        debug("Struct was Derrick"+ droid.x +" "+droid.y);
        huntForOil(droid);
    }
    queue("extendMainBase");
}

function eventDroidBuilt(droid, struct) {
    console("[Event]: DroidBuilt-> appeard");
    if (droid.droidType == DROID_CONSTRUCT) {
        addTruckToSomeGroup(droid);
        queue("produceTrucks");
    }else{
        groupAddDroid(attackerGroup,droid);
    }
}
function eventAttacked(victim, attacker) {
    attackKoordinates(attackerGroup,attacker.x,attacker.y);
}