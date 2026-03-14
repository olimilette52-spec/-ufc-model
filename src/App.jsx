import { useState, useEffect } from "react";

// VRAIS TAUX DE FINISH PAR DIVISION (UFCStats/Fightomic)
const DIV_FINISH_RATE = {
  "Heavyweight":0.66,"Light Heavyweight":0.60,"Middleweight":0.53,
  "Welterweight":0.51,"Lightweight":0.50,"Featherweight":0.45,
  "Bantamweight":0.45,"Flyweight":0.45,"Strawweight W":0.33,
  "Bantamweight W":0.40,"Flyweight W":0.38,"Featherweight W":0.40,
};

// VRAIS TEMPS MOYENS PAR DIVISION (UFC Cross-Sectional Analysis 2017-2019)
const DIV_AVG_TIME = {
  "Heavyweight":9.67,"Light Heavyweight":9.22,"Middleweight":11.10,
  "Welterweight":11.37,"Lightweight":10.65,"Featherweight":11.78,
  "Bantamweight":11.17,"Flyweight":11.23,"Strawweight W":12.75,
  "Bantamweight W":12.78,"Flyweight W":12.07,"Featherweight W":11.73,
};

const fights = [
  { id:1, card:"PRELIMS", time:"17:00", rounds:3, wc:"Strawweight W", lbs:"115 lbs", ou:2.5,
    f1:{name:"P. Rodriguez",full:"Piera Rodriguez",country:"VEN",record:"16-3",age:28,odds:-180,slpm:4.1,sapm:2.9,sacc:51,sdef:61,td:2.1,tdacc:45,tddef:72,sub:0.9,ko:3,dec:9,s:4,reach:63,layoff:68,recentForm:[{r:"W",opp:"Jauregui",oppRank:12,method:"DEC"},{r:"W",opp:"Gomes",oppRank:99,method:"KO"},{r:"L",opp:"Suarez",oppRank:2,method:"DEC"},{r:"W",opp:"Hill",oppRank:14,method:"DEC"},{r:"W",opp:"Jandiroba",oppRank:6,method:"SUB"}],lossTypes:{ko:0,sub:1,dec:2},rank:7},
    f2:{name:"S. Hughes",full:"Sam Hughes",country:"USA",record:"12-7",age:30,odds:155,slpm:3.4,sapm:4.1,sacc:43,sdef:55,td:0.8,tdacc:33,tddef:68,sub:1.2,ko:1,dec:6,s:5,reach:67,layoff:45,recentForm:[{r:"L",opp:"Nunes",oppRank:99,method:"SUB"},{r:"W",opp:"J.Nunes",oppRank:99,method:"DEC"},{r:"L",opp:"Rendon",oppRank:99,method:"DEC"},{r:"W",opp:"Markos",oppRank:99,method:"DEC"},{r:"L",opp:"Godinez",oppRank:99,method:"SUB"}],lossTypes:{ko:0,sub:3,dec:4},rank:99}},
  { id:2, card:"PRELIMS", time:"17:20", rounds:3, wc:"Bantamweight", lbs:"135 lbs", ou:1.5,
    f1:{name:"L. Lacerda",full:"Luan Luiz Lacerda",country:"BRA",record:"11-1",age:26,odds:-260,slpm:5.2,sapm:3.1,sacc:55,sdef:63,td:1.8,tdacc:52,tddef:70,sub:0.6,ko:6,dec:3,s:2,reach:70,layoff:72,recentForm:[{r:"W",opp:"Pajuelo",oppRank:99,method:"KO"},{r:"W",opp:"Garcia",oppRank:99,method:"KO"},{r:"W",opp:"Bilder",oppRank:99,method:"DEC"},{r:"W",opp:"Durden",oppRank:99,method:"KO"},{r:"L",opp:"Salvador",oppRank:15,method:"DEC"}],lossTypes:{ko:0,sub:1,dec:0},rank:99},
    f2:{name:"H. Sosa",full:"Hecher Sosa",country:"ARG",record:"9-4",age:29,odds:215,slpm:3.8,sapm:4.3,sacc:41,sdef:52,td:1.0,tdacc:38,tddef:60,sub:1.1,ko:3,dec:3,s:3,reach:68,layoff:55,recentForm:[{r:"L",opp:"Garcia",oppRank:99,method:"DEC"},{r:"W",opp:"Bolanos",oppRank:99,method:"KO"},{r:"W",opp:"Talbott",oppRank:99,method:"DEC"},{r:"L",opp:"Souza",oppRank:99,method:"SUB"},{r:"W",opp:"Rosas",oppRank:99,method:"DEC"}],lossTypes:{ko:2,sub:1,dec:1},rank:99}},
  { id:3, card:"PRELIMS", time:"17:40", rounds:3, wc:"Bantamweight W", lbs:"135 lbs", ou:2.5,
    f1:{name:"B. Mesquita",full:"Beatriz Mesquita",country:"BRA",record:"3-2",age:32,odds:-140,slpm:2.8,sapm:2.9,sacc:44,sdef:58,td:0.5,tdacc:40,tddef:65,sub:2.1,ko:0,dec:0,s:3,reach:65,layoff:90,recentForm:[{r:"W",opp:"Cachoeira",oppRank:99,method:"SUB"},{r:"L",opp:"Gatto",oppRank:99,method:"DEC"},{r:"W",opp:"Luciano",oppRank:99,method:"SUB"},{r:"W",opp:"Dumont",oppRank:99,method:"SUB"},{r:"L",opp:"Pinheiro",oppRank:15,method:"DEC"}],lossTypes:{ko:1,sub:0,dec:1},rank:99},
    f2:{name:"M. Rendon",full:"Montserrat Rendon",country:"MEX",record:"7-3",age:27,odds:120,slpm:3.3,sapm:3.6,sacc:46,sdef:53,td:1.2,tdacc:42,tddef:58,sub:0.8,ko:2,dec:3,s:2,reach:64,layoff:60,recentForm:[{r:"W",opp:"Hughes",oppRank:99,method:"DEC"},{r:"W",opp:"Young",oppRank:99,method:"KO"},{r:"L",opp:"Gatto",oppRank:99,method:"DEC"},{r:"W",opp:"Rodriguez",oppRank:7,method:"DEC"},{r:"W",opp:"Kassem",oppRank:99,method:"SUB"}],lossTypes:{ko:1,sub:1,dec:1},rank:99}},
  { id:4, card:"PRELIMS", time:"18:00", rounds:3, wc:"Middleweight", lbs:"185 lbs", ou:2.5,
    f1:{name:"B. Tavares",full:"Brad Tavares",country:"USA",record:"20-11",age:37,odds:140,slpm:3.1,sapm:3.8,sacc:44,sdef:56,td:0.7,tdacc:28,tddef:78,sub:0.1,ko:6,dec:13,s:1,reach:76,layoff:180,recentForm:[{r:"L",opp:"Rodrigues",oppRank:15,method:"KO"},{r:"L",opp:"Hawes",oppRank:99,method:"KO"},{r:"W",opp:"B.Silva",oppRank:99,method:"DEC"},{r:"L",opp:"Dolidze",oppRank:12,method:"DEC"},{r:"W",opp:"Jotko",oppRank:99,method:"DEC"}],lossTypes:{ko:4,sub:1,dec:6},rank:99},
    f2:{name:"E. Anders",full:"Eryk Anders",country:"USA",record:"14-10",age:35,odds:-165,slpm:4.2,sapm:4.5,sacc:49,sdef:54,td:1.3,tdacc:44,tddef:65,sub:0.3,ko:8,dec:4,s:2,reach:76,layoff:120,recentForm:[{r:"L",opp:"Borralho",oppRank:5,method:"DEC"},{r:"W",opp:"Barriault",oppRank:99,method:"KO"},{r:"L",opp:"Allen",oppRank:8,method:"SUB"},{r:"W",opp:"Park",oppRank:99,method:"KO"},{r:"L",opp:"Imavov",oppRank:7,method:"DEC"}],lossTypes:{ko:4,sub:2,dec:4},rank:99}},
  { id:5, card:"PRELIMS", time:"18:20", rounds:3, wc:"Lightweight", lbs:"155 lbs", ou:1.5,
    f1:{name:"B. Oki",full:"Bolaji Oki",country:"NGR",record:"10-2",age:28,odds:-200,slpm:4.8,sapm:3.2,sacc:52,sdef:60,td:2.2,tdacc:50,tddef:68,sub:0.4,ko:5,dec:3,s:2,reach:72,layoff:88,recentForm:[{r:"W",opp:"McKinney",oppRank:99,method:"KO"},{r:"W",opp:"Martinez",oppRank:99,method:"KO"},{r:"L",opp:"J.Silva",oppRank:99,method:"KO"},{r:"W",opp:"Leavitt",oppRank:99,method:"DEC"},{r:"W",opp:"Hadzovic",oppRank:99,method:"KO"}],lossTypes:{ko:1,sub:0,dec:1},rank:99},
    f2:{name:"M. Sousa",full:"Manoel Sousa",country:"BRA",record:"13-5",age:31,odds:170,slpm:3.5,sapm:3.9,sacc:45,sdef:58,td:1.5,tdacc:40,tddef:62,sub:1.4,ko:3,dec:4,s:6,reach:70,layoff:95,recentForm:[{r:"L",opp:"Giagos",oppRank:99,method:"DEC"},{r:"W",opp:"Ogden",oppRank:99,method:"SUB"},{r:"W",opp:"Gibson",oppRank:99,method:"SUB"},{r:"L",opp:"Topuria",oppRank:1,method:"SUB"},{r:"W",opp:"Caceres",oppRank:99,method:"DEC"}],lossTypes:{ko:1,sub:2,dec:2},rank:99}},
  { id:6, card:"PRELIMS", time:"18:40", rounds:3, wc:"Bantamweight", lbs:"135 lbs", ou:2.5,
    f1:{name:"E. Smith",full:"Elijah Smith",country:"USA",record:"9-1",age:23,odds:-185,slpm:4.45,sapm:3.1,sacc:47,sdef:62,td:3.51,tdacc:55,tddef:71,sub:0.5,ko:4,dec:3,s:2,reach:71,layoff:75,recentForm:[{r:"W",opp:"Stamann",oppRank:99,method:"DEC"},{r:"W",opp:"Turcios",oppRank:99,method:"KO"},{r:"W",opp:"Butler",oppRank:99,method:"KO"},{r:"W",opp:"Morales",oppRank:99,method:"DEC"},{r:"L",opp:"Nurmagomedov",oppRank:3,method:"DEC"}],lossTypes:{ko:0,sub:1,dec:0},rank:99},
    f2:{name:"S. You",full:"Soyoung You",country:"KOR",record:"16-3",age:30,odds:155,slpm:2.28,sapm:3.5,sacc:46,sdef:57,td:3.80,tdacc:48,tddef:63,sub:1.8,ko:2,dec:8,s:6,reach:65,layoff:55,recentForm:[{r:"W",opp:"Diaz",oppRank:99,method:"SUB"},{r:"L",opp:"Dvalishvili",oppRank:1,method:"DEC"},{r:"W",opp:"Emmers",oppRank:99,method:"DEC"},{r:"W",opp:"Martinez",oppRank:99,method:"SUB"},{r:"W",opp:"Gutierrez",oppRank:99,method:"DEC"}],lossTypes:{ko:1,sub:1,dec:1},rank:99}},
  { id:7, card:"MAIN CARD", time:"20:00", rounds:3, wc:"Heavyweight", lbs:"265 lbs", ou:1.5,
    f1:{name:"V. Petrino",full:"Vitor Petrino",country:"BRA",record:"13-1",age:28,odds:-310,slpm:5.6,sapm:2.8,sacc:54,sdef:64,td:1.4,tdacc:48,tddef:72,sub:0.2,ko:9,dec:3,s:1,reach:78,layoff:154,recentForm:[{r:"W",opp:"Tybura",oppRank:10,method:"KO"},{r:"W",opp:"Nascimento",oppRank:99,method:"KO"},{r:"W",opp:"Romanov",oppRank:99,method:"KO"},{r:"W",opp:"Mayes",oppRank:99,method:"DEC"},{r:"L",opp:"Almeida",oppRank:5,method:"SUB"}],lossTypes:{ko:0,sub:1,dec:0},rank:10},
    f2:{name:"S. Asplund",full:"Steven Asplund",country:"USA",record:"9-3",age:27,odds:250,slpm:3.2,sapm:4.5,sacc:41,sdef:51,td:0.9,tdacc:35,tddef:59,sub:0.3,ko:4,dec:4,s:1,reach:74,layoff:91,recentForm:[{r:"W",opp:"Brzeski",oppRank:99,method:"DEC"},{r:"L",opp:"Williams",oppRank:99,method:"DEC"},{r:"W",opp:"Tafa",oppRank:99,method:"KO"},{r:"L",opp:"Arlovski",oppRank:99,method:"KO"},{r:"W",opp:"Barnett",oppRank:99,method:"DEC"}],lossTypes:{ko:2,sub:0,dec:1},rank:99}},
  { id:8, card:"MAIN CARD", time:"20:20", rounds:3, wc:"Welterweight", lbs:"170 lbs", ou:2.5,
    f1:{name:"C. Curtis",full:"Chris Curtis",country:"USA",record:"32-10",age:36,odds:-175,slpm:5.1,sapm:4.3,sacc:48,sdef:58,td:0.3,tdacc:20,tddef:81,sub:0.0,ko:17,dec:13,s:2,reach:73,layoff:95,recentForm:[{r:"W",opp:"Nelson",oppRank:99,method:"DEC"},{r:"W",opp:"Brady",oppRank:6,method:"DEC"},{r:"L",opp:"Maddalena",oppRank:3,method:"KO"},{r:"W",opp:"Buckley",oppRank:8,method:"DEC"},{r:"W",opp:"Barriault",oppRank:99,method:"KO"}],lossTypes:{ko:3,sub:2,dec:5},rank:99},
    f2:{name:"M. Orolbay",full:"Myktybek Orolbay",country:"KGZ",record:"9-3",age:27,odds:148,slpm:3.7,sapm:4.0,sacc:43,sdef:53,td:1.8,tdacc:44,tddef:62,sub:0.7,ko:4,dec:3,s:2,reach:70,layoff:110,recentForm:[{r:"W",opp:"Ferreira",oppRank:99,method:"DEC"},{r:"W",opp:"Salikhov",oppRank:99,method:"KO"},{r:"W",opp:"Gorimbo",oppRank:99,method:"DEC"},{r:"L",opp:"Burns",oppRank:5,method:"DEC"},{r:"W",opp:"Zaleski",oppRank:99,method:"KO"}],lossTypes:{ko:1,sub:1,dec:1},rank:99}},
  { id:9, card:"MAIN CARD", time:"21:00", rounds:3, wc:"Flyweight", lbs:"125 lbs", ou:2.5,
    f1:{name:"C. Johnson",full:"Charles Johnson",country:"USA",record:"18-8",age:30,odds:-115,slpm:4.3,sapm:4.1,sacc:47,sdef:55,td:2.1,tdacc:41,tddef:67,sub:0.6,ko:5,dec:10,s:3,reach:66,layoff:49,recentForm:[{r:"L",opp:"Perez",oppRank:7,method:"KO"},{r:"W",opp:"Durden",oppRank:99,method:"DEC"},{r:"W",opp:"Figueiredo",oppRank:99,method:"DEC"},{r:"L",opp:"Mokaev",oppRank:5,method:"DEC"},{r:"W",opp:"Ulanbekov",oppRank:99,method:"DEC"}],lossTypes:{ko:3,sub:2,dec:3},rank:99},
    f2:{name:"B. Silva",full:"Bruno Silva",country:"BRA",record:"15-8",age:32,odds:-105,slpm:4.0,sapm:4.4,sacc:44,sdef:53,td:0.8,tdacc:33,tddef:70,sub:1.4,ko:4,dec:7,s:4,reach:65,layoff:148,recentForm:[{r:"W",opp:"Park",oppRank:99,method:"SUB"},{r:"L",opp:"Van",oppRank:2,method:"KO"},{r:"L",opp:"Kape",oppRank:4,method:"KO"},{r:"L",opp:"Dvorak",oppRank:99,method:"DEC"},{r:"W",opp:"Ulanbekov",oppRank:99,method:"DEC"}],lossTypes:{ko:2,sub:2,dec:4},rank:99}},
  { id:10, card:"MAIN CARD", time:"21:20", rounds:3, wc:"Light Heavyweight", lbs:"205 lbs", ou:1.5,
    f1:{name:"I. Cutelaba",full:"Ion Cutelaba",country:"MDA",record:"19-11",age:32,odds:220,slpm:4.26,sapm:4.8,sacc:46,sdef:52,td:2.8,tdacc:49,tddef:75,sub:0.4,ko:11,dec:5,s:3,reach:75,layoff:308,recentForm:[{r:"L",opp:"Spann",oppRank:10,method:"KO"},{r:"W",opp:"Guskov",oppRank:99,method:"KO"},{r:"L",opp:"Ankalaev",oppRank:1,method:"DEC"},{r:"L",opp:"StPreux",oppRank:99,method:"KO"},{r:"W",opp:"Nzechukwu",oppRank:99,method:"KO"}],lossTypes:{ko:6,sub:2,dec:3},rank:99},
    f2:{name:"O. Sy",full:"Oumar Sy",country:"FRA",record:"12-1",age:30,odds:-275,slpm:3.67,sapm:1.72,sacc:49,sdef:71,td:1.9,tdacc:36,tddef:85,sub:0.3,ko:7,dec:4,s:1,reach:83,layoff:189,recentForm:[{r:"W",opp:"Guskov",oppRank:99,method:"KO"},{r:"W",opp:"Murzakanov",oppRank:99,method:"KO"},{r:"W",opp:"Jung",oppRank:12,method:"DEC"},{r:"W",opp:"Rountree",oppRank:8,method:"KO"},{r:"L",opp:"Hill",oppRank:2,method:"KO"}],lossTypes:{ko:1,sub:0,dec:0},rank:9}},
  { id:11, card:"MAIN CARD", time:"21:40", rounds:3, wc:"Featherweight", lbs:"145 lbs", ou:1.5,
    f1:{name:"M. Rahiki",full:"Marwan Rahiki",country:"ALG",record:"12-2",age:28,odds:-145,slpm:4.8,sapm:3.2,sacc:50,sdef:60,td:1.2,tdacc:42,tddef:68,sub:0.5,ko:6,dec:4,s:2,reach:70,layoff:82,recentForm:[{r:"W",opp:"Almeida",oppRank:99,method:"KO"},{r:"W",opp:"Pearce",oppRank:99,method:"KO"},{r:"W",opp:"Katona",oppRank:99,method:"DEC"},{r:"L",opp:"Chikadze",oppRank:99,method:"KO"},{r:"W",opp:"Quarantillo",oppRank:99,method:"DEC"}],lossTypes:{ko:1,sub:0,dec:1},rank:99},
    f2:{name:"H. Hardwick",full:"Harry Hardwick",country:"GBR",record:"8-3",age:26,odds:122,slpm:3.9,sapm:4.1,sacc:44,sdef:55,td:0.8,tdacc:33,tddef:61,sub:0.4,ko:3,dec:4,s:1,reach:68,layoff:70,recentForm:[{r:"W",opp:"Lima",oppRank:99,method:"KO"},{r:"W",opp:"Brito",oppRank:99,method:"DEC"},{r:"L",opp:"Charriere",oppRank:99,method:"DEC"},{r:"W",opp:"Almeida",oppRank:99,method:"DEC"},{r:"W",opp:"Nuerdanbieke",oppRank:99,method:"DEC"}],lossTypes:{ko:1,sub:1,dec:1},rank:99}},
  { id:12, card:"MAIN CARD", time:"22:00", rounds:3, wc:"Featherweight", lbs:"145 lbs", ou:1.5,
    f1:{name:"A. Fili",full:"Andre Fili",country:"USA",record:"25-12",age:33,odds:195,slpm:4.3,sapm:4.8,sacc:46,sdef:57,td:0.6,tdacc:27,tddef:74,sub:0.2,ko:8,dec:15,s:2,reach:71,layoff:218,recentForm:[{r:"W",opp:"Rodriguez",oppRank:99,method:"DEC"},{r:"L",opp:"Costa",oppRank:99,method:"SUB"},{r:"W",opp:"Swanson",oppRank:99,method:"DEC"},{r:"L",opp:"Algeo",oppRank:99,method:"DEC"},{r:"W",opp:"Jourdain",oppRank:99,method:"DEC"}],lossTypes:{ko:2,sub:4,dec:6},rank:99},
    f2:{name:"J. Delgado",full:"Jose Delgado",country:"COL",record:"10-2",age:27,odds:-240,slpm:5.1,sapm:3.5,sacc:53,sdef:62,td:1.5,tdacc:46,tddef:69,sub:0.6,ko:6,dec:3,s:1,reach:69,layoff:141,recentForm:[{r:"L",opp:"Wood",oppRank:99,method:"DEC"},{r:"W",opp:"Amil",oppRank:99,method:"KO"},{r:"W",opp:"Simmons",oppRank:99,method:"KO"},{r:"W",opp:"Rojo",oppRank:99,method:"KO"},{r:"W",opp:"Munhoz",oppRank:99,method:"KO"}],lossTypes:{ko:1,sub:0,dec:1},rank:99}},
  { id:13, card:"MAIN CARD", time:"22:20", rounds:3, wc:"Strawweight W", lbs:"115 lbs", ou:2.5,
    f1:{name:"A. Lemos",full:"Amanda Lemos",country:"BRA",record:"15-5-1",age:38,odds:170,slpm:2.75,sapm:3.24,sacc:55,sdef:45,td:1.02,tdacc:62,tddef:64,sub:0.7,ko:8,dec:4,s:3,reach:65,layoff:182,recentForm:[{r:"L",opp:"Suarez",oppRank:2,method:"DEC"},{r:"W",opp:"Lucindo",oppRank:99,method:"DEC"},{r:"L",opp:"Jandiroba",oppRank:6,method:"SUB"},{r:"W",opp:"Dern",oppRank:4,method:"DEC"},{r:"L",opp:"Weili",oppRank:1,method:"DEC"}],lossTypes:{ko:1,sub:2,dec:2},rank:5},
    f2:{name:"G. Robertson",full:"Gillian Robertson",country:"CAN",record:"16-8",age:30,odds:-205,slpm:2.86,sapm:2.86,sacc:48,sdef:56,td:2.74,tdacc:40,tddef:41,sub:2.1,ko:1,dec:7,s:8,reach:63,layoff:112,recentForm:[{r:"W",opp:"M.Rodriguez",oppRank:9,method:"KO"},{r:"W",opp:"Viana",oppRank:99,method:"SUB"},{r:"L",opp:"Barber",oppRank:6,method:"DEC"},{r:"W",opp:"Nunes",oppRank:99,method:"SUB"},{r:"W",opp:"Lookboonmee",oppRank:99,method:"SUB"}],lossTypes:{ko:2,sub:3,dec:3},rank:8}},
  { id:14, card:"MAIN EVENT", time:"22:40", rounds:5, wc:"Featherweight", lbs:"145 lbs", ou:3.5, isMain:true,
    f1:{name:"J. Emmett",full:"Josh Emmett",country:"USA",record:"19-6",age:41,odds:420,slpm:3.72,sapm:4.43,sacc:35,sdef:60,td:1.08,tdacc:37,tddef:43,sub:0.1,ko:7,dec:10,s:2,reach:70,layoff:161,recentForm:[{r:"L",opp:"Zalal",oppRank:13,method:"SUB"},{r:"L",opp:"Murphy",oppRank:3,method:"DEC"},{r:"W",opp:"Mitchell",oppRank:8,method:"KO"},{r:"L",opp:"Topuria",oppRank:1,method:"DEC"},{r:"L",opp:"Rodriguez",oppRank:3,method:"SUB"}],lossTypes:{ko:0,sub:2,dec:4},rank:11},
    f2:{name:"K. Vallejos",full:"Kevin Vallejos",country:"ARG",record:"17-1",age:24,odds:-550,slpm:5.78,sapm:4.71,sacc:46,sdef:56,td:0.71,tdacc:28,tddef:83,sub:0.0,ko:12,dec:3,s:2,reach:68,layoff:91,recentForm:[{r:"W",opp:"Chikadze",oppRank:99,method:"KO"},{r:"W",opp:"D.Silva",oppRank:99,method:"DEC"},{r:"W",opp:"Choi",oppRank:99,method:"KO"},{r:"W",opp:"Teague",oppRank:99,method:"KO"},{r:"L",opp:"J.Silva",oppRank:99,method:"DEC"}],lossTypes:{ko:0,sub:0,dec:1},rank:14}},
];
function modelV3(f1,f2,rounds){
  const strNet1=(f1.slpm*f1.sacc/100)-(f1.sapm*(1-f1.sdef/100));
  const strNet2=(f2.slpm*f2.sacc/100)-(f2.sapm*(1-f2.sdef/100));
  const grp1=f1.td*(f1.tdacc/100)*2+f1.tddef*0.015+f1.sub*0.5;
  const grp2=f2.td*(f2.tdacc/100)*2+f2.tddef*0.015+f2.sub*0.5;
  const formScore=(form)=>{
    const w=[5,4,3,2,1];
    return form.reduce((acc,f,i)=>{
      const rb=f.oppRank<=5?1.5:f.oppRank<=10?1.3:f.oppRank<=15?1.15:1.0;
      return acc+(f.r==="W"?w[i]*rb:-w[i]*0.6);
    },0)/15;
  };
  const form1=formScore(f1.recentForm);
  const form2=formScore(f2.recentForm);
  const agePen=(a)=>a>31?Math.min(0.25,(a-31)*0.028):0;
  const ap1=agePen(f1.age),ap2=agePen(f2.age);
  const layPen=(d)=>d>120?Math.min(0.15,(d-120)/900):0;
  const lp1=layPen(f1.layoff),lp2=layPen(f2.layoff);
  const ra1=Math.max(0,f1.reach-f2.reach)*0.004;
  const ra2=Math.max(0,f2.reach-f1.reach)*0.004;
  const sa1=(strNet1>strNet2&&f2.sdef<55?0.05:0)+(grp1>grp2&&f2.tddef<60?0.05:0);
  const sa2=(strNet2>strNet1&&f1.sdef<55?0.05:0)+(grp2>grp1&&f1.tddef<60?0.05:0);
  const tl1=f1.lossTypes.ko+f1.lossTypes.sub+f1.lossTypes.dec||1;
  const tl2=f2.lossTypes.ko+f2.lossTypes.sub+f2.lossTypes.dec||1;
  const cv1=(f1.lossTypes.ko/tl1)*0.08,cv2=(f2.lossTypes.ko/tl2)*0.08;
  const S1=strNet1*0.30+grp1*0.20+form1*0.25+ra1*0.05+sa1*0.10-ap1*0.05-lp1*0.03-cv1*0.02;
  const S2=strNet2*0.30+grp2*0.20+form2*0.25+ra2*0.05+sa2*0.10-ap2*0.05-lp2*0.03-cv2*0.02;
  const tot=Math.abs(S1)+Math.abs(S2)||1;
  const pct1=Math.round(Math.min(93,Math.max(7,50+((S1-S2)/tot)*42)));
  const pct2=100-pct1;
  const winner=pct1>=pct2?"f1":"f2";
  const winF=winner==="f1"?f1:f2,loseF=winner==="f1"?f2:f1;
  const wT=winF.ko+winF.s+winF.dec||1;
  const koP=(winF.ko/wT)*100,subP=(winF.s/wT)*100,decP=(winF.dec/wT)*100;
  const isStrAdv=winF.slpm>loseF.slpm*1.15||winF.sacc>loseF.sdef*0.8;
  const isGrpAdv=winF.td>1.5&&winF.tdacc>35&&loseF.tddef<65;
  const loseKOV=loseF.lossTypes.ko>=3;
  let method,mConf;
  if(isStrAdv&&(koP>45||loseKOV)){method="KO/TKO";mConf=Math.round(Math.min(85,koP+(loseKOV?12:0)));}
  else if(isGrpAdv&&subP>20){method="Soumission";mConf=Math.round(Math.min(80,subP+18));}
  else if(koP>40){method="KO/TKO";mConf=Math.round(Math.min(75,koP*0.85));}
  else{method="Decision";mConf=Math.round(Math.min(82,decP));}
  mConf=Math.max(32,mConf);
  const bd={"Striking net":[+strNet1.toFixed(2),+strNet2.toFixed(2)],"Grappling":[+grp1.toFixed(2),+grp2.toFixed(2)],"Forme":[+form1.toFixed(2),+form2.toFixed(2)],"Style":[+sa1.toFixed(2),+sa2.toFixed(2)],"Age pen":[+(ap1*-10).toFixed(1),+(ap2*-10).toFixed(1)],"Layoff pen":[+(lp1*-10).toFixed(1),+(lp2*-10).toFixed(1)],"Reach":[+ra1.toFixed(2),+ra2.toFixed(2)]};
  return{winner,pct1,pct2,method,mConf,bd,ap1,ap2,lp1,lp2,strNet1,strNet2};
}

// MODELE O/U — UTILISE VRAIS TAUX UFC PAR DIVISION
function predictOU(fight){
  const{f1,f2,ou,rounds,wc}=fight;
  const divFR=DIV_FINISH_RATE[wc]||0.50;
  const divAvgT=DIV_AVG_TIME[wc]||11.0;
  const f1FP=((f1.ko+f1.s)/(f1.ko+f1.s+f1.dec||1));
  const f2FP=((f2.ko+f2.s)/(f2.ko+f2.s+f2.dec||1));
  const fighterFinish=(f1FP+f2FP)/2;
  // Combine taux division (40%) + taux fighters (60%)
  const combinedFinish=(fighterFinish*0.60)+(divFR*0.40);
  const maxT=rounds*5;
  // Si les deux sont des finisseurs, temps estimé plus court
  const finishPressure=combinedFinish*0.50;
  const estTime=maxT*(1-finishPressure);
  const estRound=Math.min(rounds,Math.max(1,estTime/5));
  const ouMins=ou*5;
  const diff=estTime-ouMins;
  const over=Math.round(Math.min(90,Math.max(10,50+Math.tanh(diff/2.5)*40)));
  const under=100-over;
  const signal=over>=58?"OVER":under>=58?"UNDER":"PUSH";
  return{over,under,signal,estRound,estTime};
}

const fmtOdds=(o)=>o>0?`+${o}`:`${o}`;
const oddsCol=(o)=>o<0?"#e74c3c":"#27ae60";

function FormRow({form}){
  return(
    <div style={{display:"flex",gap:2,marginTop:3}}>
      {form.map((f,i)=>(
        <div key={i} title={`${f.r} vs ${f.opp}`} style={{width:9,height:9,borderRadius:"50%",background:f.r==="W"?"#27ae60":"#e74c3c",opacity:1-i*0.12,border:f.oppRank<=15?"1.5px solid #333":"none"}}/>
      ))}
    </div>
  );
}

function StatBar({label,v1,v2,unit=""}){
  const max=Math.max(v1,v2,0.01);
  const b1=v1>=v2;
  return(
    <div style={{marginBottom:6}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#888",fontFamily:"monospace",marginBottom:3}}>
        <span style={{color:b1?"#27ae60":"#333",fontWeight:b1?700:400}}>{v1}{unit}</span>
        <span>{label}</span>
        <span style={{color:!b1?"#27ae60":"#333",fontWeight:!b1?700:400}}>{v2}{unit}</span>
      </div>
      <div style={{display:"flex",gap:2,height:5}}>
        <div style={{flex:1,display:"flex",justifyContent:"flex-end"}}>
          <div style={{width:`${Math.round((v1/max)*100)}%`,height:"100%",background:b1?"#27ae60":"#ddd",borderRadius:2}}/>
        </div>
        <div style={{width:3}}/>
        <div style={{flex:1}}>
          <div style={{width:`${Math.round((v2/max)*100)}%`,height:"100%",background:!b1?"#27ae60":"#ddd",borderRadius:2}}/>
        </div>
      </div>
    </div>
  );
}

function MethodBadge({method}){
  const cfg={"KO/TKO":["#ffeaea","#e74c3c","#fcc"],"Soumission":["#fff4e5","#e67e22","#fdd"],"Decision":["#e9f7f0","#27ae60","#b2dfce"]};
  const[bg,col,brd]=cfg[method]||cfg["Decision"];
  return <span style={{fontSize:9,fontFamily:"monospace",fontWeight:700,background:bg,color:col,border:`1px solid ${brd}`,borderRadius:3,padding:"2px 7px"}}>{method.toUpperCase()}</span>;
}

function BdTable({bd}){
  return(
    <div style={{marginTop:10}}>
      <div style={{fontSize:8,fontFamily:"monospace",color:"#aaa",letterSpacing:"0.12em",marginBottom:6}}>FACTEURS MODELE v3</div>
      {Object.entries(bd).map(([k,[v1,v2]])=>{
        const b1=v1>=v2;
        const max=Math.max(Math.abs(v1),Math.abs(v2),0.01);
        return(
          <div key={k} style={{marginBottom:5}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:8,fontFamily:"monospace",marginBottom:2}}>
              <span style={{color:b1?"#27ae60":"#555",fontWeight:b1?700:400}}>{v1}</span>
              <span style={{color:"#aaa"}}>{k}</span>
              <span style={{color:!b1?"#27ae60":"#555",fontWeight:!b1?700:400}}>{v2}</span>
            </div>
            <div style={{display:"flex",gap:2,height:4}}>
              <div style={{flex:1,display:"flex",justifyContent:"flex-end"}}>
                <div style={{width:`${Math.round((Math.abs(v1)/max)*100)}%`,height:"100%",background:b1?"#27ae60":"#ddd",borderRadius:2}}/>
              </div>
              <div style={{width:3}}/>
              <div style={{flex:1}}>
                <div style={{width:`${Math.round((Math.abs(v2)/max)*100)}%`,height:"100%",background:!b1?"#27ae60":"#ddd",borderRadius:2}}/>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
function OUSection({fight}){
  const{over,under,signal,estRound,estTime}=predictOU(fight);
  const{ou,rounds}=fight;
  const ss={OVER:["#e9f7f0","#27ae60","#b2dfce","OVER PREVU"],UNDER:["#ffeaea","#e74c3c","#fcc","UNDER PREVU"],PUSH:["#f5f5f5","#888","#ddd","TROP SERRE"]}[signal];
  const est=Math.min(rounds,Math.max(1,estRound));
  return(
    <div style={{background:"#f8f9fa",borderRadius:8,padding:"10px 12px",marginTop:6}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:8,fontFamily:"monospace",color:"#aaa",fontWeight:700}}>O/U {ou} ROUNDS</span>
        <span style={{fontSize:8,fontFamily:"monospace",color:"#aaa"}}>{rounds}R max · Est: {estTime.toFixed(1)}min</span>
      </div>
      <div style={{display:"flex",gap:3,marginBottom:10}}>
        {Array.from({length:rounds},(_,i)=>i+1).map(r=>{
          const filled=r<=Math.floor(est);
          const partial=r===Math.ceil(est)&&!Number.isInteger(est);
          const col=signal==="OVER"?"#27ae60":signal==="UNDER"?"#e74c3c":"#aaa";
          return(
            <div key={r} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <div style={{height:8,width:"100%",borderRadius:3,background:filled?col:partial?`linear-gradient(90deg,${col} 50%,#e8e8e8 50%)`:"#e8e8e8"}}/>
              <span style={{fontSize:7,fontFamily:"monospace",color:filled?"#555":"#bbb"}}>R{r}</span>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:8}}>
        {[[over,"#27ae60","#e0f5ea",`OVER ${ou}`],[under,"#e74c3c","#ffeaea",`UNDER ${ou}`]].map(([prob,col,bg,lbl])=>(
          <div key={lbl} style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:8,fontFamily:"monospace",color:col,fontWeight:700}}>{lbl}</span>
              <span style={{fontSize:9,fontFamily:"monospace",fontWeight:800,color:col}}>{prob}%</span>
            </div>
            <div style={{height:6,background:bg,borderRadius:3,overflow:"hidden"}}>
              <div style={{width:`${prob}%`,height:"100%",background:col,borderRadius:3}}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:9,fontFamily:"monospace",fontWeight:800,background:ss[0],color:ss[1],border:`1px solid ${ss[2]}`,borderRadius:4,padding:"3px 10px"}}>{ss[3]}</span>
        <span style={{fontSize:8,fontFamily:"monospace",color:"#888"}}>Div finish rate: {Math.round((DIV_FINISH_RATE[fight.wc]||0.5)*100)}%</span>
      </div>
    </div>
  );
}

function FightCard({fight}){
  const[open,setOpen]=useState(fight.isMain);
  const{f1,f2}=fight;
  const res=modelV3(f1,f2,fight.rounds);
  const{winner,pct1,pct2,method,mConf,bd,ap1,ap2,lp1,lp2,strNet1,strNet2}=res;
  const winF=winner==="f1"?f1:f2;
  const winPct=winner==="f1"?pct1:pct2;
  return(
    <div style={{background:"#fff",borderRadius:12,boxShadow:fight.isMain?"0 4px 20px rgba(0,0,0,0.12)":"0 2px 8px rgba(0,0,0,0.07)",marginBottom:12,overflow:"hidden",border:fight.isMain?"2px solid #e74c3c":"1px solid #e8e8e8"}}>
      {fight.isMain&&<div style={{background:"#e74c3c",color:"#fff",fontSize:9,letterSpacing:"0.25em",fontFamily:"monospace",textAlign:"center",padding:"4px 0",fontWeight:700}}>MAIN EVENT 5 ROUNDS</div>}
      <div onClick={()=>setOpen(o=>!o)} style={{padding:"14px 16px",cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:800,color:"#111"}}>{f1.name}</div>
            <div style={{fontSize:9,color:"#999",fontFamily:"monospace",marginTop:1}}>{f1.record} · {f1.country} · {f1.age}ans</div>
            <FormRow form={f1.recentForm}/>
            <div style={{display:"flex",gap:5,marginTop:5,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:12,fontWeight:700,color:oddsCol(f1.odds),fontFamily:"monospace"}}>{fmtOdds(f1.odds)}</span>
              {ap1>0.03&&<span style={{fontSize:7,background:"#fff4e5",color:"#e67e22",borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>-AGE</span>}
              {lp1>0.03&&<span style={{fontSize:7,background:"#f0f0f0",color:"#888",borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>ROUILLE</span>}
              <span style={{fontSize:7,background:strNet1>0?"#e9f7f0":"#ffeaea",color:strNet1>0?"#27ae60":"#e74c3c",borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>NET {strNet1>0?"+":""}{strNet1.toFixed(1)}</span>
            </div>
          </div>
          <div style={{textAlign:"center",padding:"0 10px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#bbb",letterSpacing:"0.1em",fontFamily:"monospace"}}>VS</div>
            <div style={{fontSize:8,color:"#bbb",marginTop:4,fontFamily:"monospace"}}>{fight.time} HE</div>
            <div style={{fontSize:8,color:"#bbb",marginTop:1,fontFamily:"monospace"}}>{fight.lbs}</div>
          </div>
          <div style={{flex:1,textAlign:"right"}}>
            <div style={{fontSize:15,fontWeight:800,color:"#111"}}>{f2.name}</div>
            <div style={{fontSize:9,color:"#999",fontFamily:"monospace",marginTop:1}}>{f2.record} · {f2.country} · {f2.age}ans</div>
            <div style={{display:"flex",justifyContent:"flex-end"}}><FormRow form={f2.recentForm}/></div>
            <div style={{display:"flex",gap:5,marginTop:5,alignItems:"center",justifyContent:"flex-end",flexWrap:"wrap"}}>
              <span style={{fontSize:7,background:strNet2>0?"#e9f7f0":"#ffeaea",color:strNet2>0?"#27ae60":"#e74c3c",borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>NET {strNet2>0?"+":""}{strNet2.toFixed(1)}</span>
              {lp2>0.03&&<span style={{fontSize:7,background:"#f0f0f0",color:"#888",borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>ROUILLE</span>}
              {ap2>0.03&&<span style={{fontSize:7,background:"#fff4e5",color:"#e67e22",borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>-AGE</span>}
              <span style={{fontSize:12,fontWeight:700,color:oddsCol(f2.odds),fontFamily:"monospace"}}>{fmtOdds(f2.odds)}</span>
            </div>
          </div>
        </div>
        <div style={{marginTop:12,display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:9,fontFamily:"monospace",fontWeight:700,color:"#27ae60",minWidth:30}}>{pct1}%</span>
          <div style={{flex:1,height:6,background:"#f0f0f0",borderRadius:4,overflow:"hidden"}}>
            <div style={{width:`${pct1}%`,height:"100%",background:"linear-gradient(90deg,#27ae60,#2ecc71)",borderRadius:4}}/>
          </div>
          <span style={{fontSize:9,fontFamily:"monospace",fontWeight:700,color:"#e74c3c",minWidth:30,textAlign:"right"}}>{pct2}%</span>
        </div>
        <div style={{marginTop:10,background:"#f8f9fa",borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <span style={{fontSize:8,color:"#aaa",fontFamily:"monospace",letterSpacing:"0.1em"}}>VAINQUEUR PREVU</span>
            <div style={{fontSize:13,fontWeight:800,color:"#111",marginTop:1}}>
              {winF.name.split(" ").pop()}
              <span style={{fontSize:9,color:"#27ae60",fontFamily:"monospace",fontWeight:700,marginLeft:6}}>{winPct}%</span>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <span style={{fontSize:8,color:"#aaa",fontFamily:"monospace",letterSpacing:"0.1em"}}>METHODE · {mConf}%</span>
            <div style={{marginTop:3}}><MethodBadge method={method}/></div>
          </div>
        </div>
        <OUSection fight={fight}/>
      </div>
      {open&&(
        <div style={{padding:"0 16px 14px",borderTop:"1px solid #f0f0f0"}}>
          <div style={{paddingTop:12}}>
            <BdTable bd={bd}/>
            <div style={{fontSize:8,fontFamily:"monospace",color:"#aaa",letterSpacing:"0.12em",marginBottom:6,marginTop:12}}>STRIKING</div>
            <StatBar label="SLpM" v1={f1.slpm} v2={f2.slpm}/>
            <StatBar label="SApM (absorbe)" v1={f1.sapm} v2={f2.sapm}/>
            <StatBar label="Precision" v1={f1.sacc} v2={f2.sacc} unit="%"/>
            <StatBar label="Defense" v1={f1.sdef} v2={f2.sdef} unit="%"/>
            <div style={{fontSize:8,fontFamily:"monospace",color:"#aaa",letterSpacing:"0.12em",marginBottom:6,marginTop:10}}>GRAPPLING</div>
            <StatBar label="TD / 15 min" v1={f1.td} v2={f2.td}/>
            <StatBar label="Precision TD" v1={f1.tdacc} v2={f2.tdacc} unit="%"/>
            <StatBar label="Defense TD" v1={f1.tddef} v2={f2.tddef} unit="%"/>
            <StatBar label="Soumissions" v1={f1.sub} v2={f2.sub}/>
            <div style={{fontSize:8,fontFamily:"monospace",color:"#aaa",letterSpacing:"0.12em",marginBottom:6,marginTop:10}}>PALMARES</div>
            <div style={{display:"flex",gap:6}}>
              {[f1,f2].map((f,i)=>(
                <div key={i} style={{flex:1,background:"#f8f9fa",borderRadius:6,padding:"8px 10px"}}>
                  <div style={{fontSize:9,fontFamily:"monospace",color:"#888",marginBottom:4}}>{f.name.split(" ").pop()}</div>
                  <div style={{display:"flex",gap:6}}>
                    {[["KO",f.ko,"#e74c3c"],["SUB",f.s,"#e67e22"],["DEC",f.dec,"#27ae60"]].map(([lbl,val,col])=>(
                      <div key={lbl} style={{textAlign:"center"}}>
                        <div style={{fontSize:14,fontWeight:800,color:col}}>{val}</div>
                        <div style={{fontSize:7,color:"#aaa",fontFamily:"monospace"}}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:5,fontSize:7,fontFamily:"monospace",color:"#bbb"}}>
                    Def KO:{f.lossTypes.ko} SUB:{f.lossTypes.sub} DEC:{f.lossTypes.dec}
                  </div>
                  <div style={{marginTop:3,fontSize:7,fontFamily:"monospace",color:"#bbb"}}>
                    Reach:{f.reach}" · Layoff:{f.layoff}j
                  </div>
                </div>
              ))}
            </div>
            <div style={{fontSize:8,fontFamily:"monospace",color:"#aaa",letterSpacing:"0.12em",marginBottom:6,marginTop:10}}>5 DERNIERS COMBATS</div>
            <div style={{display:"flex",gap:6}}>
              {[f1,f2].map((f,fi)=>(
                <div key={fi} style={{flex:1}}>
                  <div style={{fontSize:8,fontFamily:"monospace",color:"#888",marginBottom:4,fontWeight:700}}>{f.name.split(" ").pop()}</div>
                  {f.recentForm.map((r,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:4,marginBottom:3}}>
                      <span style={{fontSize:8,fontWeight:800,color:r.r==="W"?"#27ae60":"#e74c3c",fontFamily:"monospace",minWidth:10}}>{r.r}</span>
                      <span style={{fontSize:7,color:"#555",fontFamily:"monospace",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.opp}</span>
                      <span style={{fontSize:6,color:r.method==="KO"?"#e74c3c":r.method==="SUB"?"#e67e22":"#888",fontFamily:"monospace",background:"#f0f0f0",borderRadius:2,padding:"1px 3px"}}>{r.method}</span>
                      {r.oppRank<=15&&<span style={{fontSize:6,color:"#fff",background:"#333",borderRadius:2,padding:"1px 3px",fontFamily:"monospace"}}>#{r.oppRank}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{marginTop:10,background:"#f0f8ff",borderRadius:6,padding:"8px 10px"}}>
              <div style={{fontSize:8,fontFamily:"monospace",color:"#aaa",marginBottom:4}}>TAUX FINISH DIVISION</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{flex:1,height:6,background:"#e0e0e0",borderRadius:3,overflow:"hidden"}}>
                  <div style={{width:`${Math.round((DIV_FINISH_RATE[fight.wc]||0.5)*100)}%`,height:"100%",background:"#e74c3c",borderRadius:3}}/>
                </div>
                <span style={{fontSize:9,fontFamily:"monospace",fontWeight:700,color:"#e74c3c"}}>{Math.round((DIV_FINISH_RATE[fight.wc]||0.5)*100)}%</span>
              </div>
              <div style={{fontSize:7,fontFamily:"monospace",color:"#aaa",marginTop:3}}>
                Temps moyen division: {DIV_AVG_TIME[fight.wc]||11.0} min
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default function App(){
  const[tab,setTab]=useState("ALL");
  const[time,setTime]=useState(new Date().toLocaleTimeString("fr-CA",{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
  useEffect(()=>{
    const t=setInterval(()=>setTime(new Date().toLocaleTimeString("fr-CA",{hour:"2-digit",minute:"2-digit",second:"2-digit"})),1000);
    return()=>clearInterval(t);
  },[]);
  const tabs=["ALL","PRELIMS","MAIN CARD","MAIN EVENT"];
  const filtered=tab==="ALL"?fights:fights.filter(f=>f.card===tab);
  return(
    <div style={{background:"#f0f2f5",minHeight:"100vh",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"#fff",borderBottom:"1px solid #e8e8e8",padding:"14px 16px",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:17,fontWeight:900,letterSpacing:"0.08em",fontFamily:"monospace",background:"linear-gradient(135deg,#e74c3c,#c0392b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>UFC PREDICTION MODEL</span>
            <span style={{fontSize:8,fontFamily:"monospace",background:"#27ae60",color:"#fff",borderRadius:3,padding:"2px 6px"}}>v3 8/10</span>
          </div>
          <span style={{fontSize:9,color:"#aaa",fontFamily:"monospace"}}>↺ {time}</span>
        </div>
        <div style={{fontSize:8,color:"#bbb",fontFamily:"monospace",letterSpacing:"0.1em",marginTop:2}}>
          FIGHT NIGHT 269 · EMMETT vs VALLEJOS · LAS VEGAS
        </div>
        <div style={{display:"flex",gap:4,marginTop:10}}>
          {tabs.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{fontSize:8,fontFamily:"monospace",letterSpacing:"0.08em",padding:"4px 8px",borderRadius:4,border:"none",cursor:"pointer",fontWeight:700,background:tab===t?"#e74c3c":"#f0f2f5",color:tab===t?"#fff":"#888"}}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"12px 16px 4px"}}>
        <span style={{fontSize:9,letterSpacing:"0.2em",fontFamily:"monospace",color:"#aaa",fontWeight:700}}>
          PREDICTIONS PRE-COMBAT · MODELE v3
        </span>
      </div>
      <div style={{padding:"4px 12px 24px"}}>
        {filtered.map(f=><FightCard key={f.id} fight={f}/>)}
      </div>
      <div style={{background:"#fff",borderTop:"1px solid #e8e8e8",padding:"12px 16px"}}>
        <div style={{fontSize:8,fontFamily:"monospace",color:"#bbb",letterSpacing:"0.08em",marginBottom:6}}>MODELE v3 · VARIABLES</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {["Striking Net","SApM absorbe","Grappling score","Forme recente ponderee","Style matchup","Age penalty","Layoff penalty","Reach adv","Chin vulnerability","Div finish rate UFC","Div avg fight time UFC"].map(v=>(
            <span key={v} style={{fontSize:7,fontFamily:"monospace",background:"#f0f2f5",color:"#888",borderRadius:3,padding:"2px 6px"}}>{v}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
