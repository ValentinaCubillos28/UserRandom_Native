import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function ChatScreen({ route, navigation }) {
  const { usuario } = route.params;
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const indexRef = useRef(0);
  const [userAuth, setUserAuth] = useState(null);

  const respuestas = [
    'Hola, ¿cómo estás?',
    'Cuéntame sobre ti...',
    'Interesante, cuéntame más...',
    'Genial, hablemos después',
    'Adiós'
  ];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserAuth(user);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!usuario || !userAuth) return;

    const cargarMensajes = async () => {
      try {
        const chatRef = doc(db, 'chats', `${userAuth.uid}_${usuario.id}`);
        const chatSnap = await getDoc(chatRef);

        if (chatSnap.exists()) {
          setMensajes(chatSnap.data().mensajes || []);
        } else {
          const mensajeInicial = [{ from: 'bot', text: `Hola, soy ${usuario.name.first}. ¿En qué puedo ayudarte?` }];
          setMensajes(mensajeInicial);
          await setDoc(chatRef, { mensajes: mensajeInicial });
        }
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
      }
    };

    cargarMensajes();
  }, [usuario, userAuth]);

  const enviarMensaje = async () => {
    if (!input.trim() || !usuario || !userAuth) return;

    const nuevoMensaje = { from: 'yo', text: input };
    const respuesta = respuestas[indexRef.current];
    indexRef.current = (indexRef.current + 1) % respuestas.length;

    const chatRef = doc(db, 'chats', `${userAuth.uid}_${usuario.id}`);

    try {
      await updateDoc(chatRef, {
        mensajes: arrayUnion(nuevoMensaje, { from: 'bot', text: respuesta })
      });
      setMensajes(prev => [...prev, nuevoMensaje, { from: 'bot', text: respuesta }]);
      setInput('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      Alert.alert('Error', 'No se pudo enviar el mensaje');
    }
  };

  if (!usuario) return <Text style={styles.alert}>No se ha seleccionado ningún usuario. Vuelve a explorar para elegir uno.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Chat con {usuario.name.first}</Text>
      <ScrollView style={styles.chatBox} contentContainerStyle={{ paddingBottom: 100 }}>
        {mensajes.map((m, i) => (
          <View key={i} style={[styles.mensaje, m.from === 'yo' ? styles.mensajeYo : styles.mensajeBot]}>
            <Text style={m.from === 'yo' ? { color: 'white' } : {}}>{m.from === 'yo' ? 'Tú' : usuario.name.first}: {m.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={enviarMensaje}
        />
        <TouchableOpacity style={styles.boton} onPress={enviarMensaje}>
          <Text style={styles.botonTexto}>Enviar</Text>
        </TouchableOpacity>
      </View>

      {/* Menú fijo abajo */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.menuTexto}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Explorar')}>
          <Text style={styles.menuTexto}>Explorar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Perfil')}>
          <Text style={styles.menuTexto}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  chatBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  mensaje: {
    padding: 8,
    borderRadius: 8,
    marginVertical: 4
  },
  mensajeYo: {
    alignSelf: 'flex-end',
    backgroundColor: '#bf68f9',
    color: 'white'
  },
  mensajeBot: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e3e5'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8
  },
  boton: {
    backgroundColor: '#bf68f9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold'
  },
  alert: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#333'
  },
  menu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    elevation: 10,
  },
  menuBtn: {
    padding: 8,
  },
  menuTexto: {
    fontSize: 16,
    color: '#bf68f9',
    fontWeight: 'bold',
  }
});