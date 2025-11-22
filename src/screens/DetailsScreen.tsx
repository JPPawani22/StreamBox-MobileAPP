import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchMovieDetails } from '../redux/movieSlice';
import { toggleFavorite, saveFavorites } from '../redux/favoritesSlice';
import { TMDB_IMAGE_BASE_URL } from '../constants/api';
import { COLORS } from '../constants/colors';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

const { width } = Dimensions.get('window');

const DetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { movieId } = route.params;
  const dispatch = useAppDispatch();

  const { selectedMovie, loading } = useAppSelector((state) => state.movies);
  const favorites = useAppSelector((state) => state.favorites.items);
  const themeMode = useAppSelector((state) => state.theme.mode);
  const colors = COLORS[themeMode];

  useEffect(() => {
    dispatch(fetchMovieDetails(movieId));
  }, [movieId, dispatch]);

  if (loading || !selectedMovie) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  const isFavorite = favorites.some((fav) => fav.id === selectedMovie.id);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(selectedMovie));
    const updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav.id !== selectedMovie.id)
      : [...favorites, selectedMovie];
    dispatch(saveFavorites(updatedFavorites));
  };

  const imageUri = selectedMovie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${selectedMovie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const backdropUri = selectedMovie.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}${selectedMovie.backdrop_path}`
    : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleToggleFavorite}>
          <Feather
            name="heart"
            size={24}
            color={isFavorite ? colors.primary : colors.text}
            fill={isFavorite ? colors.primary : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {backdropUri && <Image source={{ uri: backdropUri }} style={styles.backdrop} />}

        <View style={styles.content}>
          <View style={styles.posterContainer}>
            <Image source={{ uri: imageUri }} style={styles.poster} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{selectedMovie.title}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Feather name="star" size={16} color="#FFC107" />
              <Text style={[styles.metaText, { color: colors.text }]}>
                {selectedMovie.vote_average?.toFixed(1)}/10
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Feather name="calendar" size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.text }]}>
                {selectedMovie.release_date?.split('-')[0]}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Feather name="clock" size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.text }]}>
                {selectedMovie.runtime} min
              </Text>
            </View>
          </View>

          {selectedMovie.genres && selectedMovie.genres.length > 0 && (
            <View style={styles.genresContainer}>
              {selectedMovie.genres.map((genre) => (
                <View
                  key={genre.id}
                  style={[styles.genreChip, { backgroundColor: colors.card }]}
                >
                  <Text style={[styles.genreText, { color: colors.text }]}>
                    {genre.name}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
            <Text style={[styles.overview, { color: colors.textSecondary }]}>
              {selectedMovie.overview || 'No overview available.'}
            </Text>
          </View>

          {selectedMovie.tagline && (
            <View style={styles.section}>
              <Text style={[styles.tagline, { color: colors.primary }]}>
                "{selectedMovie.tagline}"
              </Text>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Status:
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {selectedMovie.status}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Budget:
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {selectedMovie.budget
                  ? `$${selectedMovie.budget.toLocaleString()}`
                  : 'N/A'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Revenue:
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {selectedMovie.revenue
                  ? `$${selectedMovie.revenue.toLocaleString()}`
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    width: width,
    height: width * 0.6,
  },
  content: {
    padding: 20,
  },
  posterContainer: {
    alignItems: 'center',
    marginTop: -80,
    marginBottom: 20,
  },
  poster: {
    width: 150,
    height: 225,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  metaText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  genreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  overview: {
    fontSize: 14,
    lineHeight: 22,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
  },
});

export default DetailsScreen;