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

const fights = [
  { id:1, card:"PRELIMS", time:"16:00", rounds:3, wc:"Strawweight W", lbs:"115 lbs", ou:2.5,
    f1:{name:"P. Rodriguez",full:"Piera Rodriguez",country:"VEN",record:"11-2",age:33,odds:-165,slpm:3.54,sapm:2.81,sacc:47,sdef:55,td:4.53,tdacc:54,tddef:73,sub:0.0,ko:2,dec:7,s:2,reach:63,layoff:224,recentForm:[{r:"W",opp:"K.Souza",oppRank:99,method:"DEC"},{r:"W",opp:"Knutsson",oppRank:99,method:"DEC"},{r:"L",opp:"Carnelossi",oppRank:99,method:"DQ"},{r:"L",opp:"Robertson",oppRank:8,method:"SUB"},{r:"W",opp:"Hansen",oppRank:99,method:"DEC"}],lossTypes:{ko:0,sub:1,dec:1},rank:99},
    f2:{name:"S. Hughes",full:"Sam Hughes",country:"USA",record:"11-6",age:33,odds:140,slpm:4.34,sapm:4.44,sacc:46,sdef:58,td:1.23,tdacc:35,tddef:60,sub:0.2,ko:1,dec:7,s:3,reach:64,layoff:196,recentForm:[{r:"W",opp:"Bannon",oppRank:99,method:"SUB"},{r:"W",opp:"Luciano",oppRank:99,method:"DEC"},{r:"W",opp:"Dudakova",oppRank:99,method:"DEC"},{r:"L",opp:"Jauregui",oppRank:99,method:"DEC"},{r:"W",opp:"Amorim",oppRank:99,method:"DEC"}],lossTypes:{ko:0,sub:1,dec:5},rank:99}},
  { id:2, card:"PRELIMS", time:"16:20", rounds:3, wc:"Bantamweight", lbs:"135 lbs", ou:2.5,
    f1:{name:"L. Lacerda",full:"Luan Luiz Lacerda",country:"BRA",record:"13-3",age:32,odds:-162,slpm:4.02,sapm:5.79,sacc:46,sdef:46,td:2.29,tdacc:41,tddef:66,sub:0.9,ko:5,dec:4,s:4,reach:71,layoff:154,recentForm:[{r:"W",opp:"S.Oliveira",oppRank:99,method:"SUB"},{r:"L",opp:"Blackshear",oppRank:99,method:"KO"},{r:"L",opp:"Stamann",oppRank:99,method:"DEC"},{r:"W",opp:"Sosa",oppRank:99,method:"KO"},{r:"W",opp:"Durden",oppRank:99,method:"KO"}],lossTypes:{ko:2,sub:0,dec:1},rank:99},
    f2:{name:"H. Sosa",full:"Hecher Sosa",country:"ESP",record:"14-1",age:29,odds:225,slpm:2.13,sapm:0.87,sacc:50,sdef:55,td:4.00,tdacc:36,tddef:100,sub:2.0,ko:0,dec:1,s:13,reach:70,layoff:179,recentForm:[{r:"W",opp:"M.Lee",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"SUB"},{r:"W",opp:"opp",oppRank:99,method:"SUB"},{r:"W",opp:"opp",oppRank:99,method:"SUB"},{r:"L",opp:"Lacerda",oppRank:99,method:"KO"}],lossTypes:{ko:1,sub:0,dec:0},rank:99}},
  { id:3, card:"PRELIMS", time:"16:40", rounds:3, wc:"Bantamweight W", lbs:"135 lbs", ou:2.5,
    f1:{name:"B. Mesquita",full:"Beatriz Mesquita",country:"BRA",record:"6-0",age:34,odds:-550,slpm:3.20,sapm:1.80,sacc:52,sdef:65,td:2.80,tdacc:58,tddef:78,sub:2.4,ko:1,dec:0,s:4,reach:64,layoff:154,recentForm:[{r:"W",opp:"Alekseeva",oppRank:99,method:"SUB"},{r:"W",opp:"LFA opp",oppRank:99,method:"SUB"},{r:"W",opp:"LFA opp",oppRank:99,method:"KO"},{r:"W",opp:"LFA opp",oppRank:99,method:"SUB"},{r:"W",opp:"Ramos",oppRank:99,method:"SUB"}],lossTypes:{ko:0,sub:0,dec:0},rank:99},
    f2:{name:"M. Rendon",full:"Montserrat Rendon",country:"MEX",record:"7-1",age:36,odds:400,slpm:3.09,sapm:3.42,sacc:28,sdef:59,td:2.00,tdacc:37,tddef:100,sub:0.3,ko:0,dec:5,s:2,reach:68,layoff:182,recentForm:[{r:"W",opp:"A.Pereira",oppRank:99,method:"DEC"},{r:"L",opp:"Zhelezniakova",oppRank:99,method:"DEC"},{r:"W",opp:"Vidal",oppRank:99,method:"DEC"},{r:"W",opp:"Hughes",oppRank:99,method:"DEC"},{r:"W",opp:"Kassem",oppRank:99,method:"SUB"}],lossTypes:{ko:0,sub:0,dec:1},rank:99}},
  { id:4, card:"PRELIMS", time:"17:00", rounds:3, wc:"Middleweight", lbs:"185 lbs", ou:2.5,
    f1:{name:"B. Tavares",full:"Brad Tavares",country:"USA",record:"21-12",age:37,odds:200,slpm:3.42,sapm:3.36,sacc:43,sdef:54,td:0.73,tdacc:26,tddef:81,sub:0.0,ko:7,dec:13,s:1,reach:74,layoff:189,recentForm:[{r:"L",opp:"Bryczek",oppRank:99,method:"KO"},{r:"W",opp:"Meerschaert",oppRank:99,method:"DEC"},{r:"L",opp:"J.Park",oppRank:99,method:"DEC"},{r:"L",opp:"Rodrigues",oppRank:99,method:"KO"},{r:"W",opp:"Weidman",oppRank:99,method:"DEC"}],lossTypes:{ko:5,sub:1,dec:6},rank:99},
    f2:{name:"E. Anders",full:"Eryk Anders",country:"USA",record:"17-9",age:37,odds:-183,slpm:3.51,sapm:4.09,sacc:48,sdef:50,td:1.75,tdacc:24,tddef:80,sub:0.1,ko:9,dec:5,s:3,reach:75,layoff:217,recentForm:[{r:"L",opp:"Duncan",oppRank:99,method:"KO"},{r:"W",opp:"Weidman",oppRank:99,method:"KO"},{r:"W",opp:"Pickett",oppRank:99,method:"DEC"},{r:"L",opp:"Barriault",oppRank:99,method:"DEC"},{r:"W",opp:"Daukaus",oppRank:99,method:"KO"}],lossTypes:{ko:4,sub:2,dec:3},rank:99}},
  { id:5, card:"PRELIMS", time:"17:20", rounds:3, wc:"Lightweight", lbs:"155 lbs", ou:2.5,
    f1:{name:"B. Oki",full:"Bolaji Oki",country:"BEL",record:"10-3",age:29,odds:125,slpm:6.59,sapm:5.15,sacc:44,sdef:61,td:1.01,tdacc:60,tddef:66,sub:0.0,ko:5,dec:4,s:1,reach:73,layoff:189,recentForm:[{r:"L",opp:"M.Jones",oppRank:99,method:"KO"},{r:"W",opp:"Aswell Jr",oppRank:99,method:"DEC"},{r:"L",opp:"C.Duncan",oppRank:99,method:"SUB"},{r:"W",opp:"Cuamba",oppRank:99,method:"DEC"},{r:"W",opp:"Salvador",oppRank:99,method:"KO"}],lossTypes:{ko:1,sub:1,dec:1},rank:99},
    f2:{name:"M. Sousa",full:"Manoel Sousa",country:"BRA",record:"13-1",age:27,odds:-137,slpm:3.23,sapm:1.31,sacc:58,sdef:55,td:0.00,tdacc:0,tddef:62,sub:2.3,ko:2,dec:2,s:9,reach:70,layoff:196,recentForm:[{r:"W",opp:"C.Perez",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"SUB"},{r:"W",opp:"opp",oppRank:99,method:"SUB"},{r:"W",opp:"opp",oppRank:99,method:"SUB"},{r:"L",opp:"opp",oppRank:99,method:"DEC"}],lossTypes:{ko:0,sub:0,dec:1},rank:99}},
  { id:6, card:"PRELIMS", time:"17:40", rounds:3, wc:"Bantamweight", lbs:"135 lbs", ou:2.5,
    f1:{name:"E. Smith",full:"Elijah Smith",country:"USA",record:"9-1",age:22,odds:-176,slpm:4.45,sapm:3.40,sacc:47,sdef:47,td:3.51,tdacc:53,tddef:57,sub:0.9,ko:3,dec:4,s:2,reach:71,layoff:217,recentForm:[{r:"W",opp:"Kazama",oppRank:99,method:"KO"},{r:"W",opp:"Morales",oppRank:99,method:"DEC"},{r:"W",opp:"A.Tau",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"L",opp:"opp",oppRank:15,method:"DEC"}],lossTypes:{ko:0,sub:0,dec:1},rank:99},
    f2:{name:"S. You",full:"SuYoung You",country:"KOR",record:"16-3",age:29,odds:200,slpm:2.28,sapm:1.96,sacc:46,sdef:70,td:3.80,tdacc:47,tddef:66,sub:0.4,ko:1,dec:10,s:5,reach:65,layoff:112,recentForm:[{r:"W",opp:"X.Long",oppRank:99,method:"DEC"},{r:"W",opp:"Cunningham",oppRank:99,method:"DEC"},{r:"W",opp:"Jieleyisi",oppRank:99,method:"DEC"},{r:"W",opp:"Zhawupasi",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],lossTypes:{ko:0,sub:1,dec:2},rank:99}},
  { id:7, card:"MAIN CARD", time:"18:00", rounds:3, wc:"Heavyweight", lbs:"265 lbs", ou:1.5,
    f1:{name:"V. Petrino",full:"Vitor Petrino",country:"BRA",record:"13-2",age:27,odds:-155,
        slpm:2.75,sapm:2.48,sacc:46,sdef:47,td:3.04,tdacc:51,tddef:79,sub:0.8,
        ko:7,dec:4,s:2,reach:77,layoff:154,
        recentForm:[{r:"W",opp:"Petersen",oppRank:99,method:"KO"},{r:"W",opp:"Lane",oppRank:99,method:"SUB"},{r:"L",opp:"Jacoby",oppRank:99,method:"KO"},{r:"L",opp:"A.Smith",oppRank:99,method:"SUB"},{r:"W",opp:"Tybura",oppRank:10,method:"KO"}],
        lossTypes:{ko:1,sub:1,dec:0},rank:99},
    f2:{name:"S. Asplund",full:"Steven Asplund",country:"USA",record:"7-1",age:26,odds:240,
        slpm:19.93,sapm:7.49,sacc:58,sdef:57,td:0.00,tdacc:0,tddef:100,sub:0.0,
        ko:5,dec:2,s:0,reach:78,layoff:91,
        recentForm:[{r:"W",opp:"Sharaf",oppRank:99,method:"KO"},{r:"W",opp:"Guarascio",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"L",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:1},rank:99}},
  { id:8, card:"MAIN CARD", time:"18:20", rounds:3, wc:"Welterweight", lbs:"170 lbs", ou:2.5,
    f1:{name:"C. Curtis",full:"Chris Curtis",country:"USA",record:"32-12",age:37,odds:130,
        slpm:5.98,sapm:6.19,sacc:50,sdef:54,td:0.00,tdacc:0,tddef:82,sub:0.0,
        ko:17,dec:13,s:2,reach:75,layoff:245,
        recentForm:[{r:"W",opp:"M.Griffin",oppRank:99,method:"DEC"},{r:"L",opp:"Kopylov",oppRank:99,method:"KO"},{r:"L",opp:"B.Allen",oppRank:8,method:"DEC"},{r:"W",opp:"Barriault",oppRank:99,method:"DEC"},{r:"W",opp:"Buckley",oppRank:8,method:"DEC"}],
        lossTypes:{ko:5,sub:2,dec:5},rank:99},
    f2:{name:"M. Orolbay",full:"Myktybek Orolbay",country:"KGZ",record:"15-2-1",age:27,odds:-150,
        slpm:3.24,sapm:3.31,sacc:48,sdef:50,td:5.48,tdacc:45,tddef:40,sub:0.6,
        ko:5,dec:7,s:3,reach:74,layoff:112,
        recentForm:[{r:"W",opp:"Hermansson",oppRank:99,method:"KO"},{r:"W",opp:"Musayev",oppRank:99,method:"SUB"},{r:"L",opp:"Rebecki",oppRank:99,method:"DEC"},{r:"W",opp:"Brener",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:1,dec:1},rank:99}},
  { id:9, card:"MAIN CARD", time:"19:00", rounds:3, wc:"Flyweight", lbs:"125 lbs", ou:2.5,
    f1:{name:"C. Johnson",full:"Charles Johnson",country:"USA",record:"18-7",age:34,odds:-135,
        slpm:4.73,sapm:3.78,sacc:49,sdef:56,td:0.56,tdacc:20,tddef:66,sub:0.4,
        ko:6,dec:10,s:2,reach:70,layoff:49,
        recentForm:[{r:"W",opp:"Kavanagh",oppRank:99,method:"KO"},{r:"L",opp:"Temirov",oppRank:99,method:"DEC"},{r:"W",opp:"Sumudaerji",oppRank:99,method:"DEC"},{r:"W",opp:"J.Van",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:2,sub:2,dec:3},rank:99},
    f2:{name:"B. Silva",full:"Bruno Silva",country:"BRA",record:"15-7-2",age:35,odds:235,
        slpm:3.82,sapm:4.55,sacc:50,sdef:52,td:2.30,tdacc:29,tddef:63,sub:0.3,
        ko:5,dec:7,s:3,reach:65,layoff:147,
        recentForm:[{r:"W",opp:"H.Park",oppRank:99,method:"SUB"},{r:"L",opp:"J.Van",oppRank:2,method:"KO"},{r:"L",opp:"M.Kape",oppRank:4,method:"KO"},{r:"W",opp:"Durden",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:4,sub:1,dec:2},rank:99}},
  { id:10, card:"MAIN CARD", time:"19:30", rounds:3, wc:"Light Heavyweight", lbs:"205 lbs", ou:2.5,
    f1:{name:"I. Cutelaba",full:"Ion Cutelaba",country:"MDA",record:"19-11-1",age:31,odds:140,
        slpm:4.26,sapm:3.34,sacc:43,sdef:47,td:3.77,tdacc:49,tddef:75,sub:0.1,
        ko:11,dec:5,s:3,reach:75,layoff:126,
        recentForm:[{r:"L",opp:"Bukauskas",oppRank:99,method:"DEC"},{r:"W",opp:"Aslan",oppRank:99,method:"SUB"},{r:"W",opp:"Erslan",oppRank:99,method:"DEC"},{r:"L",opp:"Lins",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:6,sub:2,dec:3},rank:99},
    f2:{name:"O. Sy",full:"Oumar Sy",country:"FRA",record:"12-1",age:29,odds:-155,
        slpm:3.67,sapm:1.72,sacc:48,sdef:70,td:2.73,tdacc:36,tddef:100,sub:0.4,
        ko:5,dec:5,s:2,reach:83,layoff:189,
        recentForm:[{r:"W",opp:"Ribeiro",oppRank:99,method:"KO"},{r:"L",opp:"Menifield",oppRank:99,method:"DEC"},{r:"W",opp:"D.Jung",oppRank:12,method:"DEC"},{r:"W",opp:"Tokkos",oppRank:99,method:"SUB"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:1},rank:9}},
  { id:11, card:"MAIN CARD", time:"20:00", rounds:3, wc:"Featherweight", lbs:"145 lbs", ou:2.5,
    f1:{name:"M. Rahiki",full:"Marwan Rahiki",country:"ALG",record:"7-0",age:22,odds:-160,
        slpm:5.96,sapm:6.10,sacc:47,sdef:56,td:0.00,tdacc:0,tddef:100,sub:2.1,
        ko:3,dec:2,s:2,reach:72,layoff:151,
        recentForm:[{r:"W",opp:"Mulumba",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"SUB"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:99},
    f2:{name:"H. Hardwick",full:"Harry Hardwick",country:"GBR",record:"13-4-1",age:30,odds:230,
        slpm:2.39,sapm:7.16,sacc:34,sdef:40,td:0.00,tdacc:0,tddef:0,sub:0.0,
        ko:4,dec:6,s:3,reach:71,layoff:189,
        recentForm:[{r:"L",opp:"Fernandes",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"L",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:2,sub:0,dec:2},rank:99}},
  { id:12, card:"MAIN CARD", time:"20:30", rounds:3, wc:"Featherweight", lbs:"145 lbs", ou:1.5,
    f1:{name:"A. Fili",full:"Andre Fili",country:"USA",record:"25-12",age:34,odds:160,
        slpm:3.87,sapm:4.23,sacc:37,sdef:51,td:2.22,tdacc:45,tddef:71,sub:0.2,
        ko:8,dec:15,s:2,reach:74,layoff:217,
        recentForm:[{r:"W",opp:"C.Rodriguez",oppRank:99,method:"DEC"},{r:"L",opp:"Costa",oppRank:99,method:"SUB"},{r:"W",opp:"Swanson",oppRank:99,method:"DEC"},{r:"L",opp:"D.Ige",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:3,sub:4,dec:5},rank:99},
    f2:{name:"J. Delgado",full:"Jose Delgado",country:"COL",record:"10-2",age:26,odds:-147,
        slpm:8.22,sapm:5.44,sacc:54,sdef:47,td:1.81,tdacc:42,tddef:60,sub:0.0,
        ko:7,dec:2,s:1,reach:74,layoff:140,
        recentForm:[{r:"L",opp:"N.Wood",oppRank:99,method:"DEC"},{r:"W",opp:"Amil",oppRank:99,method:"KO"},{r:"W",opp:"Matthews",oppRank:99,method:"KO"},{r:"W",opp:"Juarez",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:1,sub:0,dec:1},rank:99}},
  { id:13, card:"MAIN CARD", time:"21:00", rounds:3, wc:"Strawweight W", lbs:"115 lbs", ou:2.5,
    f1:{name:"A. Lemos",full:"Amanda Lemos",country:"BRA",record:"15-5-1",age:38,odds:174,
        slpm:2.75,sapm:3.24,sacc:55,sdef:45,td:1.02,tdacc:62,tddef:64,sub:0.7,
        ko:8,dec:4,s:3,reach:65,layoff:182,
        recentForm:[{r:"L",opp:"Suarez",oppRank:2,method:"DEC"},{r:"W",opp:"Lucindo",oppRank:99,method:"DEC"},{r:"L",opp:"Jandiroba",oppRank:6,method:"SUB"},{r:"W",opp:"Dern",oppRank:4,method:"DEC"},{r:"L",opp:"Weili",oppRank:1,method:"DEC"}],
        lossTypes:{ko:1,sub:2,dec:2},rank:5},
    f2:{name:"G. Robertson",full:"Gillian Robertson",country:"CAN",record:"16-8",age:30,odds:-143,
        slpm:2.86,sapm:2.86,sacc:48,sdef:56,td:2.74,tdacc:40,tddef:41,sub:0.9,
        ko:2,dec:7,s:7,reach:63,layoff:315,
        recentForm:[{r:"W",opp:"M.Rodriguez",oppRank:9,method:"KO"},{r:"W",opp:"Pinheiro",oppRank:99,method:"DEC"},{r:"W",opp:"Waterson",oppRank:99,method:"DEC"},{r:"W",opp:"Viana",oppRank:99,method:"KO"},{r:"L",opp:"Ricci",oppRank:99,method:"DEC"}],
        lossTypes:{ko:1,sub:2,dec:5},rank:8}},
  { id:14, card:"MAIN EVENT", time:"21:30", rounds:5, wc:"Featherweight", lbs:"145 lbs", ou:3.5, isMain:true,
    f1:{name:"J. Emmett",full:"Josh Emmett",country:"USA",record:"19-6",age:41,odds:185,
        slpm:3.72,sapm:4.43,sacc:35,sdef:60,td:1.08,tdacc:37,tddef:43,sub:0.1,
        ko:7,dec:10,s:2,reach:70,layoff:161,
        recentForm:[{r:"L",opp:"Zalal",oppRank:13,method:"SUB"},{r:"L",opp:"Murphy",oppRank:3,method:"DEC"},{r:"W",opp:"Mitchell",oppRank:8,method:"KO"},{r:"L",opp:"Topuria",oppRank:1,method:"DEC"},{r:"L",opp:"Y.Rodriguez",oppRank:3,method:"SUB"}],
        lossTypes:{ko:0,sub:2,dec:4},rank:11},
    f2:{name:"K. Vallejos",full:"Kevin Vallejos",country:"ARG",record:"17-1",age:24,odds:-240,
        slpm:5.78,sapm:4.71,sacc:46,sdef:56,td:0.71,tdacc:28,tddef:83,sub:0.0,
        ko:12,dec:3,s:2,reach:68,layoff:91,
        recentForm:[{r:"W",opp:"Chikadze",oppRank:99,method:"KO"},{r:"W",opp:"D.Silva",oppRank:99,method:"DEC"},{r:"W",opp:"Choi",oppRank:99,method:"KO"},{r:"W",opp:"Teague",oppRank:99,method:"KO"},{r:"L",opp:"J.Silva",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:1},rank:14}},
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

function predictOU(fight){
  const{f1,f2,ou,rounds,wc}=fight;
  const divFR=DIV_FINISH_RATE[wc]||0.50;
  const f1FP=((f1.ko+f1.s)/(f1.ko+f1.s+f1.dec||1));
  const f2FP=((f2.ko+f2.s)/(f2.ko+f2.s+f2.dec||1));
  const fighterFinish=(f1FP+f2FP)/2;
  const combinedFinish=(fighterFinish*0.60)+(divFR*0.40);
  const maxT=rounds*5;
  const estTime=maxT*(1-combinedFinish*0.50);
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
        <span style={{fontSize:8,fontFamily:"monospace",color:"#aaa"}}>{rounds}R max · Est:{estTime.toFixed(1)}min</span>
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
        <span style={{fontSize:8,fontFamily:"monospace",color:"#888"}}>Div FR:{Math.round((DIV_FINISH_RATE[fight.wc]||0.5)*100)}%</span>
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
            <span style={{fontSize:8,fontFamily:"monospace",background:"#27ae60",color:"#fff",borderRadius:3,padding:"2px 6px"}}>v4 8/10</span>
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
          PREDICTIONS PRE-COMBAT · MODELE v4 · STATS 100% UFCSTATS
        </span>
      </div>
      <div style={{padding:"4px 12px 24px"}}>
        {filtered.map(f=><FightCard key={f.id} fight={f}/>)}
      </div>
      <div style={{background:"#fff",borderTop:"1px solid #e8e8e8",padding:"12px 16px"}}>
        <div style={{fontSize:8,fontFamily:"monospace",color:"#bbb",letterSpacing:"0.08em",marginBottom:6}}>MODELE v4 · VARIABLES · SOURCE: UFCSTATS.COM</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {["SLpM reel","SApM reel","Str.Acc reel","Str.Def reel","TD Avg reel","TD Acc reel","TD Def reel","Sub Avg reel","Forme recente ponderee","Age penalty","Layoff penalty","Reach adv","Style matchup","Chin vulnerability","Div finish rate UFC","Div avg time UFC"].map(v=>(
            <span key={v} style={{fontSize:7,fontFamily:"monospace",background:"#f0f2f5",color:"#888",borderRadius:3,padding:"2px 6px"}}>{v}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
