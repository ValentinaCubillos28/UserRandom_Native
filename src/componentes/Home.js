import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

const Home = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('all');

  useEffect(() => {
    const obtenerDatos = async () => {
      setLoading(true);
      const url = tipoSeleccionado === 'all'
        ? 'https://randomuser.me/api/?results=20'
        : `https://randomuser.me/api/?results=20&gender=${tipoSeleccionado}`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        const datosAdaptados = json.results.map((item) => ({
          id: item.login.uuid,
          name: `${item.name.first} ${item.name.last}`,
          email: item.email,
          telefono: item.phone,
          foto: item.picture.large,
          gender: item.gender
        }));
        setData(datosAdaptados);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, [tipoSeleccionado]);

  let resultados = data;

  if (busqueda.length >= 3 && isNaN(busqueda)) {
    resultados = data.filter(perfil =>
      perfil.name.toLowerCase().includes(busqueda.toLowerCase())
    );
  }

  if (!isNaN(busqueda)) {
    resultados = data.filter(perfil =>
      perfil.id.includes(busqueda)
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TextInput
          style={styles.buscador}
          placeholder="Buscar"
          placeholderTextColor="#aaa"
          value={busqueda}
          onChangeText={setBusqueda}
        />

        <ScrollView contentContainerStyle={styles.perfilesContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#bf35f1" />
          ) : (
            resultados.map((perfil, index) => (
              <TouchableOpacity
                key={index}
                style={styles.perfilCard}
                onPress={() => navigation.navigate('Perfil', { user: perfil })}
              >
                <Image source={{ uri: perfil.foto }} style={styles.perfilImagen} />
                <Text style={styles.perfilNombre}>{perfil.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Menú fijo abajo */}
      <View style={styles.menu}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={[styles.menuItem, styles.menuItemActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Explorar')}>
          <Text style={styles.menuItem}>Explorar</Text>
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
};

export default Home;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 16,
    paddingBottom: 80, // para que no tape el menu fijo
  },
  buscador: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    borderRadius: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
    elevation: 3,
  },
  perfilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  perfilCard: {
    width: 140,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    margin: 8,
    elevation: 4,
  },
  perfilImagen: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#bf35f1',
    marginBottom: 10,
  },
  perfilNombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
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
    color: '#bf35f1',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});