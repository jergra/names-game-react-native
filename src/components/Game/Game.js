import React, {useState, useEffect} from 'react'
//import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, Alert, Modal, Pressable } from 'react-native';
import {colors, CLEAR, ENTER, colorsToEmoji} from '../../constants'
import Keyboard from '../Keyboard'
import * as Clipboard from 'expo-clipboard'
import { NAMES } from '../../names/namesList'
import { VALID_NAMES } from '../../names/validNames'
import styles from "./Game.styles";
import Animated, {SlideInDown, SlideInLeft, ZoomIn, FlipInEasyY} from 'react-native-reanimated'


const NUMBER_OF_TRIES = 6

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])]
}

const randomChoice = Math.floor(Math.random() * NAMES.length)
//const name = NAMES[randomChoice]

const Game = () => {
  //const [modalVisible, setModalVisible] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true)
  const [name, setName] = useState(NAMES[randomChoice])
  console.log('name:', name)

  const letters = name.split('')
  
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''))
  )
  
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCol, setCurrentCol] = useState(0)
  const [gameState, setGameState] = useState('playing')

  useEffect(() => {
    // function delayModalClose() {
    //     //setModalVisible(false)
    // }
    function delayKeyboard() {
        setShowKeyboard(true)
    }
    if (currentRow > 0) {
      //setTimeout(delayModalClose, 100);
      setTimeout(delayKeyboard, 50);
      checkIfValid()
    }
  }, [currentRow])

  const checkIfValid = () => {
    const row = rows[currentRow - 1].join('')
    //console.log('row in checkIfValid:', row)
    if (!VALID_NAMES.includes(row)) {
      console.log(row, 'is not a valid name')
      rows.splice(currentRow - 1, 1, Array(letters.length).fill('') )
      setRows(rows)
      setCurrentRow(currentRow - 1)
      setCurrentCol(0)
      Alert.alert(row.toUpperCase(), 'is not a valid name')
      return
      
    } else {
      console.log(row, 'is a valid name')
      setCurrentCol(0)
      checkGameState()
      return
    }
  }

  const checkGameState = () => {
    if (checkIfWon() && gameState !== 'won') {
      Alert.alert('Hurray!', 'You won!', [
        {text: 'Play Again', onPress: restart},
        {text: 'Share', onPress: shareScore}
      ])
      setGameState('won')
    } else if (checkIfLost() && gameState !== 'lost') {
      Alert.alert(name.toUpperCase(), '', [
        {text: 'Play Again', onPress: restart},
        {text: 'Share', onPress: shareScore}
      ])
      setGameState('lost')
    }
  }

  const checkIfWon = () => {
    const row = rows[currentRow - 1]
    return row.every((letter, i) => letter === letters[i])
  }

  const checkIfLost = () => {
    return !checkIfWon() && currentRow === rows.length
  }

  const shareScore = () => {
    const textMap = rows
      .map((row, i) => 
        row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join('')
      )
      .filter((row) => row)
      .join('\n')
    const textToShare = `Names Game \n ${textMap}`
    Clipboard.setString(textToShare)
    Alert.alert('Copied successfully', 'Share your score on your social media', [
      {text: 'Play Again', onPress: restart}
    ])
  }

  const restart = () => {
    const choice = Math.floor(Math.random() * NAMES.length)
    setName(NAMES[choice])
    setRows(
      new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''))
    )
    setCurrentRow(0)
    setCurrentCol(0)
    setGameState('playing')
  }

  const onKeyPressed = (key) => {
    if (gameState !== 'playing') {
      return
    }
    const updatedRows = copyArray(rows)

    if (key === CLEAR) {
      const previousCol = currentCol - 1
      if (previousCol >= 0) {
        updatedRows[currentRow][previousCol] = ''
        setRows(updatedRows)
        setCurrentCol(previousCol)
      }
      return
    }

    // function delayIncrement() {
    //   if (currentCol === rows[0].length) {
    //     setCurrentRow(currentRow + 1)
    //   }  
    //   return
    // }

    if (key === ENTER) {
      //setModalVisible(true)
      setShowKeyboard(false)
      //setTimeout(delayIncrement, 50);
      if (currentCol === rows[0].length) {
        setCurrentRow(currentRow + 1)
      }  
      return
    }
    
    if (currentCol < rows[0].length) {
      updatedRows[currentRow][currentCol] = key
      setRows(updatedRows)
      setCurrentCol(currentCol + 1)
    }

    return
  }

  const isCellActive = (row, col) => {
    return row === currentRow && col === currentCol
  }

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col]

    if (row >= currentRow) {
      return colors.black
    }
    if (letter === letters[col]) {
      return colors.primary
    }
    if (letters.includes(letter)) {
      return colors.secondary
    }
    return colors.darkgrey
  }

  const getAllLettersWithColor = color => {
    return rows.flatMap((row, i) => 
      row.filter((cell, j) => getCellBGColor(i, j) === color))
  }

  const greenCaps = getAllLettersWithColor(colors.primary)
  const yellowCaps = getAllLettersWithColor(colors.secondary)
  const greyCaps = getAllLettersWithColor(colors.darkgrey)

  const getCellStyle = (i, j)  => [
  styles.cell, 
    {
      borderColor: isCellActive(i, j) ? colors.grey : colors.darkgrey, 
      backgroundColor: getCellBGColor(i, j)
    }
  ]

  return (
    <>
      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <Animated.View 
            key={`row-${i}`} 
            style={styles.row}
            entering={SlideInLeft.delay(i * 80)} 
          >
            {row.map((letter, j) => (
              <>
                {i < currentRow && (
                  <Animated.View 
                    entering={FlipInEasyY.delay(600 + j * 120)}
                    key={`cell-color-${i}-${j}`}
                    style={getCellStyle(i, j)}
                  >
                    <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                  </Animated.View>
                  )}
                {i === currentRow && !!letter && (
                  <Animated.View 
                    entering={ZoomIn}
                    key={`cell-active-${i}-${j}`}
                    style={getCellStyle(i, j)}
                  >
                    <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                  </Animated.View>
                  )}
                {!letter && (
                  <View 
                    key={`cell-${i}-${j}`}
                    style={getCellStyle(i, j)}
                  >
                    <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                  </View>
                )}
              </>
              
            ))}
          </Animated.View>
        ))}
        
      </ScrollView>
      {
        showKeyboard ? (
          <Keyboard 
            onKeyPressed={onKeyPressed} 
            greenCaps={greenCaps} 
            yellowCaps={yellowCaps} 
            greyCaps={greyCaps} 
          />
        ) : (
          <View></View>
        )
      }
      
      
      {/* <View style={styles.centeredView}>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}></Text>
            </View>
          </View>
        </Modal>
      </View>  */}
    </>
  );
}


export default Game
