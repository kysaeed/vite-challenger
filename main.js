
/**
 * Phaser3
 *  https://newdocs.phaser.io/docs/3.70.0/gameobjects
 */
import Phaser from 'phaser'
import _ from 'lodash'



/**
 * https://bodoge.hoobby.net/games/challengers/strategies/41250
 */
const CardList = [
  {
    p: 1,
    name: '新入り',
    image: 'chara',
  },
  {
    p: 1,
    name: '新入り',
    image: 'chara',
  },
  {
    p: 1,
    name: '新入り',
    image: 'chara',
  },
  {
    p: 2,
    name: 'タレント',
    image: 'chara',
  },
  {
    p: 2,
    name: 'タレント',
    image: 'chara',
  },
  {
    p: 3,
    name: 'ねこ',
    image: 'cat',
  },
  {
    p: 4,
    name: 'チャンピオン',
    image: 'chara',
  },

];



const HeightBase = 220
let y = HeightBase
let enemyY = -HeightBase
let direction = 1

class Card {
  constructor(scene, parent, cardInfo, x, y, cardDirection) {
    this.scene = scene

    this.cardBg = scene.add.sprite(0, 0, 'card')
    this.cardChara = scene.add.sprite(0, 22, cardInfo.image)
    this.cardTextPoint = scene.add.text(-20, -55, cardInfo.p, { fontSize: '24px', fill: '#000' });
    this.cardTextTitle = scene.add.text(-40, -28, cardInfo.name, { fontSize: '12px', fill: '#000' });
    this.card = scene.add.container(x, y, [
      this.cardBg,
      this.cardChara,
      this.cardTextPoint,
      this.cardTextTitle,
    ])
    this.card.angle = 180 * cardDirection

    parent.add(this.card)

    this.cardInfo = cardInfo
  }

  enterTo(x, y) {

    this.scene.tweens.chain({
      targets: this.card,
      tweens: [
        {
          x: x,
          y: y,
          angle: 270,
          scale: 0.3,
          duration: 300,
        },
        {
          angle: 180,
          x: x,
          y: y,
          ease: 'power1',
          duration: 300,
        },
        {
          x: x,
          y: y,
          angle: 180,
          scale: 1.0,
          duration: 200,
        },
      ],
      onComplete() {
        console.log('diffence-card: OK!')
      },
    })

  }

  attack(stackCount, onEnd) {
    // console.log('attack..')

    this.scene.tweens.chain({
      targets: this.card,
      tweens: [
        {
          delay: stackCount * 40,
          angle: '+=9',
          // angle: 180 * (turnPlayer) + 9,
          x: 400 + stackCount * 8,
          y: 0, //enemyY,
          scale: 1.0,
          duration: 100,
          ease: 'power1',
        },
        {
          // angle: 180 * (turnPlayer) + 9,
          x: 400 + stackCount * 8,
          scale: 1.2,
          y: this.card.y,
          ease: 'power1',
          duration: 300,
        },
        {
          x: 400 + stackCount * 8,
          y: y + stackCount * 8,
          angle: '-=9',
          scale: 1.0,
          duration: 200,
          ease: 'power1',
        },
      ],
      onComplete() {
        console.log('OK!')
        if (onEnd) {
          onEnd()
        }
      },
    })

  }

  damaged(onEnd) {
    const x = this.card.x
    const y = this.card.y

    this.scene.tweens.chain({
      targets: this.card,
      tweens: [
        {
          x: x,
          y: y,
          //angle: 270,
          scale: 1.3,
          duration: 100,
        },
        {
          //angle: 180,
          x: x,
          y: y - (40 * direction),
          ease: 'power1',
          duration: 100,
        },
        {
          x: x,
          y: y,
          //angle: 180,
          scale: 1.0,
          duration: 200,
        },
      ],
      onComplete() {
        if (onEnd) {
          onEnd();
        }
      },
    })
  }

  moveToBench(x, y, onEnd) {
    this.scene.tweens.chain({
      targets: this.card,
      tweens: [
        {
          x: x,
          y: y,
          angle: 90,
          scale: 0.5,
          duration: 400,
          ease: 'power1',
        },
      ],
      onComplete() {
        if (onEnd) {
          onEnd();
        }
      },
    })

  }

}

const setTurnPlayer = (player) => {
  DuelInfo.turnPlayer = player
  if (!player) {
    y = HeightBase
    enemyY = -HeightBase
    direction = 1
  } else {
    y = -HeightBase
    enemyY = HeightBase
    direction = -1
  }
}

class Flag {
  constructor(scene, x, y) {
    this.scene = scene
    this.sprite = scene.add.sprite(x, y, 'flag')

  }

  moveTo(x, y, onEnd) {
    const basePosition = {
      x: this.sprite.x,
      y: this.sprite.y,
    }
    this.scene.tweens.chain({
      targets: this.sprite,
      tweens: [
        {
          // x: x,
          // y: y,
          angle: 0,
          scale: 1.0,
          duration: 300,
        },
        {
          angle: 0,
          // x: x,
          // y: y,
          scale: 1.4,
          ease: 'power1',
          duration: 300,
        },
        {
          x: x,
          y: y,
          angle: 0,
          scale: 1.0,
          duration: 200,
        },
      ],
      onComplete() {
        console.log('flag: OK!')
        if (onEnd) {
          onEnd()
        }
      },
    });
  }
}


const SetupPhase = {
  enter(scene, cardBoard, DuelInfo, onEnd) {
    const turnPlayer = DuelInfo.turnPlayer
    const player = DuelInfo.player[1 - turnPlayer]

    DuelInfo.player.forEach((player) => {
      player.deck = new Deck()
      player.deck.setCardList(CardList)
      player.deck.shuffle()
    })

    let diffenceCardInfo = player.deck.draw(scene, cardBoard, 400, turnPlayer)
    const card = diffenceCardInfo
    const diffenceCardSprite = card.card
    diffenceCardSprite.angle = 180 * (1 - turnPlayer)

    player.diffenceCard = card

    card.enterTo(400, 0)

    onEnd();
  },

}

const AttackPhase = {
  enter(scene, cardBoard, flag, DuelInfo, onEnd) {

    const turnPlayer = DuelInfo.turnPlayer
    const enemyCard = DuelInfo.player[1 - turnPlayer].diffenceCard

    const stackCount = DuelInfo.player[turnPlayer].attackCards.length
    const newAttackCard = DuelInfo.player[turnPlayer].deck.draw(scene, cardBoard, 0, turnPlayer);
    if (newAttackCard) {

      const x = 400

      scene.tweens.chain({
        targets: newAttackCard.card,
        tweens: [
          {
            x: 400,
            y: -10,
            // angle: 270,
            scale: 2.5,
            duration: 100,
            angle: 0,
          },
          {
            delay: 1000,
            //angle: 180,
            scale: 1.0,
            x: x,
            y: y,
            ease: 'power1',
            duration: 200,
            angle: 180 * turnPlayer,
          },
          {
            x: x,
            y: y,
            //angle: 180,
            scale: 1.0,
            duration: 100,
          },
        ],
        onComplete() {

          console.log('diffence-card: OK!')

          DuelInfo.player[turnPlayer].attackCards.push(newAttackCard)

          let total = 0
          DuelInfo.player[turnPlayer].attackCards.forEach((c) => {
              total += c.cardInfo.p
          })

          DuelInfo.player[turnPlayer].attackCards.forEach((c, i) => {
            const stackCount = i
            c.attack(stackCount)
          })


          if (total >= enemyCard.cardInfo.p) {
            enemyCard.damaged(() => {
              console.log('かった！'  + turnPlayer, DuelInfo.player[turnPlayer].attackCards)

              DuelInfo.player[turnPlayer].attackCards.forEach((c) => {
                c.enterTo(400, 0)
                // console.log(c.card)
                // scene.tweens.chain({
                //   targets:  c.card,
                //   tweens: {
                // //     x: 400,
                // //     y: 0,
                // //     duration: 100,
                // //     //scale: 1.0,
                // //     // angle: 0,
                //   }
                // })
              })

              DuelInfo.player[turnPlayer].diffenceCard = DuelInfo.player[turnPlayer].attackCards.pop()
              //DuelInfo.player[turnPlayer].attackCards = []
              flag.moveTo(520, 170 + (200 * (1 - turnPlayer)))



              const getBenchY = (benchIndex, turnPlayers) => {
                if (turnPlayers == 0) {
                  return 200 - (benchIndex * 70)
                }
                return (-200 + (benchIndex * 70));
              }

              const enemyPlayer = DuelInfo.player[1 - turnPlayer]
              const benchIndex = enemyPlayer.benchCards.length
              enemyPlayer.diffenceCard.moveToBench(200 + (turnPlayer * 400), getBenchY(benchIndex, 1 - turnPlayer))
              enemyPlayer.benchCards.push(enemyPlayer.diffenceCard)
              enemyPlayer.diffenceCard = null
              for (let i = 0; i < enemyPlayer.attackCards.length; i++) {
                const benchIndex = enemyPlayer.benchCards.length

                enemyPlayer.benchCards.push(enemyPlayer.attackCards[i]);
                enemyPlayer.attackCards[i].moveToBench(200 + (turnPlayer * 400), getBenchY(benchIndex, 1 - turnPlayer));
              }
              enemyPlayer.attackCards = [];

              if (enemyPlayer.deck.isEmpty()) {

                console.log('END!')
                const textModal = scene.add.sprite(360, 200, 'modal')
                textModal.displayWidth = 400

                let text = ''
                if (turnPlayer == 0) {
                  text = '勝ち'
                } else {
                  text = '負け'
                }

                const endText = scene.add.text(360, 216, text, { fontSize: '32px', fill: '#000' });
              }

              setTurnPlayer(1 - turnPlayer)

              onEnd();
            })
          }

        },
      })

    }

  },

}

const DamagePhase = {
  enter(scene, cardBoard, flag, DuelInfo, onEnd) {

    onEnd();
  },

}


class Deck {
  constructor() {
    this.cards = []
  }

  setCardList(cardList) {
    this.cards = _.cloneDeep(cardList)
  }
  shuffle() {
    this.cards = _.shuffle(this.cards)
  }

  draw(scene, cardBoard, stackCount, turnPlayer) {
    if (this.isEmpty()) {
      return null
    }

    const cardInfo = this.cards.shift()
    const card = new Card(scene, cardBoard, cardInfo, 400 + stackCount * 8, y + stackCount * 8, turnPlayer)
    return card
  }

  isEmpty() {
    if (!this.cards.length) {
      return true
    }
    return false
  }

}

const DuelInfo = {
  turnPlayer: 0,
  player: [
    {
      deck: [],
      attackCards: [],
      diffenceCard: null,
      benchCards: [],
    },
    {
      deck: [],
      attackCards: [],
      diffenceCard: null,
      benchCards: [],
    },
  ],
  scene: null,
  cardBoard: null,
}

const scene = {
  preload() {
    this.load.image('flag', 'assets/flag.png');
    this.load.image('card', 'assets/card.png');
    this.load.image('card_back', 'assets/card_back.png');
    this.load.image('chara', 'assets/chara.png');
    this.load.image('cat', 'assets/cat.png');
    this.load.image('sky', 'assets/sky2.png');
    this.load.image('modal', 'assets/modal.png');
    // this.load.spritesheet('dude',
    //   'assets/dude.png',
    //   { frameWidth: 32, frameHeight: 48 }
    // );

  },
  create() {

    this.add.image(400, 300, 'sky');


    const scene = this;


    const self = this;
    this.deckSprite = this.add.sprite(370, 542, 'card_back').setInteractive();
    this.deckSprite.on('pointerdown', function(pointer) {
      AttackPhase.enter(scene, self.cardBoard, flag, DuelInfo, () => {
      })
    });


    const flag = new Flag(scene, 480, 170)
    this.cardBoard = scene.add.container(0, 300, [])
    DuelInfo.cardBoard = this.cardBoard


    SetupPhase.enter(this, this.cardBoard, DuelInfo, () => {
      //
      console.log('SetupPhase')
    })



    this.scoreText = this.add.text(16, 16, 'ちゃれんじゃ', { fontSize: '32px', fill: '#000' });
  },
  update() {
    //

  },
};

const config = {
  parent: 'app',
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene,
};

window.game = new Phaser.Game(config);
