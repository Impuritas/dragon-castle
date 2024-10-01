enum ActionKind {
    Walking,
    Idle,
    Jumping
}
namespace SpriteKind {
    export const Ally = SpriteKind.create()
    export const SpecialEnemy = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Power.value >= 3) {
        Power.value += -3
        mySprite.setVelocity(0, -50)
        pause(1000)
        mySprite.setVelocity(0, 0)
        pause(200)
        mySprite.setVelocity(0, 100)
        pause(500)
        mySprite.setVelocity(0, 0)
        mySprite.setPosition(80, 90)
        scene.cameraShake(2, 200)
        for (let value of Enemy_List) {
            if (EnemyOrientation[Enemy_List.indexOf(value)] == 0) {
                value.x += 3
            } else {
                value.x += -3
            }
        }
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Skill1) {
        if (Power.value >= 3) {
            Power.value += -3
            if (Orientation == 0) {
                Flame = sprites.create(assets.image`Flame - Right`, SpriteKind.Projectile)
                Skill1 = false
                Flame.setPosition(mySprite.x + 20, mySprite.y - 2)
                Flame.setVelocity(20, 0)
                timer.debounce("action", 1500, function () {
                    if (!(Skill1)) {
                        sprites.destroy(Flame, effects.fire, 100)
                    }
                })
            } else {
                Flame = sprites.create(assets.image`Flame - Left`, SpriteKind.Projectile)
                Skill1 = false
                Flame.setPosition(mySprite.x - 20, mySprite.y - 2)
                Flame.setVelocity(-20, 0)
                timer.debounce("action", 1500, function () {
                    if (!(Skill1)) {
                        sprites.destroy(Flame, effects.fire, 100)
                    }
                })
            }
        }
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(Summon)) {
        if (Power.value >= 25) {
            scene.setBackgroundImage(assets.image`Castle - Open`)
            Summon = true
            music.play(music.createSoundEffect(WaveShape.Square, 200, 1, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.UntilDone)
        }
    } else {
        scene.setBackgroundImage(assets.image`Castle - Closed`)
        Summon = false
        music.play(music.createSoundEffect(WaveShape.Square, 200, 1, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.UntilDone)
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Orientation == 0) {
        Orientation = 1
        mySprite.setImage(assets.image`The Dragon - Left`)
        music.play(music.createSoundEffect(WaveShape.Square, 400, 600, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    }
})
info.onCountdownEnd(function () {
    Skill2 = true
})
sprites.onDestroyed(SpriteKind.Ally, function (sprite) {
    AllyAlive = false
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Orientation == 1) {
        Orientation = 0
        mySprite.setImage(assets.image`The Dragon - Right`)
        music.play(music.createSoundEffect(WaveShape.Square, 400, 600, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Skill2) {
        if (Power.value >= 20) {
            if (Enemy_List.length / 3 <= 10) {
                Power.value += Math.round(Enemy_List.length / 5)
            } else {
                Power.value += 10
            }
            scene.cameraShake(5, 500)
            SpEnemyHP.value += -1
            if (SpEnemyOrientation == 0) {
                SpEnemy.setVelocity(-20, 0)
            } else {
                SpEnemy.setVelocity(20, 0)
            }
            for (let value of Enemy_List) {
                animation.stopAnimation(animation.AnimationTypes.All, value)
                value.setVelocity(0, 0)
                EnemyHP_List[Enemy_List.indexOf(value)].value += -1
                if (EnemyOrientation[Enemy_List.indexOf(value)] == 0) {
                    value.x += 5
                } else {
                    value.x += -5
                }
                timer.after(1500, function () {
                    if (EnemyOrientation[Enemy_List.indexOf(value)] == 0) {
                        value.setVelocity(randint(-3, -1), 0)
                        animation.runImageAnimation(
                        value,
                        assets.animation`EnemyRight - Walk`,
                        500,
                        true
                        )
                    } else {
                        value.setVelocity(randint(1, 3), 0)
                        animation.runImageAnimation(
                        value,
                        assets.animation`EnemyLeft - Walk`,
                        500,
                        true
                        )
                    }
                })
            }
            Power.value += -20
            Skill2 = false
            info.startCountdown(12)
        }
    }
})
info.onLifeZero(function () {
    game.gameOver(false)
})
sprites.onDestroyed(SpriteKind.Enemy, function (sprite) {
    Power.value += EnemyValue
    info.changeScoreBy(15)
})
sprites.onDestroyed(SpriteKind.Projectile, function (sprite) {
    Skill1 = true
})
let EnemyBar: StatusBarSprite = null
let AllyAttacked = false
let AllyAlive = false
let Skill2 = false
let Skill1 = false
let EnemyValue = 0
let SpEnemyOrientation = 0
let EnemyHP_List: StatusBarSprite[] = []
let EnemyOrientation: number[] = []
let Enemy_List: Sprite[] = []
let Power: StatusBarSprite = null
let Orientation = 0
let Summon = false
let SpEnemyHP: StatusBarSprite = null
let SpEnemy: Sprite = null
let mySprite: Sprite = null
let Flame: Sprite = null
scene.setBackgroundImage(assets.image`Castle - Closed`)
Flame = sprites.create(assets.image`Flame - Right`, SpriteKind.Projectile)
mySprite = sprites.create(assets.image`The Dragon - Right`, SpriteKind.Player)
SpEnemy = sprites.create(assets.image`SpEnemy`, SpriteKind.SpecialEnemy)
let MyAlly = sprites.create(assets.image`Ally`, SpriteKind.Ally)
SpEnemyHP = statusbars.create(20, 4, StatusBarKind.EnemyHealth)
let Warning = textsprite.create(" Warning ", 1, 2)
SpEnemyHP.attachToSprite(SpEnemy)
sprites.destroy(Flame)
sprites.destroy(Warning)
sprites.destroy(SpEnemy)
sprites.destroy(MyAlly)
mySprite.setPosition(80, 90)
Summon = false
Orientation = 0
info.setScore(0)
info.setLife(10)
Power = statusbars.create(30, 6, StatusBarKind.Energy)
Power.max = 100
Power.value = 10
Power.attachToSprite(mySprite)
let EnemyState: boolean[] = []
Enemy_List = []
EnemyOrientation = []
EnemyHP_List = statusbars.allOfKind(StatusBarKind.EnemyHealth)
let Difficulty = 2500
let SpEnemy_Possibility = 0
SpEnemyOrientation = 0
let EnemyHP = 3
let EnemyMinSpeed = 3
let EnemyMaxSpeed = 6
EnemyValue = 5
Skill1 = true
Skill2 = true
AllyAlive = false
let SpEnemyState = false
let DealtDamage = false
game.onUpdate(function () {
    for (let value of Enemy_List) {
        if (value.x < 0 || value.x > 160) {
            sprites.destroy(value)
        } else if (EnemyHP_List[Enemy_List.indexOf(value)].value <= 0) {
            sprites.destroy(value, effects.ashes, 200)
        } else if (value.overlapsWith(Flame)) {
            sprites.destroy(Flame, effects.fire, 200)
            EnemyHP_List[Enemy_List.indexOf(value)].value += -2
        } else if (value.overlapsWith(MyAlly)) {
            if (!(AllyAttacked)) {
                animation.runImageAnimation(
                MyAlly,
                assets.animation`AllyAttack`,
                100,
                false
                )
                AllyAttacked = true
                timer.after(400, function () {
                    EnemyHP_List[Enemy_List.indexOf(value)].value += -3
                    sprites.destroy(MyAlly)
                })
            }
        } else if (value.overlapsWith(mySprite)) {
            if (EnemyState[Enemy_List.indexOf(value)] == false) {
                if (EnemyOrientation[Enemy_List.indexOf(value)] == 0) {
                    value.setVelocity(0, 0)
                    EnemyState[Enemy_List.indexOf(value)] = true
                    animation.runImageAnimation(
                    value,
                    assets.animation`EnemyRight - Attack`,
                    200,
                    false
                    )
                    timer.after(1000, function () {
                        EnemyState[Enemy_List.indexOf(value)] = false
                        info.changeLifeBy(-1)
                        if (value.overlapsWith(mySprite) == false) {
                            value.x += -9
                        }
                    })
                } else {
                    value.setVelocity(0, 0)
                    EnemyState[Enemy_List.indexOf(value)] = true
                    animation.runImageAnimation(
                    value,
                    assets.animation`EnemyLeft - Attack`,
                    200,
                    false
                    )
                    timer.after(1000, function () {
                        EnemyState[Enemy_List.indexOf(value)] = false
                        info.changeLifeBy(-1)
                        if (value.overlapsWith(mySprite) == false) {
                            value.x += 2
                        }
                    })
                }
            }
        }
    }
})
game.onUpdate(function () {
    if (SpEnemy.x < 0 || SpEnemy.x > 160) {
        sprites.destroy(SpEnemy)
        SpEnemyState = false
        DealtDamage = false
    } else if (SpEnemyHP.value <= 0) {
        sprites.destroy(SpEnemy, effects.ashes, 300)
        if (SpEnemyState) {
            info.changeScoreBy(25)
            Power.value += 8
        }
        SpEnemyState = false
        DealtDamage = false
    } else if (SpEnemy.overlapsWith(Flame)) {
        sprites.destroy(Flame, effects.fire, 200)
        SpEnemyHP.value += -2
    } else if (SpEnemy.overlapsWith(mySprite)) {
        if (!(DealtDamage)) {
            DealtDamage = true
            music.play(music.createSoundEffect(WaveShape.Square, 1600, 1, 255, 0, 300, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.UntilDone)
            info.changeLifeBy(-2)
        }
    }
})
game.onUpdate(function () {
    if (Summon) {
        if (!(AllyAlive)) {
            AllyAlive = true
            AllyAttacked = false
            timer.after(200, function () {
                MyAlly = sprites.create(assets.image`Ally`, SpriteKind.Ally)
                MyAlly.setPosition(45, 68)
                MyAlly.setVelocity(25, -25)
                animation.runImageAnimation(
                MyAlly,
                assets.animation`AllyMove - Right`,
                150,
                true
                )
                timer.after(1500, function () {
                    MyAlly.setVelocity(0, 0)
                    timer.after(150, function () {
                        MyAlly.follow(Enemy_List[0], 75)
                        if (EnemyOrientation[0] == 1) {
                            animation.runImageAnimation(
                            MyAlly,
                            assets.animation`AllyMove - Left`,
                            150,
                            true
                            )
                        }
                    })
                })
            })
        }
    } else if (AllyAlive) {
        timer.after(200, function () {
            sprites.destroy(MyAlly, effects.blizzard, 100)
        })
    }
})
game.onUpdate(function () {
    if (Summon) {
        if (Power.value < 15) {
            Summon = false
            scene.setBackgroundImage(assets.image`Castle - Closed`)
            music.play(music.createSoundEffect(WaveShape.Square, 200, 1, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.UntilDone)
        }
    }
})
game.onUpdateInterval(2000, function () {
    if (!(SpEnemyState)) {
        if (Math.percentChance(SpEnemy_Possibility)) {
            SpEnemyState = true
            Warning = textsprite.create(" Warning! ", 1, 2)
            if (Math.percentChance(50)) {
                Warning.setPosition(130, 75)
                SpEnemyOrientation = 0
                timer.after(500, function () {
                    sprites.destroy(Warning)
                    SpEnemy = sprites.create(assets.image`SpEnemy`, SpriteKind.SpecialEnemy)
                    SpEnemyHP = statusbars.create(20, 4, StatusBarKind.EnemyHealth)
                    SpEnemyHP.max = 6
                    SpEnemyHP.attachToSprite(SpEnemy)
                    SpEnemy.setPosition(160, 95)
                    SpEnemy.setVelocity(-50, 0)
                    animation.runImageAnimation(
                    SpEnemy,
                    assets.animation`SpEnemyRight`,
                    200,
                    true
                    )
                })
            } else {
                Warning.setPosition(30, 75)
                SpEnemyOrientation = 1
                timer.after(500, function () {
                    sprites.destroy(Warning)
                    SpEnemy = sprites.create(assets.image`SpEnemy`, SpriteKind.SpecialEnemy)
                    SpEnemyHP = statusbars.create(20, 4, StatusBarKind.EnemyHealth)
                    SpEnemyHP.max = 6
                    SpEnemyHP.attachToSprite(SpEnemy)
                    SpEnemy.setPosition(0, 95)
                    SpEnemy.setVelocity(50, 0)
                    animation.runImageAnimation(
                    SpEnemy,
                    assets.animation`SpEnemyLeft`,
                    200,
                    true
                    )
                })
            }
        }
    }
})
game.onUpdateInterval(1000, function () {
    if (Summon) {
        Power.value += -2
    }
})
game.onUpdateInterval(1000, function () {
    if (game.runtime() >= 15000) {
        if (game.runtime() > 15000 && game.runtime() < 30000) {
            Difficulty = 2000
        } else if (game.runtime() > 30000 && game.runtime() < 45000) {
            Difficulty = 1500
            SpEnemy_Possibility = 10
        } else if (game.runtime() > 45000 && game.runtime() < 60000) {
            Difficulty = 1000
        } else {
            if (!(EnemyHP == 4)) {
                EnemyHP = 4
                EnemyMinSpeed = 4
                EnemyMaxSpeed = 7
                SpEnemy_Possibility = 20
                EnemyValue = 6
            }
            if (Math.percentChance(5)) {
                Difficulty += -100
                SpEnemy_Possibility += 1
                if (Math.percentChance(50)) {
                    if (Math.percentChance(50)) {
                        EnemyMinSpeed += 0.5
                    } else {
                        EnemyMaxSpeed += 0.5
                    }
                }
            }
        }
    }
})
game.onUpdateInterval(1000, function () {
    Power.value += 1
})
game.onUpdateInterval(Difficulty, function () {
    if (Math.percentChance(50)) {
        Enemy_List.unshift(sprites.create(assets.image`EnemyRight`, SpriteKind.Enemy))
        EnemyState.unshift(false)
        EnemyOrientation.unshift(0)
        EnemyBar = statusbars.create(15, 2, StatusBarKind.EnemyHealth)
        EnemyBar.max = EnemyHP
        EnemyBar.attachToSprite(Enemy_List[0])
        EnemyHP_List.unshift(EnemyBar)
        Enemy_List[0].setPosition(160, 95)
        Enemy_List[0].setVelocity(randint(EnemyMinSpeed * -1, EnemyMaxSpeed * -1), 0)
        animation.runImageAnimation(
        Enemy_List[0],
        assets.animation`EnemyRight - Walk`,
        500,
        true
        )
    } else {
        Enemy_List.unshift(sprites.create(assets.image`EnemyLeft`, SpriteKind.Enemy))
        EnemyState.unshift(false)
        EnemyOrientation.unshift(1)
        EnemyBar = statusbars.create(15, 2, StatusBarKind.EnemyHealth)
        EnemyBar.max = EnemyHP
        EnemyBar.attachToSprite(Enemy_List[0])
        EnemyHP_List.unshift(EnemyBar)
        Enemy_List[0].setPosition(0, 95)
        Enemy_List[0].setVelocity(randint(EnemyMinSpeed, EnemyMaxSpeed), 0)
        animation.runImageAnimation(
        Enemy_List[0],
        assets.animation`EnemyLeft - Walk`,
        500,
        true
        )
    }
})
