import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MovieCard from '../components/MovieCard';
import Header from '../components/Header';
import { COLORS } from '../constants/colors';
import { useAppSelector } from '../redux/hooks';
import { MainTabParamList, RootStackParamList, Movie } from '../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Favorites'>,
  NativeStackScreenProps<RootStackParamList>
>;

const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
  const favorites = useAppSelector((state) => state.favorites.items);
  const themeMode = useAppSelector((state) => state.theme.mode);
  const colors = COLORS[themeMode];

  const navigateToDetails = (movie: Movie) => {
    navigation.navigate('Details', { movieId: movie.id });
  };

  const renderMovieItem: ListRenderItem<Movie> = ({ item }) => (
    <View style={styles.cardWrapper}>
      <MovieCard movie={item} onPress={() => navigateToDetails(item)} />
    </View>
  );

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Favorites" />
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>No favorites yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Start adding movies to your favorites!
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Browse Movies</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Favorites" />
      <FlatList
        data={favorites}
        renderItem={renderMovieItem}
        keyExtractor={(item) => `favorite-${item.id}`}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    marginBottom: 15,
  },
});

export default FavoritesScreen;