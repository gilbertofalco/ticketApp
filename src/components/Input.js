import { TextInput, StyleSheet } from "react-native";

export default function Input(props) {
  return <TextInput style={styles.input}
                    placeholder={props.placeholder}
                    onChangeText={props.onChangeText}
                    secureTextEntry={props.secureTextEntry}
                    value={props.value}
                    />;
}

const styles = StyleSheet.create({
    input: {
        marginVertical: 4,
        height:50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor:'#fff',
    }
})
