import { useState, useEffect } from "react";

const DIV_FINISH_RATE = {
  "Heavyweight":0.66,"Light Heavyweight":0.60,"Middleweight":0.53,
  "Welterweight":0.51,"Lightweight":0.50,"Featherweight":0.45,
  "Bantamweight":0.45,"Flyweight":0.45,"Strawweight W":0.33,
  "Bantamweight W":0.40,"Flyweight W":0.38,
};

const DIV_AVG_TIME = {
  "Heavyweight":9.67,"Light Heavyweight":9.22,"Middleweight":11.10,
  "Welterweight":11.37,"Lightweight":10.65,"Featherweight":11.78,
  "Bantamweight":11.17,"Flyweight":11.23,"Strawweight W":12.75,
  "Bantamweight W":12.78,"Flyweight W":12.07,
};

// FILTRE STATS ABERRANTES — si < 3 combats UFC, cap les stats
function capStats(f) {
  if (f.ucfFights < 3) {
    return {
      ...f,
      slpm: Math.min(f.slpm, 6.0),
      sapm: Math.min(f.sapm, 6.0),
      td: Math.min(f.td, 5.0),
    };
  }
  return f;
}

const fights = [
  { id:1, card:"PRELIMS", time:"13:00", rounds:3, wc:"Bantamweight W", lbs:"135 lbs", ou:2.5,
    f1:{name:"M. Mullins",full:"Melissa Mullins",country:"USA",record:"8-2",age:28,odds:-150,ucfFights:3,
        slpm:3.2,sapm:2.8,sacc:45,sdef:58,td:1.2,tdacc:40,tddef:65,sub:0.8,
        ko:2,dec:4,s:2,reach:65,layoff:180,
        recentForm:[{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"L",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"SUB"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:1,sub:0,dec:1},rank:99},
    f2:{name:"L. Carolina",full:"Luana Carolina",country:"BRA",record:"9-5",age:30,odds:125,ucfFights:6,
        slpm:3.8,sapm:3.4,sacc:48,sdef:55,td:1.8,tdacc:42,tddef:60,sub:1.2,
        ko:2,dec:5,s:2,reach:64,layoff:210,
        recentForm:[{r:"L",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"SUB"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"L",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:2,sub:1,dec:2},rank:99}},
  { id:2, card:"PRELIMS", time:"13:20", rounds:3, wc:"Strawweight W", lbs:"115 lbs", ou:2.5,
    f1:{name:"S. Dyer",full:"Shanelle Dyer",country:"USA",record:"7-2",age:27,odds:-130,ucfFights:3,
        slpm:3.5,sapm:3.0,sacc:46,sdef:57,td:1.5,tdacc:44,tddef:68,sub:0.6,
        ko:2,dec:4,s:1,reach:64,layoff:150,
        recentForm:[{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"L",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:1,dec:1},rank:99},
    f2:{name:"R. Oliveira",full:"Ravena Oliveira",country:"BRA",record:"8-3",age:26,odds:110,ucfFights:2,
        slpm:3.2,sapm:3.5,sacc:44,sdef:54,td:1.0,tdacc:38,tddef:62,sub:1.0,
        ko:2,dec:4,s:2,reach:63,layoff:160,
        recentForm:[{r:"W",opp:"opp",oppRank:99,method:"SUB"},{r:"L",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"L",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:1,sub:1,dec:1},rank:99}},
  { id:3, card:"PRELIMS", time:"13:40", rounds:3, wc:"Lightweight", lbs:"155 lbs", ou:2.5,
    f1:{name:"S. Rock",full:"Shem Rock",country:"CAN",record:"16-6",age:33,odds:-160,ucfFights:8,
        slpm:3.8,sapm:3.2,sacc:46,sdef:57,td:2.5,tdacc:48,tddef:72,sub:0.8,
        ko:4,dec:9,s:3,reach:73,layoff:200,
        recentForm:[{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"L",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"SUB"}],
        lossTypes:{ko:3,sub:1,dec:2},rank:99},
    f2:{name:"A. Al-Selwady",full:"Abdul-Kareem Al-Selwady",country:"USA",record:"9-2",age:27,odds:135,ucfFights:3,
        slpm:4.2,sapm:3.8,sacc:50,sdef:55,td:1.8,tdacc:45,tddef:65,sub:0.5,
        ko:4,dec:4,s:1,reach:72,layoff:140,
        recentForm:[{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"L",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:1,sub:0,dec:1},rank:99}},
  { id:4, card:"PRELIMS", time:"14:00", rounds:3, wc:"Heavyweight", lbs:"265 lbs", ou:1.5,
    f1:{name:"M. Pinto",full:"Mario Pinto",country:"PRT",record:"11-0",age:27,odds:-200,ucfFights:3,
        slpm:3.39,sapm:2.42,sacc:78,sdef:53,td:2.72,tdacc:60,tddef:100,sub:1.8,
        ko:5,dec:3,s:3,reach:79,layoff:161,
        recentForm:[{r:"W",opp:"Diniz",oppRank:99,method:"KO"},{r:"W",opp:"Lane",oppRank:99,method:"KO"},{r:"W",opp:"Camacho",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"SUB"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:99},
    f2:{name:"F. Franco",full:"Felipe Franco",country:"BRA",record:"8-1",age:28,odds:165,ucfFights:1,
        slpm:4.0,sapm:3.2,sacc:50,sdef:55,td:1.0,tdacc:40,tddef:70,sub:0.5,
        ko:5,dec:2,s:1,reach:76,layoff:120,
        recentForm:[{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"L",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:1},rank:99}},
  { id:5, card:"PRELIMS", time:"14:20", rounds:3, wc:"Middleweight", lbs:"185 lbs", ou:2.5,
    f1:{name:"M. Kondratavicius",full:"Mantas Kondratavicius",country:"LTU",record:"10-2",age:29,odds:-140,ucfFights:3,
        slpm:3.5,sapm:3.0,sacc:47,sdef:58,td:2.0,tdacc:45,tddef:68,sub:0.6,
        ko:4,dec:5,s:1,reach:74,layoff:170,
        recentForm:[{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"L",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:1,sub:0,dec:1},rank:99},
    f2:{name:"A. Trocoli",full:"Antonio Trocoli",country:"BRA",record:"12-3",age:32,odds:118,ucfFights:4,
        slpm:3.2,sapm:3.5,sacc:44,sdef:55,td:1.5,tdacc:40,tddef:62,sub:1.0,
        ko:3,dec:7,s:2,reach:73,layoff:180,
        recentForm:[{r:"L",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"SUB"},{r:"L",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:2,sub:0,dec:1},rank:99}},
  { id:6, card:"PRELIMS", time:"14:40", rounds:3, wc:"Heavyweight", lbs:"265 lbs", ou:1.5,
    f1:{name:"L. Sutherland",full:"Louie Sutherland",country:"GBR",record:"13-5",age:31,odds:-125,ucfFights:5,
        slpm:3.8,sapm:3.4,sacc:47,sdef:52,td:1.2,tdacc:38,tddef:65,sub:0.4,
        ko:6,dec:5,s:2,reach:76,layoff:200,
        recentForm:[{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"L",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"L",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:3,sub:0,dec:2},rank:99},
    f2:{name:"B. Pericic",full:"Brando Pericic",country:"HRV",record:"12-3",age:29,odds:105,ucfFights:4,
        slpm:3.5,sapm:3.8,sacc:45,sdef:50,td:1.0,tdacc:35,tddef:60,sub:0.5,
        ko:5,dec:5,s:2,reach:75,layoff:160,
        recentForm:[{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"L",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"L",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:2,sub:0,dec:1},rank:99}},
  { id:7, card:"PRELIMS", time:"15:00", rounds:3, wc:"Lightweight", lbs:"155 lbs", ou:2.5,
    f1:{name:"M. Jones",full:"Mason Jones",country:"GBR",record:"17-2",age:30,odds:-180,ucfFights:7,
        slpm:5.71,sapm:4.47,sacc:41,sdef:50,td:4.17,tdacc:55,tddef:81,sub:0.2,
        ko:5,dec:9,s:3,reach:74,layoff:196,
        recentForm:[{r:"W",opp:"Oki",oppRank:99,method:"KO"},{r:"W",opp:"Stephens",oppRank:99,method:"DEC"},{r:"L",opp:"Klein",oppRank:99,method:"DEC"},{r:"W",opp:"Onama",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:1,dec:1},rank:99},
    f2:{name:"A. Sola",full:"Axel Sola",country:"FRA",record:"11-0-1",age:27,odds:150,ucfFights:1,
        slpm:3.74,sapm:2.74,sacc:42,sdef:75,td:1.25,tdacc:25,tddef:0,sub:0.0,
        ko:4,dec:6,s:1,reach:74,layoff:196,
        recentForm:[{r:"W",opp:"McKee",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"D",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:99}},
];
  { id:8, card:"MAIN CARD", time:"16:00", rounds:3, wc:"Featherweight", lbs:"145 lbs", ou:2.5,
    f1:{name:"N. Wood",full:"Nathaniel Wood",country:"GBR",record:"22-6",age:32,odds:-175,ucfFights:12,
        slpm:5.74,sapm:4.32,sacc:52,sdef:54,td:1.46,tdacc:50,tddef:73,sub:0.5,
        ko:7,dec:12,s:3,reach:69,layoff:147,
        recentForm:[{r:"W",opp:"Delgado",oppRank:99,method:"DEC"},{r:"W",opp:"Charriere",oppRank:99,method:"DEC"},{r:"W",opp:"Pineda",oppRank:99,method:"DEC"},{r:"L",opp:"Naimov",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"SUB"}],
        lossTypes:{ko:1,sub:2,dec:3},rank:99},
    f2:{name:"L. Keita",full:"Losene Keita",country:"GUI",record:"16-1",age:27,odds:145,ucfFights:1,
        slpm:4.0,sapm:3.0,sacc:48,sdef:58,td:2.0,tdacc:45,tddef:70,sub:1.0,
        ko:6,dec:7,s:3,reach:72,layoff:200,
        recentForm:[{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"L",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:1},rank:99}},
  { id:9, card:"MAIN CARD", time:"16:20", rounds:3, wc:"Featherweight", lbs:"145 lbs", ou:2.5,
    f1:{name:"K. Campbell",full:"Kurtis Campbell",country:"GBR",record:"8-0",age:22,odds:-165,ucfFights:1,
        slpm:5.25,sapm:1.50,sacc:77,sdef:60,td:5.0,tdacc:40,tddef:100,sub:0.0,
        ko:3,dec:4,s:1,reach:72,layoff:172,
        recentForm:[{r:"W",opp:"Seck",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:99},
    f2:{name:"D. Silva",full:"Danny Silva",country:"ESP",record:"10-2",age:28,odds:138,ucfFights:4,
        slpm:6.67,sapm:7.47,sacc:55,sdef:61,td:2.00,tdacc:33,tddef:81,sub:0.2,
        ko:4,dec:5,s:1,reach:70,layoff:231,
        recentForm:[{r:"L",opp:"Vallejos",oppRank:14,method:"DEC"},{r:"W",opp:"L.Almeida",oppRank:99,method:"DEC"},{r:"W",opp:"Culibao",oppRank:99,method:"DEC"},{r:"W",opp:"Pacheco",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:2},rank:99}},
  { id:10, card:"MAIN CARD", time:"16:40", rounds:3, wc:"Light Heavyweight", lbs:"205 lbs", ou:1.5,
    f1:{name:"I. Baraniewski",full:"Iwo Baraniewski",country:"POL",record:"7-0",age:26,odds:-145,ucfFights:2,
        slpm:5.0,sapm:5.0,sacc:55,sdef:50,td:0.0,tdacc:0,tddef:100,sub:0.0,
        ko:5,dec:2,s:0,reach:73,layoff:105,
        recentForm:[{r:"W",opp:"Aslan",oppRank:99,method:"KO"},{r:"W",opp:"Aly",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:99},
    f2:{name:"A. Lane",full:"Austen Lane",country:"USA",record:"13-7",age:37,odds:120,ucfFights:6,
        slpm:2.74,sapm:2.23,sacc:50,sdef:40,td:1.52,tdacc:28,tddef:33,sub:0.0,
        ko:4,dec:7,s:2,reach:80,layoff:252,
        recentForm:[{r:"L",opp:"Petrino",oppRank:99,method:"SUB"},{r:"L",opp:"M.Pinto",oppRank:99,method:"KO"},{r:"W",opp:"Despaigne",oppRank:99,method:"DEC"},{r:"L",opp:"Diniz",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:4,sub:1,dec:2},rank:99}},
  { id:11, card:"MAIN CARD", time:"17:00", rounds:3, wc:"Middleweight", lbs:"185 lbs", ou:2.5,
    f1:{name:"R. Dolidze",full:"Roman Dolidze",country:"GEO",record:"15-4",age:37,odds:120,ucfFights:10,
        slpm:3.41,sapm:3.72,sacc:41,sdef:48,td:0.99,tdacc:39,tddef:26,sub:0.8,
        ko:5,dec:8,s:2,reach:76,layoff:224,
        recentForm:[{r:"L",opp:"Hernandez",oppRank:99,method:"SUB"},{r:"W",opp:"Vettori",oppRank:99,method:"DEC"},{r:"W",opp:"Holland",oppRank:99,method:"KO"},{r:"W",opp:"A.Smith",oppRank:99,method:"DEC"},{r:"L",opp:"Chimaev",oppRank:1,method:"SUB"}],
        lossTypes:{ko:0,sub:3,dec:1},rank:99},
    f2:{name:"C. Duncan",full:"Christian Leroy Duncan",country:"GBR",record:"13-2",age:30,odds:-145,ucfFights:5,
        slpm:4.60,sapm:2.97,sacc:58,sdef:51,td:0.40,tdacc:20,tddef:69,sub:0.0,
        ko:5,dec:7,s:1,reach:79,layoff:133,
        recentForm:[{r:"W",opp:"M.Tulio",oppRank:99,method:"KO"},{r:"W",opp:"Anders",oppRank:99,method:"KO"},{r:"W",opp:"Pulyaev",oppRank:99,method:"DEC"},{r:"L",opp:"Rodrigues",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:2},rank:99}},
  { id:12, card:"MAIN CARD", time:"17:20", rounds:3, wc:"Featherweight", lbs:"145 lbs", ou:2.5,
    f1:{name:"L. Riley",full:"Luke Riley",country:"GBR",record:"12-0",age:25,odds:-130,ucfFights:1,
        slpm:2.55,sapm:1.27,sacc:60,sdef:46,td:0.0,tdacc:0,tddef:42,sub:0.0,
        ko:5,dec:6,s:1,reach:69,layoff:119,
        recentForm:[{r:"W",opp:"Grad",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:99},
    f2:{name:"M. Aswell Jr",full:"Michael Aswell Jr",country:"USA",record:"11-3",age:24,odds:108,ucfFights:3,
        slpm:5.0,sapm:5.0,sacc:45,sdef:54,td:0.0,tdacc:0,tddef:57,sub:0.0,
        ko:6,dec:4,s:1,reach:69,layoff:161,
        recentForm:[{r:"W",opp:"L.Almeida",oppRank:99,method:"KO"},{r:"L",opp:"Oki",oppRank:99,method:"DEC"},{r:"L",opp:"Grad",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:3},rank:99}},
  { id:13, card:"MAIN CARD", time:"17:40", rounds:3, wc:"Welterweight", lbs:"170 lbs", ou:2.5,
    f1:{name:"M. Page",full:"Michael Page",country:"GBR",record:"24-3",age:38,odds:-160,ucfFights:5,
        slpm:2.39,sapm:1.68,sacc:60,sdef:57,td:0.23,tdacc:16,tddef:66,sub:0.0,
        ko:13,dec:9,s:2,reach:79,layoff:217,
        recentForm:[{r:"W",opp:"Cannonier",oppRank:99,method:"DEC"},{r:"W",opp:"Magomedov",oppRank:99,method:"DEC"},{r:"L",opp:"I.Garry",oppRank:5,method:"DEC"},{r:"W",opp:"Holland",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:3},rank:99},
    f2:{name:"S. Patterson",full:"Sam Patterson",country:"GBR",record:"14-2-1",age:29,odds:133,ucfFights:5,
        slpm:3.89,sapm:3.93,sacc:43,sdef:49,td:1.39,tdacc:100,tddef:33,sub:2.8,
        ko:4,dec:7,s:3,reach:78,layoff:196,
        recentForm:[{r:"W",opp:"Waters",oppRank:99,method:"KO"},{r:"W",opp:"Barlow",oppRank:99,method:"KO"},{r:"W",opp:"Crosbie",oppRank:99,method:"SUB"},{r:"W",opp:"Lainesse",oppRank:99,method:"SUB"},{r:"L",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:2},rank:99}},
  { id:14, card:"MAIN EVENT", time:"17:40", rounds:5, wc:"Featherweight", lbs:"145 lbs", ou:3.5, isMain:true,
    f1:{name:"M. Evloev",full:"Movsar Evloev",country:"RUS",record:"19-0",age:32,odds:-140,ucfFights:10,
        slpm:3.99,sapm:2.66,sacc:48,sdef:60,td:4.67,tdacc:48,tddef:61,sub:0.2,
        ko:4,dec:13,s:2,reach:72,layoff:469,
        recentForm:[{r:"W",opp:"Sterling",oppRank:99,method:"DEC"},{r:"W",opp:"A.Allen",oppRank:99,method:"DEC"},{r:"W",opp:"D.Lopes",oppRank:99,method:"DEC"},{r:"W",opp:"D.Ige",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:1},
    f2:{name:"L. Murphy",full:"Lerone Murphy",country:"GBR",record:"17-0-1",age:34,odds:118,ucfFights:8,
        slpm:4.48,sapm:2.51,sacc:53,sdef:61,td:1.41,tdacc:54,tddef:51,sub:0.5,
        ko:6,dec:9,s:2,reach:73,layoff:217,
        recentForm:[{r:"W",opp:"A.Pico",oppRank:99,method:"KO"},{r:"W",opp:"Emmett",oppRank:11,method:"DEC"},{r:"W",opp:"D.Ige",oppRank:99,method:"DEC"},{r:"W",opp:"Barboza",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:4}},
];
// FILTRE STATS ABERRANTES — cap les stats si peu de combats UFC
function getStats(f) {
  const maxSlpm = f.ucfFights < 3 ? 5.5 : 99;
  const maxSapm = f.ucfFights < 3 ? 5.5 : 99;
  const maxTd = f.ucfFights < 3 ? 4.5 : 99;
  return {
    ...f,
    slpm: Math.min(f.slpm, maxSlpm),
    sapm: Math.min(f.sapm, maxSapm),
    td: Math.min(f.td, maxTd),
  };
}

function modelV5(f1raw, f2raw, rounds) {
  const f1 = getStats(f1raw);
  const f2 = getStats(f2raw);

  // 1. STRIKING NET
  const strNet1 = (f1.slpm * f1.sacc/100) - (f1.sapm * (1 - f1.sdef/100));
  const strNet2 = (f2.slpm * f2.sacc/100) - (f2.sapm * (1 - f2.sdef/100));

  // 2. GRAPPLING
  const grp1 = f1.td*(f1.tdacc/100)*2 + f1.tddef*0.015 + f1.sub*0.5;
  const grp2 = f2.td*(f2.tdacc/100)*2 + f2.tddef*0.015 + f2.sub*0.5;

  // 3. FORME RECENTE PONDEREE
  const formScore = (form) => {
    const w = [5,4,3,2,1];
    return form.reduce((acc,f,i) => {
      if(f.r==="D") return acc;
      const rb = f.oppRank<=5?1.5:f.oppRank<=10?1.3:f.oppRank<=15?1.15:1.0;
      return acc + (f.r==="W" ? w[i]*rb : -w[i]*0.6);
    },0)/15;
  };
  const form1 = formScore(f1.recentForm);
  const form2 = formScore(f2.recentForm);

  // 4. PENALITE AGE
  const agePen = (a) => a>31 ? Math.min(0.25,(a-31)*0.028) : 0;
  const ap1=agePen(f1.age), ap2=agePen(f2.age);

  // 5. PENALITE LAYOFF
  const layPen = (d) => d>120 ? Math.min(0.15,(d-120)/900) : 0;
  const lp1=layPen(f1.layoff), lp2=layPen(f2.layoff);

  // 6. REACH
  const ra1=Math.max(0,f1.reach-f2.reach)*0.004;
  const ra2=Math.max(0,f2.reach-f1.reach)*0.004;

  // 7. STYLE MATCHUP
  const sa1=(strNet1>strNet2&&f2.sdef<55?0.05:0)+(grp1>grp2&&f2.tddef<60?0.05:0);
  const sa2=(strNet2>strNet1&&f1.sdef<55?0.05:0)+(grp2>grp1&&f1.tddef<60?0.05:0);

  // 8. VULNERABILITE CHIN
  const tl1=f1.lossTypes.ko+f1.lossTypes.sub+f1.lossTypes.dec||1;
  const tl2=f2.lossTypes.ko+f2.lossTypes.sub+f2.lossTypes.dec||1;
  const cv1=(f1.lossTypes.ko/tl1)*0.08, cv2=(f2.lossTypes.ko/tl2)*0.08;

  // 9. PENALITE INEXPERIENCE UFC
  const expPen1 = f1.ucfFights < 3 ? 0.05 : 0;
  const expPen2 = f2.ucfFights < 3 ? 0.05 : 0;

  // 10. COMBINE
  const S1 = strNet1*0.28 + grp1*0.20 + form1*0.27 + ra1*0.05 + sa1*0.08 - ap1*0.05 - lp1*0.03 - cv1*0.02 - expPen1*0.02;
  const S2 = strNet2*0.28 + grp2*0.20 + form2*0.27 + ra2*0.05 + sa2*0.08 - ap2*0.05 - lp2*0.03 - cv2*0.02 - expPen2*0.02;

  const tot = Math.abs(S1)+Math.abs(S2)||1;
  const pct1 = Math.round(Math.min(93,Math.max(7,50+((S1-S2)/tot)*42)));
  const pct2 = 100-pct1;
  const winner = pct1>=pct2?"f1":"f2";
  const winF = winner==="f1"?f1:f2, loseF=winner==="f1"?f2:f1;

  // 11. METHODE AMELIOREE
  const wT = winF.ko+winF.s+winF.dec||1;
  const koP = (winF.ko/wT)*100;
  const subP = (winF.s/wT)*100;
  const decP = (winF.dec/wT)*100;
  // Facteurs KO: striker fort + adversaire chin vulnérable + SApM élevé adversaire
  const loseKOV = loseF.lossTypes.ko>=3;
  const loseHighSapm = loseF.sapm > 4.5;
  const isStrAdv = winF.slpm > loseF.slpm*1.2 || winF.sacc > loseF.sdef*0.85;
  const isGrpAdv = winF.td>1.5 && winF.tdacc>35 && loseF.tddef<60;
  // Facteur DECISION: si les deux ont beaucoup de décisions dans palmarès
  const bothDecision = (decP > 55) && ((loseF.dec/(loseF.ko+loseF.s+loseF.dec||1))*100 > 40);

  let method, mConf;
  if(bothDecision && !loseKOV) {
    method="Decision"; mConf=Math.round(Math.min(82,decP+10));
  } else if(isStrAdv&&(koP>45||loseKOV||loseHighSapm)) {
    method="KO/TKO"; mConf=Math.round(Math.min(82,koP+(loseKOV?10:0)+(loseHighSapm?5:0)));
  } else if(isGrpAdv&&subP>20) {
    method="Soumission"; mConf=Math.round(Math.min(78,subP+15));
  } else if(koP>40) {
    method="KO/TKO"; mConf=Math.round(Math.min(72,koP*0.85));
  } else {
    method="Decision"; mConf=Math.round(Math.min(80,decP));
  }
  mConf=Math.max(32,mConf);

  const bd={
    "Striking net":[+strNet1.toFixed(2),+strNet2.toFixed(2)],
    "Grappling":[+grp1.toFixed(2),+grp2.toFixed(2)],
    "Forme":[+form1.toFixed(2),+form2.toFixed(2)],
    "Style":[+sa1.toFixed(2),+sa2.toFixed(2)],
    "Age pen":[+(ap1*-10).toFixed(1),+(ap2*-10).toFixed(1)],
    "Layoff pen":[+(lp1*-10).toFixed(1),+(lp2*-10).toFixed(1)],
    "Reach":[+ra1.toFixed(2),+ra2.toFixed(2)],
  };

  return{winner,pct1,pct2,method,mConf,bd,ap1,ap2,lp1,lp2,strNet1:+strNet1.toFixed(1),strNet2:+strNet2.toFixed(1)};
}

// O/U V5 — recalibre pour moins de UNDER
function predictOU(fight) {
  const{f1:f1raw,f2:f2raw,ou,rounds,wc}=fight;
  const f1=getStats(f1raw), f2=getStats(f2raw);
  const divFR = DIV_FINISH_RATE[wc]||0.50;
  const divAvgT = DIV_AVG_TIME[wc]||11.0;
  const f1FP = ((f1.ko+f1.s)/(f1.ko+f1.s+f1.dec||1));
  const f2FP = ((f2.ko+f2.s)/(f2.ko+f2.s+f2.dec||1));
  const fighterFinish = (f1FP+f2FP)/2;
  // V5: augmente poids du temps moyen division (plus de décisions en réalité)
  const combinedFinish = (fighterFinish*0.50)+(divFR*0.50);
  const maxT = rounds*5;
  // Base sur temps moyen division, ajusté par finish rate
  const estTime = divAvgT * rounds/3 * (1 - combinedFinish*0.35);
  const estRound = Math.min(rounds,Math.max(1,estTime/5));
  const ouMins = ou*5;
  const diff = estTime-ouMins;
  const over = Math.round(Math.min(88,Math.max(12,50+Math.tanh(diff/2.8)*38)));
  const under = 100-over;
  const signal = over>=58?"OVER":under>=58?"UNDER":"PUSH";
  return{over,under,signal,estRound,estTime};
}

const fmtOdds=(o)=>o>0?`+${o}`:`${o}`;
const oddsCol=(o)=>o<0?"#e74c3c":"#27ae60";

function FormRow({form}){
  return(
    <div style={{display:"flex",gap:2,marginTop:3}}>
      {form.map((f,i)=>(
        <div key={i} title={`${f.r} vs ${f.opp}`} style={{width:9,height:9,borderRadius:"50%",background:f.r==="W"?"#27ae60":f.r==="D"?"#f0a500":"#e74c3c",opacity:1-i*0.12,border:f.oppRank<=15?"1.5px solid #333":"none"}}/>
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
      <div style={{fontSize:8,fontFamily:"monospace",color:"#aaa",letterSpacing:"0.12em",marginBottom:6}}>FACTEURS MODELE v5</div>
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
function FightCard({fight}){
  const[open,setOpen]=useState(false);
  const{f1,f2,wc,lbs,rounds,ou,card,time,isMain}=fight;
  const res=modelV5(f1,f2,rounds);
  const ouRes=predictOU(fight);
  const wF=res.winner==="f1"?f1:f2;
  const lF=res.winner==="f1"?f2:f1;
  const wPct=res.winner==="f1"?res.pct1:res.pct2;
  const lPct=res.winner==="f1"?res.pct2:res.pct1;
  const wStr=res.winner==="f1"?res.strNet1:res.strNet2;
  const lStr=res.winner==="f1"?res.strNet2:res.strNet1;
  const confColor=wPct>=70?"#27ae60":wPct>=58?"#f0a500":"#e74c3c";
  const ouColor=ouRes.signal==="OVER"?"#e74c3c":ouRes.signal==="UNDER"?"#2980b9":"#888";

  return(
    <div style={{background:"#fff",borderRadius:10,boxShadow:"0 2px 10px rgba(0,0,0,0.07)",marginBottom:12,border:`1px solid ${isMain?"#f0a500":"#eee"}`,overflow:"hidden"}}>
      {/* HEADER */}
      <div style={{background:isMain?"linear-gradient(135deg,#1a1a2e,#16213e)":card==="MAIN CARD"?"#1a1a2e":"#f8f8f8",padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:8,fontFamily:"monospace",fontWeight:700,color:isMain?"#f0a500":card==="MAIN CARD"?"#aaa":"#888",letterSpacing:"0.12em"}}>{card}</span>
          {isMain&&<span style={{fontSize:8,background:"#f0a500",color:"#000",borderRadius:3,padding:"1px 6px",fontWeight:700,fontFamily:"monospace"}}>MAIN EVENT</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:8,fontFamily:"monospace",color:isMain?"#aaa":card==="MAIN CARD"?"#aaa":"#888"}}>{rounds}R · {wc} · {lbs}</span>
          <span style={{fontSize:8,fontFamily:"monospace",color:isMain?"#aaa":card==="MAIN CARD"?"#aaa":"#888"}}>{time} ET</span>
        </div>
      </div>

      {/* FIGHTERS */}
      <div style={{padding:"12px 14px 10px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          {/* FIGHTER 1 */}
          <div style={{flex:1,textAlign:"left"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
              <span style={{fontSize:8,background:"#eee",borderRadius:3,padding:"1px 5px",fontFamily:"monospace",color:"#555"}}>{f1.country}</span>
              {f1.rank<=15&&<span style={{fontSize:8,background:"#1a1a2e",color:"#f0a500",borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>#{f1.rank}</span>}
              {f1.ucfFights<3&&<span style={{fontSize:8,background:"#fff4e5",color:"#e67e22",borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>NEW</span>}
            </div>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"monospace",color:"#1a1a2e",lineHeight:1.2}}>{f1.name}</div>
            <div style={{fontSize:9,color:"#888",fontFamily:"monospace",marginTop:1}}>{f1.record}</div>
            <FormRow form={f1.recentForm}/>
            <div style={{fontSize:9,fontFamily:"monospace",color:oddsCol(f1.odds),fontWeight:700,marginTop:3}}>{fmtOdds(f1.odds)}</div>
          </div>

          {/* CENTER */}
          <div style={{textAlign:"center",padding:"0 10px",minWidth:80}}>
            <div style={{fontSize:9,fontFamily:"monospace",color:"#aaa",marginBottom:3}}>VS</div>
            {/* WIN BAR */}
            <div style={{height:6,borderRadius:3,overflow:"hidden",display:"flex",marginBottom:4}}>
              <div style={{width:`${res.pct1}%`,background:"#27ae60"}}/>
              <div style={{width:`${res.pct2}%`,background:"#e74c3c"}}/>
            </div>
            <div style={{fontSize:8,fontFamily:"monospace",color:"#888",marginBottom:6}}>{res.pct1}% — {res.pct2}%</div>
            {/* WINNER */}
            <div style={{background:isMain?"#1a1a2e":"#f3f9f5",borderRadius:6,padding:"5px 8px",marginBottom:5}}>
              <div style={{fontSize:7,fontFamily:"monospace",color:"#aaa",letterSpacing:"0.1em",marginBottom:2}}>PRÉDICTION</div>
              <div style={{fontSize:11,fontWeight:700,fontFamily:"monospace",color:confColor}}>{wF.name}</div>
              <div style={{fontSize:8,fontFamily:"monospace",color:"#aaa",marginBottom:3}}>{wPct}% conf.</div>
              <MethodBadge method={res.method}/>
              <div style={{fontSize:7,fontFamily:"monospace",color:"#aaa",marginTop:2}}>{res.mConf}% meth.</div>
            </div>
            {/* O/U */}
            <div style={{background:"#f8f8f8",borderRadius:6,padding:"4px 8px"}}>
              <div style={{fontSize:7,fontFamily:"monospace",color:"#aaa",letterSpacing:"0.1em",marginBottom:2}}>O/U {ou}</div>
              <div style={{fontSize:11,fontWeight:700,fontFamily:"monospace",color:ouColor}}>{ouRes.signal}</div>
              <div style={{fontSize:8,fontFamily:"monospace",color:"#aaa"}}>{ouRes.over}% OVER</div>
              <div style={{fontSize:7,fontFamily:"monospace",color:"#999",marginTop:1}}>~R{ouRes.estRound.toFixed(1)}</div>
            </div>
          </div>

          {/* FIGHTER 2 */}
          <div style={{flex:1,textAlign:"right"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2,justifyContent:"flex-end"}}>
              {f2.ucfFights<3&&<span style={{fontSize:8,background:"#fff4e5",color:"#e67e22",borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>NEW</span>}
              {f2.rank<=15&&<span style={{fontSize:8,background:"#1a1a2e",color:"#f0a500",borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>#{f2.rank}</span>}
              <span style={{fontSize:8,background:"#eee",borderRadius:3,padding:"1px 5px",fontFamily:"monospace",color:"#555"}}>{f2.country}</span>
            </div>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"monospace",color:"#1a1a2e",lineHeight:1.2}}>{f2.name}</div>
            <div style={{fontSize:9,color:"#888",fontFamily:"monospace",marginTop:1}}>{f2.record}</div>
            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <FormRow form={f2.recentForm}/>
            </div>
            <div style={{fontSize:9,fontFamily:"monospace",color:oddsCol(f2.odds),fontWeight:700,marginTop:3}}>{fmtOdds(f2.odds)}</div>
          </div>
        </div>

        {/* STATS RAPIDES */}
        <div style={{borderTop:"1px solid #f0f0f0",paddingTop:8}}>
          <StatBar label="SLpM" v1={getStats(f1).slpm} v2={getStats(f2).slpm}/>
          <StatBar label="Str. Acc" v1={f1.sacc} v2={f2.sacc} unit="%"/>
          <StatBar label="Str. Def" v1={f1.sdef} v2={f2.sdef} unit="%"/>
          <StatBar label="TD Avg" v1={getStats(f1).td} v2={getStats(f2).td}/>
          <StatBar label="TD Def" v1={f1.tddef} v2={f2.tddef} unit="%"/>
        </div>

        {/* TOGGLE DETAILS */}
        <button onClick={()=>setOpen(!open)} style={{width:"100%",marginTop:8,background:"#f8f8f8",border:"1px solid #eee",borderRadius:6,padding:"5px",fontFamily:"monospace",fontSize:9,color:"#888",cursor:"pointer"}}>
          {open?"▲ MOINS":"▼ DÉTAILS MODÈLE"}
        </button>

        {open&&(
          <div style={{marginTop:8}}>
            <BdTable bd={res.bd}/>
            <div style={{marginTop:8,padding:8,background:"#f8f8f8",borderRadius:6}}>
              <div style={{fontSize:8,fontFamily:"monospace",color:"#aaa",marginBottom:4}}>RÉSUMÉ ANALYSE</div>
              <div style={{fontSize:9,fontFamily:"monospace",color:"#555",lineHeight:1.6}}>
                {wF.name} domine sur le striking net ({wStr>0?"+":""}{wStr}), avec {wPct}% win prob.
                {res.ap1>0.05||res.ap2>0.05?" ⚠ Pénalité d'âge appliquée.":""}
                {res.lp1>0.05||res.lp2>0.05?" ⚠ Layoff significatif détecté.":""}
                {(f1.ucfFights<3||f2.ucfFights<3)?" 🆕 Stats cappées (nouveau combattant UFC).":""}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function SummaryTable(){
  const results = fights.map(f=>{
    const r=modelV5(f.f1,f.f2,f.rounds);
    const ou=predictOU(f);
    const wF=r.winner==="f1"?f.f1:f.f2;
    return{id:f.id,f1:f.f1.name,f2:f.f2.name,winner:wF.name,pct:r.winner==="f1"?r.pct1:r.pct2,method:r.method,mConf:r.mConf,signal:ou.signal,over:ou.over,wc:f.wc,card:f.card};
  });

  const cardOrder=["MAIN EVENT","MAIN CARD","PRELIMS"];
  const sorted=[...results].sort((a,b)=>{
    const ai=cardOrder.indexOf(a.card),bi=cardOrder.indexOf(b.card);
    if(ai!==bi)return ai-bi;
    return a.id-b.id;
  });

  const confColor=(p)=>p>=70?"#27ae60":p>=58?"#f0a500":"#e74c3c";
  const ouColor=(s)=>s==="OVER"?"#e74c3c":s==="UNDER"?"#2980b9":"#888";

  return(
    <div style={{background:"#fff",borderRadius:10,boxShadow:"0 2px 10px rgba(0,0,0,0.07)",marginBottom:20,overflow:"hidden",border:"1px solid #eee"}}>
      <div style={{background:"#1a1a2e",padding:"10px 16px"}}>
        <div style={{fontSize:10,fontFamily:"monospace",fontWeight:700,color:"#f0a500",letterSpacing:"0.15em"}}>RÉSUMÉ — UFC LONDON 21 MARS 2026</div>
        <div style={{fontSize:8,fontFamily:"monospace",color:"#aaa",marginTop:2}}>Modèle v5 · Stats réelles UFCStats · Filtre données aberrantes</div>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:9,fontFamily:"monospace"}}>
          <thead>
            <tr style={{background:"#f8f8f8",borderBottom:"2px solid #eee"}}>
              <th style={{padding:"6px 10px",textAlign:"left",color:"#888",fontWeight:700}}>COMBAT</th>
              <th style={{padding:"6px 10px",textAlign:"center",color:"#888",fontWeight:700}}>DIVISION</th>
              <th style={{padding:"6px 10px",textAlign:"center",color:"#888",fontWeight:700}}>PRÉDICTION</th>
              <th style={{padding:"6px 10px",textAlign:"center",color:"#888",fontWeight:700}}>CONF</th>
              <th style={{padding:"6px 10px",textAlign:"center",color:"#888",fontWeight:700}}>MÉTHODE</th>
              <th style={{padding:"6px 10px",textAlign:"center",color:"#888",fontWeight:700}}>METH%</th>
              <th style={{padding:"6px 10px",textAlign:"center",color:"#888",fontWeight:700}}>O/U</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r,i)=>(
              <tr key={r.id} style={{borderBottom:"1px solid #f0f0f0",background:i%2===0?"#fff":"#fafafa"}}>
                <td style={{padding:"7px 10px"}}>
                  <div style={{fontWeight:700,color:"#1a1a2e"}}>{r.f1} vs {r.f2}</div>
                  <div style={{fontSize:8,color:"#aaa",marginTop:1}}>{r.card}</div>
                </td>
                <td style={{padding:"7px 10px",textAlign:"center",color:"#888"}}>{r.wc}</td>
                <td style={{padding:"7px 10px",textAlign:"center"}}>
                  <span style={{fontWeight:700,color:"#27ae60"}}>{r.winner}</span>
                </td>
                <td style={{padding:"7px 10px",textAlign:"center"}}>
                  <span style={{fontWeight:700,color:confColor(r.pct)}}>{r.pct}%</span>
                </td>
                <td style={{padding:"7px 10px",textAlign:"center"}}>
                  <MethodBadge method={r.method}/>
                </td>
                <td style={{padding:"7px 10px",textAlign:"center",color:"#888"}}>{r.mConf}%</td>
                <td style={{padding:"7px 10px",textAlign:"center"}}>
                  <span style={{fontWeight:700,color:ouColor(r.signal)}}>{r.signal}</span>
                  <div style={{fontSize:8,color:"#aaa"}}>{r.over}%</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatsLegend(){
  return(
    <div style={{background:"#fff",borderRadius:10,padding:"12px 16px",boxShadow:"0 2px 10px rgba(0,0,0,0.05)",marginBottom:16,border:"1px solid #eee"}}>
      <div style={{fontSize:9,fontFamily:"monospace",color:"#aaa",letterSpacing:"0.12em",marginBottom:8}}>AMÉLIORATIONS MODÈLE v5</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {[
          ["🎯","Stats réelles UFCStats","Données directes ufcstats.com"],
          ["🔒","Cap stats aberrantes","< 3 combats UFC → stats plafonnées"],
          ["📊","O/U recalibré","Division avg time 50% du calcul"],
          ["🆕","Badge NEW","Pénalité -5% fighters inexperimentés"],
          ["🥊","Méthode améliorée","SApM + bothDecision + chin vuln."],
          ["📈","Forme pondérée","Decay exponentiel + qualité adversaire"],
        ].map(([icon,title,desc])=>(
          <div key={title} style={{background:"#f8f8f8",borderRadius:6,padding:"6px 10px",minWidth:140,flex:"1 1 140px"}}>
            <div style={{fontSize:10,marginBottom:2}}>{icon} <span style={{fontFamily:"monospace",fontWeight:700,color:"#1a1a2e",fontSize:9}}>{title}</span></div>
            <div style={{fontSize:8,fontFamily:"monospace",color:"#aaa"}}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default function App(){
  const[filter,setFilter]=useState("ALL");
  const[showSummary,setShowSummary]=useState(true);

  const cards=["ALL","MAIN EVENT","MAIN CARD","PRELIMS"];
  const filtered=filter==="ALL"?fights:fights.filter(f=>f.card===filter);

  // Stats globales
  const allRes=fights.map(f=>{
    const r=modelV5(f.f1,f.f2,f.rounds);
    const ou=predictOU(f);
    return{method:r.method,signal:ou.signal};
  });
  const koCount=allRes.filter(r=>r.method==="KO/TKO").length;
  const subCount=allRes.filter(r=>r.method==="Soumission").length;
  const decCount=allRes.filter(r=>r.method==="Decision").length;
  const overCount=allRes.filter(r=>r.signal==="OVER").length;
  const underCount=allRes.filter(r=>r.signal==="UNDER").length;
  const pushCount=allRes.filter(r=>r.signal==="PUSH").length;

  return(
    <div style={{minHeight:"100vh",background:"#f4f4f4",fontFamily:"monospace"}}>
      {/* TOP HEADER */}
      <div style={{background:"linear-gradient(135deg,#1a1a2e,#16213e)",padding:"16px 20px 12px",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 15px rgba(0,0,0,0.3)"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:"#fff",letterSpacing:"0.05em"}}>🥊 UFC LONDON</div>
              <div style={{fontSize:9,color:"#f0a500",letterSpacing:"0.15em",marginTop:1}}>EVLOEV vs MURPHY · 21 MARS 2026 · O2 ARENA</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:8,color:"#aaa"}}>MODÈLE</div>
              <div style={{fontSize:13,fontWeight:700,color:"#27ae60"}}>v5</div>
            </div>
          </div>

          {/* GLOBAL STATS BAR */}
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            {[
              ["KO/TKO",koCount,"#e74c3c"],
              ["SUB",subCount,"#e67e22"],
              ["DEC",decCount,"#27ae60"],
              ["OVER",overCount,"#e74c3c"],
              ["UNDER",underCount,"#2980b9"],
              ["PUSH",pushCount,"#888"],
            ].map(([label,count,color])=>(
              <div key={label} style={{background:"rgba(255,255,255,0.08)",borderRadius:6,padding:"4px 8px",textAlign:"center",flex:1}}>
                <div style={{fontSize:11,fontWeight:700,color}}>{count}</div>
                <div style={{fontSize:7,color:"#aaa",letterSpacing:"0.08em"}}>{label}</div>
              </div>
            ))}
          </div>

          {/* FILTER TABS */}
          <div style={{display:"flex",gap:4}}>
            {cards.map(c=>(
              <button key={c} onClick={()=>setFilter(c)} style={{flex:1,padding:"5px 4px",borderRadius:6,border:"none",background:filter===c?"#f0a500":"rgba(255,255,255,0.08)",color:filter===c?"#000":"#aaa",fontFamily:"monospace",fontSize:8,fontWeight:700,cursor:"pointer",letterSpacing:"0.06em",transition:"all 0.15s"}}>
                {c==="ALL"?"TOUS":c==="MAIN EVENT"?"M.EVENT":c==="MAIN CARD"?"MAIN":"PRELIMS"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{maxWidth:700,margin:"0 auto",padding:"14px 12px"}}>
        {/* TOGGLE SUMMARY */}
        <button onClick={()=>setShowSummary(!showSummary)} style={{width:"100%",marginBottom:12,background:"#fff",border:"1px solid #eee",borderRadius:8,padding:"8px",fontFamily:"monospace",fontSize:9,color:"#888",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
          {showSummary?"▲ CACHER RÉSUMÉ":"▼ VOIR RÉSUMÉ COMPLET"}
        </button>

        {showSummary&&<SummaryTable/>}
        <StatsLegend/>

        {filtered.map(f=>(
          <FightCard key={f.id} fight={f}/>
        ))}

        {/* FOOTER */}
        <div style={{textAlign:"center",padding:"16px 0 8px",fontSize:8,fontFamily:"monospace",color:"#bbb"}}>
          UFC Model v5 · Stats UFCStats.com · Filtre aberrantes · O/U recalibré
          <br/>À titre informatif seulement — pas de conseils de paris
        </div>
      </div>
    </div>
  );
}
