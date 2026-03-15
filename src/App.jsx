import { useState } from "react";

const DIV_FINISH_RATE = {
  "Heavyweight":0.66,"Light Heavyweight":0.60,"Middleweight":0.53,
  "Welterweight":0.51,"Lightweight":0.50,"Featherweight":0.45,
  "Bantamweight":0.45,"Flyweight":0.45,"Strawweight W":0.33,
  "Bantamweight W":0.40,
};
const DIV_AVG_TIME = {
  "Heavyweight":9.67,"Light Heavyweight":9.22,"Middleweight":11.10,
  "Welterweight":11.37,"Lightweight":10.65,"Featherweight":11.78,
  "Bantamweight":11.17,"Flyweight":11.23,"Strawweight W":12.75,
  "Bantamweight W":12.78,
};

function getStats(f) {
  return {
    ...f,
    slpm: Math.min(f.slpm, f.ucfFights<3?5.5:99),
    sapm: Math.min(f.sapm, f.ucfFights<3?5.5:99),
    td:   Math.min(f.td,   f.ucfFights<3?4.5:99),
  };
}

function modelV6(f1raw, f2raw, rounds) {
  const f1=getStats(f1raw), f2=getStats(f2raw);

  // 1. STRIKING NET
  const strNet1=(f1.slpm*f1.sacc/100)-(f1.sapm*(1-f1.sdef/100));
  const strNet2=(f2.slpm*f2.sacc/100)-(f2.sapm*(1-f2.sdef/100));

  // 2. STRIKING ACCURACY vs DEFENSE MATCHUP
  const strMatchup1=Math.max(0,(f1.sacc/100)-(1-f2.sdef/100))*0.5;
  const strMatchup2=Math.max(0,(f2.sacc/100)-(1-f1.sdef/100))*0.5;

  // 3. GRAPPLING NET
  const grp1=f1.td*(f1.tdacc/100)*2+f1.tddef*0.015+f1.sub*0.5;
  const grp2=f2.td*(f2.tdacc/100)*2+f2.tddef*0.015+f2.sub*0.5;

  // 4. TD MATCHUP — offense vs defense adversaire
  const tdMatchup1=f1.td*(f1.tdacc/100)*Math.max(0,1-(f2.tddef/100));
  const tdMatchup2=f2.td*(f2.tdacc/100)*Math.max(0,1-(f1.tddef/100));

  // 5. KNOCKDOWN RATIO
  const kd1=f1raw.kdRatio||1.0, kd2=f2raw.kdRatio||1.0;
  const kdAdv1=Math.max(0,kd1-kd2)*0.05;
  const kdAdv2=Math.max(0,kd2-kd1)*0.05;

  // 6. FORME RECENTE avec vrais rankings adversaires
  const formScore=(form)=>{
    const w=[5,4,3,2,1];
    return form.reduce((acc,f,i)=>{
      if(f.r==="D") return acc;
      const rb=f.oppRank<=5?1.5:f.oppRank<=10?1.3:f.oppRank<=15?1.15:1.0;
      return acc+(f.r==="W"?w[i]*rb:-w[i]*0.6);
    },0)/15;
  };
  const form1=formScore(f1raw.recentForm), form2=formScore(f2raw.recentForm);

  // 7. AGE PENALTY
  const agePen=(a)=>a>31?Math.min(0.25,(a-31)*0.028):0;
  const ap1=agePen(f1raw.age), ap2=agePen(f2raw.age);

  // 8. LAYOFF PENALTY
  const layPen=(d)=>d>120?Math.min(0.15,(d-120)/900):0;
  const lp1=layPen(f1raw.layoff), lp2=layPen(f2raw.layoff);

  // 9. REACH ADVANTAGE
  const ra1=Math.max(0,f1raw.reach-f2raw.reach)*0.004;
  const ra2=Math.max(0,f2raw.reach-f1raw.reach)*0.004;

  // 10. CHIN VULNERABILITY
  const tl1=f1raw.lossTypes.ko+f1raw.lossTypes.sub+f1raw.lossTypes.dec||1;
  const tl2=f2raw.lossTypes.ko+f2raw.lossTypes.sub+f2raw.lossTypes.dec||1;
  const cv1=(f1raw.lossTypes.ko/tl1)*0.08, cv2=(f2raw.lossTypes.ko/tl2)*0.08;

  // 11. HOME CROWD — UFC London
  const hc1=f1raw.home?0.04:0, hc2=f2raw.home?0.04:0;

  // 12. STANCE SOUTHPAW ADVANTAGE
  const sp1=f1raw.stance==="Southpaw"&&f2raw.stance==="Orthodox"?0.03:0;
  const sp2=f2raw.stance==="Southpaw"&&f1raw.stance==="Orthodox"?0.03:0;

  // 13. UFC EXPERIENCE PENALTY
  const expPen1=f1raw.ucfFights<3?0.05:0, expPen2=f2raw.ucfFights<3?0.05:0;

  // 14. SCORE FINAL
  const S1=strNet1*0.22+strMatchup1*0.08+grp1*0.12+tdMatchup1*0.08+kdAdv1+form1*0.25+ra1*0.04+hc1+sp1-ap1*0.05-lp1*0.03-cv1*0.02-expPen1*0.02;
  const S2=strNet2*0.22+strMatchup2*0.08+grp2*0.12+tdMatchup2*0.08+kdAdv2+form2*0.25+ra2*0.04+hc2+sp2-ap2*0.05-lp2*0.03-cv2*0.02-expPen2*0.02;

  const tot=Math.abs(S1)+Math.abs(S2)||1;
  const pct1=Math.round(Math.min(93,Math.max(7,50+((S1-S2)/tot)*42)));
  const pct2=100-pct1;
  const winner=pct1>=pct2?"f1":"f2";
  const winF=winner==="f1"?f1:f2, loseF=winner==="f1"?f2:f1;
  const winFraw=winner==="f1"?f1raw:f2raw, loseFraw=winner==="f1"?f2raw:f1raw;

  // 15. MÉTHODE
  const wT=winF.ko+winF.s+winF.dec||1;
  const koP=(winF.ko/wT)*100, subP=(winF.s/wT)*100, decP=(winF.dec/wT)*100;
  const loseKOV=loseF.lossTypes.ko>=3;
  const loseHighSapm=loseF.sapm>4.5;
  const isStrAdv=winF.slpm>loseF.slpm*1.2||winF.sacc>loseF.sdef*0.85;
  const isGrpAdv=winF.td>1.5&&winF.tdacc>35&&loseF.tddef<60;
  const bothDec=(decP>55)&&((loseF.dec/(loseF.ko+loseF.s+loseF.dec||1))*100>40);
  let method,mConf;
  if(bothDec&&!loseKOV){method="DÉCISION";mConf=Math.round(Math.min(82,decP+10));}
  else if(isStrAdv&&(koP>45||loseKOV||loseHighSapm)){method="KO/TKO";mConf=Math.round(Math.min(82,koP+(loseKOV?10:0)+(loseHighSapm?5:0)));}
  else if(isGrpAdv&&subP>20){method="SOUMISSION";mConf=Math.round(Math.min(78,subP+15));}
  else if(koP>40){method="KO/TKO";mConf=Math.round(Math.min(72,koP*0.85));}
  else{method="DÉCISION";mConf=Math.round(Math.min(80,decP));}
  mConf=Math.max(32,mConf);

  return{winner,pct1,pct2,method,mConf,
    strNet1:+strNet1.toFixed(1),strNet2:+strNet2.toFixed(1),
    S1:+S1.toFixed(2),S2:+S2.toFixed(2)};
}

function predictOU(fight) {
  const{f1:f1raw,f2:f2raw,ou,rounds,wc}=fight;
  const f1=getStats(f1raw),f2=getStats(f2raw);
  const divFR=DIV_FINISH_RATE[wc]||0.50;
  const divAvgT=DIV_AVG_TIME[wc]||11.0;
  const f1FP=(f1.ko+f1.s)/(f1.ko+f1.s+f1.dec||1);
  const f2FP=(f2.ko+f2.s)/(f2.ko+f2.s+f2.dec||1);
  const fighterFinish=(f1FP+f2FP)/2;
  const combinedFinish=(fighterFinish*0.50)+(divFR*0.50);
  const estTime=divAvgT*rounds/3*(1-combinedFinish*0.35);
  const estRound=Math.min(rounds,Math.max(1,estTime/5));
  const ouMins=ou*5;
  const diff=estTime-ouMins;
  const over=Math.round(Math.min(88,Math.max(12,50+Math.tanh(diff/2.8)*38)));
  const under=100-over;
  const signal=over>=58?"OVER":under>=58?"UNDER":"PUSH";
  return{over,under,signal,estRound:+estRound.toFixed(1)};
}

const fmtOdds=(o)=>o>0?`+${o}`:`${o}`;
const fmtNet=(n)=>n>=0?`NET +${n}`:`NET ${n}`;
const oddsColor=(o)=>o<0?"#e74c3c":"#27ae60";

const fights=[
  {id:1,card:"PRELIMS",time:"12:00 HE",rounds:3,wc:"Bantamweight W",lbs:"135 lbs",ou:2.5,
    f1:{name:"M. Mullins",country:"GBR",record:"7-2",age:34,odds:-130,ucfFights:5,stance:"Orthodox",
        slpm:3.71,sapm:4.39,sacc:50,sdef:52,td:2.03,tdacc:42,tddef:85,sub:0.0,kdRatio:0.8,
        ko:2,dec:4,s:0,reach:68,layoff:272,home:true,
        recentForm:[{r:"L",opp:"Zhelezniakova",oppRank:99,method:"DEC"},{r:"W",opp:"Sygula",oppRank:99,method:"KO"},{r:"L",opp:"Cornolle",oppRank:12,method:"KO"},{r:"W",opp:"Alekseeva",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:1,sub:0,dec:1},rank:99},
    f2:{name:"L. Carolina",country:"BRA",record:"11-5",age:32,odds:108,ucfFights:8,stance:"Orthodox",
        slpm:4.65,sapm:3.46,sacc:51,sdef:51,td:0.30,tdacc:37,tddef:68,sub:0.6,kdRatio:0.6,
        ko:3,dec:7,s:1,reach:69,layoff:175,home:false,
        recentForm:[{r:"L",opp:"Montague",oppRank:99,method:"DEC"},{r:"W",opp:"Pudilova",oppRank:99,method:"DEC"},{r:"W",opp:"Stoliarenko",oppRank:99,method:"KO"},{r:"W",opp:"Petrovic",oppRank:99,method:"DEC"},{r:"L",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:1,sub:1,dec:3},rank:99}},
  {id:2,card:"PRELIMS",time:"12:20 HE",rounds:3,wc:"Strawweight W",lbs:"115 lbs",ou:2.5,
    f1:{name:"S. Dyer",country:"USA",record:"6-1",age:24,odds:-145,ucfFights:1,stance:"Orthodox",
        slpm:5.5,sapm:5.5,sacc:41,sdef:44,td:0.0,tdacc:0,tddef:0,sub:0.0,kdRatio:1.0,
        ko:2,dec:3,s:1,reach:65,layoff:188,home:false,
        recentForm:[{r:"L",opp:"Foro",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:1},rank:99},
    f2:{name:"R. Oliveira",country:"BRA",record:"7-3-1",age:28,odds:120,ucfFights:3,stance:"Orthodox",
        slpm:1.40,sapm:2.80,sacc:29,sdef:50,td:1.08,tdacc:66,tddef:50,sub:0.0,kdRatio:0.3,
        ko:1,dec:5,s:1,reach:65,layoff:150,home:false,
        recentForm:[{r:"L",opp:"Luciano",oppRank:99,method:"SUB"},{r:"L",opp:"Lisboa",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"D",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:1,dec:2},rank:99}},
  {id:3,card:"PRELIMS",time:"12:40 HE",rounds:3,wc:"Lightweight",lbs:"155 lbs",ou:2.5,
    f1:{name:"S. Rock",country:"GBR",record:"12-2-1",age:31,odds:100,ucfFights:2,stance:"Southpaw",
        slpm:2.93,sapm:3.40,sacc:42,sdef:56,td:1.00,tdacc:11,tddef:80,sub:0.0,kdRatio:0.5,
        ko:2,dec:9,s:1,reach:73,layoff:119,home:true,
        recentForm:[{r:"L",opp:"Aliev",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"D",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:2},rank:99},
    f2:{name:"A. Al-Selwady",country:"PAL",record:"15-4",age:30,odds:-120,ucfFights:2,stance:"Orthodox",
        slpm:4.14,sapm:3.60,sacc:34,sdef:59,td:2.32,tdacc:30,tddef:20,sub:0.0,kdRatio:1.2,
        ko:5,dec:8,s:2,reach:69,layoff:383,home:false,
        recentForm:[{r:"L",opp:"Radzhabov",oppRank:99,method:"KO"},{r:"W",opp:"Hardwick",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:2,sub:0,dec:2},rank:99}},
  {id:4,card:"PRELIMS",time:"13:40 HE",rounds:3,wc:"Heavyweight",lbs:"265 lbs",ou:1.5,
    f1:{name:"M. Pinto",country:"PRT",record:"11-0",age:27,odds:-600,ucfFights:3,stance:"Orthodox",
        slpm:3.39,sapm:2.42,sacc:78,sdef:53,td:2.72,tdacc:60,tddef:100,sub:1.8,kdRatio:2.0,
        ko:5,dec:3,s:3,reach:79,layoff:161,home:false,
        recentForm:[{r:"W",opp:"Diniz",oppRank:99,method:"KO"},{r:"W",opp:"Lane",oppRank:99,method:"KO"},{r:"W",opp:"Camacho",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"SUB"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:99},
    f2:{name:"F. Franco",country:"BRA",record:"8-1",age:24,odds:450,ucfFights:1,stance:"Orthodox",
        slpm:2.23,sapm:2.84,sacc:71,sdef:35,td:4.5,tdacc:40,tddef:100,sub:0.0,kdRatio:0.8,
        ko:3,dec:4,s:1,reach:76,layoff:188,home:false,
        recentForm:[{r:"L",opp:"Vidal",oppRank:99,method:"SUB"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:1,dec:0},rank:99}},
  {id:5,card:"PRELIMS",time:"13:20 HE",rounds:3,wc:"Middleweight",lbs:"185 lbs",ou:1.5,
    f1:{name:"M. Kondratavicius",country:"LTU",record:"8-1",age:25,odds:-600,ucfFights:1,stance:"Orthodox",
        slpm:4.55,sapm:3.64,sacc:33,sdef:60,td:4.5,tdacc:100,tddef:0,sub:0.0,kdRatio:1.5,
        ko:4,dec:3,s:1,reach:75,layoff:175,home:false,
        recentForm:[{r:"W",opp:"Barbir",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"L",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:1},rank:99},
    f2:{name:"A. Trocoli",country:"BRA",record:"12-6",age:34,odds:450,ucfFights:4,stance:"Orthodox",
        slpm:1.37,sapm:5.55,sacc:50,sdef:24,td:0.79,tdacc:10,tddef:33,sub:0.8,kdRatio:0.2,
        ko:2,dec:4,s:4,reach:80,layoff:100,home:false,
        recentForm:[{r:"L",opp:"Abdul-Malik",oppRank:99,method:"SUB"},{r:"L",opp:"Gore",oppRank:99,method:"SUB"},{r:"L",opp:"Magomedov",oppRank:3,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"SUB"}],
        lossTypes:{ko:2,sub:3,dec:1},rank:99}},
  {id:6,card:"PRELIMS",time:"13:00 HE",rounds:3,wc:"Heavyweight",lbs:"265 lbs",ou:1.5,
    f1:{name:"L. Sutherland",country:"GBR",record:"10-4",age:31,odds:210,ucfFights:2,stance:"Orthodox",
        slpm:2.14,sapm:3.57,sacc:60,sdef:0,td:0.0,tdacc:0,tddef:0,sub:0.0,kdRatio:0.8,
        ko:4,dec:5,s:1,reach:76,layoff:142,home:true,
        recentForm:[{r:"L",opp:"Walker",oppRank:99,method:"SUB"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"L",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:2,sub:1,dec:1},rank:99},
    f2:{name:"B. Pericic",country:"HRV",record:"5-1",age:30,odds:-260,ucfFights:1,stance:"Orthodox",
        slpm:5.5,sapm:1.57,sacc:59,sdef:66,td:0.0,tdacc:0,tddef:100,sub:0.0,kdRatio:2.0,
        ko:4,dec:1,s:0,reach:79,layoff:175,home:false,
        recentForm:[{r:"W",opp:"Ellison",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"L",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:1},rank:99}},
  {id:7,card:"PRELIMS",time:"14:20 HE",rounds:3,wc:"Lightweight",lbs:"155 lbs",ou:2.5,
    f1:{name:"M. Jones",country:"GBR",record:"17-2",age:30,odds:-145,ucfFights:7,stance:"Orthodox",
        slpm:5.71,sapm:4.47,sacc:41,sdef:50,td:4.17,tdacc:55,tddef:81,sub:0.2,kdRatio:1.8,
        ko:5,dec:9,s:3,reach:74,layoff:196,home:true,
        recentForm:[{r:"W",opp:"Oki",oppRank:99,method:"KO"},{r:"W",opp:"Stephens",oppRank:99,method:"DEC"},{r:"L",opp:"Klein",oppRank:99,method:"DEC"},{r:"W",opp:"Onama",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:1,dec:1},rank:99},
    f2:{name:"A. Sola",country:"FRA",record:"11-0-1",age:27,odds:121,ucfFights:1,stance:"Southpaw",
        slpm:3.74,sapm:2.74,sacc:42,sdef:75,td:1.25,tdacc:25,tddef:0,sub:0.0,kdRatio:1.2,
        ko:4,dec:6,s:1,reach:74,layoff:196,home:false,
        recentForm:[{r:"W",opp:"McKee",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"D",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:99}},
];
const fights2=[
  {id:8,card:"MAIN CARD",time:"15:00 HE",rounds:3,wc:"Featherweight",lbs:"145 lbs",ou:2.5,
    f1:{name:"N. Wood",country:"GBR",record:"22-6",age:32,odds:-175,ucfFights:12,stance:"Orthodox",
        slpm:5.74,sapm:4.32,sacc:52,sdef:54,td:1.46,tdacc:50,tddef:73,sub:0.5,kdRatio:1.4,
        ko:7,dec:12,s:3,reach:69,layoff:147,home:true,
        recentForm:[{r:"W",opp:"Delgado",oppRank:14,method:"DEC"},{r:"W",opp:"Charriere",oppRank:99,method:"DEC"},{r:"W",opp:"Pineda",oppRank:99,method:"DEC"},{r:"L",opp:"Naimov",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"SUB"}],
        lossTypes:{ko:1,sub:2,dec:3},rank:99},
    f2:{name:"L. Keita",country:"GUI",record:"16-1",age:27,odds:145,ucfFights:0,stance:"Orthodox",
        slpm:3.5,sapm:3.0,sacc:48,sdef:55,td:2.0,tdacc:40,tddef:65,sub:1.5,kdRatio:1.0,
        ko:6,dec:7,s:3,reach:72,layoff:200,home:false,
        recentForm:[{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"L",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:1},rank:99}},
  {id:9,card:"MAIN CARD",time:"15:20 HE",rounds:3,wc:"Featherweight",lbs:"145 lbs",ou:2.5,
    f1:{name:"K. Campbell",country:"GBR",record:"8-0",age:22,odds:-154,ucfFights:1,stance:"Switch",
        slpm:5.25,sapm:1.50,sacc:77,sdef:60,td:4.5,tdacc:40,tddef:100,sub:0.0,kdRatio:1.8,
        ko:3,dec:4,s:1,reach:72,layoff:172,home:true,
        recentForm:[{r:"W",opp:"Seck",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:99},
    f2:{name:"D. Silva",country:"ESP",record:"10-2",age:28,odds:128,ucfFights:4,stance:"Switch",
        slpm:6.67,sapm:7.47,sacc:55,sdef:61,td:2.00,tdacc:33,tddef:81,sub:0.2,kdRatio:0.8,
        ko:4,dec:5,s:1,reach:70,layoff:231,home:false,
        recentForm:[{r:"L",opp:"Vallejos",oppRank:14,method:"DEC"},{r:"W",opp:"Almeida",oppRank:99,method:"DEC"},{r:"W",opp:"Culibao",oppRank:99,method:"DEC"},{r:"W",opp:"Pacheco",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:2},rank:99}},
  {id:10,card:"MAIN CARD",time:"15:40 HE",rounds:3,wc:"Light Heavyweight",lbs:"205 lbs",ou:1.5,
    f1:{name:"I. Baraniewski",country:"GBR",record:"7-0",age:26,odds:-145,ucfFights:2,stance:"Orthodox",
        slpm:5.0,sapm:5.0,sacc:55,sdef:50,td:0.0,tdacc:0,tddef:100,sub:0.0,kdRatio:2.5,
        ko:5,dec:2,s:0,reach:73,layoff:105,home:true,
        recentForm:[{r:"W",opp:"Aslan",oppRank:99,method:"KO"},{r:"W",opp:"Aly",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:99},
    f2:{name:"A. Lane",country:"USA",record:"13-7",age:37,odds:120,ucfFights:6,stance:"Orthodox",
        slpm:2.74,sapm:2.23,sacc:50,sdef:40,td:1.52,tdacc:28,tddef:33,sub:0.0,kdRatio:0.4,
        ko:4,dec:7,s:2,reach:80,layoff:252,home:false,
        recentForm:[{r:"L",opp:"Petrino",oppRank:99,method:"SUB"},{r:"L",opp:"Pinto",oppRank:99,method:"KO"},{r:"W",opp:"Despaigne",oppRank:99,method:"DEC"},{r:"L",opp:"Diniz",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:4,sub:1,dec:2},rank:99}},
  {id:11,card:"MAIN CARD",time:"16:20 HE",rounds:3,wc:"Middleweight",lbs:"185 lbs",ou:2.5,
    f1:{name:"R. Dolidze",country:"GEO",record:"15-4",age:37,odds:260,ucfFights:10,stance:"Orthodox",
        slpm:3.41,sapm:3.72,sacc:41,sdef:48,td:0.99,tdacc:39,tddef:26,sub:0.8,kdRatio:0.9,
        ko:5,dec:8,s:2,reach:76,layoff:224,home:false,
        recentForm:[{r:"L",opp:"Hernandez",oppRank:8,method:"SUB"},{r:"W",opp:"Vettori",oppRank:11,method:"DEC"},{r:"W",opp:"Holland",oppRank:99,method:"KO"},{r:"W",opp:"A.Smith",oppRank:99,method:"DEC"},{r:"L",opp:"Chimaev",oppRank:1,method:"SUB"}],
        lossTypes:{ko:0,sub:3,dec:1},rank:99},
    f2:{name:"C. Duncan",country:"GBR",record:"13-2",age:30,odds:-131,ucfFights:5,stance:"Switch",
        slpm:4.60,sapm:2.97,sacc:58,sdef:51,td:0.40,tdacc:20,tddef:69,sub:0.0,kdRatio:1.6,
        ko:5,dec:7,s:1,reach:79,layoff:133,home:true,
        recentForm:[{r:"W",opp:"Tulio",oppRank:99,method:"KO"},{r:"W",opp:"Anders",oppRank:99,method:"KO"},{r:"W",opp:"Pulyaev",oppRank:99,method:"DEC"},{r:"L",opp:"Rodrigues",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:2},rank:99}},
  {id:12,card:"MAIN CARD",time:"17:00 HE",rounds:3,wc:"Featherweight",lbs:"145 lbs",ou:2.5,
    f1:{name:"L. Riley",country:"GBR",record:"12-0",age:25,odds:-138,ucfFights:1,stance:"Orthodox",
        slpm:2.55,sapm:1.27,sacc:60,sdef:46,td:0.0,tdacc:0,tddef:42,sub:0.0,kdRatio:1.5,
        ko:5,dec:6,s:1,reach:69,layoff:119,home:true,
        recentForm:[{r:"W",opp:"Grad",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:99},
    f2:{name:"M. Aswell Jr",country:"USA",record:"11-3",age:24,odds:116,ucfFights:3,stance:"Orthodox",
        slpm:5.0,sapm:5.0,sacc:45,sdef:54,td:0.0,tdacc:0,tddef:57,sub:0.0,kdRatio:1.8,
        ko:6,dec:4,s:1,reach:69,layoff:161,home:false,
        recentForm:[{r:"W",opp:"Almeida",oppRank:99,method:"KO"},{r:"L",opp:"Oki",oppRank:99,method:"DEC"},{r:"L",opp:"Grad",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:3},rank:99}},
  {id:13,card:"MAIN CARD",time:"16:30 HE",rounds:3,wc:"Welterweight",lbs:"170 lbs",ou:2.5,
    f1:{name:"M. Page",country:"GBR",record:"24-3",age:38,odds:-150,ucfFights:5,stance:"Switch",
        slpm:2.39,sapm:1.68,sacc:60,sdef:57,td:0.23,tdacc:16,tddef:66,sub:0.0,kdRatio:2.2,
        ko:13,dec:9,s:2,reach:79,layoff:217,home:true,
        recentForm:[{r:"W",opp:"Cannonier",oppRank:99,method:"DEC"},{r:"W",opp:"Magomedov",oppRank:6,method:"DEC"},{r:"L",opp:"Garry",oppRank:5,method:"DEC"},{r:"W",opp:"Holland",oppRank:99,method:"DEC"},{r:"W",opp:"opp",oppRank:99,method:"KO"}],
        lossTypes:{ko:0,sub:0,dec:3},rank:99},
    f2:{name:"S. Patterson",country:"GBR",record:"14-2-1",age:29,odds:125,ucfFights:5,stance:"Orthodox",
        slpm:3.89,sapm:3.93,sacc:43,sdef:49,td:1.39,tdacc:100,tddef:33,sub:2.8,kdRatio:1.2,
        ko:4,dec:7,s:3,reach:78,layoff:196,home:true,
        recentForm:[{r:"W",opp:"Waters",oppRank:99,method:"KO"},{r:"W",opp:"Barlow",oppRank:99,method:"KO"},{r:"W",opp:"Crosbie",oppRank:99,method:"SUB"},{r:"W",opp:"Lainesse",oppRank:99,method:"SUB"},{r:"L",opp:"opp",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:2},rank:99}},
  {id:14,card:"MAIN EVENT",time:"17:30 HE",rounds:5,wc:"Featherweight",lbs:"145 lbs",ou:3.5,isMain:true,
    f1:{name:"M. Evloev",country:"RUS",record:"19-0",age:32,odds:-140,ucfFights:10,stance:"Orthodox",
        slpm:3.99,sapm:2.66,sacc:48,sdef:60,td:4.67,tdacc:48,tddef:61,sub:0.2,kdRatio:1.2,
        ko:4,dec:13,s:2,reach:72,layoff:469,home:false,
        recentForm:[{r:"W",opp:"Sterling",oppRank:5,method:"DEC"},{r:"W",opp:"Allen",oppRank:8,method:"DEC"},{r:"W",opp:"Lopes",oppRank:2,method:"DEC"},{r:"W",opp:"Ige",oppRank:99,method:"DEC"},{r:"W",opp:"Dawodu",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:1},
    f2:{name:"L. Murphy",country:"GBR",record:"17-0-1",age:34,odds:118,ucfFights:8,stance:"Orthodox",
        slpm:4.48,sapm:2.51,sacc:53,sdef:61,td:1.41,tdacc:54,tddef:51,sub:0.5,kdRatio:1.5,
        ko:6,dec:9,s:2,reach:73,layoff:217,home:true,
        recentForm:[{r:"W",opp:"Pico",oppRank:99,method:"KO"},{r:"W",opp:"Emmett",oppRank:11,method:"DEC"},{r:"W",opp:"Ige",oppRank:99,method:"DEC"},{r:"W",opp:"Barboza",oppRank:13,method:"DEC"},{r:"W",opp:"Culibao",oppRank:99,method:"DEC"}],
        lossTypes:{ko:0,sub:0,dec:0},rank:3}},
];

const allFights=[...fights,...fights2];
function FormDots({form}){
  return(
    <div style={{display:"flex",gap:3,marginTop:4}}>
      {form.map((f,i)=>(
        <div key={i} style={{
          width:10,height:10,borderRadius:"50%",
          background:f.r==="W"?"#27ae60":f.r==="D"?"#f0a500":"#e74c3c",
          opacity:1-i*0.1,
          border:f.oppRank<=15?"2px solid #333":"1px solid #ddd"
        }}/>
      ))}
    </div>
  );
}

function WinBar({pct1,pct2}){
  return(
    <div style={{height:8,borderRadius:4,overflow:"hidden",display:"flex",margin:"8px 0"}}>
      <div style={{width:`${pct1}%`,background:"#27ae60",transition:"width 0.3s"}}/>
      <div style={{width:`${pct2}%`,background:"#e74c3c",transition:"width 0.3s"}}/>
    </div>
  );
}

function MethodBadge({method}){
  const cfg={
    "KO/TKO":{bg:"#ffeaea",color:"#e74c3c",border:"#fcc"},
    "SOUMISSION":{bg:"#fff4e5",color:"#e67e22",border:"#fdd"},
    "DÉCISION":{bg:"#e9f7f0",color:"#27ae60",border:"#b2dfce"},
  };
  const c=cfg[method]||cfg["DÉCISION"];
  return(
    <span style={{
      fontSize:10,fontFamily:"monospace",fontWeight:700,
      background:c.bg,color:c.color,
      border:`1px solid ${c.border}`,
      borderRadius:4,padding:"3px 10px",letterSpacing:"0.05em"
    }}>{method}</span>
  );
}

function OUBadge({signal,over}){
  const cfg={
    "OVER":{bg:"#ffeaea",color:"#e74c3c",border:"#fcc"},
    "UNDER":{bg:"#e8f4fd",color:"#2980b9",border:"#b8d8f0"},
    "PUSH":{bg:"#f8f8f8",color:"#888",border:"#ddd"},
  };
  const c=cfg[signal]||cfg["PUSH"];
  return(
    <span style={{
      fontSize:10,fontFamily:"monospace",fontWeight:700,
      background:c.bg,color:c.color,
      border:`1px solid ${c.border}`,
      borderRadius:4,padding:"3px 10px",letterSpacing:"0.05em"
    }}>{signal} PRÉVU</span>
  );
}

function RoundBar({rounds,estRound}){
  const bars=Array.from({length:rounds},(_,i)=>i+1);
  return(
    <div style={{marginTop:8}}>
      <div style={{display:"flex",gap:3,marginBottom:2}}>
        {bars.map(r=>{
          const filled=estRound>=r;
          const partial=estRound>r-1&&estRound<r;
          const pct=partial?((estRound-(r-1))*100):filled?100:0;
          return(
            <div key={r} style={{flex:1,height:8,borderRadius:3,background:"#eee",overflow:"hidden"}}>
              <div style={{width:`${pct}%`,height:"100%",background:"#e74c3c",borderRadius:3}}/>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:3}}>
        {bars.map(r=>(
          <div key={r} style={{flex:1,textAlign:"center",fontSize:8,color:"#bbb",fontFamily:"monospace"}}>R{r}</div>
        ))}
      </div>
    </div>
  );
}

function FightCard({fight}){
  const{f1,f2,wc,lbs,rounds,ou,card,time,isMain}=fight;
  const res=modelV6(f1,f2,rounds);
  const ouRes=predictOU(fight);
  const wF=res.winner==="f1"?f1:f2;
  const lF=res.winner==="f1"?f2:f1;
  const wPct=res.winner==="f1"?res.pct1:res.pct2;
  const lPct=100-wPct;
  const wNet=res.winner==="f1"?res.strNet1:res.strNet2;
  const lNet=res.winner==="f1"?res.strNet2:res.strNet1;
  const confColor=wPct>=70?"#27ae60":wPct>=58?"#f0a500":"#e74c3c";

  return(
    <div style={{
      background:"#fff",borderRadius:12,
      boxShadow:"0 2px 12px rgba(0,0,0,0.08)",
      marginBottom:14,
      border:isMain?"2px solid #f0a500":"1px solid #eee",
      overflow:"hidden"
    }}>
      {/* TOP BAR */}
      <div style={{
        background:isMain?"#1a1a1a":card==="MAIN CARD"?"#f8f8f8":"#f8f8f8",
        padding:"6px 14px",
        display:"flex",justifyContent:"space-between",alignItems:"center",
        borderBottom:"1px solid #eee"
      }}>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:9,fontFamily:"monospace",fontWeight:700,
            color:isMain?"#f0a500":card==="MAIN CARD"?"#555":"#999",
            letterSpacing:"0.12em"}}>{card}</span>
          {isMain&&<span style={{fontSize:8,background:"#f0a500",color:"#000",
            borderRadius:3,padding:"1px 6px",fontWeight:700,fontFamily:"monospace"}}>MAIN EVENT</span>}
        </div>
        <span style={{fontSize:9,fontFamily:"monospace",
          color:isMain?"#aaa":"#999"}}>{time} · {rounds}R · {lbs}</span>
      </div>

      {/* FIGHTERS ROW */}
      <div style={{padding:"12px 14px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          {/* F1 */}
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:4,marginBottom:2,alignItems:"center"}}>
              {f1.home&&<span style={{fontSize:9}}>🏠</span>}
              {f1.rank<=15&&<span style={{fontSize:8,background:"#1a1a1a",color:"#f0a500",
                borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>#{f1.rank}</span>}
              {f1.ucfFights<3&&<span style={{fontSize:8,background:"#fff4e5",color:"#e67e22",
                borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>NEW</span>}
            </div>
            <div style={{fontSize:16,fontWeight:800,fontFamily:"monospace",color:"#1a1a1a"}}>{f1.name}</div>
            <div style={{fontSize:9,color:"#999",fontFamily:"monospace"}}>{f1.record} · {f1.country} · {f1.age}ans</div>
            <FormDots form={f1.recentForm}/>
            <div style={{display:"flex",gap:6,marginTop:4,alignItems:"center"}}>
              <span style={{fontSize:11,fontWeight:700,fontFamily:"monospace",color:oddsColor(f1.odds)}}>{fmtOdds(f1.odds)}</span>
              {f1.stance==="Southpaw"&&<span style={{fontSize:8,background:"#e8f4fd",color:"#2980b9",borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>GAUCHER</span>}
              <span style={{fontSize:9,fontFamily:"monospace",color:res.strNet1>=0?"#27ae60":"#e74c3c",fontWeight:600}}>{fmtNet(res.strNet1)}</span>
            </div>
          </div>

          {/* CENTER VS */}
          <div style={{textAlign:"center",padding:"0 10px",minWidth:50}}>
            <div style={{fontSize:9,fontFamily:"monospace",color:"#ccc",marginTop:8}}>VS</div>
            <div style={{fontSize:9,fontFamily:"monospace",color:"#999",marginTop:2}}>{time}</div>
          </div>

          {/* F2 */}
          <div style={{flex:1,textAlign:"right"}}>
            <div style={{display:"flex",gap:4,marginBottom:2,alignItems:"center",justifyContent:"flex-end"}}>
              {f2.ucfFights<3&&<span style={{fontSize:8,background:"#fff4e5",color:"#e67e22",
                borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>NEW</span>}
              {f2.rank<=15&&<span style={{fontSize:8,background:"#1a1a1a",color:"#f0a500",
                borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>#{f2.rank}</span>}
              {f2.home&&<span style={{fontSize:9}}>🏠</span>}
            </div>
            <div style={{fontSize:16,fontWeight:800,fontFamily:"monospace",color:"#1a1a1a"}}>{f2.name}</div>
            <div style={{fontSize:9,color:"#999",fontFamily:"monospace"}}>{f2.record} · {f2.country} · {f2.age}ans</div>
            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <FormDots form={f2.recentForm}/>
            </div>
            <div style={{display:"flex",gap:6,marginTop:4,alignItems:"center",justifyContent:"flex-end"}}>
              <span style={{fontSize:9,fontFamily:"monospace",color:res.strNet2>=0?"#27ae60":"#e74c3c",fontWeight:600}}>{fmtNet(res.strNet2)}</span>
              {f2.stance==="Southpaw"&&<span style={{fontSize:8,background:"#e8f4fd",color:"#2980b9",borderRadius:3,padding:"1px 5px",fontFamily:"monospace"}}>GAUCHER</span>}
              <span style={{fontSize:11,fontWeight:700,fontFamily:"monospace",color:oddsColor(f2.odds)}}>{fmtOdds(f2.odds)}</span>
            </div>
          </div>
        </div>

        {/* WIN % BAR */}
        <div style={{marginTop:8}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:"monospace",fontWeight:700,marginBottom:2}}>
            <span style={{color:"#27ae60"}}>{res.pct1}%</span>
            <span style={{color:"#e74c3c"}}>{res.pct2}%</span>
          </div>
          <WinBar pct1={res.pct1} pct2={res.pct2}/>
        </div>

        {/* PREDICTION ROW */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:"1px solid #f5f5f5"}}>
          <div>
            <div style={{fontSize:8,fontFamily:"monospace",color:"#bbb",letterSpacing:"0.1em",marginBottom:3}}>VAINQUEUR PRÉVU</div>
            <div style={{fontSize:15,fontWeight:800,fontFamily:"monospace",color:confColor}}>{wF.name} <span style={{fontSize:11,color:"#999"}}>{wPct}%</span></div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:8,fontFamily:"monospace",color:"#bbb",letterSpacing:"0.1em",marginBottom:3}}>MÉTHODE · {res.mConf}%</div>
            <MethodBadge method={res.method}/>
          </div>
        </div>

        {/* O/U */}
        <div style={{borderTop:"1px solid #f5f5f5",paddingBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8,marginBottom:4}}>
            <div style={{fontSize:8,fontFamily:"monospace",color:"#bbb",letterSpacing:"0.1em"}}>O/U {ou} ROUNDS</div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:9,fontFamily:"monospace",color:"#27ae60"}}>{ouRes.over}% OVER</span>
              <span style={{fontSize:9,fontFamily:"monospace",color:"#e74c3c"}}>{ouRes.under}% UNDER</span>
            </div>
          </div>
          <RoundBar rounds={rounds} estRound={ouRes.estRound}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
            <OUBadge signal={ouRes.signal} over={ouRes.over}/>
            <span style={{fontSize:9,fontFamily:"monospace",color:"#bbb"}}>Est: {ouRes.estRound}R · Div FR:{Math.round((DIV_FINISH_RATE[wc]||0.5)*100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
function SummaryTable(){
  const rows=allFights.map(f=>{
    const r=modelV6(f.f1,f.f2,f.rounds);
    const ou=predictOU(f);
    const wF=r.winner==="f1"?f.f1:f.f2;
    return{
      id:f.id,card:f.card,
      f1:f.f1.name,f2:f.f2.name,
      winner:wF.name,pct:r.winner==="f1"?r.pct1:r.pct2,
      method:r.method,mConf:r.mConf,
      signal:ou.signal,over:ou.over,wc:f.wc
    };
  });

  const order=["MAIN EVENT","MAIN CARD","PRELIMS"];
  const sorted=[...rows].sort((a,b)=>order.indexOf(a.card)-order.indexOf(b.card)||a.id-b.id);
  const confColor=(p)=>p>=70?"#27ae60":p>=58?"#f0a500":"#e74c3c";
  const ouColor=(s)=>s==="OVER"?"#e74c3c":s==="UNDER"?"#2980b9":"#888";

  return(
    <div style={{background:"#fff",borderRadius:12,boxShadow:"0 2px 12px rgba(0,0,0,0.08)",marginBottom:16,overflow:"hidden",border:"1px solid #eee"}}>
      <div style={{background:"#1a1a1a",padding:"10px 16px"}}>
        <div style={{fontSize:11,fontFamily:"monospace",fontWeight:700,color:"#f0a500",letterSpacing:"0.15em"}}>RÉSUMÉ CARTE COMPLÈTE</div>
        <div style={{fontSize:8,fontFamily:"monospace",color:"#aaa",marginTop:2}}>UFC London · 21 mars 2026 · Modèle v6</div>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:9,fontFamily:"monospace"}}>
          <thead>
            <tr style={{background:"#f8f8f8",borderBottom:"2px solid #eee"}}>
              <th style={{padding:"7px 10px",textAlign:"left",color:"#999",fontWeight:600}}>COMBAT</th>
              <th style={{padding:"7px 10px",textAlign:"center",color:"#999",fontWeight:600}}>WINNER</th>
              <th style={{padding:"7px 10px",textAlign:"center",color:"#999",fontWeight:600}}>CONF</th>
              <th style={{padding:"7px 10px",textAlign:"center",color:"#999",fontWeight:600}}>MÉTHODE</th>
              <th style={{padding:"7px 10px",textAlign:"center",color:"#999",fontWeight:600}}>O/U</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r,i)=>(
              <tr key={r.id} style={{borderBottom:"1px solid #f5f5f5",background:i%2===0?"#fff":"#fafafa"}}>
                <td style={{padding:"7px 10px"}}>
                  <div style={{fontWeight:700,color:"#1a1a1a",fontSize:9}}>{r.f1} vs {r.f2}</div>
                  <div style={{fontSize:7,color:"#bbb",marginTop:1}}>{r.card} · {r.wc}</div>
                </td>
                <td style={{padding:"7px 10px",textAlign:"center"}}>
                  <span style={{fontWeight:700,color:"#27ae60"}}>{r.winner}</span>
                </td>
                <td style={{padding:"7px 10px",textAlign:"center"}}>
                  <span style={{fontWeight:700,color:confColor(r.pct)}}>{r.pct}%</span>
                </td>
                <td style={{padding:"7px 10px",textAlign:"center"}}>
                  <MethodBadge method={r.method}/>
                </td>
                <td style={{padding:"7px 10px",textAlign:"center"}}>
                  <span style={{fontWeight:700,color:ouColor(r.signal),display:"block"}}>{r.signal}</span>
                  <span style={{fontSize:8,color:"#bbb"}}>{r.over}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default function App(){
  const[filter,setFilter]=useState("ALL");
  const[showSummary,setShowSummary]=useState(true);

  const cards=["ALL","PRELIMS","MAIN CARD","MAIN EVENT"];
  const filtered=filter==="ALL"?allFights:allFights.filter(f=>f.card===filter);

  const allRes=allFights.map(f=>{
    const r=modelV6(f.f1,f.f2,f.rounds);
    const ou=predictOU(f);
    return{method:r.method,signal:ou.signal};
  });
  const koCount=allRes.filter(r=>r.method==="KO/TKO").length;
  const subCount=allRes.filter(r=>r.method==="SOUMISSION").length;
  const decCount=allRes.filter(r=>r.method==="DÉCISION").length;
  const overCount=allRes.filter(r=>r.signal==="OVER").length;
  const underCount=allRes.filter(r=>r.signal==="UNDER").length;
  const pushCount=allRes.filter(r=>r.signal==="PUSH").length;

  // Heure actuelle simulation
  const now=new Date();
  const timeStr=now.toLocaleTimeString("fr-CA",{hour:"2-digit",minute:"2-digit",second:"2-digit"});

  return(
    <div style={{minHeight:"100vh",background:"#f2f2f2",fontFamily:"monospace"}}>

      {/* HEADER */}
      <div style={{background:"#fff",borderBottom:"1px solid #eee",padding:"14px 16px 10px",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 8px rgba(0,0,0,0.06)"}}>
        <div style={{maxWidth:680,margin:"0 auto"}}>

          {/* TITLE ROW */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18,fontWeight:900,fontFamily:"monospace",color:"#e74c3c",letterSpacing:"0.02em"}}>UFC PREDICTION MODEL</span>
                <span style={{fontSize:10,background:"#27ae60",color:"#fff",borderRadius:4,padding:"2px 7px",fontWeight:700,fontFamily:"monospace"}}>v6</span>
              </div>
              <div style={{fontSize:9,color:"#999",fontFamily:"monospace",marginTop:2,letterSpacing:"0.1em"}}>
                UFC LONDON · EVLOEV vs MURPHY · O2 ARENA
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:9,fontFamily:"monospace",color:"#bbb"}}>{timeStr}</div>
              <div style={{fontSize:8,fontFamily:"monospace",color:"#bbb",marginTop:1}}>21 MARS 2026</div>
            </div>
          </div>

          {/* STATS GLOBALES */}
          <div style={{display:"flex",gap:4,margin:"8px 0"}}>
            {[
              ["KO/TKO",koCount,"#e74c3c"],
              ["SUB",subCount,"#e67e22"],
              ["DEC",decCount,"#27ae60"],
              ["OVER",overCount,"#e74c3c"],
              ["UNDER",underCount,"#2980b9"],
              ["PUSH",pushCount,"#999"],
            ].map(([label,count,color])=>(
              <div key={label} style={{
                flex:1,background:"#f8f8f8",borderRadius:6,
                padding:"4px 2px",textAlign:"center",
                border:"1px solid #eee"
              }}>
                <div style={{fontSize:13,fontWeight:800,color,fontFamily:"monospace"}}>{count}</div>
                <div style={{fontSize:7,color:"#bbb",letterSpacing:"0.08em"}}>{label}</div>
              </div>
            ))}
          </div>

          {/* FILTER TABS */}
          <div style={{display:"flex",gap:4}}>
            {cards.map(c=>(
              <button key={c} onClick={()=>setFilter(c)} style={{
                flex:1,padding:"6px 4px",borderRadius:6,
                border:filter===c?"2px solid #e74c3c":"1px solid #eee",
                background:filter===c?"#e74c3c":"#fff",
                color:filter===c?"#fff":"#999",
                fontFamily:"monospace",fontSize:8,fontWeight:700,
                cursor:"pointer",letterSpacing:"0.06em",
                transition:"all 0.15s"
              }}>
                {c==="ALL"?"TOUS":c==="MAIN EVENT"?"M.EVENT":c==="MAIN CARD"?"MAIN":"PRELIMS"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{maxWidth:680,margin:"0 auto",padding:"12px 12px"}}>

        {/* TOGGLE SUMMARY */}
        <button onClick={()=>setShowSummary(!showSummary)} style={{
          width:"100%",marginBottom:12,
          background:"#fff",border:"1px solid #eee",
          borderRadius:8,padding:"8px",
          fontFamily:"monospace",fontSize:9,color:"#999",
          cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"
        }}>
          {showSummary?"▲ CACHER RÉSUMÉ":"▼ VOIR RÉSUMÉ COMPLET"}
        </button>

        {showSummary&&<SummaryTable/>}

        {filtered.map(f=>(
          <FightCard key={f.id} fight={f}/>
        ))}

        {/* FOOTER */}
        <div style={{textAlign:"center",padding:"16px 0 24px",fontSize:8,fontFamily:"monospace",color:"#ccc",lineHeight:1.8}}>
          UFC Model v6 · Stats UFCStats.com · Rankings UFC officiels · Home crowd · Stance · KD ratio<br/>
          ⚠️ À titre informatif seulement — pas de conseils de paris
        </div>
      </div>
    </div>
  );
}
