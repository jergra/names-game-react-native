import { StyleSheet, Dimensions } from 'react-native';
import {colors} from '../../constants'

export default StyleSheet.create({
    map: {
        alignSelf: 'stretch',
        marginVertical: 20
    },
    row: {
        alignSelf: 'stretch', 
        flexDirection: 'row',
        justifyContent: 'center'
    },
    cell: {
        borderWidth: 3,
        borderColor: colors.darkgrey,
        aspectRatio: 1,
        flex: 1, 
        margin: 3,
        maxWidth: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellText: {
        color: colors.lightgrey,
        fontWeight: 'bold',
        fontSize: 28
    },



    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    
    modalView: {
        width: 400,
        height: 650,
        marginTop: 40,
        backgroundColor: colors.black,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        // shadowColor: "#000",
        // shadowOffset: {
        //   width: 0,
        //   height: 2
        // },
        //shadowOpacity: 0.25,
        //shadowRadius: 4,
        //elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
        marginBottom: 40
    },
    buttonClose: {
        //backgroundColor: "#2196F3",
    },
    textStyle: {
        //color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});