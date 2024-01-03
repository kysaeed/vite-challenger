
/**
 * Phaser3
 *  https://newdocs.phaser.io/docs/3.70.0/gameobjects
 */
import Phaser from 'phaser'
import _ from 'lodash'



/**
 * https://bodoge.hoobby.net/games/challengers/strategies/41250
 */
const deckCards = [
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
}


let y = 400
let enemyY = 180


class Card {
  constructor(scene, cardInfo, x, y) {
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
          y: y - 40,
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
  enter(scene, DuelInfo, onEnd) {
    const turnPlayer = DuelInfo.turnPlayer
    const player = DuelInfo.player[1 - turnPlayer]

    let diffenceCardInfo = player.deck.shift()
    const card = new Card(scene, diffenceCardInfo, 400, enemyY)
    const diffenceCardSprite = card.card
    diffenceCardSprite.angle = 180 * (1 - turnPlayer)

    player.diffenceCard = card

    card.enterTo(400, enemyY)

    onEnd();
  },
}

const MainPhase = {
  enter(scene, DuelInfo, onEnd) {
    onEnd();
  },
}


const scene = {
  preload() {
    this.load.image('flag', 'assets/flag.png');
    this.load.image('card', 'assets/card.png');
    this.load.image('card_back', 'assets/card_back.png');
    this.load.image('chara', 'assets/chara.png');
    this.load.image('cat', 'assets/cat.png');
    this.load.image('sky', 'assets/sky.png');
    this.load.spritesheet('dude',
      'assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
    );

  },
  create() {

    DuelInfo.player.forEach((player) => {
      deckCards.forEach((c) => {
        player.deck.push(c)
      })
      player.deck = _.shuffle(player.deck)
    })


    this.add.image(400, 300, 'sky');


    const scene = this;

    const flag = new Flag(scene, 520, 170)


    const Center = 290 ;
    let direction = 1

    const setTurnPlayer = (player) => {
      DuelInfo.turnPlayer = player
      if (player == 0) {
        y = 400
        enemyY = 180
      } else {
        y = 180
        enemyY = 400
      }
    }


    SetupPhase.enter(this, DuelInfo, () => {
      //
      console.log('SetupPhase')
    })

    this.deckSprite = this.add.sprite(370, 542, 'card_back').setInteractive();
    this.deckSprite.on('pointerdown', function(pointer) {
      const turnPlayer = DuelInfo.turnPlayer
      const enemyCard = DuelInfo.player[1 - turnPlayer].diffenceCard

      const cardInfo = DuelInfo.player[turnPlayer].deck.shift();
      if (cardInfo) {

        const stackCount = DuelInfo.player[turnPlayer].attackCards.length
        const slide = stackCount * 10

        const cc = new Card(scene, cardInfo, 400 + stackCount * 8, y + stackCount * 8)
        DuelInfo.player[turnPlayer].attackCards.push(cc)

        cc.card.angle = 180 * (turnPlayer)

        scene.tweens.chain({
          targets: cc.card,
          tweens: [
            {
              angle: '+=9',
              // angle: 180 * (turnPlayer) + 9,
              y: 100,
              scale: 1.0,
              duration: 100,
              ease: 'power1',
            },
            {
              // angle: 180 * (turnPlayer) + 9,
              scale: 1.2,
              y: 400,
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
          },
        })


        let total = 0
        DuelInfo.player[turnPlayer].attackCards.forEach((c) => {
            total += c.cardInfo.p
        })


        if (total >= enemyCard.cardInfo.p) {
          enemyCard.damaged(() => {
            console.log('かった！', DuelInfo.player[turnPlayer].attackCards)
            DuelInfo.player[turnPlayer].diffenceCard = DuelInfo.player[turnPlayer].attackCards.pop()
            //DuelInfo.player[turnPlayer].attackCards = []
            flag.moveTo(520, 170 + (200 * (1 - turnPlayer)))

            const getBenchY = (benchIndex, turnPlayers) => {
              if (turnPlayers == 0) {
                return 500 - (benchIndex * 80)
              }
              return (90 + (benchIndex * 80));
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

            setTurnPlayer(1 - turnPlayer)
          })
        }
      }

    });


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

var game = new Phaser.Game(config);
