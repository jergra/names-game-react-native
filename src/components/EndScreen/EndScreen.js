import { View, Text, StyleSheet, Pressable, NativeModules } from 'react-native'
import React, {useState, useEffect} from 'react'
import {colors} from '../../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Game from '../Game/Game';
  
const Number = ({number, label}) => (
    <View style={{alignItems: 'center', margin: 10}}>
        <Text style={{color: colors.lightgrey, fontSize: 30, fontWeight: 'bold'}}>{number}</Text>
        <Text style={{color: colors.lightgrey, fontSize: 16}}>{label}</Text>
    </View>
)
const GuessDistributionLine = ({position, amount, percentage}) => (
    <View 
        style={{
            flexDirection: 'row', 
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: "100%"
        }}
    >
        <Text 
            style={{
                color: colors.lightgrey,
                marginRight: 3
            }}
        >
            {position}
        </Text>
        <View 
            style={{
                alignSelf: 'stretch',
                backgroundColor: colors.grey, 
                margin: 5, 
                padding: 5,
                width: `${percentage}%`
            }}
        >
            <Text 
                style={{
                color: colors.lightgrey,
                marginLeft: 'auto',
                marginRight: 3
                }}
            >
                {amount}
            </Text>
        </View>
        
    </View>
)

const GuessDistribution = ({guessesInfo}) => {

    //console.log('guessesInfo in GuessDistribution:', guessesInfo)
    
    const getWidth = (guessLine) => {
        if (7 + guessLine * 5 > 100) {
            return 100
        }
        return 7 + guessLine * 2
    }

    return (
        <>
            <Text style={styles.subtitle}>
                GUESS DISTRIBUTION
            </Text>
            <View style={{width: '100%', padding: 20}}>
                {
                    guessesInfo.map((guessLine, index) => (
                        <>
                            <View
                                key={`guessLine-${index}`}
                            >
                                <GuessDistributionLine 
                                    position={index + 1} 
                                    amount={guessLine} 
                                    percentage={getWidth(guessLine)} 
                                />
                            </View>
                        </>
                    ))
                }
            </View>
        </>
    )
}


const EndScreen = ({won = false, name, currentRow}) => {

    // console.log('won in EndScreen:', won)
    // console.log('name in EndScreen:', name)
    // console.log('currentRow in EndScreen:', currentRow)
    
    const [totalPlayed, setTotalPlayed] = useState(0)
    const [totalWins, setTotalWins] = useState(0)
    const [winRate, setWinRate] = useState(0)
    const [currentStreak, setCurrentStreak] = useState(0)
    const [maxStreak, setMaxStreak] = useState(0)
    const [gameState, setGameState] = useState('won')
    const [guessesInfo, setGuessesInfo] = useState([0,0,0,0,0,0])

    useEffect(() => {
        readState()
    }, [])

    function share() {

    }

    const readState = async () => {
        const dataString = await AsyncStorage.getItem('UID8765')
        // console.log('dataString UID8765:', dataString);
        // console.log('JSON.parse(dataString):', JSON.parse(dataString))
        const data = JSON.parse(dataString)
        //console.log('data:', data)
           
        if (dataString === null && won === true) {
            guessesInfo.splice(currentRow - 1, 1, 1)
            setGuessesInfo(guessesInfo)
            let UID8765_object = {games: [[true, currentRow, 1]]}
            AsyncStorage.setItem('UID8765', JSON.stringify(UID8765_object))
            setTotalPlayed(1)
            setTotalWins(1)
            setWinRate(100)
            setCurrentStreak(1)
            setMaxStreak(1)
        }
        if (dataString === null && won === false) {
            let UID8765_object = {games: [[false, currentRow, 0]]}
            AsyncStorage.setItem('UID8765', JSON.stringify(UID8765_object))
            setTotalPlayed(1)
        }
        
        if (dataString !== null) {
            const gamesArray = data.games
            // console.log('gamesArray:', gamesArray)
            // console.log('gamesArray.length:', gamesArray.length)
         
            if (won === false) {
                const distribution = []
                for (let i = 1; i < 7; i++) {
                    const total = 0
                    for (let j = 0; j < gamesArray.length; j++) {
                        if (gamesArray[j][1] === i) {
                            total++
                        }
                    }
                    distribution.push(total)
                    //console.log('distribution:', distribution)
                }
                setGuessesInfo(distribution)

                setTotalPlayed(gamesArray.length + 1)
                let wins = 0
                for (let i = 0; i < gamesArray.length; i++) {
                    if (gamesArray[i][0] === true) {
                        wins++
                    }
                    setTotalWins(wins)
                    setWinRate((((wins)/(gamesArray.length + 1)) * 100).toFixed(0))
                }
                let previousMaxStreak = gamesArray[gamesArray.length - 1][2]
                setMaxStreak(previousMaxStreak)
                gamesArray.push([false, 7, previousMaxStreak])
                let UID8765_object = {games: gamesArray}
                AsyncStorage.setItem('UID8765', JSON.stringify(UID8765_object))
                setCurrentStreak(0)
            }

            if (won === true) {
                const distribution = []
                for (let i = 1; i < 7; i++) {
                    const total = 0
                    for (let j = 0; j < gamesArray.length; j++) {
                        if (gamesArray[j][1] === i) {
                            total++
                        }
                    }
                    distribution.push(total)
                    if (i === currentRow) {
                        var lastValue = distribution.pop()
                        distribution.push(++lastValue)
                    }
                }
                setGuessesInfo(distribution)
                
                setTotalPlayed(gamesArray.length + 1)
                let wins = 0
                for (let i = 0; i < gamesArray.length; i++) {
                    if (gamesArray[i][0] === true) {
                        wins++
                    }
                    setTotalWins(wins + 1)
                    setWinRate((((wins + 1)/(gamesArray.length + 1)) * 100).toFixed(0))
                }
                
                let streak = 0
                for (let i = gamesArray.length - 1; i > -1; i--) {
                    if (gamesArray[i][0] === true) {
                        streak++
                    }
                    if (gamesArray[i][0] === false) {
                        setCurrentStreak(streak + 1)
                        break
                    }
                    if (i === 0) {
                        setCurrentStreak(gamesArray.length + 1)
                    }
                }

                let previousMaxStreak = gamesArray[gamesArray.length - 1][2]
                let currentMaxStreak = 0
                for (let i = gamesArray.length - 1; i > -1; i--) {
                    if (gamesArray[i][0] === true) {
                        currentMaxStreak++
                    }
                    if (gamesArray[i][0] === false) {
                        if (currentMaxStreak === previousMaxStreak) {
                            setMaxStreak(previousMaxStreak + 1)
                            gamesArray.push([true, currentRow, previousMaxStreak + 1])
                            let UID8765_object = {games: gamesArray}
                            AsyncStorage.setItem('UID8765', JSON.stringify(UID8765_object))
                            break
                        } else {
                            setMaxStreak(previousMaxStreak)
                            gamesArray.push([true, currentRow, previousMaxStreak])
                            let UID8765_object = {games: gamesArray}
                            AsyncStorage.setItem('UID8765', JSON.stringify(UID8765_object))
                            break
                        }
                    }
                    if (i === 0) {
                        setMaxStreak(currentMaxStreak + 1)
                        gamesArray.push([true, currentRow, currentMaxStreak + 1])
                        let UID8765_object = {games: gamesArray}
                        AsyncStorage.setItem('UID8765', JSON.stringify(UID8765_object))
                    }
                }
            }
        }
    }

    const restart = () => {
        setGameState('playing')
    }

    if (gameState === 'playing') {
        return (<Game playing={gameState === 'playing'} />)
    }
    

  return (
    <View style={{width: '100%', alignItems: 'center'}}>
      <Text style={styles.title}>
          {won ? 'Congrats!' : 'You lost.'}
      </Text>
      <Text style={styles.title}>
          {!won ? `The name was ${name.toUpperCase()}.` : ''}
      </Text>
      <Text style={styles.subtitle}>STATISTICS</Text>
      <View style={{flexDirection: 'row'}}>
        <Number number={totalPlayed} label={'Played'} />
        <Number number={winRate} label={'Win %'} />
        <Number number={currentStreak} label={'Current'} />
        <Number number={maxStreak} label={'Max'} />
      </View>
      <View style={{flexDirection: 'row', marginTop: -62, marginBottom: 20}}>
        <Number number={''} label={'              '} />
        <Number number={''} label={'              '} />
        <Number number={''} label={'  Streak'} />
        <Number number={''} label={'Streak'} />
      </View>
      
      <GuessDistribution guessesInfo={guessesInfo} currentRow={currentRow} />

      <View style={{flexDirection: 'row', padding: 10, }}>
          {/* <View style={{alignItems: 'center', flex: 1}}>
              <Text style={{color: colors.lightgrey}}>Next Names Game</Text>
              <Text style={{color: colors.lightgrey, fontSize: 24, fontWeight: 'bold'}}>10:35:00</Text>
          </View> */}
          <Pressable 
            onPress={restart} 
            style={{
                backgroundColor: colors.primary, 
                borderRadius: 25, 
                alignItems: 'center',
                justifyContent: 'center', 
                width: '30%',
                padding: 10,
                marginRight: 50
            }}
        >
              <Text style={{color: colors.lightgrey, fontWeight: 'bold'}}>Play Again</Text>
          </Pressable>
          <Pressable 
            onPress={share} 
            style={{
                backgroundColor: colors.primary, 
                borderRadius: 25, 
                alignItems: 'center',
                justifyContent: 'center', 
                width: '30%',
                padding: 10
            }}
        >
              <Text style={{color: colors.lightgrey, fontWeight: 'bold'}}>Share</Text>
          </Pressable>
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: 'white',
        textAlign: 'center',
        marginVertical: 20,
    },
    subtitle: {
        fontSize: 20,
        color: colors.lightgrey,
        textAlign: 'center',
        fontWeight: 'bold'
    }
})

export default EndScreen