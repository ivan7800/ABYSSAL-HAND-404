import assert from 'node:assert/strict';
import { newRun, toggleCard, playSelection, claimReward, chooseRoute } from '../js/core/game.js';
import { scoreSelection } from '../js/scoring/scoring.js';
import { makeSeededRandom } from '../js/core/rng.js';
import { EVENTS } from '../js/economy/content.js';
import { buyItem, acceptPact, continueFromNode, resolveSanctuary, resolveEvent, resolveCache } from '../js/gameplay/meta.js';

// A deterministic, ordinary build can finish all 32 encounters without forced scores.
const previousRandom=Math.random;
Math.random=makeSeededRandom('SHUFFLE-5');
try {
  const state=newRun('COMPLETE-5');
  const visited=new Set();
  let steps=0;
  while(!['lost','won'].includes(state.status)&&steps++<150){
    if(state.screenMode==='battle'){
      while(state.status==='playing'){
        let best=[],bestScore=-1;
        for(let mask=1;mask<256;mask++){
          const cards=[];
          for(let i=0;i<state.hand.length;i++)if(mask&(1<<i))cards.push(state.hand[i]);
          if(cards.length<1||cards.length>5)continue;
          const score=scoreSelection(cards,state)?.score||0;
          if(score>bestScore){bestScore=score;best=cards;}
        }
        assert.ok(best.length);
        for(const card of best)assert.equal(toggleCard(state,card.id).ok,true);
        assert.equal(playSelection(state).ok,true);
      }
      assert.notEqual(state.status,'lost',`Perdida en el encuentro ${state.encounter} con ${state.madness}% locura, ${state.handsLeft} manos y ${state.totalScore}/${state.targetScore}`);
    }
    if(state.screenMode==='reward')assert.equal(claimReward(state).ok,true);
    if(state.screenMode==='route'){
      let type='battle';
      if(state.encounter===2&&!state.relics.some(x=>x.id==='coral-heart'))type='shop';
      else if(state.encounter===3&&!state.pacts.some(x=>x.id==='blood-pact'))type='ritual';
      else if(state.encounter===4&&state.routeOptions.some(x=>x.type==='cache'))type='cache';
      else if(state.madness>=17&&state.routeOptions.some(x=>x.type==='sanctuary'))type='sanctuary';
      else if(state.routeOptions.some(x=>x.type==='event'))type='event';
      const route=state.routeOptions.find(x=>x.type===type)||state.routeOptions[0];
      assert.equal(chooseRoute(state,route.id).ok,true);
      visited.add(route.type);
      if(state.screenMode==='shop'){
        if(state.echoes>=22)assert.equal(buyItem(state,'coral-heart').ok,true);
        continueFromNode(state);
      }
      if(state.screenMode==='ritual'){assert.equal(acceptPact(state,'blood-pact').ok,true);continueFromNode(state);}
      if(state.screenMode==='sanctuary'){assert.equal(resolveSanctuary(state,'rest').ok,true);continueFromNode(state);}
      if(state.screenMode==='cache'){assert.equal(resolveCache(state,'listen').ok,true);continueFromNode(state);}
      if(state.screenMode==='event'){
        const story=EVENTS.find(x=>x.id===state.currentNode.eventId);
        assert.ok(story);
        assert.equal(resolveEvent(state,story.choices[1].id).ok,true);
        continueFromNode(state);
      }
    }
  }
  assert.equal(state.status,'won');
  assert.equal(state.encounter,32);
  assert.equal(state.bossesDefeated,8);
  assert.ok(['shop','ritual','sanctuary','event','cache'].every(type=>visited.has(type)));
  console.log('PASS campaña completa: 32 encuentros, ocho jefes y cinco tipos de decisión');
} finally { Math.random=previousRandom; }
