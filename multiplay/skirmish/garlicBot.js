
  /*************/
  /* Constants */
  /*************/

const MIN_BUILDERS = 3;   // the usual number of trucks that construct base structures
const MAX_OILERS = 10;   // the maximum number of trucks used for oil hunting

const LOW_POWER = 500;    //decrease ambitions when power is below this level

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

const truckBodies = [
  "Body4ABT", // bug
  "Body1REC", // viper
];
const truckPropulsions = [
  "hover01", // hover
  "wheeled01", // wheels
];

const researchPath = [
  "R-Wpn-MG1Mk1",
  "R-Vehicle-Prop-Tracks",
  "R-Defense-WallTower-TwinAGun",
  "R-Vehicle-Body05",
  "R-Vehicle-Body08",
  "R-Vehicle-Body07",
  "R-Struc-Research-Upgrade09",
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
  ["CybRotMgGrd","CyborgRotMG"], // assault gunner
  ["CyborgRkt1Ground", "CyborgRocket"], // lancer
  ["Cyb-Bod-Atmiss","Cyb-Wpn-Atmiss"], // scourge
];


  /*************/
  /* Variables */
  /*************/

var builderGroup;
var oilerGroup;

  /**************/
  /* Procedures */
  /**************/



function hworld(){
  console("Hello World i am a Bot");
}

function extendMainBase(){
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
  if (genCount < 1 && playerPower(me) < 100 && isStructureAvailable(generator,me))
    buildBasicStructure(generator);
  else if (labCount < 3 && isStructureAvailable(lab,me))
    buildBasicStructure(lab);
  else if (isStructureAvailable(factory,me))
    buildBasicStructure(factory);
}

// order some factory to build a truck
function produceTrucks() {
  // do we actually need more trucks?
  console("produceTrucks called");
  if (groupSize(oilerGroup) >= MAX_OILERS && groupSize(builderGroup) >= MIN_BUILDERS)
    return;

  var factories = enumStruct(me, factory);
  for (var i=0; i<factories.length; ++i) {
    var struct=factories[i];
    if (structureIdle(struct)) {
      buildDroid(struct, "Some Truck", truckBodies, truckPropulsions, "", DROID_CONSTRUCT, "Spade1Mk1");
      return
    }
  }
}

function addTruckToSomeGroup(truck) {
  var n = groupSize(builderGroup);
  console("[Buildergroup count]"+n);
  enumGroup(builderGroup).forEach( function(obj) {
    console("[Buildergroup name]:"+obj.name); // automatically removes it from group 7
} );
  console(groupSize(testGroup));
  console("[Buildergroup ]"+n);
  console("[Oilergroup count]"+groupSize(oilerGroup));
  if (n < MIN_BUILDERS) {
    groupAddDroid(builderGroup,truck)
  } else {
    groupAddDroid(oilerGroup,truck);
  }
}


function eventStartLevel(){
  setTimer("hworld",10000);
  testGroup=newGroup();
  builderGroup=newGroup();
  oilerGroup=newGroup();
  var trucks = enumDroid(me, DROID_CONSTRUCT);
  for (var i=0; i<trucks.length; ++i) {
    addTruckToSomeGroup(trucks[i]);     //Maps his trucks to the previously created Groups
  }
  produceTrucks();
}

function eventResearched(tech, labparam) {}

function eventStructureBuilt(struct, droid) {
  console("[Event]: StructureBuilt-> appeard");
  queue("extendMainBase");
//  queue("huntForOil");
}

function eventDroidBuilt(droid, struct) {
  console("[Event]: DroidBuilt-> appeard");
  if (droid.droidType == DROID_CONSTRUCT){
    addTruckToSomeGroup(droid);
    queue("extendMainBase");
    //queue("huntForOil");
  }
  queue("produceTrucks");
}

function eventAttacked(victim, attacker) {}
