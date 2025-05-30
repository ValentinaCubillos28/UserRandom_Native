import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function Explorar({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch('https://randomuser.me/api/?results=10');
        const data = await res.json();
        setUsuarios(data.results);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la lista de usuarios');
        console.error('Error al traer usuarios:', error);
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  function handleHablar(usuario) {
    navigation.navigate('Contactos', { usuario });
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#bf68f9" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Explora Personas</Text>
        <Text style={styles.subtitle}>¿Con cuál de estos te gustaría hablar?</Text>
        <View style={styles.usuariosLista}>
          {usuarios.map((u, i) => (
            <View key={i} style={styles.usuarioCard}>
              <Image source={{ uri: u.picture.medium }} style={styles.usuarioImg} />
              <Text style={styles.usuarioNombre}>{u.name.first} {u.name.last}</Text>
              <TouchableOpacity style={styles.hablarBtn} onPress={() => handleHablar(u)}>
                <Text style={styles.hablarBtnTexto}>Hablar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Menú fijo abajo */}
      <View style={styles.menu}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.menuItem}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Explorar')}>
          <Text style={[styles.menuItem, styles.menuItemActive]}>Explorar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Contactos')}>
          <Text style={styles.menuItem}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Favoritos')}>
          <Text style={styles.menuItem}>Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
          <Text style={styles.menuItem}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 16,
    paddingBottom: 80, // espacio para que no tape el menú
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
  },
  usuariosLista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  usuarioCard: {
    backgroundColor: 'rgba(194, 136, 219, 0.15)',
    borderColor: '#bf68f9',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 6,
    width: 150,
    alignItems: 'center',
  },
  usuarioImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  usuarioNombre: {
    fontSize: 16,
    marginBottom: 8,
  },
  hablarBtn: {
    backgroundColor: '#bf68f9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  hablarBtnTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  menu: {
    height: 60,
    backgroundColor: '#e9d8fd',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  menuItem: {
    color: '#2d2d2d',
    fontWeight: '600',
    fontSize: 14,
  },
  menuItemActive: {
    color: '#bf68f9',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});